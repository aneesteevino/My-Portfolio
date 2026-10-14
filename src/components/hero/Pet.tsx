"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { COPY, CHAT } from "@/lib/data";
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });
export default function Pet() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="robo-launcher"
        aria-label={COPY.hero.petLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg aria-hidden="true" width="48" height="48" viewBox="0 0 64 64">
          <path
            d="M12 26 10 8q0-4 5-1l13 11h8L49 7q5-3 5 1l-2 18"
            fill="#ddd"
            stroke="#555"
            strokeWidth="2"
          />
          <rect
            x="7"
            y="19"
            width="50"
            height="38"
            rx="17"
            fill="#eee"
            stroke="#777"
            strokeWidth="2"
          />
          <rect x="13" y="26" width="38" height="23" rx="10" fill="#191919" />
          <path
            d="M23 34v5m18-5v5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M29 42q3 3 6 0"
            fill="none"
            stroke="#ddd"
            strokeWidth="1.5"
          />
        </svg>
        <span className="robo-tooltip">{CHAT.title}</span>
      </button>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <style href="pet-styles" precedence="components">{`
.robo-launcher{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:80;width:68px;height:68px;display:grid;place-items:center;border:1px solid #d1cec8;border-radius:24px;background:var(--paper);box-shadow:0 6px 24px #0002;transition:transform .25s var(--ease),box-shadow .25s var(--ease)}.robo-launcher>svg{animation:robo-float 3.8s ease-in-out infinite}.robo-launcher:after{content:"Hi!";position:absolute;right:55px;top:-12px;padding:6px 9px;border-radius:14px 14px 2px 14px;background:var(--ink);color:white;font-size:9px;font-family:var(--font-mono);animation:robo-greet 7s ease-in-out infinite}.robo-launcher:hover{transform:translateY(-3px);box-shadow:0 9px 30px #0003}.robo-launcher:hover>svg{animation-play-state:paused}.robo-tooltip{position:absolute;right:78px;white-space:nowrap;padding:9px 13px;border-radius:20px;background:var(--ink);color:white;font-size:12px;opacity:0;pointer-events:none;transition:opacity .2s var(--ease)}.robo-launcher:hover .robo-tooltip,.robo-launcher:focus-visible .robo-tooltip{opacity:1}@keyframes robo-float{0%,100%{translate:0 0}50%{translate:0 -7px}}@keyframes robo-greet{0%,12%,88%,100%{opacity:0;transform:translateY(5px) scale(.8)}18%,34%{opacity:1;transform:none}}@media(max-width:700px){.robo-launcher{width:60px;height:60px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));border-radius:21px}.robo-launcher:after{right:48px}}@media(prefers-reduced-motion:reduce){.robo-launcher,.robo-launcher>svg,.robo-launcher:after,.robo-tooltip{animation:none;transition:none}.robo-launcher:after{opacity:1;transform:none}}
`}</style>
    </>
  );
}
