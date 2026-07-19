"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Little animated robot guide — floats just above the "Message me" button and
 * gives a one-line tour note about the section currently on screen.
 */

const SECTION_MESSAGES: { id: string; message: string }[] = [
  { id: "profile", message: "Hi! I'm the AMS guide. Scroll down — I'll walk you through." },
  { id: "about", message: "A quick intro — who Anshul is and how he works." },
  { id: "experience", message: "Three role steps at Aartech — R&D to Jr. R&D." },
  { id: "trajectory", message: "Capability and value growing together, year on year." },
  { id: "skills", message: "The toolkit — automation and embedded as one craft." },
  { id: "education", message: "Where the foundations were built." },
  { id: "work", message: "Click any project to open its full case study." },
  { id: "gallery", message: "Click a photo to open the full gallery with stories." },
  { id: "certifications", message: "Verified credentials — click any to enlarge." },
  { id: "contact", message: "Like what you see? The Message me button is right below." },
];

function routeMessage(pathname: string): string | null {
  if (pathname.startsWith("/gallery"))
    return "Tap any photo to see it large, with the story behind it.";
  if (pathname.startsWith("/projects"))
    return "You're inside a case study — back links are at the top and bottom.";
  return null;
}

export function SectionGuide() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState(SECTION_MESSAGES[0].message);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("ams-guide-dismissed") === "1");
  }, []);

  // Track which home section is on screen
  useEffect(() => {
    const fixed = routeMessage(pathname);
    if (fixed) {
      setMessage(fixed);
      return;
    }
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const found = SECTION_MESSAGES.find((s) => s.id === entry.target.id);
          if (found) setMessage(found.message);
        }
      },
      // A band around the middle of the viewport decides the "current" section
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );

    for (const s of SECTION_MESSAGES) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname.startsWith("/admin") || dismissed) return null;

  return (
    <motion.div
      className="fixed bottom-[4.7rem] right-5 z-50 flex items-end gap-2 md:bottom-20 md:right-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
    >
      {/* Speech bubble */}
      <div className="relative mb-8 max-w-[13rem] md:max-w-[15rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl rounded-br-sm border border-stone bg-paper/95 px-3.5 py-2.5 text-[0.72rem] leading-snug text-ink shadow-[0_10px_28px_rgba(12,13,16,0.14)] backdrop-blur-sm"
          >
            {message}
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          aria-label="Hide guide"
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("ams-guide-dismissed", "1");
          }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-stone bg-cream text-[0.6rem] text-ink-soft transition hover:text-ink"
        >
          ✕
        </button>
      </div>

      {/* Robot */}
      <motion.svg
        width="58"
        height="66"
        viewBox="0 0 58 66"
        aria-hidden
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="drop-shadow-[0_10px_20px_rgba(184,151,90,0.35)]"
      >
        {/* antenna */}
        <line x1="29" y1="10" x2="29" y2="17" stroke="var(--bronze)" strokeWidth="2" />
        <motion.circle
          cx="29"
          cy="7"
          r="3.4"
          fill="var(--gold)"
          animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {/* head */}
        <rect x="9" y="16" width="40" height="30" rx="10" fill="var(--ink)" />
        <rect x="12.5" y="19.5" width="33" height="23" rx="7" fill="#1d2026" />
        {/* eyes (blinking) */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1] }}
          style={{ transformOrigin: "29px 30px" }}
        >
          <circle cx="21.5" cy="30" r="4" fill="var(--gold)" />
          <circle cx="36.5" cy="30" r="4" fill="var(--gold)" />
          <circle cx="22.8" cy="28.8" r="1.3" fill="#fff8ea" />
          <circle cx="37.8" cy="28.8" r="1.3" fill="#fff8ea" />
        </motion.g>
        {/* smile */}
        <path
          d="M23 37.5 Q29 41.5 35 37.5"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* body */}
        <rect x="16" y="48" width="26" height="13" rx="6" fill="var(--ink)" />
        <circle cx="29" cy="54.5" r="3" fill="var(--bronze)" />
        {/* waving arm */}
        <motion.line
          x1="45"
          y1="52"
          x2="52"
          y2="46"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ rotate: [0, 18, 0, 18, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "45px 52px" }}
        />
        <line
          x1="13"
          y1="52"
          x2="6"
          y2="56"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}
