"use client";

import { motion } from "framer-motion";

/** Elegant gold rule between portfolio sections */
export function SectionDivider({
  label,
  tone = "light",
}: {
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`relative z-10 px-5 py-6 md:px-8 md:py-8 ${
        tone === "dark" ? "bg-[#0c0d10]" : "bg-paper"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scaleX: 0.7 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-6xl items-center gap-4 md:gap-6"
      >
        <div className="gold-rule flex-1" />
        <span className={tone === "dark" ? "divider-pill divider-pill-dark" : "divider-pill"}>
          <span className="h-2 w-2 rotate-45 bg-gold" />
          {label ? <span className="divider-label">{label}</span> : null}
          <span className="h-2 w-2 rotate-45 bg-gold" />
        </span>
        <div className="gold-rule flex-1" />
      </motion.div>
    </div>
  );
}
