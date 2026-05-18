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

  const validate = () => {
    if (!email) { setError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return false; }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success("Reset instructions sent!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md page-enter">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <DollarSign size={18} />
          </div>
          <span className="text-xl font-bold text-black">WealthWise</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!submitted ? (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
                <Mail size={22} className="text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-black mb-1">
                Forgot password?
              </h1>
              <p className="text-gray-500 text-sm mb-7">
                No worries. Enter your email and we will send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all input-glow ${
                      error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1.5 fade-in">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 btn-press"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                Check your inbox
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                We sent reset instructions to
              </p>
              <p className="font-semibold text-black text-sm mb-6">{email}</p>
              <p className="text-xs text-gray-400 mb-4">
                Did not receive it? Check your spam folder.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                className="text-sm text-gray-500 hover:text-black transition-colors underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-7 pt-6 border-t border-gray-100">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={15} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}