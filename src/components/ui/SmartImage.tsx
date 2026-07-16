"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Fit = "cover" | "contain" | "auto";

/**
 * Displays uploaded images without stretching.
 * - cover: fills the frame (crops edges) — photos
 * - contain: full image visible (letterbox) — certificates / logos
 * - auto: picks cover or contain based on how different the image ratio is from the frame
 */
export function SmartImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
  fit = "auto",
  /** Frame width/height ratio, e.g. 16/9. Used when fit="auto". */
  frameRatio = 16 / 10,
  position = "center",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fit?: Fit;
  frameRatio?: number;
  position?: "center" | "top";
}) {
  const [resolved, setResolved] = useState<"cover" | "contain">(
    fit === "contain" ? "contain" : "cover",
  );

  useEffect(() => {
    if (fit !== "auto") {
      setResolved(fit);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled || !img.naturalWidth) return;
      const imageRatio = img.naturalWidth / img.naturalHeight;
      const diff = Math.abs(Math.log(imageRatio / frameRatio));
      // If image shape is very different from the frame, show full image (contain)
      // Otherwise fill the frame cleanly (cover)
      setResolved(diff > 0.35 ? "contain" : "cover");
    };
    img.onerror = () => {
      if (!cancelled) setResolved("cover");
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, fit, frameRatio]);

  const positionClass = position === "top" ? "object-top" : "object-center";
  const fitClass = resolved === "contain" ? "object-contain" : "object-cover";

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`${fitClass} ${positionClass} ${className}`}
      style={{ objectFit: resolved, objectPosition: position === "top" ? "center top" : "center" }}
    />
  );
}

/** Consistent frame — champagne pad so contain mode never looks broken */
export function MediaFrame({
  children,
  className = "",
  aspectClass = "aspect-[16/10]",
}: {
  children: React.ReactNode;
  className?: string;
  aspectClass?: string;
}) {
  return (
    <div
      className={`media-frame relative overflow-hidden ${aspectClass} ${className}`}
    >
      {children}
    </div>
  );
}
