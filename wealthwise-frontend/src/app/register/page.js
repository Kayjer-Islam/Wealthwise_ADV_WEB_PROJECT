"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";
import toast from "react-hot-toast";
import { DollarSign, Eye, EyeOff, Loader, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getStrength = (p) => {
    if (!p) return { score: 0, label: "", color: "", text: "" };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { score: s, label: "Weak", color: "bg-red-400", text: "text-red-500" };
    if (s <= 3) return { score: s, label: "Fair", color: "bg-amber-400", text: "text-amber-600" };
    return { score: s, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
  };

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    else if (form.name.length < 3) e.name = "At least 3 characters required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters required";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) toast.error("This email is already registered. Try logging in.");
      else toast.error("Registration failed. Please try again.");
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
            Start your financial<br />
            <span className="text-slate-400">journey today.</span>
          </h2>
          <div className="space-y-3">
            {["Track all expenses in one place", "Set budgets and get smart alerts", "View detailed financial reports", "Create personal expense categories"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">Free to use · No credit card required</p>
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
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
            <p className="text-slate-400 text-sm mb-7">Sign up free and start managing your finances</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" placeholder="Fahim Ahmed" value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.name ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.email ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: "" }); }}
                    className={`w-full px-4 py-3 border rounded-xl text-sm input-focus pr-11 ${errors.password ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 fade-in">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.text}`}>{strength.label} password</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={form.confirmPassword}
                    onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" }); }}
                    className={`w-full px-4 py-3 border rounded-xl text-sm input-focus pr-11 ${
                      errors.confirmPassword ? "border-red-300 bg-red-50" :
                      form.confirmPassword && form.password === form.confirmPassword ? "border-emerald-300 bg-emerald-50" :
                      "border-slate-200 hover:border-slate-300"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                  <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1 fade-in"><CheckCircle size={12} />Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 fade-in">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-press mt-1">
                {loading ? <><Loader size={16} className="animate-spin" />Creating account...</> : <>Create Account <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-slate-900 font-semibold hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}