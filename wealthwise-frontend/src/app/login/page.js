"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { loginUser, getMe } from "../../lib/api";
import toast from "react-hot-toast";
import { DollarSign, Eye, EyeOff, Loader, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { access_token, role } = res.data;
      const userRes = await getMe();
      login(access_token, role, userRes.data);
      toast.success(`Welcome back!`);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        toast.error(serverMessage.toLowerCase().includes("credentials") ? "Invalid email or password" : serverMessage);
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Login failed. Please try again.");
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
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] mb-12 tracking-tight">
              Manage your <br /> wealth with <span className="text-indigo-600">precision.</span>
            </h2>
            
            <div className="space-y-8">
              {[
                { title: "Real-time Spending Insights", desc: "Monitor every transaction instantly." },
                { title: "Encrypted Data Vault", desc: "Your security is our top priority." },
                { title: "Priority Support", desc: "24/7 assistance for premium members." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-xl font-black leading-none mb-2">{item.title}</p>
                    <p className="text-slate-500 text-base font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={20} className="text-slate-300" /> SECURE SESSION ACTIVE
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 md:px-24 py-16">
          <div className="max-w-md w-full mx-auto">
            <header className="mb-14 text-center lg:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Member Login</h1>
              <p className="text-slate-500 text-lg font-light leading-relaxed italic">
                Continue your journey toward financial clarity.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                <div className="flex justify-between items-center px-1">
                  <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 font-black hover:underline underline-offset-8 decoration-2">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
                {errors.password && <p className="text-rose-600 text-[11px] font-bold ml-4 tracking-wide italic">{errors.password}</p>}
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200/40 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? <Loader size={24} className="animate-spin" /> : "Sign In to Account"}
                  {!loading && <ArrowRight size={24} />}
                </button>
              </div>
            </form>

            <footer className="mt-14 text-center text-lg text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-black hover:underline underline-offset-8 decoration-2 decoration-indigo-200">
                Join now
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}