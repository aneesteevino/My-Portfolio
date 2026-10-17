import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/knowledge";
import { CHAT } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 60;

const CHAT_LIMITS = {
  messageChars: CHAT.maxChars,
  assistantChars: 2400,
  historyMessages: 12,
} as const;

type ChatMessage = { role: "user" | "assistant"; content: string };
type Provider = {
  name: string;
  enabled: () => boolean;
  stream: (messages: ChatMessage[], signal: AbortSignal) => AsyncIterable<string>;
};

class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const FIRST_TOKEN_TIMEOUT = 15_000;
const TOTAL_TIMEOUT = 50_000;

const gemini: Provider = {
  name: "gemini",
  enabled: () => Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  async *stream(messages, signal) {
    const result = streamText({
      model: google(GEMINI_MODEL),
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 900,
      temperature: 0.4,
      maxRetries: 0,
      abortSignal: signal,
    });
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") yield part.text;
      else if (part.type === "error") {
        const error = part.error as { statusCode?: number; message?: string };
        throw new ProviderError(error?.message || "Gemini error", error?.statusCode);
      }
    }
  },
};

const groq: Provider = {
  name: "groq",
  enabled: () => Boolean(process.env.GROQ_API_KEY),
  async *stream(messages, signal) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_completion_tokens: 1400,
        reasoning_effort: "low",
        temperature: 0.4,
        stream: true,
      }),
      signal,
    });
    if (!response.ok || !response.body)
      throw new ProviderError(`Groq HTTP ${response.status}`, response.status);
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const data = line.trim().replace(/^data:\s*/, "");
        if (!data || data === "[DONE]" || !line.trim().startsWith("data:")) continue;
        let chunk: { choices?: Array<{ delta?: { content?: string } }>; error?: { message?: string } };
        try {
          chunk = JSON.parse(data);
        } catch {
          continue;
        }
        if (chunk.error) throw new ProviderError(chunk.error.message || "Groq stream error");
        const text = chunk.choices?.[0]?.delta?.content;
        if (text) yield text;
      }
    }
  },
};

const PROVIDERS = [gemini, groq];

// Best-effort, per-instance abuse protection. Vercel may run several instances,
// so this caps bursts rather than acting as a global quota.
const visitors = new Map<string, { minute: number[]; day: number[] }>();
let globalMinute: number[] = [];
const LIMITS = { perMinute: 8, perDay: 80, globalPerMinute: 40 };

function rateLimit(ip: string): number | null {
  const now = Date.now();
  if (visitors.size > 2000) visitors.clear();
  const entry = visitors.get(ip) ?? { minute: [], day: [] };
  entry.minute = entry.minute.filter((time) => now - time < 60_000);
  entry.day = entry.day.filter((time) => now - time < 86_400_000);
  globalMinute = globalMinute.filter((time) => now - time < 60_000);
  if (entry.day.length >= LIMITS.perDay) return 3600;
  if (entry.minute.length >= LIMITS.perMinute || globalMinute.length >= LIMITS.globalPerMinute)
    return Math.ceil((60_000 - (now - (entry.minute[0] ?? globalMinute[0] ?? now))) / 1000) || 30;
  entry.minute.push(now);
  entry.day.push(now);
  globalMinute.push(now);
  visitors.set(ip, entry);
  return null;
}

function json(status: number, error: string, headers: Record<string, string> = {}) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function parseMessages(body: unknown): ChatMessage[] | string {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 60) return "Invalid request.";
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string")
      return "Invalid request.";
    const text = content.replace(/\u0000/g, "").trim();
    if (!text) continue;
    if (role === "user" && text.length > CHAT_LIMITS.messageChars)
      return `Please keep each message under ${CHAT_LIMITS.messageChars} characters.`;
    messages.push({ role, content: text.slice(0, CHAT_LIMITS.assistantChars) });
  }
  const last = messages.at(-1);
  if (!last || last.role !== "user") return "Please type a question first.";
  // Keep recent context only, starting on a user turn.
  let recent = messages.slice(-CHAT_LIMITS.historyMessages);
  while (recent[0]?.role === "assistant") recent = recent.slice(1);
  return recent;
}

async function openStream(messages: ChatMessage[], signal: AbortSignal) {
  const failures: Array<{ name: string; status?: number }> = [];
  for (const provider of PROVIDERS) {
    if (!provider.enabled()) continue;
    const attempt = new AbortController();
    const abort = () => attempt.abort();
    signal.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(abort, FIRST_TOKEN_TIMEOUT);
    const iterator = provider.stream(messages, attempt.signal)[Symbol.asyncIterator]();
    try {
      const first = await iterator.next();
      clearTimeout(timer);
      if (first.done || !first.value) throw new ProviderError("Empty response");
      return { ok: true as const, provider: provider.name, first: first.value, iterator };
    } catch (error) {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      if (signal.aborted) throw error;
      const status = (error as ProviderError).status;
      failures.push({ name: provider.name, status });
      console.warn(
        `[chat] provider=${provider.name} failed status=${status ?? "n/a"} reason=${
          attempt.signal.aborted ? "timeout" : (error as Error).name
        }`,
      );
    }
  }
  return { ok: false as const, failures };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, "Forbidden.");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const retryAfter = rateLimit(ip);
  if (retryAfter)
    return json(429, "You're sending messages quickly. Please wait a moment and try again.", {
      "Retry-After": String(retryAfter),
    });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = parseMessages(body);
  if (typeof messages === "string") return json(400, messages);

  if (!PROVIDERS.some((provider) => provider.enabled())) {
    console.error("[chat] no AI provider key configured");
    return json(503, "The AI assistant isn't configured right now. Please contact Anees directly.");
  }

  const deadline = AbortSignal.any([request.signal, AbortSignal.timeout(TOTAL_TIMEOUT)]);
  let opened: Awaited<ReturnType<typeof openStream>>;
  try {
    opened = await openStream(messages, deadline);
  } catch {
    return json(499, "Request cancelled.");
  }
  if (!opened.ok) {
    const rateLimited = opened.failures.some((failure) => failure.status === 429);
    return json(
      503,
      rateLimited
        ? "The assistant has reached its free usage limit for the moment. Please try again in a minute."
        : "The AI assistant is temporarily unavailable. Please try again shortly.",
      { "Retry-After": "30" },
    );
  }

  const { provider, first, iterator } = opened;
  const encoder = new TextEncoder();
  const line = (event: object) => encoder.encode(JSON.stringify(event) + "\n");
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(line({ type: "delta", text: first }));
      try {
        for (;;) {
          const { value, done } = await iterator.next();
          if (done) break;
          if (value) controller.enqueue(line({ type: "delta", text: value }));
        }
        controller.enqueue(line({ type: "done", provider }));
      } catch (error) {
        console.warn(`[chat] provider=${provider} interrupted reason=${(error as Error).name}`);
        controller.enqueue(
          line({ type: "error", error: "The response was interrupted. Please retry." }),
        );
      }
      controller.close();
    },
    async cancel() {
      await iterator.return?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Answer-Engine": provider,
    },
  });
}
