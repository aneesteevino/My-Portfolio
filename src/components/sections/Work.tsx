"use client";
import { useState } from "react";
import { COPY, PROJECTS } from "@/lib/data";
import TechLogo from "../ui/TechLogo";
import ProjectIllustration from "../ui/ProjectIllustration";
import SectionHeading from "../ui/SectionHeading";
export default function Work() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section
      id="work"
      className="section work-section"
      aria-labelledby="work-heading"
    >
      <div className="container">
        <div className="work-heading-row">
          <SectionHeading
            index="03"
            tag={COPY.work.tag}
            heading={COPY.work.heading}
            accent={COPY.work.accent}
            id="work-heading"
          />
          <p className="rv">{COPY.work.intro}</p>
        </div>
        <div className="project-gallery rv">
          {PROJECTS.map((p, i) => (
            <article
              className={`project-panel ${active === i ? "expanded" : ""}`}
              key={p.id}
            >
              <button
                className="project-spine"
                aria-expanded={active === i}
                aria-controls={`project-${p.id}`}
                onClick={() => setActive((current) => (current === i ? null : i))}
              >
                <span className="eyebrow">{p.index}</span>
                <span className="spine-title">{p.title}</span>
                <span className="spine-plus" aria-hidden="true">
                  ＋
                </span>
                <span className="sr-only">
                  {active === i ? COPY.ui.selectedProject : COPY.ui.openProject}
                </span>
              </button>
              <div
                id={`project-${p.id}`}
                className="project-expanded"
                inert={active !== i}
                aria-hidden={active !== i}
              >
                <button
                  type="button"
                  className="project-close"
                  aria-label={`Close ${p.title}`}
                  onClick={() => setActive(null)}
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="project-copy">
                  <p className="eyebrow project-kicker">
                    {p.index} / {p.kicker} · {p.year}
                  </p>
                  <h3>{p.title}</h3>
                  <p className="project-description">{p.description}</p>
                  <ul className="project-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span aria-hidden="true">↳</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="tech-chips">
                    {p.tech.map((t) => (
                      <span key={t}>
                        <TechLogo name={t} size={12} decorative />
                        {t}
                      </span>
                    ))}
                  </div>
                  {(p.demo || p.github) && (
                    <div className="project-links">
                      {p.demo && (
                        <a
                          className="project-github project-demo"
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {COPY.work.demo}
                        </a>
                      )}
                      {p.github && (
                        <a
                          className="project-github"
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {COPY.work.github}
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="project-art">
                  <ProjectIllustration project={p} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style href="work-styles" precedence="components">{`
  .work-section{border-top:1px solid var(--line)}.work-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:52px}.work-heading-row>p{font-size:14px;line-height:1.7;max-width:235px;color:#6d6b65}.project-gallery{display:flex;gap:8px;height:min(78svh,600px);min-height:550px}.project-panel{position:relative;flex:1;min-width:0;background:#eae8e3;border-radius:25px;overflow:hidden;transition:flex .8s var(--ease),background .6s var(--ease);border:1px solid #dedbd5}.project-panel.expanded{flex:11;background:#fff;border-color:#e9e6e0;box-shadow:0 16px 40px -28px #0003}.project-spine{position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;flex-direction:column;padding:27px 0;gap:28px;transition:opacity .3s var(--ease)}.spine-title{writing-mode:vertical-rl;font-size:17px;letter-spacing:-.025em;text-align:left}.spine-plus{margin-top:auto;width:29px;height:29px;border-radius:50%;border:1px solid #bbb7b0;display:grid;place-items:center;font-size:19px;transition:transform .5s var(--ease)}.project-spine:hover .spine-plus{transform:rotate(90deg)}.project-panel.expanded .project-spine{width:45px;right:auto;opacity:0;z-index:2}.project-panel.expanded .project-spine:focus-visible{opacity:1;background:var(--paper)}.project-panel.expanded .spine-title{display:none}.project-expanded{position:relative;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:22px;padding:40px 28px 35px 35px;height:100%;opacity:0;visibility:hidden;transition:opacity .3s var(--ease);min-width:620px}.expanded .project-expanded{opacity:1;visibility:visible;transition-delay:.2s}.project-close{position:absolute;z-index:3;right:17px;top:15px;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:var(--paper);font-size:25px;line-height:1;transition:background .3s var(--ease),color .3s var(--ease),transform .3s var(--ease)}.project-close:hover,.project-close:focus-visible{background:var(--ink);color:#fff;transform:rotate(90deg)}.project-copy{display:flex;flex-direction:column;min-width:0}.project-kicker{font-size:8px;line-height:1.7;color:#6d6b65;margin-bottom:24px;padding-right:35px}.project-copy h3{font-size:clamp(25px,2.8vw,42px);line-height:1.04;font-weight:550;letter-spacing:-.04em}.project-description{margin-top:23px;font-size:13px;line-height:1.75;color:#66645f}.project-features{display:grid;grid-template-columns:1fr 1fr;list-style:none;gap:13px 12px;padding:0;margin:25px 0;font-size:10px;line-height:1.4;color:#4b4944}.project-features li{display:flex;gap:7px}.project-features span{color:#999}.tech-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}.tech-chips>span{display:flex;align-items:center;gap:5px;border:1px solid #e6e4e0;padding:6px 7px;border-radius:5px;font-size:8px}.project-links{display:flex;flex-wrap:wrap;gap:18px;margin-top:25px}.project-github{align-self:flex-start;border-bottom:1px solid #aaa;padding-bottom:6px;font-size:11px}.project-demo{font-weight:600;border-color:var(--ink)}.project-github:hover{border-color:#000}.project-art{align-self:center;height:350px;clip-path:inset(0 100% 0 0);transition:clip-path .8s var(--ease)}.expanded .project-art{clip-path:inset(0);transition-delay:.2s}
  @media(max-width:1200px) and (min-width:901px){.project-gallery{gap:6px}.project-panel.expanded{flex:15}.project-expanded{min-width:500px;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);padding:35px 20px;gap:15px}.project-copy h3{font-size:30px}.project-features{font-size:9px}.spine-title{font-size:14px}.project-art{height:300px}.project-kicker{font-size:7px}}
  @media(max-width:900px){.project-gallery{display:flex;flex-direction:column;height:auto;min-height:0;gap:10px}.project-panel{flex:none;border-radius:20px;height:76px;transition:height .65s var(--ease),background .6s var(--ease)}.project-panel.expanded{flex:none;height:535px}.project-spine{flex-direction:row;gap:20px;padding:24px;width:100%;height:76px}.spine-title{writing-mode:horizontal-tb;font-size:16px}.spine-plus{margin-top:0;margin-left:auto;flex-shrink:0}.project-panel.expanded .project-spine{width:100%;height:68px;opacity:1;padding:20px 25px;border-bottom:1px solid var(--line);right:0}.project-panel.expanded .spine-title{display:inline}.expanded .spine-plus{transform:rotate(45deg)}.project-expanded{min-width:0;height:467px;margin-top:68px;padding:27px;gap:28px}.project-close{display:none}.project-copy h3{font-size:33px}.project-kicker{margin-bottom:14px}.project-description{margin-top:17px}.project-features{margin-block:18px}.project-art{height:325px}.work-heading-row>p{max-width:200px;font-size:12px}}
  @media(max-width:600px){.work-heading-row{display:block;margin-bottom:34px}.work-heading-row>p{margin-top:24px;max-width:270px}.project-panel.expanded{height:835px}.project-expanded{display:flex;flex-direction:column;height:767px;padding:25px;gap:23px}.project-copy{flex:1}.project-copy h3{font-size:33px;max-width:90%}.project-description{font-size:13px}.project-features{font-size:10px}.project-art{height:260px;width:100%;flex-shrink:0}.project-illustration{padding:20px;flex-direction:row;gap:20px}.project-illustration .mini-window{min-height:0;width:210px;transform:rotate(-3deg) scale(.82);flex-shrink:0}.project-illustration figcaption{writing-mode:vertical-rl;margin:0}.project-spine{gap:15px;padding:20px}.spine-title{font-size:15px}.project-links{margin-top:20px}}
  `}</style>
    </section>
  );
}
