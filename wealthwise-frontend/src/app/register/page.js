"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";
import toast from "react-hot-toast";
import { DollarSign, Eye, EyeOff, Loader, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { strength: score, label: "Weak", color: "bg-rose-400" };
    if (score <= 4) return { strength: score, label: "Fair", color: "bg-amber-400" };
    return { strength: score, label: "Strong", color: "bg-emerald-400" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Full name is required";
    else if (form.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        toast.error(serverMessage);
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center font-sans text-slate-800 p-6 md:p-10">
      <div className="w-full max-w-7xl flex bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 min-h-[850px]">
        
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#F8FAFC] p-20 border-r border-slate-100">
          <Link href="/" className="flex items-center gap-4 group w-fit">
            <div className="bg-indigo-600 text-white w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100/50 transition-transform group-hover:scale-105">
              <DollarSign size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">WealthWise</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
              Start your <br /> financial <span className="text-indigo-600">mastery.</span>
            </h2>
            <div className="space-y-6">
              {["Visual Spending Analytics", "Smart Budget Goals", "Military-Grade Privacy"].map((item, i) => (
                <div key={i} className="flex items-center gap-5 text-slate-600 text-lg font-medium">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} className="text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={20} className="text-slate-300" /> Secure Cloud Infrastructure
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 md:px-24 py-16">
          <div className="max-w-md w-full mx-auto">
            <header className="mb-14 text-center lg:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-lg font-light leading-relaxed">
                Join our community and take control of your future.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-7 py-5 rounded-[2rem] text-base transition-all outline-none border hover:border-slate-300 ${
                    errors.name ? "border-rose-300 bg-rose-50/20 ring-4 ring-rose-50" : "border-slate-200 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5"
                  }`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-rose-600 text-[11px] font-bold ml-4 tracking-wide italic">{errors.name}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full px-7 py-5 rounded-[2rem] text-base transition-all outline-none border hover:border-slate-300 ${
                    errors.email ? "border-rose-300 bg-rose-50/20 ring-4 ring-rose-50" : "border-slate-200 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5"
                  }`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-rose-600 text-[11px] font-bold ml-4 tracking-wide italic">{errors.email}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className={`w-full px-7 py-5 rounded-[2rem] text-base transition-all outline-none border hover:border-slate-300 ${
                      errors.password ? "border-rose-300 bg-rose-50/20 ring-4 ring-rose-50" : "border-slate-200 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5"
                    }`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {form.password && (
                  <div className="px-4 pt-3">
                    <div className="flex gap-2.5 mb-2.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${i <= passwordStrength.strength ? passwordStrength.color : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-black uppercase tracking-widest ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label} Password Security
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    className={`w-full px-7 py-5 rounded-[2rem] text-base transition-all outline-none border hover:border-slate-300 ${
                      errors.confirmPassword ? "border-rose-300 bg-rose-50/20 ring-4 ring-rose-50" : "border-slate-200 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5"
                    }`}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-rose-600 text-[11px] font-bold ml-4 tracking-wide italic">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200/40 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? <Loader size={24} className="animate-spin" /> : "Get Started Now"}
                  {!loading && <ArrowRight size={24} />}
                </button>
              </div>
            </form>

            <footer className="mt-12 text-center text-lg text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-black hover:underline underline-offset-8 decoration-2 decoration-indigo-200">
                Log in
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}