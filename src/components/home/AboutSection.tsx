"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";

const DOMAIN_STYLES = [
  "border-gold/40 text-gold bg-gold/[0.06]",
  "border-platinum/40 text-platinum bg-platinum/[0.06]",
  "border-bronze/40 text-bronze bg-bronze/[0.06]",
] as const;

export function AboutSection({ site }: { site: PortfolioData["site"] }) {
  return (
    <section id="about" className="theme-about section-frame scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.35fr] md:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:sticky md:top-28 md:self-start"
          >
            <p className="section-label mb-4">About</p>
            <h2 className="display text-4xl leading-[1.05] text-ink md:text-[3.1rem]">
              A bit about me
            </h2>
            <div className="mt-8 h-px w-14 bg-gold" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="whitespace-pre-line text-[1.05rem] leading-[1.85] text-ink-soft md:text-lg">
              {site.bio}
            </p>

            <dl className="glass-light mt-10 grid gap-6 rounded-xl p-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] tracking-[0.28em] text-platinum uppercase">Email</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.email}`} className="text-sm text-ink transition hover:text-gold">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] tracking-[0.28em] text-platinum uppercase">Based in</dt>
                <dd className="mt-2 text-sm text-ink">{site.location}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {site.domains.map((d, i) => (
                <motion.span
                  key={d}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className={`rounded-full border px-4 py-2 text-xs tracking-wide ${DOMAIN_STYLES[i % DOMAIN_STYLES.length]}`}
                >
                  {d}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
