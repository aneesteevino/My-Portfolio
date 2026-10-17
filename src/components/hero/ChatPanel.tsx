"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CHAT } from "@/lib/data";
import { lockScroll } from "@/lib/scroll";

type Status = "streaming" | "done" | "error" | "stopped";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: Status;
  error?: string;
};

const STORAGE_KEY = "anees-robo-chat-v3";
const MAX_STORED = 40;

function readMessages(): Message[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as Message[];
    return parsed.slice(-MAX_STORED).map((message) =>
      message.status === "streaming" ? { ...message, status: "stopped" } : message,
    );
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch {}
}

function safeHref(href: string) {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : null;
}

function inlineMarkdown(text: string): ReactNode {
  const tokens = text.split(
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+[^\s).,;:!?])/g,
  );
  return tokens.map((token, index) => {
    if (/^\*\*[^*]+\*\*$/.test(token)) return <strong key={index}>{token.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(token)) return <code key={index}>{token.slice(1, -1)}</code>;
    const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    const bare = /^https?:\/\//.test(token) ? token : null;
    if (link || bare) {
      const label = link ? link[1] : bare!;
      const href = safeHref(link ? link[2] : bare!);
      if (!href) return <Fragment key={index}>{label}</Fragment>;
      const external = /^https?:/.test(href);
      return (
        <a
          key={index}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      );
    }
    return <Fragment key={index}>{token.replace(/\*\*/g, "")}</Fragment>;
  });
}

