"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CHAT } from "@/lib/data";
import { answerQuestion, type Answer } from "@/lib/chat";
import { lockScroll } from "@/lib/scroll";
export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const topic = useRef<string | undefined>(undefined);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ question: string; answer: Answer }[]>([]);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    lockScroll(true);
    input.current?.focus();
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      lockScroll(false);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages]);
  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const answer = answerQuestion(trimmed, topic.current);
    topic.current = answer.topic;
    setMessages(old => [...old.slice(-19), { question: trimmed, answer }]);
    setQuestion("");
    input.current?.focus();
  }
  function submit(event: FormEvent) { event.preventDefault(); ask(question); }
  return <dialog ref={dialog} className="robo-chat" aria-labelledby="robo-chat-title" aria-describedby="robo-chat-subtitle" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="chat-header"><span className="chat-avatar" aria-hidden="true">◕ ◕</span><div><h2 id="robo-chat-title">{CHAT.title}</h2><p id="robo-chat-subtitle">{CHAT.subtitle}</p></div><button type="button" className="chat-close" onClick={onClose} aria-label={CHAT.close}>×</button></header>
    <div ref={log} className="chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
      <p className="chat-bubble">{CHAT.intro}</p>
      {messages.map((m, i) => <div className="chat-turn" key={i}><p className="chat-question"><span className="sr-only">You: </span>{m.question}</p><div className="chat-bubble"><span className="sr-only">Robo Cat: </span><p>{m.answer.text}</p>{m.answer.sources.length > 0 && <div className="chat-sources"><span>{CHAT.source}</span>{m.answer.sources.map(s => <a key={s.href} href={s.href} onClick={() => { if (s.href.startsWith("#")) onClose(); }} target={s.href.startsWith("#") || s.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">{s.label} ↗</a>)}</div>}</div></div>)}
    </div>
    <div className="chat-suggestions">{CHAT.suggestions.map(s => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div>
    <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="robo-question">{CHAT.inputLabel}</label><input ref={input} id="robo-question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={500} autoComplete="off" placeholder={CHAT.placeholder}/><button className="pill pill-primary" type="submit" disabled={!question.trim()}>{CHAT.send}</button></form>
    <footer className="chat-footer"><p>{CHAT.privacy}</p><button type="button" onClick={() => { setMessages([]); topic.current = undefined; input.current?.focus(); }}>{CHAT.clear}</button></footer>
    <style href="chat-styles" precedence="components">{`
.robo-chat{position:fixed;inset:0;margin:auto;width:min(560px,calc(100vw - 24px));height:min(720px,calc(100dvh - 24px));max-width:none;max-height:none;padding:0;border:1px solid var(--line);border-radius:26px;background:var(--paper);color:var(--ink);box-shadow:0 30px 100px #0003;overflow:hidden}.robo-chat[open]{display:flex;flex-direction:column}.robo-chat::backdrop{background:#0005;backdrop-filter:blur(5px)}.chat-header{display:flex;align-items:center;gap:12px;padding:20px;border-bottom:1px solid var(--line);flex-shrink:0}.chat-avatar{background:var(--ink);color:white;border-radius:15px;padding:13px 9px;white-space:nowrap}.chat-header h2{font-size:20px;letter-spacing:-.03em}.chat-header p{font-size:11px;margin-top:4px;color:var(--ink-2)}.chat-close{margin-left:auto;min-width:44px;height:44px;border-radius:50%;font-size:28px}.chat-close:hover{background:#0001}.chat-log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px;scroll-behavior:auto}.chat-bubble{background:white;border:1px solid var(--line);border-radius:18px 18px 18px 4px;padding:16px;font-size:13px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere}.chat-question{background:var(--ink);color:white;border-radius:18px 18px 4px 18px;padding:12px 16px;margin:20px 0 12px 35px;font-size:13px;overflow-wrap:anywhere}.chat-sources{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:10px;border-top:1px solid var(--line);font-size:11px;white-space:normal}.chat-sources>span{width:100%;color:var(--ink-2)}.chat-sources a{text-decoration:underline;text-underline-offset:3px}.chat-suggestions{padding:10px 20px;display:flex;flex-wrap:wrap;gap:6px}.chat-suggestions button{border:1px solid var(--line);border-radius:30px;padding:8px 10px;font-size:11px;text-align:left}.chat-suggestions button:hover{background:white}.chat-form{display:flex;padding:8px 20px;gap:8px}.chat-form input{min-width:0;flex:1;border:1px solid #a9a6a0;border-radius:30px;background:white;padding:13px;font:inherit;font-size:12px;color:var(--ink)}.chat-form button{font-size:12px;padding:10px 16px}.chat-form button:disabled{opacity:.5;cursor:default}.chat-footer{display:flex;align-items:center;gap:15px;padding:8px 20px 16px;font-size:10px;line-height:1.5;color:var(--ink-2)}.chat-footer p{flex:1}.chat-footer button{min-height:40px;text-decoration:underline;white-space:nowrap}@media(max-width:480px){.chat-header,.chat-log{padding:16px}.chat-suggestions{padding:8px 16px}.chat-form{padding:8px 16px}.chat-header p{max-width:190px}.chat-footer{padding:8px 16px 12px}}
`}</style>
  </dialog>;
}
