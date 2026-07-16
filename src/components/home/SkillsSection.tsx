"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";

/** Premium soft tag colors per category */
const CAT: Record<
  string,
  { label: string; tag: string; num: string }
> = {
  Automation: {
    label: "text-[#3a7a5c]",
    tag: "border-[#4f9a78]/35 bg-[#e8f5ee] text-[#2f6b4e]",
    num: "text-[#4f9a78]/45",
  },
  Embedded: {
    label: "text-[#3f63a3]",
    tag: "border-[#5b7fbf]/35 bg-[#e8eef8] text-[#35548f]",
    num: "text-[#5b7fbf]/45",
  },
  Communication: {
    label: "text-[#9a7b56]",
    tag: "border-[#b8975a]/40 bg-[#f7f0e2] text-[#8a6b3e]",
    num: "text-[#b8975a]/50",
  },
  Domain: {
    label: "text-[#9a7b56]",
    tag: "border-[#c4a35a]/40 bg-[#faf4e6] text-[#8a7330]",
    num: "text-[#c4a35a]/50",
  },
  Software: {
    label: "text-[#6e5294]",
    tag: "border-[#8a6bb5]/35 bg-[#f0ebf7] text-[#5c4480]",
    num: "text-[#8a6bb5]/45",
  },
  Hardware: {
    label: "text-[#8a6548]",
    tag: "border-[#a67c52]/35 bg-[#f5ebe3] text-[#6e4f38]",
    num: "text-[#a67c52]/45",
  },
  Tools: {
    label: "text-[#6a6f78]",
    tag: "border-[#8e8a84]/35 bg-[#f0efed] text-[#5c616a]",
    num: "text-[#8e8a84]/45",
  },
};

const FALLBACK = [
  CAT.Automation,
  CAT.Embedded,
  CAT.Communication,
  CAT.Domain,
  CAT.Software,
];

function styleFor(cat: string, index: number) {
  return CAT[cat] ?? FALLBACK[index % FALLBACK.length];
}

export function SkillsSection({ skills }: { skills: PortfolioData["skills"] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="scroll-mt-24 border-y border-stone bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-lg"
        >
          <p className="section-label mb-3">Toolkit</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Skills & abilities</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Soft premium colors by discipline — clean and easy to scan.
          </p>
        </motion.div>

        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
          {categories.map((cat, i) => {
            const st = styleFor(cat, i);
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="mb-4 flex items-baseline gap-3 border-b border-stone pb-3">
                  <span className={`display text-2xl ${st.num}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`text-[0.7rem] font-semibold tracking-[0.28em] uppercase ${st.label}`}>
                    {cat}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <motion.li
                        key={s.name}
                        whileHover={{ y: -2 }}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ${st.tag}`}
                      >
                        {s.image && (
                          <span className="relative h-4 w-4 overflow-hidden rounded-full">
                            <Image src={s.image} alt="" fill className="object-cover" sizes="16px" />
                          </span>
                        )}
                        {s.name}
                      </motion.li>
                    ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
