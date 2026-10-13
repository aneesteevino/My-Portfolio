"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, COPY } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";
export default function About() {
  const card = useRef<HTMLButtonElement>(null),
    swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false),
    [hovered, setHovered] = useState(false);
  useEffect(() => {
    const node = card.current;
    if (!node) return;
    let frame = 0,
      angle = 0,
      velocity = 0,
      target = 0,
      lastX = 0,
      lastT = 0,
      active = false;
    const animate = (time: number) => {
      const dt = lastT ? Math.min((time - lastT) / 16.67, 2) : 1;
      lastT = time;
      if (prefersReducedMotion()) {
        if (swing.current) swing.current.style.transform = "none";
        frame = 0;
        return;
      }
      const idle = Math.sin(time * 0.0012) * 0.7;
      velocity += (target + idle - angle) * 0.028 * dt;
      velocity *= Math.pow(0.86, dt);
      angle += velocity * dt;
      target *= Math.pow(0.95, dt);
      if (swing.current) swing.current.style.transform = `rotate(${angle}deg)`;
      if (active) frame = requestAnimationFrame(animate);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target = Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.2));
      lastX = e.clientX;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        if (active && !frame) {
          lastT = 0;
          frame = requestAnimationFrame(animate);
        } else if (!active) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.05 },
    );
    io.observe(node);
    node.addEventListener("pointermove", move);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (active) {
        lastT = 0;
        frame = requestAnimationFrame(animate);
      }
    };
    media.addEventListener("change", change);
    return () => {
      io.disconnect();
      node.removeEventListener("pointermove", move);
      media.removeEventListener("change", change);
      cancelAnimationFrame(frame);
    };
  }, []);
  const back = flipped || hovered;
  return (
    <section
      id="about"
      className="section about-section"
      aria-labelledby="about-heading"
    >
      <div className="container about-grid">
        <div className="about-copy">
          <SectionHeading
            index="01"
            tag={COPY.about.tag}
            heading={COPY.about.heading}
            accent={COPY.about.accent}
            id="about-heading"
          />
          <p className="about-summary rv">{PROFILE.resumeSummary}</p>
          <p className="about-line rv">{PROFILE.shortLine}</p>
          <div className="about-links rv">
            <a className="pill pill-primary" href={PROFILE.resume} download>
              {COPY.about.resume} ↓
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              {COPY.about.github} ↗
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              {COPY.about.linkedin} ↗
            </a>
          </div>
        </div>
        <div className="lanyard-wrap rv">
          <div className="lanyard-anchor" aria-hidden="true" />
          <div ref={swing} className="lanyard-swing">
            <div className="lanyard-strap" aria-hidden="true">
              <span>
                {PROFILE.name} · {PROFILE.role} · {PROFILE.name}
              </span>
            </div>
            <div className="metal-clip" aria-hidden="true" />
            <button
              ref={card}
              className={`id-card ${back ? "flipped" : ""}`}
              aria-label={
                back
                  ? `${COPY.about.cardFront} ${COPY.about.cardBack} ${PROFILE.idLines.join(" ")} ${PROFILE.name} ${COPY.about.hello} ${PROFILE.email}. ${COPY.about.flip}`
                  : `${COPY.about.cardFront} ${PROFILE.name} ${PROFILE.role} ${COPY.about.education} ${PROFILE.educationShort} ${COPY.about.graduation} ${PROFILE.graduationYear} ${PROFILE.initials}. ${COPY.about.flip}`
              }
              aria-pressed={back}
              onClick={() => setFlipped((v) => !v)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setHovered(true);
              }}
              onPointerLeave={() => setHovered(false)}
            >
              <div className="id-rotator">
                <div className="id-face id-front" aria-hidden={back}>
                  <div className="id-top">
                    <span className="eyebrow">{COPY.about.cardFront}</span>
                    <span aria-hidden="true">✳</span>
                  </div>
                  <div className="id-photo">
                    <img
                      src={PROFILE.portrait}
                      alt={PROFILE.name}
                      width="128"
                      height="156"
                      loading="lazy"
                    />
                  </div>
                  <h3>{PROFILE.name}</h3>
                  <p className="id-role">{PROFILE.role}</p>
                  <div className="id-details">
                    <span>{COPY.about.education}</span>
                    <strong>{PROFILE.educationShort}</strong>
                    <span>{COPY.about.graduation}</span>
                    <strong>{PROFILE.graduationYear}</strong>
                  </div>
                  <div className="id-bottom">
                    <div className="barcode" aria-hidden="true">
                      {Array.from({ length: 34 }, (_, i) => (
                        <i key={i} style={{ width: ((i * 7) % 3) + 1 }} />
                      ))}
                    </div>
                    <span className="id-seal" aria-hidden="true">
                      {PROFILE.initials}
                    </span>
                  </div>
                </div>
                <div className="id-face id-back" aria-hidden={!back}>
                  <p className="eyebrow">{COPY.about.cardFront}</p>
                  <h3>{COPY.about.cardBack}</h3>
                  <ul>
                    {PROFILE.idLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <span className="signature">{PROFILE.name}</span>
                  <p className="id-found">
                    {COPY.about.hello}
                    <br />
                    {PROFILE.email}
                  </p>
                </div>
              </div>
            </button>
          </div>
          <span className="card-caption eyebrow" aria-hidden="true">
            ↻
          </span>
        </div>
        <aside className="about-facts rv">
          <p className="eyebrow">{COPY.about.facts}</p>
          <dl>
            <div>
              <dt>{COPY.about.education}</dt>
              <dd>
                {PROFILE.educationShort}
                <br />
                <span>{PROFILE.educationCaption}</span>
              </dd>
            </div>
            <div>
              <dt>{COPY.about.role}</dt>
              <dd>{PROFILE.currentRole}</dd>
            </div>
            <div>
              <dt>{COPY.about.email}</dt>
              <dd>
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              </dd>
            </div>
          </dl>
          <blockquote>
            <span aria-hidden="true">“</span>
            {PROFILE.quote}
          </blockquote>
        </aside>
      </div>
      <style href="about-styles" precedence="components">{`
  .about-section{border-top:1px solid var(--line)}.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(30px,4vw,65px);align-items:stretch}.about-copy .section-heading{font-size:clamp(44px,4.4vw,64px)}.about-summary{font-size:16px;line-height:1.75;color:var(--ink-2);margin-top:30px}.about-line{margin-top:22px;color:#65635e;line-height:1.7;font-size:13px}.about-links{display:flex;flex-wrap:wrap;align-items:center;gap:18px;margin-top:28px}.text-link{font-size:12px;border-bottom:1px solid var(--line);padding:7px 0}.text-link:hover{border-color:var(--ink)}
  .lanyard-wrap{position:relative;display:flex;flex-direction:column;align-items:center;padding-top:8px}.lanyard-anchor{width:120px;height:1px;background:var(--line)}.lanyard-swing{transform-origin:50% 0;will-change:transform;display:flex;align-items:center;flex-direction:column}.lanyard-strap{height:56px;width:30px;background:#303030;color:#fff;overflow:hidden;position:relative;border-inline:2px solid #555}.lanyard-strap span{position:absolute;font-family:var(--font-mono);font-size:7px;writing-mode:vertical-rl;left:8px;white-space:nowrap;animation:strap-scroll 16s linear infinite}.metal-clip{position:relative;width:20px;height:29px;border:3px solid #929292;border-radius:5px;box-shadow:inset 1px 0 #fff,1px 0 #d0d0d0;margin-top:-7px;margin-bottom:-11px;z-index:2;background:#d3d3d3}.metal-clip::after{content:"";position:absolute;inset:5px 3px;background:#666;border-radius:2px}.id-card{display:block;width:300px;height:404px;padding:0;perspective:1000px;border-radius:22px;text-align:center}.id-rotator{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 1s var(--ease)}.id-card.flipped .id-rotator{transform:rotateY(180deg)}.id-face{position:absolute;inset:0;border-radius:22px;background:#fff;backface-visibility:hidden;overflow:hidden;box-shadow:inset 0 0 0 1px #00000012,0 24px 35px -16px #00000025}.id-top{background:var(--ink);color:#fff;height:53px;display:flex;align-items:center;justify-content:space-between;padding:0 25px}.id-top .eyebrow{color:#eee;font-size:8px}.id-photo{margin:20px auto 13px;width:128px;height:156px;border-radius:14px;overflow:hidden;border:4px solid #eee;box-shadow:0 0 26px #0000000b}.id-photo img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}.id-card:hover .id-photo img{transform:scale(1.05)}.id-front h3{font-size:20px;letter-spacing:-.035em}.id-role{font-size:10px;color:#6d6b65;margin-top:4px}.id-details{margin:18px 27px 0;display:grid;grid-template-columns:auto 1fr;text-align:left;gap:8px;font-family:var(--font-mono);font-size:8px}.id-details span{color:#6d6b65}.id-details strong{text-align:right;font-weight:400}.id-bottom{display:flex;align-items:center;justify-content:space-between;margin:17px 27px 0}.barcode{height:24px;display:flex;gap:2px}.barcode i{display:block;background:#343434}.id-seal{width:29px;height:29px;display:grid;place-items:center;border:3px double #aaa;border-radius:50%;background:#eee;font-size:9px;color:#777}.id-back{transform:rotateY(180deg);text-align:left;padding:28px}.id-back h3{font-size:35px;margin:25px 0 20px;letter-spacing:-.04em}.id-back ul{padding:0;list-style:none;font-size:12px;color:var(--ink-2);line-height:2.1}.signature{display:block;font-family:var(--font-serif);font-style:italic;font-size:28px;margin-top:19px;border-bottom:1px solid var(--line);padding-bottom:12px}.id-found{font-size:8px;line-height:1.8;margin-top:15px}.card-caption{margin-top:22px;font-size:21px;color:var(--faint)}@keyframes strap-scroll{to{transform:translateY(-60%)}}
  .about-facts{padding-top:95px}.about-facts dl{margin:24px 0 0}.about-facts dl>div{padding:18px 0;border-bottom:1px solid var(--line)}.about-facts dt{font-family:var(--font-mono);font-size:9px;color:#6d6b65;text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px}.about-facts dd{margin:0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.about-facts dd span{color:#6d6b65;font-size:12px}.about-facts blockquote{font-family:var(--font-serif);font-style:italic;font-size:25px;line-height:1.2;margin:34px 0 0;color:#6d6b65}.about-facts blockquote>span{display:block;font-size:40px;line-height:.8;margin-bottom:4px}
  @media(max-width:1100px){.about-grid{grid-template-columns:minmax(0,1fr) 320px}.about-facts{grid-column:1/-1;padding-top:25px;display:grid;grid-template-columns:1fr 2fr;gap:24px}.about-facts dl{grid-column:2;grid-row:1/3;margin:0}.about-facts blockquote{margin:0}}
  @media(max-width:700px){.about-grid{grid-template-columns:minmax(0,1fr);gap:48px}.about-copy .section-heading em{display:inline}.about-summary{font-size:15px}.lanyard-wrap{padding-top:0}.about-facts{grid-column:auto;display:block;padding-top:0}.about-facts dl{margin:14px 0 0}.about-facts blockquote{margin-top:30px}.about-line{font-size:12px}}
  `}</style>
    </section>
  );
}
