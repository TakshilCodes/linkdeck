"use client";

import { useEffect } from "react";

const PENDING_SCROLL_KEY = "linkdeck:pending-scroll-target";

function getPendingTarget() {
  try {
    return (
      window.sessionStorage.getItem(PENDING_SCROLL_KEY) ||
      window.location.hash.replace("#", "")
    );
  } catch {
    return window.location.hash.replace("#", "");
  }
}

function clearPendingTarget() {
  try {
    window.sessionStorage.removeItem(PENDING_SCROLL_KEY);
  } catch {
    // Ignore storage access failures.
  }
}

function scrollToTarget(targetId: string) {
  const target = document.getElementById(targetId);
  if (!target) return false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  return true;
}

export default function SmoothLandingScroll() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const targetId = getPendingTarget();
        if (!targetId) return;

        if (scrollToTarget(targetId)) {
          clearPendingTarget();

          if (window.location.hash !== `#${targetId}`) {
            window.history.replaceState(null, "", `#${targetId}`);
          }
        }
      }, 80);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
