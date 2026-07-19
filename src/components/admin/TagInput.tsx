"use client";

import { useRef, useState } from "react";

/**
 * Tag chips for admin lists (trajectory skills, etc.).
 * Type a skill → press Enter (or comma) to create a tag.
 * Click a tag to edit it; press × / Backspace to remove.
 */
export function TagInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
  hint = "Press Enter or comma to add. Click a tag to edit.",
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const text = raw.trim().replace(/,+$/, "").trim();
    if (!text) return;

    if (editingIndex !== null) {
      const next = [...values];
      // Avoid duplicates (except keeping the same tag)
      if (
        next.some(
          (v, i) => i !== editingIndex && v.toLowerCase() === text.toLowerCase(),
        )
      ) {
        setDraft("");
        setEditingIndex(null);
        return;
      }
      next[editingIndex] = text;
      onChange(next);
      setEditingIndex(null);
    } else {
      if (values.some((v) => v.toLowerCase() === text.toLowerCase())) {
        setDraft("");
        return;
      }
      onChange([...values, text]);
    }
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraft("");
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setDraft(values[index]);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
      return;
    }
    if (e.key === "Escape" && editingIndex !== null) {
      e.preventDefault();
      setEditingIndex(null);
      setDraft("");
      return;
    }
    if (e.key === "Backspace" && !draft && values.length > 0 && editingIndex === null) {
      e.preventDefault();
      removeAt(values.length - 1);
    }
  }

  // Also commit when the user pastes "a, b, c"
  function onChangeDraft(value: string) {
    if (value.includes(",") && editingIndex === null) {
      const parts = value.split(",");
      const last = parts.pop() ?? "";
      const added = parts.map((p) => p.trim()).filter(Boolean);
      if (added.length) {
        const merged = [...values];
        for (const item of added) {
          if (!merged.some((v) => v.toLowerCase() === item.toLowerCase())) {
            merged.push(item);
          }
        }
        onChange(merged);
      }
      setDraft(last);
      return;
    }
    setDraft(value);
  }

  return (
    <div className="block text-sm">
      <span className="mb-1 block text-ink-soft">{label}</span>
      <div
        className="flex min-h-[2.75rem] flex-wrap items-center gap-2 rounded-xl border border-stone bg-cream/80 px-3 py-2 focus-within:border-platinum"
        onClick={() => inputRef.current?.focus()}
      >
        {values.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
              editingIndex === i
                ? "border-gold bg-gold/10 text-bronze"
                : "border-stone bg-white/80 text-ink"
            }`}
          >
            <button
              type="button"
              className="max-w-[14rem] truncate text-left hover:text-bronze"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(i);
              }}
              title="Click to edit"
            >
              {tag}
            </button>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="text-ink-soft hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                removeAt(i);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => onChangeDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) commit(draft);
          }}
          placeholder={
            editingIndex !== null
              ? "Edit tag, then Enter"
              : values.length
                ? placeholder
                : "Type a skill and press Enter"
          }
          className="min-w-[10rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-ink-soft/70"
        />
      </div>
      <p className="mt-1.5 text-[0.65rem] text-ink-soft">
        {editingIndex !== null
          ? "Editing — press Enter to save, Esc to cancel."
          : hint}
      </p>
    </div>
  );
}
