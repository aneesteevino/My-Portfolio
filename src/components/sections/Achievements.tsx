"use client";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, COPY, type Achievement } from "@/lib/data";
import { useInView, useReducedMotion } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";
function AchievementCard({
  item,
  index,
  active,
}: {
  item: Achievement;
  index: number;
  active: boolean;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(item.value);
      return;
    }
    let frame = 0,
      start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 1400);
      setValue(Math.round(item.value * (1 - (1 - p) ** 4)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, item.value]);
  return (
    <article
      ref={ref}
      className={`achievement-card card ${active ? "centred" : ""}`}
    >
      <div className="achievement-top">
        {item.logo && <img src={item.logo} width="72" height="72" alt="" />}
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(ACHIEVEMENTS.length).padStart(2, "0")}
        </span>
      </div>
      <h3>{item.label}</h3>
      <p>{item.caption}</p>
      <small>{item.detail}</small>
      <strong aria-label={`${item.value}${item.suffix}`}>
        <span aria-hidden="true">
          {value.toLocaleString()}
          {item.suffix}
        </span>
      </strong>
    </article>
  );
}
export default function Achievements() {
  const outer = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const section = outer.current,
      node = track.current;
    if (!section || !node) return;
    let frame = 0,
      travel = 0;
    const measure = () => {
      travel = Math.max(0, node.scrollWidth - innerWidth + 32);
      section.style.height = reduced ? "auto" : `${innerHeight + travel}px`;
      update();
    };
    const update = () => {
      frame = 0;
      const p = reduced
        ? 0
        : Math.min(
            1,
            Math.max(0, -section.getBoundingClientRect().top / (travel || 1)),
          );
      node.style.transform = `translateX(${-travel * p}px)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const cards = Array.from(node.querySelectorAll<HTMLElement>("article"));
      let distance = Infinity,
        index = 0;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect(),
          d = Math.abs(r.left + r.width / 2 - innerWidth / 2);
        if (d < distance) {
          distance = d;
          index = i;
        }
      });
      setActive(index);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    measure();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", measure);
    };
  }, [reduced]);
  if (!ACHIEVEMENTS.length) return null;
  return (
    <section
      id="achievements"
      ref={outer}
      className={`achievements-section ${reduced ? "reduced" : ""}`}
      aria-labelledby="achievements-heading"
    >
      <div className="achievements-sticky">
        <div className="container">
          <SectionHeading
            index="06"
            tag={COPY.achievements.tag}
            heading={COPY.achievements.heading}
            accent={COPY.achievements.accent}
            id="achievements-heading"
          />
          <div className="achievements-progress" aria-hidden="true">
            <span ref={bar} />
          </div>
        </div>
        <div className="achievement-viewport">
          <div ref={track} className="achievement-track">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementCard
                key={a.label}
                item={a}
                index={i}
                active={active === i}
              />
            ))}
            <p className="and-counting">{COPY.achievements.end}</p>
          </div>
        </div>
      </div>
      <style
        href="achievements-styles"
        precedence="components"
      >{`.achievements-sticky{position:sticky;top:0;height:100svh;padding-top:100px;overflow:hidden}.achievements-progress{height:1px;background:var(--line);margin-top:25px}.achievements-progress span{display:block;height:2px;background:var(--ink);transform-origin:left;transform:scaleX(0)}.achievement-viewport{overflow:hidden;padding-block:40px}.achievement-track{display:flex;gap:24px;padding-inline:var(--gutter);width:max-content;will-change:transform}.achievement-card{position:relative;flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);padding:28px;transition:transform .5s var(--ease),box-shadow .5s var(--ease)}.achievement-card.centred{transform:translateY(-12px);box-shadow:0 25px 50px -20px #0002}.achievement-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:35px}.achievement-top img{border-radius:16px;padding:12px;background:#f4f4f4}.achievement-card h3{font-size:24px}.achievement-card p,.achievement-card small{font-size:12px;color:var(--mute)}.achievement-card strong{position:absolute;right:25px;bottom:25px;font-size:60px;letter-spacing:-.05em}.and-counting{align-self:center;font-family:var(--font-serif);font-style:italic;font-size:40px;padding:0 80px}.reduced .achievements-sticky{position:static;height:auto}.reduced .achievement-track{width:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));transform:none!important}.reduced .achievement-card{width:100%}.reduced .and-counting{padding:30px}`}</style>
    </section>
  );
}
