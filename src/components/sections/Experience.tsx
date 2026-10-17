"use client";
import { useRef, useState } from "react";
import { COPY, EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";
const stops = [...EDUCATION, ...EXPERIENCE].sort((a, b) =>
  a.sort.localeCompare(b.sort),
);
export default function Experience() {
  const path = useRef<HTMLDivElement>(null),
    line = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(0);
  useScrollProgress(path, (p) => {
    if (line.current) line.current.style.transform = `scaleY(${p})`;
    setLit(Math.floor(p * stops.length));
  });
  return (
    <section
      id="experience"
      className="section experience-section"
      aria-labelledby="experience-heading"
    >
      <div className="container experience-grid">
        <SectionHeading
          index="05"
          tag={COPY.experience.tag}
          heading={COPY.experience.heading}
          accent={COPY.experience.accent}
          id="experience-heading"
        />
        <div ref={path} className="timeline">
          <span className="timeline-line" aria-hidden="true">
            <span ref={line} />
          </span>
          {stops.map((s, i) => (
            <article
              key={s.id}
              className={`timeline-stop rv ${lit >= i ? "lit" : ""}`}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <p className="eyebrow">
                {s.date} <span> / {s.kind}</span>
              </p>
              <h3>{s.title}</h3>
              <p className="timeline-place">{s.place}</p>
              <ul>
                {s.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          ))}
          <a className="next-card" href="#contact">
            {COPY.experience.next}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <style href="experience-styles" precedence="components">{`
  .experience-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:75px}.experience-grid>header{position:sticky;top:120px;align-self:start}.experience-grid .section-heading{font-size:clamp(42px,4.5vw,64px)}.timeline{position:relative;padding-left:44px;padding-top:8px}.timeline-line{position:absolute;left:3px;top:14px;bottom:55px;width:1px;background:#d7d4ce}.timeline-line>span{display:block;width:2px;height:100%;background:var(--ink);transform:scaleY(0);transform-origin:top}.timeline-stop{position:relative;margin-bottom:52px}.timeline-dot{position:absolute;left:-46px;top:3px;width:11px;height:11px;border:1px solid #b8b4ad;background:var(--paper);border-radius:50%;transition:background .6s var(--ease),box-shadow .6s var(--ease)}.lit .timeline-dot{background:var(--ink);border-color:var(--ink);box-shadow:0 0 0 6px #e9e6e0}.timeline-stop>.eyebrow{font-size:9px}.timeline-stop>.eyebrow span{color:#6d6b65}.timeline-stop h3{font-size:29px;font-weight:550;letter-spacing:-.035em;margin-top:16px}.timeline-place{font-size:13px;color:#6d6b65;line-height:1.7;margin:7px 0 18px}.timeline-stop ul{padding:0;margin:0;list-style:none}.timeline-stop li{font-size:13px;line-height:1.8;color:#54524d;margin:10px 0;padding-left:14px;position:relative}.timeline-stop li::before{content:"";position:absolute;left:0;top:10px;width:3px;height:3px;background:#85817a;border-radius:50%}.next-card{padding:24px 28px;border:1px dashed #bdb9b1;border-radius:18px;display:flex;justify-content:space-between;align-items:center;font-family:var(--font-serif);font-style:italic;font-size:24px;color:#6d6b65;transition:background .4s var(--ease),color .4s var(--ease)}.next-card:hover{background:white;color:var(--ink)}
  @media(max-width:800px){.experience-grid{grid-template-columns:1fr;gap:55px}.experience-grid>header{position:static}.timeline{padding-left:30px}.timeline-dot{left:-32px}.timeline-stop h3{font-size:26px}.timeline-stop>.eyebrow{font-size:8px}.timeline-stop>.eyebrow span{display:block;margin-top:5px}.timeline-stop li{font-size:12px}.next-card{font-size:24px}}
  `}</style>
    </section>
  );
}
