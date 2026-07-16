"use client";

import { motion } from "framer-motion";

export function SoftWhatsApp({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 overflow-hidden rounded-full bg-gradient-to-r from-gold to-platinum px-5 py-3 text-sm text-cream shadow-[0_12px_32px_rgba(184,151,90,0.35)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-gold/35"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <span className="relative">Message me</span>
    </motion.a>
  );
}
