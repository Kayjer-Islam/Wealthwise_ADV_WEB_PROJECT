"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { DollarSign, Loader, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("Reset instructions sent to your email!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md fade-up">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <DollarSign size={17} />
          </div>
          <span className="text-xl font-bold text-slate-900">WealthWise</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {!submitted ? (
            <>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <Mail size={22} className="text-slate-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h1>
              <p className="text-slate-400 text-sm mb-7">No worries. Enter your email and we will send reset instructions.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${error ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {error && <p className="text-red-500 text-xs mt-1.5 fade-in">{error}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press">
                  {loading ? <><Loader size={16} className="animate-spin" />Sending...</> : "Send Reset Instructions"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-slate-400 text-sm mb-1">We sent instructions to</p>
              <p className="font-semibold text-slate-900 text-sm mb-6">{email}</p>
              <button onClick={() => { setSubmitted(false); setEmail(""); }}
                className="text-sm text-slate-400 hover:text-slate-900 transition-colors underline">
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-7 pt-6 border-t border-slate-100">
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={15} />Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}