/** Renders a safe Markdown subset as React nodes — never as raw HTML. */
function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  for (let index = 0; index < lines.length; ) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={`pre-${index}`}>
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const listMatch = (pattern: RegExp) => {
      const items: string[] = [];
      while (index < lines.length && pattern.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(pattern, ""));
        index += 1;
      }
      return items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkdown(item)}</li>);
    };
    if (/^[-*•]\s+/.test(line)) {
      blocks.push(<ul key={`ul-${index}`}>{listMatch(/^[-*•]\s+/)}</ul>);
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      blocks.push(<ol key={`ol-${index}`}>{listMatch(/^\d+[.)]\s+/)}</ol>);
      continue;
    }
    const heading = line.match(/^#{1,6}\s+(.+)$/)?.[1];
    blocks.push(
      heading ? (
        <p className="answer-heading" key={index}>
          {inlineMarkdown(heading)}
        </p>
      ) : (
        <p key={index}>{inlineMarkdown(line)}</p>
      ),
    );
    index += 1;
  }
  return <>{blocks}</>;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const atBottom = useRef(true);
  const [messages, setMessages] = useState<Message[]>(readMessages);
  const [question, setQuestion] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showLatest, setShowLatest] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const update = useCallback((transform: (current: Message[]) => Message[]) => {
    setMessages((current) => {
      const next = transform(current);
      saveMessages(next);
      return next;
    });
  }, []);

  // Open as a modal, freeze the page (including Lenis), restore on close.
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    lockScroll(true);
    // Only auto-focus where it won't pop up a virtual keyboard.
    if (matchMedia("(hover: hover) and (pointer: fine)").matches)
      input.current?.focus({ preventScroll: true });
    else node?.focus({ preventScroll: true });
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
    return () => {
      request.current?.abort();
      saveMessages(
        messagesRef.current.map((message) =>
          message.status === "streaming" ? { ...message, status: "stopped" } : message,
        ),
      );
      node?.close();
      document.body.style.overflow = overflow;
      lockScroll(false);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  // Keep the mobile sheet above the virtual keyboard (iOS doesn't resize the layout viewport).
  useEffect(() => {
    const viewport = window.visualViewport;
    const node = dialog.current;
    if (!viewport || !node) return;
    const sync = () => {
      node.style.setProperty("--vvh", `${viewport.height}px`);
      node.style.setProperty("--vvt", `${viewport.offsetTop}px`);
      if (atBottom.current && log.current) log.current.scrollTop = log.current.scrollHeight;
    };
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  // Follow new content only while the reader is already at the bottom.
  useLayoutEffect(() => {
    const node = log.current;
    if (!node) return;
    if (atBottom.current) node.scrollTop = node.scrollHeight;
    else setShowLatest(true);
  }, [messages]);

  useEffect(() => {
    const node = input.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = Math.min(node.scrollHeight, 132) + "px";
  }, [question]);

  function onScroll() {
    const node = log.current;
    if (!node) return;
    atBottom.current = node.scrollHeight - node.scrollTop - node.clientHeight < 48;
    if (atBottom.current) setShowLatest(false);
  }

  function jumpToLatest() {
    const node = log.current;
    if (!node) return;
    atBottom.current = true;
    setShowLatest(false);
    node.scrollTo({
      top: node.scrollHeight,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  async function send(history: Message[]) {
    const assistantId = crypto.randomUUID();
    atBottom.current = true;
    update(() => [...history, { id: assistantId, role: "assistant", content: "", status: "streaming" }]);
    setGenerating(true);
    const controller = new AbortController();
    request.current = controller;
    const patch = (changes: Partial<Message>) =>
      update((current) =>
        current.map((message) => (message.id === assistantId ? { ...message, ...changes } : message)),
      );

    let text = "";
    try {
      const payload = history
        .filter((message) => message.content && message.status !== "error")
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || CHAT.error);
      }
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let finished = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as { type: string; text?: string; error?: string };
          if (event.type === "delta" && event.text) {
            text += event.text;
            patch({ content: text });
          } else if (event.type === "error") throw new Error(event.error || CHAT.error);
          else if (event.type === "done") finished = true;
        }
      }
      if (!finished) throw new Error(CHAT.error);
      patch({ content: text, status: "done" });
    } catch (error) {
      if ((error as Error).name === "AbortError") patch({ content: text, status: "stopped" });
      else
        patch({
          content: text,
          status: "error",
          error: (error as Error).message && !(error instanceof TypeError) ? (error as Error).message : CHAT.error,
        });
    } finally {
      request.current = null;
      setGenerating(false);
    }
  }

  function ask(raw: string) {
    const text = raw.trim();
    if (!text || text.length > CHAT.maxChars || generating) return;
    setQuestion("");
    void send([...messagesRef.current, { id: crypto.randomUUID(), role: "user", content: text }]);
  }

  function retry(assistantId: string) {
    if (generating) return;
    const index = messagesRef.current.findIndex((message) => message.id === assistantId);
    if (index > 0) void send(messagesRef.current.slice(0, index));
  }

  function closePanel() {
    request.current?.abort();
    onClose();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    ask(question);
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      ask(question);
    }
  }

  const remaining = CHAT.maxChars - question.length;

  return (
    <dialog
      ref={dialog}
      className="robo-chat"
      aria-labelledby="robo-chat-title"
      aria-describedby="robo-chat-subtitle"
      tabIndex={-1}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        closePanel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
    >
      <header className="chat-header">
        <span className="chat-avatar" aria-hidden="true">
          <i /> <i />
        </span>
        <div className="chat-heading">
          <h2 id="robo-chat-title">{CHAT.title}</h2>
          <p id="robo-chat-subtitle">{CHAT.subtitle}</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            className="chat-new"
            onClick={() => {
              request.current?.abort();
              update(() => []);
              setShowLatest(false);
              input.current?.focus({ preventScroll: true });
            }}
          >
            {CHAT.clear}
          </button>
        )}
        <button type="button" className="chat-close" onClick={closePanel} aria-label={CHAT.close}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
            <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="chat-body">
        <div
          ref={log}
          className="chat-log"
          role="log"
          aria-label="Conversation"
          aria-busy={generating}
          tabIndex={0}
          onScroll={onScroll}
        >
          <div className="chat-msg assistant">
            <div className="chat-bubble">
              <p>{CHAT.intro}</p>
            </div>
          </div>
          {messages.length === 0 && (
            <div className="chat-suggestions" aria-label="Suggested questions">
              {CHAT.suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          {messages.map((message) =>
            message.role === "user" ? (
              <div className="chat-msg user" key={message.id}>
                <p className="chat-bubble">
                  <span className="sr-only">You: </span>
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="chat-msg assistant" key={message.id}>
                <div className="chat-bubble" aria-live={message.status === "streaming" ? "off" : "polite"}>
                  <span className="sr-only">Robo Cat: </span>
                  {message.content ? (
                    <div className={"answer" + (message.status === "streaming" ? " streaming" : "")}>
                      <Markdown text={message.content} />
                    </div>
                  ) : message.status === "streaming" ? (
                    <span className="typing" role="status" aria-label={CHAT.thinking}>
                      <i /> <i /> <i />
                    </span>
                  ) : null}
                  {message.status === "stopped" && <p className="chat-meta">{CHAT.stopped}</p>}
                  {message.status === "error" && (
                    <div className="chat-error" role="alert">
                      <p>{message.error || CHAT.error}</p>
                      <button type="button" onClick={() => retry(message.id)} disabled={generating}>
                        {CHAT.retry}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
        {showLatest && (
          <button type="button" className="chat-latest" onClick={jumpToLatest} aria-label={CHAT.latest}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 3v10m-4-4 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="robo-question">
          {CHAT.inputLabel}
        </label>
        <div className="chat-compose">
          <textarea
            ref={input}
            id="robo-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={keyDown}
            maxLength={CHAT.maxChars}
            rows={1}
            autoComplete="off"
            enterKeyHint="send"
            placeholder={CHAT.placeholder}
            aria-describedby="robo-chat-privacy"
          />
          {generating ? (
            <button type="button" className="chat-send stop" onClick={() => request.current?.abort()} aria-label={CHAT.stop}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                <rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" />
              </svg>
            </button>
          ) : (
            <button type="submit" className="chat-send" disabled={!question.trim()} aria-label={CHAT.send}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 15V3m-5 5 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <p id="robo-chat-privacy" className="chat-footnote">
          {remaining < 120 ? (
            <span aria-live="polite">{remaining} characters left</span>
          ) : (
            CHAT.privacy
          )}
        </p>
      </form>

      <style href="chat-styles" precedence="components">{`
.robo-chat{box-sizing:border-box;position:fixed;inset:0;margin:auto;width:min(600px,calc(100vw - 32px));height:min(780px,calc(100dvh - 32px));max-width:none;max-height:none;padding:0;border:1px solid #ffffffc0;border-radius:24px;background:#f4f2eee6;color:var(--ink);box-shadow:0 30px 90px #0000002e,inset 0 1px #fff;backdrop-filter:blur(24px) saturate(1.1);-webkit-backdrop-filter:blur(24px) saturate(1.1);overflow:hidden;outline:none}
.robo-chat[open]{display:flex;flex-direction:column;animation:chat-enter .32s var(--ease) both}
.robo-chat::backdrop{background:#0d0d0d40;backdrop-filter:blur(6px);animation:backdrop-enter .3s ease-out both}
.chat-header{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 18px;border-bottom:1px solid var(--line);flex-shrink:0}
.chat-avatar{position:relative;isolation:isolate;width:40px;height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:7px;background:var(--ink);border-radius:14px 14px 12px 12px}
.chat-avatar:before,.chat-avatar:after{content:"";position:absolute;top:-4px;width:12px;height:12px;background:var(--ink);border-radius:3px;transform:rotate(45deg);z-index:-1}.chat-avatar:before{left:5px}.chat-avatar:after{right:5px}
.chat-avatar i{width:5px;height:9px;border-radius:5px;background:#fff;animation:cat-blink 5s infinite}
.chat-heading{min-width:0;flex:1}.chat-header h2{font-size:17px;letter-spacing:-.02em;line-height:1.2}
.chat-header p{font-size:12px;margin-top:2px;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chat-new{flex-shrink:0;min-height:36px;padding:0 12px;border:1px solid var(--line);border-radius:99px;font-size:12px;background:#ffffff80}.chat-new:hover{background:#fff}
.chat-close{flex-shrink:0;width:40px;height:40px;display:grid;place-items:center;border-radius:50%}.chat-close:hover{background:#0d0d0d0f}
.chat-body{position:relative;flex:1;min-height:0;display:flex}
.chat-log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 18px 8px;display:flex;flex-direction:column;gap:12px;outline:none}
.chat-log:focus-visible{box-shadow:inset 0 0 0 2px var(--ink)}
.chat-log::-webkit-scrollbar{width:8px}.chat-log::-webkit-scrollbar-thumb{background:#0d0d0d30;border-radius:8px;border:2px solid transparent;background-clip:content-box}
.chat-msg{display:flex;animation:message-in .28s var(--ease) both}.chat-msg.user{justify-content:flex-end}
.chat-bubble{max-width:88%;min-width:0;padding:11px 14px;border-radius:18px;font-size:14.5px;line-height:1.6;overflow-wrap:anywhere}
.chat-msg.assistant .chat-bubble{background:#fff;border:1px solid #0d0d0d12;border-bottom-left-radius:6px;box-shadow:0 1px 2px #0d0d0d0a}
.chat-msg.user .chat-bubble{background:var(--ink);color:#fff;border-bottom-right-radius:6px;white-space:pre-wrap}
.answer{display:flex;flex-direction:column;gap:8px}.answer ul,.answer ol{margin:0;padding-left:20px;display:grid;gap:4px}
.answer-heading{font-weight:650;margin-top:4px}.answer a{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.answer code{font-family:var(--font-mono);font-size:.88em;background:#0d0d0d0d;padding:1px 5px;border-radius:5px}
.answer pre{margin:0;padding:10px 12px;background:#0d0d0d;color:#f4f2ee;border-radius:10px;overflow-x:auto;font-size:12.5px;line-height:1.5}.answer pre code{background:none;padding:0;color:inherit}
.streaming>:last-child:after{content:"";display:inline-block;width:6px;height:1em;margin-left:3px;vertical-align:-2px;background:currentColor;opacity:.6;animation:cursor-blink .8s steps(1) infinite}
.typing{display:flex;align-items:center;gap:5px;height:24px}.typing i{width:7px;height:7px;border-radius:50%;background:#8a8780;animation:typing-dot 1s ease-in-out infinite}.typing i:nth-child(2){animation-delay:.14s}.typing i:nth-child(3){animation-delay:.28s}
.chat-meta{margin-top:6px;font-size:12px;color:var(--ink-2)}
.chat-error{margin-top:4px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:13px;color:#8a1c1c}
.chat-error button{min-height:34px;padding:0 14px;border:1px solid currentColor;border-radius:99px;font-size:12px;color:var(--ink)}.chat-error button:disabled{opacity:.5}
.chat-suggestions{display:flex;flex-wrap:wrap;gap:8px;padding-left:2px}
.chat-suggestions button{min-height:38px;border:1px solid #0d0d0d1f;background:#ffffffa0;border-radius:99px;padding:8px 13px;font-size:13px;text-align:left;line-height:1.3}.chat-suggestions button:hover{background:#fff;border-color:#0d0d0d40}
.chat-latest{position:absolute;left:50%;bottom:10px;translate:-50% 0;width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--ink);color:#fff;box-shadow:0 6px 18px #0003}
.chat-form{flex-shrink:0;padding:10px 14px max(12px,env(safe-area-inset-bottom));border-top:1px solid var(--line)}
.chat-compose{display:flex;align-items:flex-end;gap:8px;padding:6px 6px 6px 14px;border:1px solid #0d0d0d29;border-radius:22px;background:#fff;transition:border-color .15s,box-shadow .15s}
.chat-compose:focus-within{border-color:var(--ink);box-shadow:0 0 0 3px #0d0d0d14}
.chat-compose textarea{flex:1;min-width:0;max-height:132px;resize:none;border:0;outline:none;background:transparent;padding:7px 0;font:inherit;font-size:16px;line-height:1.45;color:var(--ink)}
.chat-compose textarea::placeholder{color:var(--mute)}
.chat-send{flex-shrink:0;width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:var(--ink);color:#fff;transition:opacity .15s}
.chat-send:disabled{opacity:.25}.chat-send.stop{background:#fff;color:var(--ink);border:1px solid var(--ink)}
.chat-footnote{margin-top:7px;padding:0 6px;font-size:11px;line-height:1.4;color:var(--ink-2);text-align:center}
@keyframes chat-enter{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
@keyframes chat-enter-mobile{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes backdrop-enter{from{opacity:0}to{opacity:1}}
@keyframes message-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes typing-dot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}
@keyframes cursor-blink{50%{opacity:0}}
@keyframes cat-blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.15)}}
@media(max-width:600px){
.robo-chat{inset:auto 0 auto 0;top:calc(var(--vvt,0px) + var(--vvh,100dvh));translate:0 -100%;width:100%;height:min(88dvh,var(--vvh,100dvh));margin:0;border-radius:22px 22px 0 0;border-bottom:0}
.robo-chat[open]{animation-name:chat-enter-mobile}
.chat-header{padding:10px 8px 10px 14px}.chat-log{padding:14px 12px 6px}
.chat-bubble{max-width:92%;font-size:15px}.chat-form{padding:8px 10px max(10px,env(safe-area-inset-bottom))}
}
@media(max-width:600px) and (max-height:520px){.robo-chat{height:var(--vvh,100dvh);border-radius:0}.chat-footnote{display:none}}
@media(prefers-reduced-motion:reduce){.robo-chat[open],.robo-chat::backdrop,.chat-avatar i,.chat-msg,.typing i,.streaming>:last-child:after{animation:none!important}}
      `}</style>
    </dialog>
  );
}
