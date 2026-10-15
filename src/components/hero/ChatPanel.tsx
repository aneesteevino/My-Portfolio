"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CHAT } from "@/lib/data";
import { answerQuestion, type Answer } from "@/lib/chat";
import { lockScroll } from "@/lib/scroll";

type MessageStatus = "loading" | "complete" | "error" | "stopped";
type Message = {
  id: string;
  question: string;
  answer: Answer;
  status: MessageStatus;
  notice?: string;
};

const STORAGE_KEY = "anees-robo-chat-v2";
const TOPIC_KEY = "anees-robo-topic-v2";

function readMessages(): Message[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as Message[];
    return parsed.slice(-20).map((message) =>
      message.status === "loading"
        ? {
            ...message,
            status: "stopped",
            answer: { ...message.answer, text: CHAT.stopped },
          }
        : message,
    );
  } catch {
    return [];
  }
}

function formatAnswer(text: string): ReactNode {
  return text.split("\n").map((line, index) => {
    if (!line) return <span className="answer-space" key={index} />;
    if (line.startsWith("• "))
      return (
        <span className="answer-bullet" key={index}>
          {line.slice(2)}
        </span>
      );
    const heading =
      line.length < 48 &&
      !/[.!?:]$/.test(line) &&
      index < text.split("\n").length - 1;
    return heading ? (
      <strong className="answer-heading" key={index}>
        {line}
      </strong>
    ) : (
      <span className="answer-line" key={index}>
        {line}
      </span>
    );
  });
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const pendingId = useRef<string | null>(null);
  const stickToBottom = useRef(true);
  const messagesRef = useRef<Message[]>([]);
  const topic = useRef<string | undefined>(
    typeof window === "undefined"
      ? undefined
      : sessionStorage.getItem(TOPIC_KEY) || undefined,
  );
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>(readMessages);
  const [generating, setGenerating] = useState(false);

  function commit(transform: (current: Message[]) => Message[]) {
    setMessages((current) => {
      const next = transform(current);
      messagesRef.current = next;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function updateMessage(id: string, update: Partial<Message>) {
    commit((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...update } : message,
      ),
    );
  }

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    lockScroll(true);
    input.current?.focus();
    return () => {
      request.current?.abort();
      const safe = messagesRef.current.map((message) =>
        message.status === "loading"
          ? {
              ...message,
              status: "stopped" as const,
              answer: { ...message.answer, text: CHAT.stopped },
            }
          : message,
      );
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
      node?.close();
      document.body.style.overflow = overflow;
      lockScroll(false);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (log.current && stickToBottom.current)
      log.current.scrollTop = log.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const node = input.current;
    if (!node) return;
    node.style.height = "0px";
    node.style.height = Math.min(node.scrollHeight, 108) + "px";
  }, [question]);

  function stop() {
    const id = pendingId.current;
    request.current?.abort();
    if (id)
      updateMessage(id, {
        status: "stopped",
        answer: {
          ...answerQuestion("", topic.current),
          text: CHAT.stopped,
          sources: [],
        },
      });
    pendingId.current = null;
    setGenerating(false);
  }

  function closePanel() {
    if (generating) stop();
    onClose();
  }

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 500 || generating) return;

    const previousTopic = topic.current;
    const local = answerQuestion(trimmed, previousTopic);
    topic.current = local.topic ?? previousTopic;
    if (topic.current) sessionStorage.setItem(TOPIC_KEY, topic.current);
    const id = crypto.randomUUID();
    pendingId.current = id;
    stickToBottom.current = true;
    commit((current) => [
      ...current.slice(-19),
      {
        id,
        question: trimmed,
        answer: { ...local, text: "" },
        status: "loading",
      },
    ]);
    setQuestion("");
    setGenerating(true);

    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, previousTopic }),
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error((await response.text()) || "Chat request failed");
      const text = (await response.text()).trim();
      if (!text) throw new Error("The assistant returned an empty response");
      const engine = response.headers.get("x-answer-engine");
      updateMessage(id, {
        answer: { ...local, text },
        status: "complete",
        notice:
          engine === "local-fallback"
            ? CHAT.localFallbackNotice
            : undefined,
      });
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        updateMessage(id, {
          status: "stopped",
          answer: { ...local, text: CHAT.stopped, sources: [] },
        });
      } else {
        updateMessage(id, {
          status: "error",
          answer: { ...local, text: CHAT.error, sources: [] },
        });
      }
    } finally {
      request.current = null;
      pendingId.current = null;
      setGenerating(false);
      input.current?.focus();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask(question);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="robo-chat"
      aria-labelledby="robo-chat-title"
      aria-describedby="robo-chat-subtitle"
      onCancel={(event) => {
        event.preventDefault();
        closePanel();
      }}
    >
      <header className="chat-header">
        <span className="chat-avatar" aria-hidden="true">
          <i /> <i />
        </span>
        <div>
          <h2 id="robo-chat-title">{CHAT.title}</h2>
          <p id="robo-chat-subtitle">{CHAT.subtitle}</p>
        </div>
        <button
          type="button"
          className="chat-close"
          onClick={closePanel}
          aria-label={CHAT.close}
        >
          ×
        </button>
      </header>

      <div
        ref={log}
        className="chat-log"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Conversation"
        aria-busy={generating}
        onScroll={(event) => {
          const node = event.currentTarget;
          stickToBottom.current =
            node.scrollHeight - node.scrollTop - node.clientHeight < 64;
        }}
      >
        <div className="chat-bubble chat-greeting">
          {formatAnswer(CHAT.intro)}
        </div>
        {messages.map((message) => (
          <div className="chat-turn" key={message.id}>
            <p className="chat-question">
              <span className="sr-only">You: </span>
              {message.question}
            </p>
            <div className="chat-bubble">
              <span className="sr-only">Robo Cat: </span>
              {message.answer.text ? (
                <div
                  className={
                    "answer-content " +
                    (message.status === "loading" ? "streaming-text" : "")
                  }
                >
                  {formatAnswer(message.answer.text)}
                </div>
              ) : (
                <span className="typing" aria-label="Robo Cat is thinking">
                  <i /> <i /> <i />
                </span>
              )}
              {message.notice && (
                <p className="chat-notice" role="status">
                  {message.notice}
                </p>
              )}
              {message.status === "error" && (
                <button
                  type="button"
                  className="retry-button"
                  onClick={() => void ask(message.question)}
                >
                  {CHAT.retry}
                </button>
              )}
              {message.status === "complete" &&
                message.answer.evidence?.map((item, index) => (
                  <div className="claim-source" key={index}>
                    <p>{item.claim}</p>
                    <div>
                      {item.sources.map((source) => (
                        <a
                          key={source.href}
                          href={source.href}
                          target={source.href.startsWith("/") ? "_blank" : "_blank"}
                          rel="noreferrer"
                        >
                          {source.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              {message.status === "complete" &&
                message.answer.sources.some((source) =>
                  /^(mailto:|tel:|#contact)/.test(source.href),
                ) && (
                  <div className="chat-actions">
                    {message.answer.sources
                      .filter((source) =>
                        /^(mailto:|tel:|#contact)/.test(source.href),
                      )
                      .map((source) => (
                        <a key={source.href} href={source.href}>
                          {source.label}
                        </a>
                      ))}
                  </div>
                )}
              {message.status === "complete" &&
                !message.answer.evidence?.length &&
                message.answer.sources.length > 0 && (
                  <div className="chat-sources">
                    <span>{CHAT.source}</span>
                    {message.answer.sources.map((source) => (
                      <a
                        key={source.href}
                        href={source.href}
                        onClick={() => {
                          if (source.href.startsWith("#")) closePanel();
                        }}
                        target={
                          source.href.startsWith("#") ||
                          source.href.startsWith("mailto:") ||
                          source.href.startsWith("tel:")
                            ? undefined
                            : "_blank"
                        }
                        rel="noreferrer"
                      >
                        {source.label} ↗
                      </a>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-suggestions" aria-label="Suggested questions">
        {CHAT.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => void ask(suggestion)}
            disabled={generating}
          >
            {suggestion}
          </button>
        ))}
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
            maxLength={500}
            rows={1}
            autoComplete="off"
            enterKeyHint="send"
            placeholder={CHAT.placeholder}
          />
          <span
            className={"char-count " + (question.length >= 400 ? "visible" : "")}
            aria-live="polite"
          >
            {question.length} / 500
          </span>
        </div>
        {generating ? (
          <button className="pill stop-button" type="button" onClick={stop}>
            {CHAT.stop}
          </button>
        ) : (
          <button
            className="pill pill-primary"
            type="submit"
            disabled={!question.trim()}
          >
            {CHAT.send}
          </button>
        )}
      </form>

      <footer className="chat-footer">
        <p>{CHAT.privacy}</p>
        <button
          type="button"
          onClick={() => {
            request.current?.abort();
            sessionStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(TOPIC_KEY);
            messagesRef.current = [];
            setMessages([]);
            setGenerating(false);
            topic.current = undefined;
            input.current?.focus();
          }}
        >
          {CHAT.clear}
        </button>
      </footer>

      <style href="chat-styles" precedence="components">{`
.robo-chat{box-sizing:border-box}
.robo-chat{position:fixed;inset:0;margin:auto;width:min(590px,calc(100vw - 24px));height:min(760px,calc(100dvh - 24px));max-width:none;max-height:none;padding:0;border:1px solid var(--line);border-radius:26px;background:var(--paper);color:var(--ink);box-shadow:0 30px 100px #0003;overflow:hidden}.robo-chat[open]{display:flex;flex-direction:column;animation:chat-enter .42s var(--ease) both}.robo-chat::backdrop{background:#0005;backdrop-filter:blur(5px);animation:backdrop-enter .35s ease-out both}.chat-header{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--line);flex-shrink:0}.chat-avatar{position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--ink);border-radius:17px 17px 14px 14px}.chat-avatar:before,.chat-avatar:after{content:"";position:absolute;top:-5px;width:14px;height:14px;background:var(--ink);border-radius:3px;transform:rotate(45deg);z-index:-1}.chat-avatar:before{left:6px}.chat-avatar:after{right:6px}.chat-avatar i{width:6px;height:10px;border-radius:6px;background:white;animation:cat-blink 5s infinite}.chat-header h2{font-size:20px;letter-spacing:-.03em}.chat-header p{font-size:11px;margin-top:4px;color:var(--ink-2)}.chat-close{margin-left:auto;min-width:44px;height:44px;border-radius:50%;font-size:28px}.chat-close:hover{background:#0001}.chat-log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px;scroll-behavior:smooth}.chat-bubble{background:white;border:1px solid var(--line);border-radius:18px 18px 18px 4px;padding:16px;font-size:13px;line-height:1.6;overflow-wrap:anywhere}.chat-greeting{animation:greeting-in .55s .16s var(--ease) both}.chat-turn{animation:message-in .45s var(--ease) both}.chat-question{white-space:pre-wrap;background:var(--ink);color:white;border-radius:18px 18px 4px 18px;padding:12px 16px;margin:20px 0 12px 35px;font-size:13px;overflow-wrap:anywhere}.answer-content,.chat-greeting{display:flex;flex-direction:column}.answer-space{height:9px}.answer-heading{font-size:13px;margin-top:2px}.answer-line{white-space:pre-wrap}.answer-bullet{position:relative;padding-left:14px}.answer-bullet:before{content:"•";position:absolute;left:1px;color:var(--mute)}.streaming-text:after{content:"";display:inline-block;width:5px;height:1em;margin-left:4px;background:currentColor;vertical-align:-2px;animation:cursor-blink .75s steps(1) infinite}.typing{display:flex;align-items:center;gap:5px;height:22px}.typing i{width:6px;height:6px;border-radius:50%;background:#777;animation:typing-dot 1s ease-in-out infinite}.typing i:nth-child(2){animation-delay:.14s}.typing i:nth-child(3){animation-delay:.28s}.chat-notice{margin-top:12px;padding:9px 10px;border-radius:10px;background:#f0eee9;color:var(--ink-2);font-size:9px;line-height:1.45}.retry-button{margin-top:12px;border:1px solid var(--ink);border-radius:99px;padding:8px 13px;font-size:10px}.claim-source{margin-top:13px;padding-top:11px;border-top:1px solid var(--line);font-size:9px;line-height:1.45;color:var(--ink-2)}.claim-source>div{display:flex;flex-wrap:wrap;gap:7px;margin-top:7px}.claim-source a,.chat-sources a{text-decoration:underline;text-underline-offset:3px}.chat-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}.chat-actions a{border:1px solid var(--ink);border-radius:99px;padding:7px 11px;font-size:9px}.chat-sources{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:10px;border-top:1px solid var(--line);font-size:10px}.chat-sources>span{width:100%;color:var(--ink-2)}.chat-suggestions{position:relative;padding:10px 20px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0}.chat-suggestions button{border:1px solid var(--line);border-radius:30px;padding:8px 10px;font-size:11px;text-align:left}.chat-suggestions button:hover{background:white}.chat-suggestions button:disabled{opacity:.45}.chat-form{display:grid;grid-template-columns:minmax(0,1fr) auto;padding:8px 20px;gap:8px;align-items:end;flex-shrink:0}.chat-compose{position:relative;min-width:0}.chat-form textarea{display:block;width:100%;min-width:0;max-height:108px;resize:none;overflow-y:auto;border:1px solid #a9a6a0;border-radius:20px;background:white;padding:12px 13px 20px;font:inherit;font-size:12px;line-height:1.45;color:var(--ink)}.char-count{position:absolute;right:12px;bottom:5px;font-family:var(--font-mono);font-size:7px;color:var(--mute);opacity:0}.char-count.visible{opacity:1}.chat-form>button{min-width:78px;min-height:44px;font-size:12px;padding:10px 16px}.chat-form button:disabled{opacity:.5;cursor:default}.stop-button{border:1px solid var(--ink);background:white}.chat-footer{display:flex;align-items:center;gap:15px;padding:8px 20px max(16px,env(safe-area-inset-bottom));font-size:10px;line-height:1.5;color:var(--ink-2);flex-shrink:0}.chat-footer p{flex:1}.chat-footer button{min-height:40px;text-decoration:underline;white-space:nowrap}@keyframes chat-enter{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:none}}@keyframes backdrop-enter{from{opacity:0}to{opacity:1}}@keyframes greeting-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes message-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes typing-dot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-5px);opacity:1}}@keyframes cursor-blink{50%{opacity:0}}@keyframes cat-blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.15)}}@media(max-width:600px){.robo-chat{inset:auto 0 0;width:100%;height:min(90dvh,780px);margin:0;border-radius:24px 24px 0 0;border-bottom:0}.chat-header{padding:14px 16px}.chat-avatar{width:43px;height:43px;border-radius:15px}.chat-header h2{font-size:18px}.chat-header p{max-width:185px;font-size:10px}.chat-log{padding:14px 16px}.chat-bubble{padding:13px;font-size:12px}.chat-question{margin:16px 0 9px 24px;font-size:12px}.chat-suggestions{padding:8px 16px;flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:16px;scrollbar-width:none;mask-image:linear-gradient(90deg,#000 0,#000 calc(100% - 28px),transparent)}.chat-suggestions::-webkit-scrollbar{display:none}.chat-suggestions button{flex:0 0 auto;scroll-snap-align:start}.chat-form{padding:7px 12px}.chat-form textarea{padding:11px 12px 19px}.chat-form>button{min-width:68px;padding:10px 12px}.chat-footer{align-items:flex-end;padding:5px 16px max(10px,env(safe-area-inset-bottom));font-size:9px}.chat-footer button{min-height:34px}}@media(max-width:370px){.chat-header p{max-width:145px}.chat-form{grid-template-columns:minmax(0,1fr) 64px}.chat-form>button{min-width:64px;padding-inline:8px}.chat-footer p{max-width:225px}}@media(max-height:600px){.robo-chat{height:100dvh;border-radius:0}.chat-suggestions{display:none}.chat-header{padding-block:10px}.chat-footer{display:none}}@media(prefers-reduced-motion:reduce){.robo-chat[open],.robo-chat::backdrop,.chat-avatar i,.chat-greeting,.chat-turn,.typing i,.streaming-text:after{animation:none!important}.chat-log{scroll-behavior:auto}}
      `}</style>
      <style href="chat-mobile-motion" precedence="components">{`
@keyframes chat-enter-mobile{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
@media(max-width:600px){.robo-chat[open]{animation-name:chat-enter-mobile;transform-origin:bottom center}}
      `}</style>
    </dialog>
  );
}
