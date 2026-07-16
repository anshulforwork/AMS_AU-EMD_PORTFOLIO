"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { SmartImage } from "@/components/ui/SmartImage";

export function HeroProfile({ site }: { site: PortfolioData["site"] }) {
  return (
    <section id="profile" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 pb-16 pt-14 md:grid-cols-12 md:gap-8 md:px-8 md:pb-24 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1 md:col-span-6 md:pb-6"
        >
          <p className="mb-6 text-[0.65rem] font-semibold tracking-[0.4em] text-gold uppercase">
            Automation · Embedded · Systems
          </p>

          <h1 className="display text-[3.4rem] leading-[0.95] text-ink md:text-[4.75rem] lg:text-[5.5rem]">
            {site.name}
          </h1>

          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gold" />
            <p className="text-sm font-medium tracking-wide text-bronze md:text-base">
              {site.title}
            </p>
          </div>

          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft md:text-base">
            {site.tagline}
          </p>

          <p className="mt-8 max-w-md border-t border-stone pt-6 text-sm leading-relaxed text-ink-soft">
            Automation and embedded as one craft — PLC &amp; Modbus on the plant side,
            firmware &amp; CAN on the device side.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn-primary">
              View work
            </a>
            <a href="#contact" className="btn-ghost">
              Contact
            </a>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3 text-sm text-ink-soft underline-offset-4 transition hover:text-gold hover:underline"
            >
              Resume
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="order-1 md:order-2 md:col-span-6"
        >
          <div className="media-frame relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden md:ml-auto md:max-w-none">
            <div className="absolute -left-3 top-6 z-10 hidden h-[72%] w-[1px] bg-gold/50 md:block" />
            <SmartImage
              src={site.profileImage}
              alt={site.name}
              fit="cover"
              position="top"
              frameRatio={4 / 5}
              priority
              sizes="(max-width: 768px) 90vw, 48vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-xs tracking-[0.22em] text-cream/90 uppercase">
              {site.location}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
