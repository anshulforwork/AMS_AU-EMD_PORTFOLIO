"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { whatsappUrl } from "@/content/defaultPortfolio";

export function ContactSection({ site }: { site: PortfolioData["site"] }) {
  const channels = [
    { label: "Email", href: `mailto:${site.email}`, detail: site.email },
    { label: "Phone", href: `tel:${site.phone.replace(/\s/g, "")}`, detail: site.phone },
    { label: "WhatsApp", href: whatsappUrl(site), detail: "Message me" },
    { label: "LinkedIn", href: site.linkedin, detail: "amsembedded" },
    { label: "GitHub", href: site.github, detail: "anshulforwork" },
    { label: "Resume", href: site.resumeUrl, detail: "Open CV" },
  ];

  return (
    <section id="contact" className="theme-contact section-frame scroll-mt-24 py-24 text-cream md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-5 text-[0.65rem] font-semibold tracking-[0.4em] text-gold-soft uppercase">
              Get in touch
            </p>
            <h2 className="display text-4xl leading-tight text-cream md:text-6xl">
              Let&apos;s build<br />something precise.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/65 md:text-base">
              Open to roles, collaborations, and automation / embedded discussions.
              Based in {site.location}.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="btn-primary mt-10 !bg-gold !text-ink hover:!brightness-105"
            >
              {site.email}
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-dark glass-shine divide-y divide-cream/10 overflow-hidden rounded-2xl px-5"
          >
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between gap-4 py-5 transition"
                >
                  <div>
                    <p className="text-[0.65rem] tracking-[0.22em] text-gold-soft uppercase">
                      {c.label}
                    </p>
                    <p className="mt-1 text-sm text-cream/80 transition group-hover:text-cream">
                      {c.detail}
                    </p>
                  </div>
                  <span className="text-gold-soft transition group-hover:translate-x-1">→</span>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
