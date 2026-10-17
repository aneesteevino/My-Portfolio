"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, COPY, ACHIEVEMENTS } from "@/lib/data";
export default function Contact() {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setError(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setError(true);
    }
  }
  const letters = (text: string) =>
    text.split(" ").map((word, w) => (
      <span className="contact-word" key={w}>
        {Array.from(word).map((letter, i) => (
          <span
            key={i}
            onPointerEnter={(e) => {
              const el = e.currentTarget;
              el.classList.remove("hop");
              void el.offsetWidth;
              el.classList.add("hop");
            }}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("hop")}
          >
            {letter}
          </span>
        ))}
        {w < text.split(" ").length - 1 ? "\u00a0" : ""}
      </span>
    ));
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <p className="eyebrow section-tag rv">
          {ACHIEVEMENTS.length ? "07" : "06"} — {COPY.contact.tag}
        </p>
        <div className="contact-heading-row">
          <h2
            id="contact-heading"
            className="contact-heading rv"
            aria-label={`${COPY.contact.heading} ${COPY.contact.accent}`}
          >
            <span aria-hidden="true">{letters(COPY.contact.heading)}</span>
            <em aria-hidden="true">{letters(COPY.contact.accent)}</em>
          </h2>
          <a
            href={`mailto:${PROFILE.email}`}
            className="hello-badge"
            aria-label={`Say hello to ${PROFILE.name}`}
          >
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path
                  id="hello-circle"
                  d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1-84 0"
                />
              </defs>
              <text>
                <textPath href="#hello-circle" textLength="263">
                  {COPY.contact.hello}
                </textPath>
              </text>
            </svg>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="contact-email-row rv">
          <a className="contact-email" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
          <button className="copy-button" onClick={copy}>
            {copied ? COPY.contact.copied : COPY.contact.copy}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? COPY.contact.copied : error ? COPY.contact.copyError : ""}
          </span>
        </div>
        {error && <p className="copy-error">{COPY.contact.copyError}</p>}
        <div className="contact-links rv">
          <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          <div>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              {COPY.about.github} ↗
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              {COPY.about.linkedin} ↗
            </a>
          </div>
        </div>
        <footer className="footer">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <span>{COPY.contact.credit}</span>
          <a href="#top">{COPY.contact.back}</a>
        </footer>
      </div>
      <style href="contact-styles" precedence="components">{`
  .contact-section{padding-top:clamp(90px,13vh,150px);border-top:1px solid var(--line)}.contact-heading-row{display:flex;justify-content:space-between;align-items:center;gap:20px}.contact-heading{font-size:clamp(49px,7.8vw,113px);font-weight:550;letter-spacing:-.05em;line-height:1.02}.contact-heading>span,.contact-heading>em{display:block}.contact-heading em{font-size:.96em}.contact-word{display:inline-block;white-space:nowrap}.contact-word>span{display:inline-block}.contact-word .hop{animation:letter-hop .5s var(--ease)}@keyframes letter-hop{30%{transform:translateY(-14px)}65%{transform:translateY(3px)}}.hello-badge{width:120px;height:120px;position:relative;flex-shrink:0}.hello-badge svg{width:100%;height:100%;animation:badge-spin 25s linear infinite}.hello-badge text{font-family:var(--font-mono);font-size:9px;letter-spacing:3px;fill:var(--ink-2)}.hello-badge>span{position:absolute;inset:0;display:grid;place-items:center;font-size:30px}.hello-badge:hover svg{animation-play-state:paused}@keyframes badge-spin{to{transform:rotate(360deg)}}.contact-email-row{display:flex;align-items:center;gap:20px;margin-top:50px}.contact-email{font-size:clamp(18px,3vw,42px);letter-spacing:-.025em;border-bottom:1px solid #a7a39b;overflow-wrap:anywhere;padding-bottom:6px;transition:border-color .4s var(--ease)}.contact-email:hover{border-color:var(--ink)}.copy-button{font-family:var(--font-mono);font-size:9px;min-width:64px;min-height:36px;border:1px solid #ccc8c0;border-radius:50px;padding:8px 13px;white-space:nowrap;transition:background .4s var(--ease)}.copy-button:hover{background:white}.copy-error{font-size:12px;margin-top:10px}.contact-links{display:flex;justify-content:space-between;gap:30px;margin-top:34px;font-size:13px;color:#595650}.contact-links>div{display:flex;gap:25px}.contact-links a:hover{color:var(--ink);text-decoration:underline}.footer{border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;padding-block:28px;margin-top:95px;gap:20px;font-family:var(--font-mono);font-size:8px;color:#706c65}.footer a{color:var(--ink)}
  @media(max-width:800px){.hello-badge{width:85px;height:85px}.contact-heading{font-size:clamp(44px,7.5vw,74px)}.contact-email-row{gap:12px}.footer{margin-top:70px}}
  @media(max-width:600px){.contact-heading-row{display:block;position:relative}.contact-heading{font-size:clamp(44px,11vw,65px);letter-spacing:-.045em}.contact-heading em{font-size:1.1em;max-width:330px}.hello-badge{display:none}.contact-email-row{margin-top:36px;align-items:flex-start;flex-wrap:wrap;gap:12px}.contact-email{font-size:clamp(17px,5.4vw,24px)}.copy-button{font-size:8px;min-height:30px}.contact-links{font-size:11px;gap:20px;flex-wrap:wrap}.footer{display:grid;grid-template-columns:1fr auto;gap:18px;font-size:7px;margin-top:65px}.footer>span{grid-row:2}.footer>a{grid-column:2;grid-row:1}}
  `}</style>
    </section>
  );
}
