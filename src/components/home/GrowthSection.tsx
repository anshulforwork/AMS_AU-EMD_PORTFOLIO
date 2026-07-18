"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";

/**
 * Financial career growth — an understated trajectory chart.
 * Frames compensation history as professional growth; the best offer in hand
 * appears as a quiet benchmark line rather than a demand.
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

export function GrowthSection({ growth }: { growth: PortfolioData["growth"] }) {
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
      label: "Total growth",
      value: `+${totalGrowthPct}%`,
      sub: `${points[0].period} → ${points[points.length - 1].period}`,
    },
    {
      label: "Avg. yearly growth",
      value: `+${cagrPct}%`,
      sub: "Compounded per year",
    },
  ];
  if (bestOffer) {
    stats.push({
      label: bestOffer.label,
      value: fmt(currency, bestOffer.amount, unit),
      sub: "Current market benchmark",
    });
  }

  return (
    <section id="growth" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="section-label mb-3">Trajectory</p>
          <h2 className="display text-4xl text-ink md:text-[3.1rem]">Career growth</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
            Year-on-year professional growth — compensation reflecting expanding
            responsibility across automation and embedded work.
          </p>
        </div>

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
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* horizontal grid */}
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

            {/* best offer benchmark */}
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

            {/* area + line */}
            <motion.path
              d={dArea}
              fill="url(#growthFill)"
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

            {/* points */}
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
                  <circle
                    cx={pts[i].x}
                    cy={pts[i].y}
                    r="10"
                    fill="var(--gold)"
                    opacity="0.15"
                  />
                  <circle
                    cx={pts[i].x}
                    cy={pts[i].y}
                    r="5"
                    fill="white"
                    stroke="var(--gold)"
                    strokeWidth="2.5"
                  />
                  {/* amount above point */}
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
                  {/* YoY growth badge */}
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
                  {/* period + note below axis */}
                  <text
                    x={pts[i].x}
                    y={PAD.top + plotH + 24}
                    textAnchor="middle"
                    fontSize="12.5"
                    fill="var(--ink-soft)"
                  >
                    {p.period}
                  </text>
                  {p.note && (
                    <text
                      x={pts[i].x}
                      y={PAD.top + plotH + 42}
                      textAnchor="middle"
                      fontSize="10.5"
                      fill="var(--ink-soft)"
                      opacity="0.75"
                    >
                      {p.note}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        <p className="mt-4 text-center text-xs text-ink-soft">
          Consistent upward trajectory — growth earned through delivered projects and
          expanded ownership.
        </p>
      </div>
    </section>
  );
}
