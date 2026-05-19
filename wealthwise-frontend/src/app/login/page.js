"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { loginUser, getMe } from "../../lib/api";
import toast from "react-hot-toast";
import { DollarSign, Eye, EyeOff, Loader, ArrowRight, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. Get token
      const res = await loginUser(form);
      const { access_token, role } = res.data;

      // 2. SAVE TOKEN IMMEDIATELY so axios interceptor can use it for getMe()
      localStorage.setItem("token", access_token);

      // 3. Fetch user profile
      const userRes = await getMe();
      
      // 4. Update Context and Redirect
      login(access_token, role, userRes.data);
      toast.success(`Welcome back, ${userRes.data.name}!`);
      
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("credentials") || msg.toLowerCase().includes("invalid")) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-slate-900 p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-white text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center">
            <DollarSign size={17} />
          </div>
          <span className="text-white font-bold text-lg">WealthWise</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Manage your money<br />
            <span className="text-slate-400">smarter than ever.</span>
          </h2>
          <div className="space-y-3">
            {["Track all your expenses in one place", "Set budgets and get smart alerts", "View detailed financial reports"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">AIUB · Advanced Web Technology · Spring 2025-2026</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md fade-up">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <DollarSign size={17} />
            </div>
            <span className="text-xl font-bold text-slate-900">WealthWise</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm mb-7">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.email ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: "" }); }}
                    className={`w-full px-4 py-3 border rounded-xl text-sm input-focus pr-11 ${errors.password ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press">
                {loading ? <><Loader size={16} className="animate-spin" />Signing in...</> : <>Sign In <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-slate-900 font-semibold hover:underline">Create one free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}