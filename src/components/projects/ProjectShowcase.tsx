"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";

export function ProjectShowcase({
  project,
  index,
  reverse = false,
  featured = false,
}: {
  project: Project;
  index: number;
  reverse?: boolean;
  featured?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const frameRatio = featured ? 21 / 9 : 16 / 11;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={featured ? "mb-14 md:mb-20" : "mb-12 md:mb-16"}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={`group grid items-center gap-8 md:gap-12 ${
          featured
            ? "md:grid-cols-1"
            : reverse
              ? "md:grid-cols-[1.05fr_0.95fr]"
              : "md:grid-cols-[0.95fr_1.05fr]"
        }`}
      >
        <div
          className={`media-frame relative overflow-hidden rounded-xl ring-1 ring-stone/50 ${
            featured ? "aspect-[21/10] md:aspect-[21/9]" : "aspect-[16/11] order-1"
          } ${!featured && reverse ? "md:order-2" : ""}`}
        >
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            fit="auto"
            frameRatio={frameRatio}
            sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 55vw"}
            priority={index === 0}
            className="transition duration-[1.1s] ease-out group-hover:scale-[1.03]"
          />
          <div className="project-shine pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-3 md:left-7 md:top-7">
            <span className="display text-3xl text-cream/90 md:text-4xl">{num}</span>
            {project.company && (
              <span className="rounded-full border border-cream/25 bg-ink/35 px-3 py-1 text-[0.58rem] tracking-[0.18em] text-cream/90 uppercase backdrop-blur-sm">
                {project.company}
              </span>
            )}
          </div>
        </div>

        <div
          className={`${featured ? "max-w-3xl md:mx-auto md:pt-2 md:text-center" : "order-2"} ${
            !featured && reverse ? "md:order-1 md:text-right" : ""
          }`}
        >
          <p className="section-label mb-3">{project.shortTitle}</p>
          <h3
            className={`display text-ink transition group-hover:text-bronze ${
              featured ? "text-4xl md:text-5xl lg:text-[3.25rem]" : "text-3xl md:text-4xl"
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`mt-4 leading-relaxed text-ink-soft ${
              featured ? "mx-auto max-w-2xl text-base md:text-lg" : "max-w-md text-sm md:text-base"
            } ${!featured && reverse ? "md:ml-auto" : ""}`}
          >
            {project.tagline}
          </p>
          <div
            className={`mt-5 flex flex-wrap gap-2 ${
              featured ? "justify-center" : reverse ? "md:justify-end" : ""
            }`}
          >
            {project.technologies.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-full border border-stone bg-[#faf9f7] px-3 py-1 text-[0.68rem] tracking-wide text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
          <div
            className={`mt-7 inline-flex items-center gap-3 text-sm tracking-wide text-gold ${
              featured ? "" : reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <span className="border-b border-gold/50 pb-0.5 transition group-hover:border-gold">
              View case study
            </span>
            <span className="transition duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
