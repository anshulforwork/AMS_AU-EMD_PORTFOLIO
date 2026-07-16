"use client";

import { SmartImage } from "@/components/ui/SmartImage";

/** Clear upload control used across admin tabs */
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
  async function handleFile(file: File | undefined) {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) {
      alert("Upload failed. Make sure you are logged in.");
      return;
    }
    const json = (await res.json()) as { url: string };
    onUploaded(json.url);
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
          {onClear && (
            <button type="button" onClick={onClear} className="text-xs text-red-700">
              Clear
            </button>
          )}
        </div>
      ) : (
        <p className="mb-2 text-xs text-ink-soft">No image yet</p>
      )}
      <label className="inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-xs text-white hover:bg-accent-soft">
        Upload image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <p className="mt-2 text-[0.65rem] text-ink-soft">
        Any size is fine — site auto-fits images so they never look stretched.
      </p>
    </div>
  );
}
