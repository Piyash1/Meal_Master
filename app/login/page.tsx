"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-500 mb-4 animate-in fade-in zoom-in duration-700">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            MealMaster
          </h1>
          <p className="text-slate-400 font-medium">
            Authorized access only for apartment members.
          </p>
        </div>

        <div className="card p-8 bg-slate-900/40 backdrop-blur-xl border-slate-800/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-emerald-500 opacity-50"></div>

          <form action={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="input pl-11 h-12 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input pl-11 h-12 bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="btn btn-primary w-full h-12 text-base font-bold flex items-center justify-center gap-2 group/btn relative overflow-hidden active:scale-95 transition-transform"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm">
          Forgot your password? Contact the apartment admin.
        </p>
      </div>
    </div>
  );
}
