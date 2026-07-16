"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

export function ExperienceSection({
  experience,
  achievements = [],
}: {
  experience: PortfolioData["experience"];
  achievements?: PortfolioData["achievements"];
}) {
  return (
    <section id="experience" className="scroll-mt-24 border-y border-stone bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="mb-14">
          <p className="section-label mb-3">Career</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Experience</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            Path at Aartech — R&amp;D into design &amp; development, then Jr. R&amp;D.
          </p>
        </div>

        <ol className="relative space-y-0 border-l border-gold/40 pl-8 md:pl-10">
          {experience.map((job, i) => (
            <motion.li
              key={job.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute top-1.5 -left-[2.15rem] h-2.5 w-2.5 rounded-full border-2 border-gold bg-white md:-left-[2.65rem]" />

              <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
                {job.period}
              </p>
              <h3 className="display mt-2 text-2xl text-ink md:text-[1.85rem]">{job.role}</h3>
              <p className="mt-1 text-sm text-bronze">{job.company}</p>

              {job.image && (
                <div className="media-frame relative mt-5 aspect-[16/9] max-w-md overflow-hidden rounded-lg">
                  <SmartImage
                    src={job.image}
                    alt={job.role}
                    fit="auto"
                    frameRatio={16 / 9}
                    sizes="420px"
                  />
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{job.summary}</p>

              <ul className="mt-4 space-y-1.5">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm text-ink-soft">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>

        {achievements.length > 0 && (
          <div className="mt-20 border-t border-stone pt-12">
            <p className="section-label mb-8">Achievements</p>
            <ul className="grid gap-8 sm:grid-cols-3">
              {achievements.map((a) => (
                <li key={a.title}>
                  {a.image && (
                    <div className="media-frame relative mb-4 aspect-[16/10] overflow-hidden rounded-lg">
                      <SmartImage
                        src={a.image}
                        alt={a.title}
                        fit="auto"
                        frameRatio={16 / 10}
                        sizes="220px"
                      />
                    </div>
                  )}
                  <p className="display text-xl text-ink">{a.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{a.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
