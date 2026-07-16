"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};

type Sparkle = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  bright: number;
};

const COLORS = [
  [184, 151, 90], // gold
  [212, 188, 138], // soft gold
  [154, 123, 86], // bronze
  [142, 138, 132], // platinum
  [197, 186, 162], // champagne metal
];

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let sparkles: Sparkle[] = [];
    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const LINK = 135;
    const SPEED = 0.32;

    function count() {
      return Math.min(64, Math.max(28, Math.floor((width * height) / 24000)));
    }

    function sparkleCount() {
      return Math.min(55, Math.max(22, Math.floor((width * height) / 28000)));
    }

    function spawn() {
      particles = Array.from({ length: count() }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.5 + 0.8,
        hue: Math.floor(Math.random() * COLORS.length),
      }));

      sparkles = Array.from({ length: sparkleCount() }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.03,
        bright: 0.35 + Math.random() * 0.55,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function frame() {
      t += 1;
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 0.1) {
            p.vx += (dx / d) * 0.04;
            p.vy += (dy / d) * 0.04;
          }
        }

        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.85) {
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const alpha = 1 - d / LINK;
            const c = COLORS[a.hue];
            ctx!.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha * 0.28})`;
            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      if (mouse.active) {
        for (const p of particles) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < LINK + 25) {
            const alpha = 1 - d / (LINK + 25);
            const c = COLORS[p.hue];
            ctx!.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha * 0.32})`;
            ctx!.lineWidth = 0.7;
            ctx!.beginPath();
            ctx!.moveTo(mouse.x, mouse.y);
            ctx!.lineTo(p.x, p.y);
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        const c = COLORS[p.hue];
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.42)`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Premium sparkles — soft gold / white twinkles
      for (const s of sparkles) {
        const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(t * s.speed + s.phase));
        const alpha = twinkle * s.bright;
        const size = s.r * (0.7 + twinkle * 0.6);

        // soft halo
        const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, size * 4);
        grad.addColorStop(0, `rgba(255, 248, 230, ${alpha * 0.55})`);
        grad.addColorStop(0.35, `rgba(212, 188, 138, ${alpha * 0.22})`);
        grad.addColorStop(1, "rgba(212, 188, 138, 0)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, size * 4, 0, Math.PI * 2);
        ctx!.fill();

        // crisp sparkle cross
        ctx!.strokeStyle = `rgba(255, 250, 240, ${alpha * 0.85})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        ctx!.moveTo(s.x - size * 2.2, s.y);
        ctx!.lineTo(s.x + size * 2.2, s.y);
        ctx!.moveTo(s.x, s.y - size * 2.2);
        ctx!.lineTo(s.x, s.y + size * 2.2);
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255, 252, 245, ${alpha})`;
        ctx!.arc(s.x, s.y, size * 0.55, 0, Math.PI * 2);
        ctx!.fill();

        // slow drift
        s.y += 0.08;
        if (s.y > height + 10) {
          s.y = -10;
          s.x = Math.random() * width;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-paper" />

      <motion.div
        className="orb -left-24 top-0 h-[460px] w-[460px] bg-gold/22"
        animate={{ x: [0, 50, 0], y: [0, 35, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb -right-16 top-24 h-[400px] w-[400px] bg-platinum/18"
        animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb bottom-0 left-1/4 h-[360px] w-[360px] bg-gold-soft/20"
        animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb right-1/4 bottom-10 h-[300px] w-[300px] bg-bronze/14"
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-gradient-to-b from-paper/10 via-transparent to-cream-deep/65" />
    </div>
  );
}
