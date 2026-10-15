"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { COPY, SKILL_GROUPS, PROJECTS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";

export default function Skills() {
  const [familyIndex, setFamilyIndex] = useState(0);
  const group = SKILL_GROUPS[familyIndex];
  const [selectedKey, setSelectedKey] = useState(group.skills[0].key);
  const selected =
    group.skills.find((skill) => skill.key === selectedKey) ?? group.skills[0];
  const projects = useMemo(
    () =>
      PROJECTS.filter((project) =>
        project.tech.some((technology) =>
          [selected.name, ...(selected.aliases ?? [])].includes(technology),
        ),
      ),
    [selected],
  );

  function selectFamily(index: number) {
    setFamilyIndex(index);
    setSelectedKey(SKILL_GROUPS[index].skills[0].key);
  }

  return (
    <section id="skills" className="section skills-section" aria-labelledby="skills-heading">
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

        <div className="capability-tabs rv" aria-label="Skill families">
          {SKILL_GROUPS.map((item, index) => (
            <button
              key={item.family}
              className={familyIndex === index ? "selected" : ""}
              aria-pressed={familyIndex === index}
              onClick={() => selectFamily(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.family}
            </button>
          ))}
        </div>

        <div className="capability-deck card rv" key={group.family}>
          <div className="deck-intro">
            <span className="eyebrow">
              {String(familyIndex + 1).padStart(2, "0")} / {String(SKILL_GROUPS.length).padStart(2, "0")}
            </span>
            <h3>{group.family}</h3>
            <p>{group.skills.length} verified {group.skills.length === 1 ? "skill" : "skills"}</p>
            <div className="deck-line" aria-hidden="true"><i /></div>
          </div>

          <div className="skill-cloud" aria-label={`${group.family} skills`}>
            {group.skills.map((skill, index) => (
              <button
                key={skill.key}
                className={`skill-chip ${selected.key === skill.key ? "active" : ""}`}
                style={{ "--delay": `${index * 55}ms` } as CSSProperties}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelectedKey(skill.key);
                }}
                onFocus={() => setSelectedKey(skill.key)}
                onClick={() => setSelectedKey(skill.key)}
                aria-pressed={selected.key === skill.key}
              >
                <span className="chip-logo" aria-hidden="true">
                  <TechLogo name={skill.name} logoKey={skill.key} size={32} decorative />
                </span>
                <span>
                  <strong>{skill.name}</strong>
                  <small>{skill.symbol}</small>
                </span>
              </button>
            ))}
          </div>

          <aside className="skill-inspector" aria-live="polite" aria-atomic="true">
            <p className="eyebrow">{COPY.skills.inspector}</p>
            <div className="inspector-main" key={selected.key}>
              <div className="inspector-logo">
                <TechLogo name={selected.name} logoKey={selected.key} size={112} />
              </div>
              <span className="eyebrow inspector-family">{group.family}</span>
              <h4>{selected.name}</h4>
            </div>
            <div className="inspector-projects">
              <p className="eyebrow">{projects.length ? COPY.skills.used : COPY.skills.empty}</p>
              {projects.map((project) => (
                <a href="#work" key={project.id}>
                  {project.title}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style href="skills-styles" precedence="components">{`
.skills-section{border-top:1px solid var(--line);overflow:clip}.skills-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:35px}.skills-hint{max-width:190px;line-height:1.8;font-size:9px;text-transform:none;letter-spacing:0;color:#6d6b65}.capability-tabs{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin:42px 0 18px;padding-bottom:2px}.capability-tabs::-webkit-scrollbar{display:none}.capability-tabs button{flex:0 0 auto;display:flex;align-items:center;gap:9px;min-height:40px;padding:9px 14px;border:1px solid var(--line);border-radius:99px;font-size:10px;transition:background .35s var(--ease),color .35s var(--ease),border-color .35s var(--ease)}.capability-tabs button span{font-family:var(--font-mono);font-size:7px;opacity:.65}.capability-tabs button.selected{background:var(--ink);border-color:var(--ink);color:#fff}.capability-deck{position:relative;isolation:isolate;display:grid;grid-template-columns:210px minmax(0,1fr) 270px;gap:24px;min-height:450px;padding:26px;overflow:hidden}.capability-deck:before{content:"";position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,transparent 49.8%,#0d0d0d08 50%,transparent 50.2%);background-size:54px 100%;opacity:.55}.deck-intro{display:flex;flex-direction:column;padding:13px 8px 8px}.deck-intro h3{font-size:clamp(27px,3vw,42px);line-height:1;letter-spacing:-.045em;font-weight:550;margin-top:22px}.deck-intro p{margin-top:12px;color:var(--mute);font-size:11px}.deck-line{height:1px;background:var(--line);margin-top:auto;overflow:hidden}.deck-line i{display:block;width:38%;height:100%;background:var(--ink);animation:deck-scan 3.2s ease-in-out infinite}.skill-cloud{align-content:center;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;padding:12px 0}.skill-chip{min-width:0;min-height:88px;display:flex;align-items:center;gap:12px;text-align:left;padding:13px;border:1px solid #dedbd5;border-radius:17px;background:#f7f5f1;opacity:0;animation:chip-enter .6s var(--ease) forwards;animation-delay:var(--delay);transition:background .32s var(--ease),color .32s var(--ease),border-color .32s var(--ease),box-shadow .32s var(--ease)}.skill-chip:hover,.skill-chip:focus-visible,.skill-chip.active{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:0 12px 24px #0002}.chip-logo{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:13px;background:#fff;box-shadow:inset 0 0 0 1px #0000000b}.skill-chip>span:last-child{min-width:0;display:flex;flex-direction:column;gap:6px}.skill-chip strong{font-size:11px;line-height:1.25;font-weight:500;overflow-wrap:anywhere}.skill-chip small{font-family:var(--font-mono);font-size:7px;opacity:.6}.skill-inspector{align-self:stretch;display:flex;flex-direction:column;padding:21px;border-radius:20px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 14px 36px #00000008}.skill-inspector>.eyebrow{font-size:7px}.inspector-main{padding:24px 0 18px;animation:inspector-enter .5s var(--ease)}.inspector-logo{height:132px;display:grid;place-items:center}.inspector-family{display:block;margin-top:12px;color:var(--mute);font-size:7px}.skill-inspector h4{font-size:25px;line-height:1.05;letter-spacing:-.04em;font-weight:520;margin-top:7px}.inspector-projects{margin-top:auto;border-top:1px solid var(--line);padding-top:16px}.inspector-projects>.eyebrow{font-size:7px;color:var(--mute)}.inspector-projects a{display:flex;justify-content:space-between;gap:8px;padding-top:12px;font-size:10px;line-height:1.35}.inspector-projects a:hover{text-decoration:underline}@keyframes chip-enter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes inspector-enter{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}@keyframes deck-scan{0%,100%{transform:translateX(-105%)}50%{transform:translateX(270%)}}
@media(max-width:1100px){.capability-deck{grid-template-columns:170px minmax(0,1fr) 235px;gap:16px}.skill-cloud{grid-template-columns:repeat(2,minmax(0,1fr))}.skill-chip{min-height:76px}.inspector-logo{height:110px}.inspector-logo img,.inspector-logo svg{max-width:92px;max-height:92px}}
@media(max-width:760px){.skills-hint{display:none}.capability-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));overflow:visible;margin-top:28px;gap:7px}.capability-tabs button{width:100%;justify-content:flex-start;white-space:normal;text-align:left;border-radius:16px}.capability-deck{grid-template-columns:minmax(0,1fr);gap:20px;padding:18px;min-height:0}.capability-deck:before{background-size:42px 100%}.deck-intro{min-height:120px;padding:8px 4px}.deck-intro h3{font-size:30px;margin-top:14px;max-width:280px}.deck-line{margin-top:22px}.skill-cloud{grid-template-columns:repeat(2,minmax(0,1fr));padding:0}.skill-chip{min-height:74px;padding:10px;gap:9px;border-radius:15px}.chip-logo{width:38px;height:38px;flex-basis:38px}.chip-logo img,.chip-logo svg{max-width:28px;max-height:28px}.skill-chip strong{font-size:10px}.skill-inspector{display:grid;grid-template-columns:92px minmax(0,1fr);column-gap:16px;padding:18px}.skill-inspector>.eyebrow{grid-column:1/-1}.inspector-main{display:contents}.inspector-logo{grid-row:2/5;height:104px}.inspector-logo img,.inspector-logo svg{max-width:78px;max-height:78px}.inspector-family{align-self:end;margin-top:22px}.skill-inspector h4{font-size:22px}.inspector-projects{grid-column:1/-1;margin-top:17px}}
@media(max-width:390px){.capability-deck{padding:14px}.skill-cloud{gap:7px}.skill-chip{padding:9px}.chip-logo{width:34px;height:34px;flex-basis:34px}.skill-chip strong{font-size:9px}}
@media(prefers-reduced-motion:reduce){.skill-chip,.inspector-main,.deck-line i{animation:none;opacity:1}}
      `}</style>
    </section>
  );
}
