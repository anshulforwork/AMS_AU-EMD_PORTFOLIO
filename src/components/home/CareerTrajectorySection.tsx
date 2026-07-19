"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Career trajectory — one understated section that reads as growth, not demands:
 * compensation trend (CTC), capabilities added each year, and appointment
 * records as quiet supporting proof.
 */

const W = 720;
const H = 360;
const PAD = { top: 56, right: 40, bottom: 56, left: 40 };

function fmt(currency: string, amount: number, unit: string) {
  const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(1);
  return `${currency}${n} ${unit}`;
}

/** Smooth cubic path through points */
function linePath(pts: { x: number; y: number }[]) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function CareerTrajectorySection({
  growth,
  offerLetters,
}: {
  growth: PortfolioData["growth"];
  offerLetters: PortfolioData["offerLetters"];
}) {
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const openLetter = activeLetter !== null ? offerLetters[activeLetter] : null;

  const points = (growth?.points ?? []).filter((p) => p.amount > 0);
  if (points.length < 2) return null;

  const { currency, unit } = growth;
  const bestOffer =
    growth.bestOffer && growth.bestOffer.amount > 0 ? growth.bestOffer : null;

  const first = points[0].amount;
  const last = points[points.length - 1].amount;
  const totalGrowthPct = Math.round((last / first - 1) * 100);
  const years = points.length - 1;
  const cagrPct = Math.round((Math.pow(last / first, 1 / years) - 1) * 100);

  const maxVal = Math.max(...points.map((p) => p.amount), bestOffer?.amount ?? 0);
  const yMax = maxVal * 1.18;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xAt = (i: number) =>
    PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const yAt = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  const pts = points.map((p, i) => ({ x: xAt(i), y: yAt(p.amount) }));
  const dLine = linePath(pts);
  const dArea = `${dLine} L ${pts[pts.length - 1].x} ${PAD.top + plotH} L ${pts[0].x} ${
    PAD.top + plotH
  } Z`;
  const bestY = bestOffer ? yAt(bestOffer.amount) : 0;

  const stats: { label: string; value: string; sub: string }[] = [
    {
      label: "Growth to date",
      value: `+${totalGrowthPct}%`,
      sub: `${points[0].period} → ${points[points.length - 1].period}`,
    },
    {
      label: "Avg. yearly step",
      value: `+${cagrPct}%`,
      sub: "Compounded per year",
    },
  ];
  if (bestOffer) {
    stats.push({
      label: bestOffer.label,
      value: fmt(currency, bestOffer.amount, unit),
      sub: "Where the market currently places this profile",
    });
  }

  const hasSkills = points.some((p) => (p.skills?.length ?? 0) > 0);

  return (
    <section id="trajectory" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="section-label mb-3">Trajectory</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Career trajectory</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
            Responsibility, capability, and value growing together — each role step
            documented and reflected in the trend.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface rounded-2xl p-5"
            >
              <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold uppercase">
                {s.label}
              </p>
              <p className="display mt-2 text-3xl text-ink">{s.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CTC trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="surface mt-6 overflow-hidden rounded-2xl p-4 md:p-8"
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Career compensation growth chart"
          >
            <defs>
              <linearGradient id="trajFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={PAD.left}
                x2={W - PAD.right}
                y1={PAD.top + plotH * (1 - f)}
                y2={PAD.top + plotH * (1 - f)}
                stroke="var(--stone)"
                strokeOpacity="0.5"
                strokeDasharray="2 6"
              />
            ))}

            {bestOffer && (
              <g>
                <motion.line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={bestY}
                  y2={bestY}
                  stroke="var(--bronze)"
                  strokeWidth="1.4"
                  strokeDasharray="7 6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.85 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                />
                <motion.text
                  x={W - PAD.right}
                  y={bestY - 10}
                  textAnchor="end"
                  fontSize="13"
                  fill="var(--bronze)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  {bestOffer.label} · {fmt(currency, bestOffer.amount, unit)}
                </motion.text>
              </g>
            )}

            <motion.path
              d={dArea}
              fill="url(#trajFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.9 }}
            />
            <motion.path
              d={dLine}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {points.map((p, i) => {
              const yoy =
                i > 0 ? Math.round((p.amount / points[i - 1].amount - 1) * 100) : null;
              return (
                <motion.g
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.22 }}
                  style={{ transformOrigin: `${pts[i].x}px ${pts[i].y}px` }}
                >
                  <circle cx={pts[i].x} cy={pts[i].y} r="10" fill="var(--gold)" opacity="0.15" />
                  <circle
                    cx={pts[i].x}
                    cy={pts[i].y}
                    r="5"
                    fill="white"
                    stroke="var(--gold)"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pts[i].x}
                    y={pts[i].y - 18}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill="var(--ink)"
                  >
                    {fmt(currency, p.amount, unit)}
                  </text>
                  {yoy !== null && yoy > 0 && (
                    <text
                      x={pts[i].x}
                      y={pts[i].y - 36}
                      textAnchor="middle"
                      fontSize="11.5"
                      fill="var(--gold)"
                    >
                      ▲ {yoy}%
                    </text>
                  )}
                  <text
                    x={pts[i].x}
                    y={PAD.top + plotH + 24}
                    textAnchor="middle"
                    fontSize="12.5"
                    fill="var(--ink-soft)"
                  >
                    {p.period}
                  </text>
                  {(p.role || p.note) && (
                    <text
                      x={pts[i].x}
                      y={PAD.top + plotH + 42}
                      textAnchor="middle"
                      fontSize="10.5"
                      fill="var(--ink-soft)"
                      opacity="0.75"
                    >
                      {p.role ?? p.note}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        {/* Skills trajectory — capabilities added alongside the trend */}
        {hasSkills && (
          <div className="mt-10">
            <p className="section-label mb-6">Capability growth</p>
            <div className="grid gap-6 md:grid-cols-3">
              {points.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative border-l-2 border-gold/40 pl-5"
                >
                  <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase">
                    {p.period}
                  </p>
                  {(p.role || p.note) && (
                    <p className="mt-1 text-sm font-medium text-bronze">
                      {p.role ?? p.note}
                    </p>
                  )}
                  {p.company && <p className="mt-0.5 text-xs text-ink-soft">{p.company}</p>}
                  {p.summary && (
                    <p className="mt-3 text-xs leading-relaxed text-ink-soft">{p.summary}</p>
                  )}
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {(p.skills ?? []).map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-stone bg-[#faf9f7] px-3 py-1 text-[0.7rem] tracking-wide text-ink-soft"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  {p.milestoneLetterId &&
                    (() => {
                      const letterIndex = offerLetters.findIndex(
                        (letter) => letter.id === p.milestoneLetterId,
                      );
                      if (letterIndex < 0) return null;
                      return (
                        <button
                          type="button"
                          onClick={() => setActiveLetter(letterIndex)}
                          className="mt-4 text-xs text-gold underline-offset-4 hover:underline"
                        >
                          View milestone record →
                        </button>
                      );
                    })()}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone records — appointment letters, understated */}
        {offerLetters.length > 0 && (
          <div id="offers" className="mt-14 scroll-mt-24 border-t border-stone pt-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <p className="section-label">Milestones on record</p>
              <p className="text-xs text-ink-soft">
                Each step above is backed by an appointment record — click to view.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {offerLetters.map((letter, i) => (
                <motion.button
                  key={letter.id}
                  type="button"
                  onClick={() => setActiveLetter(i)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="surface group flex items-center gap-4 rounded-2xl p-4 text-left"
                >
                  <div className="media-frame relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-cream ring-1 ring-stone/60">
                    {letter.image ? (
                      <SmartImage
                        src={letter.image}
                        alt={letter.title}
                        fit="contain"
                        frameRatio={3 / 4}
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[0.55rem] tracking-widest text-ink-soft uppercase">
                        Doc
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-gold uppercase">
                      {letter.date}
                    </p>
                    <p className="truncate text-sm font-medium text-ink transition group-hover:text-bronze">
                      {letter.role}
                    </p>
                    <p className="truncate text-xs text-ink-soft">{letter.company}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openLetter && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLetter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-auto bg-cream"
              onClick={(e) => e.stopPropagation()}
            >
              {openLetter.image ? (
                <div className="media-frame relative aspect-[3/4] max-h-[70vh]">
                  <SmartImage
                    src={openLetter.image}
                    alt={openLetter.title}
                    fit="contain"
                    frameRatio={3 / 4}
                    sizes="800px"
                    priority
                  />
                </div>
              ) : (
                <div className="px-8 py-16 text-center">
                  <p className="display text-3xl text-ink">{openLetter.role}</p>
                  <p className="mt-2 text-bronze">{openLetter.company}</p>
                  <p className="mt-6 text-sm text-ink-soft">
                    Add a scan of this record in Admin → Milestone letters.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone px-5 py-4">
                <div>
                  <p className="display text-xl text-ink">{openLetter.title}</p>
                  <p className="text-sm text-ink-soft">
                    {openLetter.role} · {openLetter.company} · {openLetter.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {openLetter.fileUrl && (
                    <a
                      href={openLetter.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Open PDF
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveLetter(null)}
                    className="btn-ghost"
                  >
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
