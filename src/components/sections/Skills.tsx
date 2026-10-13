"use client";
import { useMemo, useState } from "react";
import { COPY, SKILL_GROUPS, PROJECTS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";
export default function Skills() {
  const skills = useMemo(
    () =>
      SKILL_GROUPS.flatMap((g) =>
        g.skills.map((s) => ({ ...s, family: g.family })),
      ),
    [],
  );
  const [family, setFamily] = useState("all"),
    [selected, setSelected] = useState(skills[0]);
  const projects = PROJECTS.filter((p) =>
    p.tech.some((t) =>
      [selected.name, ...(selected.aliases ?? [])].includes(t),
    ),
  );
  return (
    <section
      id="skills"
      className="section skills-section"
      aria-labelledby="skills-heading"
    >
      <div className="container">
        <div className="skills-heading-row">
          <SectionHeading
            index="02"
            tag={COPY.skills.tag}
            heading={COPY.skills.heading}
            accent={COPY.skills.accent}
            id="skills-heading"
          />
          <p className="skills-hint eyebrow rv">{COPY.skills.hint}</p>
        </div>
        <div className="skill-filters rv" aria-label="Skill families">
          <button
            className={family === "all" ? "selected" : ""}
            aria-pressed={family === "all"}
            onClick={() => setFamily("all")}
          >
            {COPY.skills.all}
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.family}
              className={family === g.family ? "selected" : ""}
              aria-pressed={family === g.family}
              onClick={() => {
                setFamily(g.family);
                setSelected({ ...g.skills[0], family: g.family });
              }}
            >
              {g.family}
            </button>
          ))}
        </div>
        <div className="skills-layout">
          <div className="element-grid">
            {skills.map((s, i) => (
              <button
                key={s.key}
                className={`element rv ${selected.key === s.key ? "active" : ""} ${family !== "all" && s.family !== family ? "dimmed" : ""}`}
                style={
                  {
                    "--i": 0,
                    "--wave-desktop": `${(Math.floor(i / 8) + (i % 8)) * 40}ms`,
                    "--wave-mobile": `${(Math.floor(i / 4) + (i % 4)) * 40}ms`,
                  } as React.CSSProperties
                }
                onPointerMove={(e) => {
                  if (
                    e.pointerType === "mouse" &&
                    Math.abs(e.movementX) + Math.abs(e.movementY) > 0
                  )
                    setSelected(s);
                }}
                onFocus={() => setSelected(s)}
                onClick={() => setSelected(s)}
                aria-pressed={selected.key === s.key}
              >
                <span className="element-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{s.symbol}</strong>
                <span className="element-name">{s.name}</span>
                <span className="element-family">{s.family}</span>
              </button>
            ))}
          </div>
          <aside
            className="skill-inspector card"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="eyebrow">{COPY.skills.inspector}</p>
            <div className="inspector-logo" key={selected.key}>
              <TechLogo
                name={selected.name}
                logoKey={selected.key}
                size={150}
              />
            </div>
            <span className="eyebrow inspector-family">{selected.family}</span>
            <h3>{selected.name}</h3>
            <div className="inspector-projects">
              <p className="eyebrow">
                {projects.length ? COPY.skills.used : COPY.skills.empty}
              </p>
              {projects.map((p) => (
                <a href="#work" key={p.id}>
                  {p.title}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
      <style href="skills-styles" precedence="components">{`
  .skills-section{border-top:1px solid var(--line)}.skills-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:35px}.skills-hint{max-width:170px;line-height:1.8;font-size:9px;text-transform:none;letter-spacing:0;color:#6d6b65}.skill-filters{display:flex;gap:7px;flex-wrap:wrap;margin:42px 0 27px}.skill-filters button{padding:9px 14px;min-height:38px;border:1px solid var(--line);border-radius:99px;font-size:10px;transition:background .35s var(--ease),color .35s var(--ease)}.skill-filters button.selected{background:var(--ink);color:#fff}.skills-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:27px;align-items:start}.element-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px}.element{min-width:0;height:128px;border:1px solid #d8d5d0;border-radius:10px;padding:10px 9px;background:transparent;display:flex;align-items:flex-start;flex-direction:column;text-align:left;transition:background .4s var(--ease),color .4s var(--ease),opacity .4s var(--ease),transform .5s var(--ease)!important;transition-delay:0ms!important}.motion-ready .element:not(.is-in){transition-delay:var(--wave-desktop)!important}.element-number{font-family:var(--font-mono);font-size:8px;opacity:1}.element strong{font-size:28px;font-weight:550;letter-spacing:-.04em;line-height:1.1;margin:6px 0}.element-name{font-size:9px;line-height:1.1;overflow-wrap:anywhere}.element-family{font-family:var(--font-mono);font-size:5px;line-height:1.2;margin-top:auto;padding-top:4px;opacity:1}.element.dimmed{opacity:1;color:#6d6b65;background:#eeece7;border-color:transparent}.element.active{background:#fff;border-color:#aaa;box-shadow:0 7px 20px #00000007;transform:translateY(-3px);opacity:1}.element:hover,.element:focus-visible{background:var(--ink);color:#fff;border-color:var(--ink)}.skill-inspector{position:sticky;top:112px;padding:29px;min-height:445px}.skill-inspector>.eyebrow{font-size:8px}.inspector-logo{height:195px;display:grid;place-items:center;animation:logo-pop .55s var(--ease)}.inspector-family{font-size:8px;color:#6d6b65}.skill-inspector h3{font-size:27px;font-weight:500;letter-spacing:-.04em;margin-top:8px;line-height:1.1}.inspector-projects{margin-top:24px;border-top:1px solid var(--line);padding-top:20px}.inspector-projects>.eyebrow{font-size:8px;color:#6d6b65}.inspector-projects a{display:flex;justify-content:space-between;gap:8px;font-size:11px;padding-top:14px;line-height:1.4}.inspector-projects a:hover{text-decoration:underline}@keyframes logo-pop{from{transform:scale(.8);opacity:.3}to{transform:scale(1);opacity:1}}
  @media(max-width:1150px){.skills-layout{grid-template-columns:minmax(0,1fr) 260px;gap:16px}.element-grid{gap:5px}.element{height:124px;padding:8px 6px}.element strong{font-size:25px}.element-name{font-size:8px}.skill-inspector{padding:24px}}
  @media(max-width:900px){.element-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.element{height:132px;padding:10px}.element strong{font-size:30px}.element-name{font-size:10px}.element-family{font-size:6px}.motion-ready .element:not(.is-in){transition-delay:var(--wave-mobile)!important}}
  @media(max-width:600px){.skills-layout{grid-template-columns:minmax(0,1fr)}.skills-hint{display:none}.skill-filters{margin-top:28px;gap:6px}.skill-filters button{font-size:9px;padding:8px 11px}.element-grid{gap:6px}.element{height:124px;padding:8px}.element strong{font-size:28px}.element-name{font-size:9px}.element-family{font-size:5px}.skill-inspector{position:relative;top:auto;min-height:0;margin-top:8px;display:grid;grid-template-columns:100px 1fr;gap:8px 24px;padding:26px}.skill-inspector>.eyebrow{grid-column:1/-1}.inspector-logo{grid-row:2/5;height:120px}.inspector-logo img,.inspector-logo svg{max-width:90px;max-height:90px}.inspector-family{align-self:end}.skill-inspector h3{font-size:23px}.inspector-projects{grid-column:1/-1;margin-top:12px}.inspector-projects a{padding-top:10px}}
  `}</style>
    </section>
  );
}
