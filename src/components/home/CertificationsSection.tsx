"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

export function CertificationsSection({
  certifications,
}: {
  certifications: PortfolioData["certifications"];
}) {
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null ? certifications[active] : null;

  return (
    <section id="certifications" className="theme-certs section-frame scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-16 md:text-center">
          <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.4em] text-bronze uppercase">
            Credentials
          </p>
          <h2 className="display text-4xl text-ink md:text-5xl">Certifications</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            Click a certificate to view it larger. Upload real photos from Admin.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.length === 0 && (
            <p className="text-sm text-ink-soft">No certifications yet — add them in Admin.</p>
          )}
          {certifications.map((c, i) => (
            <motion.button
              key={`${c.title}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group text-left"
            >
              <div className="media-frame glass-champagne relative aspect-[4/3] overflow-hidden">
                {c.image ? (
                  <div className="absolute inset-4">
                    <SmartImage
                      src={c.image}
                      alt={c.title}
                      fit="contain"
                      frameRatio={4 / 3}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs tracking-widest text-ink-soft uppercase">
                    Add image
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-[0.65rem] tracking-[0.2em] text-gold uppercase">{c.year}</p>
                <h3 className="display mt-1 text-xl text-ink md:text-2xl">{c.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{c.issuer}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative w-full max-w-3xl overflow-hidden bg-cream"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="media-frame relative aspect-[4/3]">
                {open.image && (
                  <div className="absolute inset-6 md:inset-10">
                    <SmartImage
                      src={open.image}
                      alt={open.title}
                      fit="contain"
                      frameRatio={4 / 3}
                      sizes="800px"
                      priority
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-stone px-5 py-4">
                <div>
                  <p className="display text-xl text-ink">{open.title}</p>
                  <p className="text-sm text-ink-soft">
                    {open.issuer} · {open.year}
                  </p>
                </div>
                <button type="button" onClick={() => setActive(null)} className="btn-ghost">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
