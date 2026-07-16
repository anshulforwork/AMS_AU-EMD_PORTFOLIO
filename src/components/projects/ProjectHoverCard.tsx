"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";

export function ProjectHoverCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-stone bg-champagne shadow-[0_8px_30px_rgba(12,13,16,0.04)] transition duration-500 hover:-translate-y-1 hover:border-gold-soft hover:shadow-[0_24px_50px_rgba(184,151,90,0.16)]"
      >
        <div className="media-frame relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            fit="auto"
            frameRatio={4 / 3}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-[55%] bg-gradient-to-t from-ink via-ink/90 to-ink/40 p-5 transition duration-500 ease-out group-hover:translate-y-0 md:p-6">
            <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
              {project.shortTitle}
            </p>
            <h3 className="display mt-1 text-2xl text-white md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
              {project.tagline}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white">
              View project
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
