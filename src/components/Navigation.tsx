"use client";
import { useEffect, useRef, useState } from "react";
import { COPY, NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
export default function Navigation() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(scrollY > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const node = document.getElementById(n.id);
      if (node) io.observe(node);
    });
    const hero = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive("");
      },
      { threshold: 0.4 },
    );
    const top = document.getElementById("top");
    if (top) hero.observe(top);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      io.disconnect();
      hero.disconnect();
    };
  }, []);
  useEffect(() => {
    const update = () => {
      const link = pill.current?.querySelector<HTMLElement>(
        `[data-id="${active}"]`,
      );
      if (!indicator.current) return;
      indicator.current.style.opacity = link ? "1" : "0";
      if (link) {
        indicator.current.style.width = `${link.offsetWidth}px`;
        indicator.current.style.transform = `translateX(${link.offsetLeft}px)`;
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (pill.current) ro.observe(pill.current);
    return () => ro.disconnect();
  }, [active]);
  useEffect(() => {
    if (!open) return;
    const menuButton = menu.current;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("mobile-menu-open");
    lockScroll(true);
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    const focusFrame = requestAnimationFrame(() =>
      overlay.current?.querySelector<HTMLElement>("button")?.focus(),
    );
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const items =
          overlay.current?.querySelectorAll<HTMLElement>("a,button");
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (!overlay.current?.contains(document.activeElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const resize = () => {
      if (innerWidth > 800) setOpen(false);
    };
    document.addEventListener("keydown", key);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = old;
      document.body.classList.remove("mobile-menu-open");
      lockScroll(false);
      main?.removeAttribute("inert");
      document.removeEventListener("keydown", key);
      removeEventListener("resize", resize);
      menuButton?.focus();
    };
  }, [open]);
  return (
    <>
      <div ref={progress} className="scroll-line" aria-hidden="true" />
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <a
          href="#top"
          aria-label={`${PROFILE.initials} ${PROFILE.name}, ${COPY.ui.top}`}
          className="identity"
        >
          <span className="monogram">{PROFILE.initials}</span>
          <span className="identity-name">{PROFILE.name}</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          <div ref={pill} className="nav-pill">
            <span ref={indicator} className="active-pill" aria-hidden="true" />
            {NAV.map((n) => (
              <a
                key={n.id}
                data-id={n.id}
                href={`#${n.id}`}
                aria-current={active === n.id ? "location" : undefined}
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>
        <button
          ref={menu}
          className="pill mobile-menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          {COPY.ui.menu}
          <span aria-hidden="true">＋</span>
        </button>
      </header>
      <div
        ref={overlay}
        id="mobile-navigation"
        className={`mobile-overlay ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={!open}
      >
        <button className="pill overlay-close" onClick={() => setOpen(false)}>
          {COPY.ui.close} ×
        </button>
        <nav>
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              style={{ "--i": i } as React.CSSProperties}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setTimeout(() => scrollToTarget(n.id), 30);
              }}
            >
              <span className="eyebrow">0{i + 1}</span>
              {n.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </div>
      <style href="navigation-styles" precedence="components">{`
  .scroll-line{height:2px;position:fixed;inset:0 0 auto;background:var(--ink);z-index:60;transform:scaleX(0);transform-origin:left}
  .site-nav{position:fixed;top:0;left:0;right:0;z-index:40;padding:26px var(--gutter);display:flex;align-items:center;justify-content:space-between;pointer-events:none}.site-nav>*{pointer-events:auto}
  .identity{display:flex;align-items:center;gap:12px}.monogram{display:grid;place-items:center;border:1px solid var(--ink);width:42px;height:42px;border-radius:50%;font-size:13px;font-weight:600;transition:transform .8s var(--ease),background .5s var(--ease),color .5s var(--ease)}.identity:hover .monogram{transform:rotate(360deg)}.identity-name{font-size:13px;font-weight:500;transition:opacity .4s var(--ease)}.scrolled .monogram{background:var(--ink);color:#fff}.scrolled .identity-name{opacity:0}
  .nav-pill{position:relative;display:flex;gap:1px;border:1px solid transparent;border-radius:999px;padding:5px;transition:background .5s var(--ease),border .5s var(--ease)}.scrolled .nav-pill{background:rgba(255,255,255,.78);backdrop-filter:blur(12px);border-color:var(--line);box-shadow:0 5px 22px #00000004}.nav-pill a{position:relative;z-index:1;padding:12px 19px;font-size:12px;transition:color .35s var(--ease);border-radius:99px}.nav-pill a[aria-current]{color:#fff}.active-pill{position:absolute;height:calc(100% - 10px);left:0;top:5px;border-radius:99px;background:var(--ink);opacity:0;transition:transform .5s var(--ease),width .5s var(--ease),opacity .3s var(--ease)}
  .mobile-menu{display:none;background:rgba(244,242,238,.9)}.mobile-overlay{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:inset(0 0 100%);visibility:hidden;transition:clip-path .6s var(--ease),visibility .6s;display:flex;align-items:center;padding:var(--gutter)}.mobile-overlay.open{clip-path:inset(0);visibility:visible}.overlay-close{position:absolute;right:var(--gutter);top:26px}.mobile-overlay nav{width:100%}.mobile-overlay nav a{display:flex;align-items:center;gap:20px;padding:18px 0;border-bottom:1px solid var(--line);font-size:clamp(28px,8vw,48px);transform:translateY(25px);opacity:0;transition:transform .6s var(--ease),opacity .6s var(--ease);transition-delay:calc(var(--i)*55ms)}.mobile-overlay.open nav a{transform:none;opacity:1}.mobile-overlay nav a>span:last-child{margin-left:auto;font-size:24px}
  @media(max-width:800px){.desktop-nav{display:none}.mobile-menu{display:inline-flex}.site-nav{padding-block:20px}.identity-name{font-size:12px}.monogram{width:38px;height:38px}}
  `}</style>
    </>
  );
}
