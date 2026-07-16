"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

export function EducationSection({
  education,
}: {
  education: PortfolioData["education"];
}) {
  return (
    <section id="education" className="theme-education section-frame scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-xl"
        >
          <p className="section-label mb-3">Learning</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Education</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Where the foundation was built — SATI Vidisha and earlier years.
          </p>
        </motion.div>

        <div className="grid gap-7 md:grid-cols-3">
          {education.map((ed, i) => (
            <motion.article
              key={ed.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="glass-champagne group overflow-hidden rounded-xl transition hover:border-gold/45"
            >
              {ed.image && (
                <div className="media-frame relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={ed.image}
                    alt={ed.school}
                    fit="auto"
                    frameRatio={16 / 10}
                    sizes="300px"
                    className="transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-ink uppercase">
                    {ed.score}
                  </span>
                </div>
              )}
              <div className="border-t border-gold/20 p-6">
                <p
                  className={`text-[0.62rem] tracking-[0.22em] uppercase ${
                    i % 3 === 0 ? "text-gold" : i % 3 === 1 ? "text-platinum" : "text-bronze"
                  }`}
                >
                  {ed.period}
                </p>
                <h3 className="display mt-3 text-xl leading-snug text-ink md:text-2xl">{ed.degree}</h3>
                <p className="mt-2 text-sm text-ink-soft">{ed.school}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
