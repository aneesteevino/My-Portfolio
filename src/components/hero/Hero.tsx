"use client";
import Pet from "./Pet";
import { PROFILE, COPY } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-heading"
    >
      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>
      <Pet />
      <div className="hero-content container">
        <div className="hero-title">
          <p className="eyebrow hero-kicker">
            <span aria-hidden="true" /> {COPY.hero.eyebrow}
          </p>
          <h1 id="hero-heading">
            {COPY.hero.heading} <em>{COPY.hero.accent}</em>
          </h1>
          <p className="hero-name">{PROFILE.name}</p>
          <div className="hero-actions">
            <a href="#work" className="pill pill-primary">
              {COPY.hero.explore}
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact" className="pill">
              {COPY.hero.talk}
            </a>
          </div>
          <a className="hero-resume" href={PROFILE.resume} download>
            {COPY.hero.resume}
          </a>
        </div>
        <div className="hero-note">
          <span className="eyebrow">{PROFILE.specialisms[1]}</span>
          <p>
            {COPY.hero.note[0]}
            <br />
            {COPY.hero.note[1]}
          </p>
        </div>
        <div className="hero-bottom">
          <a className="eyebrow scroll-prompt" href="#about">
            <span aria-hidden="true">↓</span>
            {COPY.hero.scroll}
          </a>

        </div>
      </div>
      <style href="hero-styles" precedence="components">{`
  .hero{background:var(--paper);height:max(760px,100svh);max-height:1120px;position:relative;isolation:isolate;overflow:clip}.hero-ghost{position:absolute;z-index:-2;left:50%;top:16%;transform:translateX(-50%);font-size:clamp(90px,18.5vw,345px);font-weight:650;letter-spacing:-.055em;line-height:1;color:transparent;-webkit-text-stroke:1px #c9c6c0;white-space:nowrap;user-select:none}.hero-content{pointer-events:none;height:100%;position:relative;display:flex;align-items:center}.hero-title{pointer-events:auto;width:46%;padding-top:100px}.hero-kicker{display:flex;gap:10px;align-items:center;font-size:9px}.hero-kicker>span{width:5px;height:5px;border-radius:50%;background:var(--ink)}.hero h1{font-size:clamp(65px,7.4vw,112px);font-weight:550;line-height:.92;letter-spacing:-.065em;margin-top:28px}.hero h1 em{display:block;color:var(--ink);font-size:1.06em}.hero-name{font-size:16px;color:var(--ink-2);margin:24px 0 30px}.hero-actions{display:flex;gap:9px;flex-wrap:wrap}.hero-resume{display:inline-block;border-bottom:1px solid var(--line);font-size:12px;margin-top:22px;padding-bottom:6px}.hero-note{position:absolute;right:var(--gutter);top:55%;max-width:180px}.hero-note p{font-size:15px;color:var(--ink-2);line-height:1.6;margin-top:15px}.hero-bottom{position:absolute;bottom:30px;left:var(--gutter);right:var(--gutter);display:flex;align-items:center;justify-content:space-between}.scroll-prompt{pointer-events:auto;display:flex;align-items:center;gap:15px;font-size:9px}.scroll-prompt>span{font-size:20px}
  
  @media(max-width:1000px) and (min-width:701px){.hero-note{display:none}.hero-title{width:50%}}
  @media(max-width:700px){.hero{background:var(--paper);height:1000px;min-height:100svh;max-height:none}.hero-content{align-items:flex-start}.hero-title{width:100%;padding-top:130px;position:relative;z-index:2}.hero h1{font-size:68px;margin-top:19px}.hero h1 em{display:inline}.hero-name{margin:14px 0 21px;font-size:14px}.hero-kicker{font-size:8px}.hero-actions .pill{min-height:42px;padding:10px 18px;font-size:12px}.hero-resume{margin-top:15px}.hero-ghost{top:49%;font-size:25vw}.hero-note{display:none}.hero-bottom{bottom:23px}.scroll-prompt{font-size:8px}}
  @media(max-width:380px){.hero h1{font-size:61px}}
  `}</style>
    </section>
  );
}
