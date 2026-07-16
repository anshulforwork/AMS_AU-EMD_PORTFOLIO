"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";

export function WorkSection({ projects }: { projects: PortfolioData["projects"] }) {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="scroll-mt-24 bg-[#f7f5f1] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-b border-stone pb-10 md:mb-20"
        >
          <p className="section-label mb-3">Selected work</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-4xl text-ink md:text-[3.25rem]">Projects</h2>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft md:text-right">
              Defence, energy storage, and industrial systems — open a case study for the full story.
            </p>
          </div>
        </motion.div>

        {featured && <ProjectShowcase project={featured} index={0} featured />}

        <div className="my-14 h-px w-full bg-stone md:my-16" />

        {rest.map((p, i) => (
          <ProjectShowcase
            key={p.slug}
            project={p}
            index={i + 1}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
