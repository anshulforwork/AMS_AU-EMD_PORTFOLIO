"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Early career proof for HR — offer / appointment letters with role progression.
 * Placed right after Experience so the timeline and documents read together.
 */
export function OfferLettersSection({
  offerLetters,
}: {
  offerLetters: PortfolioData["offerLetters"];
}) {
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null ? offerLetters[active] : null;

  if (!offerLetters?.length) return null;

  return (
    <section id="offers" className="scroll-mt-24 border-y border-stone bg-[#faf8f4] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="section-label mb-3">For recruiters</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Offer letters</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
            Appointment letters that mark each role step — open a letter to review the
            original document.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {offerLetters.map((letter, i) => (
            <motion.button
              key={letter.id}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group text-left"
            >
              <div className="media-frame relative aspect-[3/4] overflow-hidden rounded-lg bg-cream ring-1 ring-stone/60">
                {letter.image ? (
                  <SmartImage
                    src={letter.image}
                    alt={letter.title}
                    fit="contain"
                    frameRatio={3 / 4}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full flex-col justify-between p-6">
                    <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
                      {letter.date}
                    </p>
                    <div>
                      <p className="display text-2xl leading-tight text-ink">{letter.role}</p>
                      <p className="mt-2 text-sm text-bronze">{letter.company}</p>
                    </div>
                    <p className="text-xs tracking-wide text-ink-soft uppercase">
                      Upload scan in Admin →
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-4 pt-16 opacity-0 transition group-hover:opacity-100">
                  <p className="text-xs tracking-wide text-cream">View letter →</p>
                </div>
              </div>
              <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.2em] text-gold uppercase">
                {letter.date}
              </p>
              <h3 className="display mt-1 text-xl text-ink md:text-2xl">{letter.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">
                {letter.role}
                {letter.company ? ` · ${letter.company}` : ""}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-auto bg-cream"
              onClick={(e) => e.stopPropagation()}
            >
              {open.image ? (
                <div className="media-frame relative aspect-[3/4] max-h-[70vh]">
                  <SmartImage
                    src={open.image}
                    alt={open.title}
                    fit="contain"
                    frameRatio={3 / 4}
                    sizes="800px"
                    priority
                  />
                </div>
              ) : (
                <div className="px-8 py-16 text-center">
                  <p className="display text-3xl text-ink">{open.role}</p>
                  <p className="mt-2 text-bronze">{open.company}</p>
                  <p className="mt-6 text-sm text-ink-soft">
                    Add a scan of this letter in Admin → Offer letters.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone px-5 py-4">
                <div>
                  <p className="display text-xl text-ink">{open.title}</p>
                  <p className="text-sm text-ink-soft">
                    {open.role} · {open.company} · {open.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {open.fileUrl && (
                    <a
                      href={open.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Open PDF
                    </a>
                  )}
                  <button type="button" onClick={() => setActive(null)} className="btn-ghost">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
