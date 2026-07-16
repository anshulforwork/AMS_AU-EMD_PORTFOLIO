"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

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
          className="max-w-xl"
        >
          <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.4em] text-gold-soft uppercase">
            Moments
          </p>
          <h2 className="display text-4xl text-cream md:text-[3.1rem]">Gallery</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/50">
            A living strip of labs, campuses, and work — hover to pause.
          </p>
        </motion.div>
      </div>

      <div className="relative space-y-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#141618] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#141618] to-transparent md:w-28" />

        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <GalleryTile key={`a-${item.id}-${i}`} item={item} tall={i % 3 === 0} />
          ))}
        </div>

        <div
          className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]"
          style={{ animationDirection: "reverse", animationDuration: "48s" }}
        >
          {loop2.map((item, i) => (
            <GalleryTile key={`b-${item.id}-${i}`} item={item} tall={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTile({
  item,
  tall,
}: {
  item: PortfolioData["gallery"][number];
  tall?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`media-frame media-frame--dark glass-dark relative shrink-0 overflow-hidden rounded-xl ${
        tall ? "h-52 w-80 md:h-60 md:w-[24rem]" : "h-44 w-72 md:h-52 md:w-[22rem]"
      }`}
    >
      <SmartImage
        src={item.src}
        alt={item.alt}
        fit="auto"
        frameRatio={tall ? 80 / 52 : 72 / 44}
        sizes="400px"
        className="opacity-90 transition hover:opacity-100"
      />
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10 text-[0.7rem] tracking-wide text-cream/90">
          {item.caption}
        </div>
      )}
    </motion.div>
  );
}
