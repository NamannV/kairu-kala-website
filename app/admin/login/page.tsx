"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kairukala.com");
  const [password, setPassword] = useState("kairukala2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#220809] flex flex-col justify-center items-center p-6 relative bg-grid-pattern">
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#DCC8A0]/70 hover:text-[#F7E9C7] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Website
      </Link>

      <div className="w-full max-w-md bg-[#300E0F] border border-[#DCC8A0]/20 p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/images/logo-emblem.png"
              alt="KAIRU KALA Official Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl font-light text-[#F7E9C7] tracking-wider">
            KAIRU KALA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#DCC8A0]/80 font-sans">
            Studio Content Management System
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#DCC8A0]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#220809] border border-[#DCC8A0]/30 pl-10 pr-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                placeholder="admin@kairukala.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#DCC8A0]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#220809] border border-[#DCC8A0]/30 pl-10 pr-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="p-3 bg-[#220809]/60 border border-[#DCC8A0]/15 text-[11px] text-[#DCC8A0]/80">
            <p className="font-medium text-[#F7E9C7] mb-0.5">Default Credentials:</p>
            <p>Email: <code className="text-[#F7E9C7]">admin@kairukala.com</code></p>
            <p>Password: <code className="text-[#F7E9C7]">kairukala2026</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-6 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#DCC8A0] transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Studio CMS"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
