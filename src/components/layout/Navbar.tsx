"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#trajectory", label: "Trajectory" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/#work", label: "Work" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({
  name,
  resumeUrl,
  logoSrc,
}: {
  name: string;
  resumeUrl: string;
  logoSrc?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/#profile" className="flex items-center gap-3">
          {logoSrc && (
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-cream-deep">
              <Image src={logoSrc} alt="AMS" fill className="object-contain p-1" />
            </span>
          )}
          <span className="display text-xl tracking-wide text-ink md:text-2xl">
            {name}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition hover:border-gold hover:text-gold"
          >
            Resume
          </a>
          <Link
            href="/admin/login"
            className="rounded-full bg-accent px-4 py-2 text-sm text-cream transition hover:bg-accent-soft"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          className="text-sm text-ink-soft lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone/60 px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-ink-soft"
              >
                {l.label}
              </a>
            ))}
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent">
              Resume
            </a>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gold"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
