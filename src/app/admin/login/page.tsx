"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="section-label mb-3">Admin</p>
      <h1 className="display mb-6 text-4xl text-ink">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-sm border border-stone bg-cream px-4 py-3 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent px-4 py-3 text-sm text-white hover:bg-accent-soft disabled:opacity-60"
        >
          {loading ? "Checking..." : "Enter dashboard"}
        </button>
      </form>
      <p className="mt-6 text-xs text-ink-soft">
        Default local password: <code className="text-accent">anshul123</code> — change via{" "}
        <code className="text-accent">ADMIN_PASSWORD</code> in <code>.env.local</code>.
      </p>
    </div>
  );
}
