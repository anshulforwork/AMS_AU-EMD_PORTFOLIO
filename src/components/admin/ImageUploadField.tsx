"use client";

import { useRef, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { deleteUploadedImage, uploadImage } from "@/lib/upload-client";

/**
 * Upload control used across admin tabs.
 * Shows a live preview with Replace / Remove actions, a busy indicator,
 * and the real server error when an upload fails.
 */
export function ImageUploadField({
  label,
  value,
  onUploaded,
  onClear,
}: {
  label: string;
  value?: string;
  onUploaded: (url: string) => void;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    const result = await uploadImage(file);
    setBusy(false);
    if (result.error !== undefined) {
      setError(result.error);
      return;
    }
    onUploaded(result.url);
  }

  async function handleRemove() {
    if (!value) return;
    if (!window.confirm("Remove this image?")) return;
    setError("");
    void deleteUploadedImage(value);
    if (onClear) {
      onClear();
    } else {
      onUploaded("");
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-accent uppercase">
        {label}
      </p>
      {value ? (
        <div className="mb-3 flex items-center gap-3">
          <div className="media-frame relative h-20 w-28 overflow-hidden rounded-lg">
            <SmartImage
              src={value}
              alt=""
              fit="contain"
              frameRatio={28 / 20}
              sizes="112px"
            />
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-ink-soft">{value}</p>
        </div>
      ) : (
        <p className="mb-2 text-xs text-ink-soft">No image yet</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-xs text-white hover:bg-accent-soft disabled:opacity-60"
        >
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value && !busy && (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-full border border-red-300 px-4 py-2 text-xs text-red-700 hover:bg-red-50"
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      <p className="mt-2 text-[0.65rem] text-ink-soft">
        Any size is fine — large photos are compressed automatically and the site
        auto-fits images so they never look stretched.
      </p>
    </div>
  );
}
