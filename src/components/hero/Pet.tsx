"use client";
import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/data";
export default function Pet() {
  const root = useRef<HTMLDivElement>(null);
  const [happy, setHappy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!happy) return;
    const timer = setTimeout(() => setHappy(false), 1800);
    return () => clearTimeout(timer);
  }, [happy]);
  return <div ref={root} className={`pet-stage ${happy ? "pet-happy" : ""} ${paused || !visible ? "pet-paused" : ""}`}>
    <div className="pet-orbit" aria-hidden="true" />
    <button className="pet-touch" aria-label={COPY.hero.petLabel} onClick={() => setHappy(true)}>
      <span className="pet-model" aria-hidden="true">
        <span className="pet-tail" />
        <span className="pet-body"><span className="pet-chest" /></span>
        <span className="pet-foot pet-foot-left" /><span className="pet-foot pet-foot-right" />
        <span className="pet-head">
          <span className="pet-ear pet-ear-left" /><span className="pet-ear pet-ear-right" />
          <span className="pet-face"><span className="pet-eye" /><span className="pet-eye" /><span className="pet-mouth" /></span>
          <span className="pet-cheek pet-cheek-left" /><span className="pet-cheek pet-cheek-right" />
        </span>
      </span>
      <span className="pet-shadow" aria-hidden="true" />
    </button>
    <div className="pet-caption"><span role="status">{happy ? COPY.hero.petHappy : COPY.hero.petHint}</span><button onClick={() => setPaused(!paused)} aria-label={paused ? COPY.hero.petPlay : COPY.hero.petPause} aria-pressed={paused}>{paused ? "▷" : "Ⅱ"}</button></div>
    <style href="pet-styles" precedence="components">{`
.pet-stage{position:absolute;width:500px;height:530px;left:56%;top:50%;transform:translate(-35%,-42%);perspective:900px;z-index:1}.pet-orbit{position:absolute;inset:30px 0 0;border:1px solid var(--line);border-radius:50%;transform:rotateX(65deg);pointer-events:none}.pet-touch{position:absolute;inset:0;width:100%;border-radius:50%;touch-action:manipulation}.pet-model{position:absolute;width:300px;height:330px;left:50%;top:50%;transform:translate(-50%,-50%) rotateY(-12deg) rotateX(5deg);transform-style:preserve-3d;animation:pet-float 5s ease-in-out infinite}.pet-body{position:absolute;width:170px;height:168px;background:#d4d4d4;border-radius:48% 48% 42% 42%;left:65px;top:150px;box-shadow:inset -22px -15px 25px #999,inset 16px 8px 20px #fff,4px 12px 15px #0002}.pet-chest{position:absolute;inset:32px 38px 28px;border:1px solid #bbb;border-radius:45%;background:#e9e9e9;box-shadow:inset 0 3px 8px #aaa}.pet-head{position:absolute;width:252px;height:188px;left:24px;top:30px;background:#eaeaea;border-radius:43% 43% 44% 44%;box-shadow:inset -18px -18px 25px #aaa,inset 10px 9px 15px #fff,0 16px 20px #0002;transform:translateZ(25px) rotate(-5deg);transition:transform .6s var(--ease)}.pet-ear{position:absolute;top:-38px;width:79px;height:98px;background:#d6d6d6;border-radius:15px 75% 10px 15px;box-shadow:inset -9px -7px 14px #999,inset 5px 5px 8px #fff;z-index:-1}.pet-ear:after{content:"";position:absolute;inset:15px 17px;background:#777;border-radius:9px 70% 8px 9px;box-shadow:inset 4px 5px 9px #444}.pet-ear-left{left:7px;transform:rotate(-12deg)}.pet-ear-right{right:7px;transform:scaleX(-1) rotate(-12deg)}.pet-face{position:absolute;inset:42px 27px 32px;background:#222;border-radius:42%;box-shadow:inset 5px 6px 10px #000,0 2px 1px #fff;display:flex;align-items:center;justify-content:center;gap:45px}.pet-eye{width:15px;height:29px;border-radius:12px;background:#f2f2f2;box-shadow:0 0 9px #fff3;animation:pet-blink 6s infinite}.pet-mouth{position:absolute;width:20px;height:10px;border-bottom:2px solid #bbb;border-radius:50%;bottom:23px}.pet-cheek{position:absolute;width:14px;height:4px;background:#aaa;border-radius:3px;bottom:40px}.pet-cheek-left{left:15px}.pet-cheek-right{right:15px}.pet-foot{position:absolute;top:293px;width:83px;height:45px;border-radius:50% 50% 35% 35%;background:#d9d9d9;box-shadow:inset -10px -8px 12px #999,inset 5px 5px 9px #fff;transform:translateZ(20px)}.pet-foot-left{left:57px}.pet-foot-right{right:57px}.pet-tail{position:absolute;right:8px;top:197px;width:90px;height:100px;border:23px solid #b8b8b8;border-left-color:transparent;border-top-color:transparent;border-radius:50%;transform:rotate(-25deg);box-shadow:9px 6px 10px #0001}.pet-shadow{position:absolute;width:205px;height:22px;left:50%;bottom:53px;transform:translateX(-50%);background:#0002;border-radius:50%;filter:blur(11px)}.pet-caption{position:absolute;bottom:0;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:18px;font-family:var(--font-mono);font-size:10px;color:var(--ink-2)}.pet-caption button{width:44px;height:44px;border:1px solid var(--line);border-radius:50%;font-size:17px}.pet-happy .pet-head{transform:translateZ(25px) rotate(9deg) translateY(-12px)}.pet-happy .pet-eye{height:9px;border-radius:12px 12px 2px 2px;animation:none}.pet-happy .pet-tail{transform:rotate(-60deg)}.pet-tail{transition:transform .5s var(--ease)}.pet-paused *{animation-play-state:paused!important}@keyframes pet-float{0%,100%{transform:translate(-50%,-50%) rotateY(-12deg) rotateX(5deg)}50%{transform:translate(-50%,-54%) rotateY(10deg) rotateX(1deg)}}@keyframes pet-blink{0%,42%,46%,100%{transform:scaleY(1)}44%{transform:scaleY(.1)}}@media(max-width:1100px){.pet-stage{left:62%;width:400px}.hero-note{display:none}}@media(max-width:700px){.pet-stage{top:auto;bottom:100px;left:50%;transform:translateX(-50%);width:min(100%,420px);height:430px}.pet-model{scale:.9}.pet-shadow{bottom:26px}.pet-caption{bottom:-18px}}@media(prefers-reduced-motion:reduce){.pet-stage *{animation:none!important;transition:none!important}}
`}</style>
  </div>;
}
