"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [info, setInfo] = useState("");

  async function onLogin(e: React.FormEvent) {
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

  async function onRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const res = await fetch("/api/admin/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const json = (await res.json()) as {
      error?: string;
      message?: string;
      otp?: string;
    };
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not send OTP");
      return;
    }
    setOtpSent(true);
    if (json.otp) {
      setOtp(json.otp);
      setInfo(`${json.message || "OTP ready."} Your code: ${json.otp}`);
    } else {
      setInfo(json.message || "OTP sent to your registered number. Valid for 10 minutes.");
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const res = await fetch("/api/admin/otp/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, newPassword }),
    });
    const json = (await res.json()) as { error?: string; message?: string };
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not update password");
      return;
    }
    setMode("login");
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setInfo("Password updated. Sign in with your new password.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <Link href="/" className="mb-6 text-sm text-ink-soft transition hover:text-platinum">
        ← Back to site
      </Link>
      <p className="section-label mb-3">Admin</p>
      <h1 className="display mb-6 text-4xl text-ink">
        {mode === "login" ? "Sign in" : "Change password"}
      </h1>

      {mode === "login" ? (
        <form onSubmit={onLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            className="w-full rounded-sm border border-stone bg-cream px-4 py-3 text-sm outline-none focus:border-accent"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          {info && <p className="text-sm text-emerald-800">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-4 py-3 text-sm text-white hover:bg-accent-soft disabled:opacity-60"
          >
            {loading ? "Checking..." : "Enter dashboard"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("reset");
              setError("");
              setInfo("");
            }}
            className="w-full text-sm text-ink-soft underline-offset-2 hover:text-gold hover:underline"
          >
            Forgot / change password (OTP)
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={onRequestOtp} className="space-y-4">
              <p className="text-sm text-ink-soft">
                Enter your registered mobile number. We will send a one-time code.
              </p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Registered mobile number"
                className="w-full rounded-sm border border-stone bg-cream px-4 py-3 text-sm outline-none focus:border-accent"
              />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading || phone.trim().length < 10}
                className="w-full rounded-full bg-accent px-4 py-3 text-sm text-white hover:bg-accent-soft disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={onChangePassword} className="space-y-4">
              {info && <p className="text-sm text-emerald-800">{info}</p>}
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                className="w-full rounded-sm border border-stone bg-cream px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                autoComplete="new-password"
                className="w-full rounded-sm border border-stone bg-cream px-4 py-3 text-sm outline-none focus:border-accent"
              />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.trim().length < 4 || newPassword.length < 8}
                className="w-full rounded-full bg-accent px-4 py-3 text-sm text-white hover:bg-accent-soft disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setInfo("");
                  setError("");
                }}
                className="w-full text-sm text-ink-soft hover:text-gold"
              >
                Resend OTP
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setInfo("");
              setOtpSent(false);
            }}
            className="w-full text-sm text-ink-soft underline-offset-2 hover:text-gold hover:underline"
          >
            Back to sign in
          </button>
        </div>
      )}
    </div>
  );
}
