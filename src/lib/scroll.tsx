"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";
let engine: Lenis | null = null;
export function scrollToTarget(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (engine && !prefersReducedMotion())
    engine.scrollTo(target, { offset: id === "top" ? 0 : -95, duration: 1.05 });
  else
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "instant" : "smooth",
      block: "start",
    });
  history.replaceState(null, "", `#${id}`);
}
export function lockScroll(lock: boolean) {
  if (lock) engine?.stop();
  else engine?.start();
}
export function SmoothScroll() {
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const configure = async () => {
      engine?.destroy();
      engine = null;
      cancelAnimationFrame(frame);
      if (media.matches) return;
      const { default: Lenis } = await import("lenis");
      if (disposed || media.matches) return;
      engine = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      });
      const loop = (time: number) => {
        engine?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };
    void configure();
    media.addEventListener("change", configure);
    const handle = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;
      const id = link.hash.slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToTarget(id);
    };
    document.addEventListener("click", handle);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      engine?.destroy();
      engine = null;
      media.removeEventListener("change", configure);
      document.removeEventListener("click", handle);
    };
  }, []);
  return null;
}
