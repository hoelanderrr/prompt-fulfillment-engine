import { useEffect, useRef } from "react";

/**
 * Adds an IntersectionObserver-driven `is-visible` class to any element
 * with `.reveal`. Triggers smooth, scroll-based fade-up reveals.
 */
export const useReveal = (selector = ".reveal") => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current ?? document;
    const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);

  return rootRef;
};
