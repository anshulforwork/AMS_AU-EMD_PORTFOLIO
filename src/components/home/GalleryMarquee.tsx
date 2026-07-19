"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { GalleryMediaTile } from "@/components/ui/GalleryMediaTile";

export function GalleryMarquee({
  gallery,
}: {
  gallery: PortfolioData["gallery"];
}) {
  const loop = [...gallery, ...gallery];
  const reverse = [...gallery].reverse();
  const loop2 = [...reverse, ...reverse];

  return (
    <section id="gallery" className="theme-gallery section-frame scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex max-w-3xl flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.4em] text-gold-soft uppercase">
              Moments
            </p>
            <h2 className="display text-4xl text-cream md:text-[3.1rem]">Gallery</h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/50">
              A living strip of labs, campuses, and work — click any photo to open the
              full gallery with stories.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 text-sm text-cream/90 transition hover:border-gold hover:text-gold"
          >
            Open gallery view →
          </Link>
        </motion.div>
      </div>

      <div className="relative space-y-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#141618] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#141618] to-transparent md:w-28" />

        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <motion.div key={`a-${item.id}-${i}`} whileHover={{ y: -5 }}>
              <Link href={`/gallery?photo=${item.id}`} aria-label={`Open ${item.alt} in gallery`}>
                <GalleryMediaTile item={item} tall={i % 3 === 0} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div
          className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]"
          style={{ animationDirection: "reverse", animationDuration: "48s" }}
        >
          {loop2.map((item, i) => (
            <motion.div key={`b-${item.id}-${i}`} whileHover={{ y: -5 }}>
              <Link href={`/gallery?photo=${item.id}`} aria-label={`Open ${item.alt} in gallery`}>
                <GalleryMediaTile item={item} tall={i % 2 === 0} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
