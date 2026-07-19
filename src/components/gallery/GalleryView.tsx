"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";
import { DriveVideoEmbed } from "@/components/ui/DriveVideoEmbed";
import { isDriveVideoUrl } from "@/lib/drive-video";

type Item = PortfolioData["gallery"][number];

function isVideo(item: Item) {
  return item.kind === "video" || Boolean(item.driveVideoUrl && isDriveVideoUrl(item.driveVideoUrl));
}

/** Full gallery view — grid of photos; click opens a lightbox with the story. */
export function GalleryView({
  gallery,
  initialId,
}: {
  gallery: PortfolioData["gallery"];
  initialId?: string;
}) {
  const [active, setActive] = useState<number | null>(() => {
    if (!initialId) return null;
    const idx = gallery.findIndex((g) => g.id === initialId);
    return idx >= 0 ? idx : null;
  });
  const open = active !== null ? gallery[active] : null;

  // Arrow keys + escape inside the lightbox
  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a === null ? a : (a + 1) % gallery.length));
      if (e.key === "ArrowLeft")
        setActive((a) => (a === null ? a : (a - 1 + gallery.length) % gallery.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, gallery.length]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <Link
        href="/#gallery"
        className="mb-8 inline-block text-sm text-ink-soft transition hover:text-gold"
      >
        ← Back to main page
      </Link>

      <p className="section-label mb-3">Moments</p>
      <h1 className="display mb-4 text-4xl text-ink md:text-5xl">Gallery</h1>
      <p className="mb-12 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
        Labs, campuses, panels, and prototypes — click any photo to see it large with
        its story.
      </p>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {gallery.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05 }}
            whileHover={{ y: -4 }}
            className="group block w-full break-inside-avoid text-left"
          >
            <div
              className={`media-frame relative w-full overflow-hidden rounded-xl ring-1 ring-stone/60 ${
                i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square"
              }`}
            >
              {isVideo(item) && item.driveVideoUrl ? (
                <>
                  <DriveVideoEmbed url={item.driveVideoUrl} title={item.alt} />
                  <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-cream/20 bg-ink/50 px-2 py-0.5 text-[0.6rem] tracking-widest text-gold-soft uppercase backdrop-blur-sm">
                    Video
                  </div>
                </>
              ) : (
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  fit="cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="transition duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-4 pt-12 opacity-0 transition group-hover:opacity-100">
                <p className="text-xs tracking-wide text-cream">View photo →</p>
              </div>
            </div>
            {item.caption && (
              <p className="mt-2.5 text-sm text-ink-soft transition group-hover:text-ink">
                {item.caption}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              key={open.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl bg-cream"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="media-frame relative aspect-[16/10] bg-cream-deep">
                {isVideo(open) && open.driveVideoUrl ? (
                  <DriveVideoEmbed url={open.driveVideoUrl} title={open.alt} />
                ) : (
                  <SmartImage
                    src={open.src}
                    alt={open.alt}
                    fit="contain"
                    frameRatio={16 / 10}
                    sizes="1024px"
                    priority
                  />
                )}
              </div>
              <div className="flex flex-wrap items-start justify-between gap-4 border-t border-stone px-5 py-4 md:px-6 md:py-5">
                <div className="min-w-0 flex-1">
                  <p className="display text-xl text-ink md:text-2xl">
                    {open.caption || open.alt}
                  </p>
                  {open.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                      {open.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    aria-label="Previous photo"
                    onClick={() =>
                      setActive((a) =>
                        a === null ? a : (a - 1 + gallery.length) % gallery.length,
                      )
                    }
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    aria-label="Next photo"
                    onClick={() => setActive((a) => (a === null ? a : (a + 1) % gallery.length))}
                  >
                    →
                  </button>
                  <button type="button" onClick={() => setActive(null)} className="btn-ghost">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
