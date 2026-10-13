"use client";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
export default function RevealObserver() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    document.documentElement.classList.add("motion-ready");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            e.target.setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    document.querySelectorAll(".rv,.rv-mask").forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return null;
}
