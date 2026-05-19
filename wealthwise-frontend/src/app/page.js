"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, DollarSign, PieChart, Bell, Shield, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: DollarSign, title: "Expense Tracking", desc: "Log and categorize every expense effortlessly.", color: "bg-blue-50 text-blue-600" },
    { icon: PieChart, title: "Budget Control", desc: "Set category budgets and monitor spending in real time.", color: "bg-violet-50 text-violet-600" },
    { icon: Bell, title: "Smart Alerts", desc: "Receive email notifications when budgets are exceeded.", color: "bg-amber-50 text-amber-600" },
    { icon: Shield, title: "Role Based Access", desc: "Dedicated dashboards for users and financial advisors.", color: "bg-emerald-50 text-emerald-600" },
    { icon: BarChart3, title: "Financial Reports", desc: "Detailed category-wise summaries and spending insights.", color: "bg-rose-50 text-rose-600" },
    { icon: TrendingUp, title: "Personal Categories", desc: "Create your own custom expense categories.", color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <DollarSign size={17} />
            </div>
            <span className="font-bold text-slate-900">WealthWise</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-all">
              Sign In
            </Link>
            <Link href="/register" className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-slate-700 transition-all btn-press">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-slate-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Personal Finance Manager — AIUB Spring 2025-2026
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Take Control of<br />
            <span className="relative inline-block">
              Your Finances
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300 -z-10 opacity-60 rounded" />
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Track expenses, manage budgets, and receive intelligent alerts — all from one clean dashboard.
          </p>
          <div className="flex items-center justify-center gap-3 mb-14">
            <Link href="/register" className="flex items-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all btn-press shadow-lg shadow-slate-900/15">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="flex items-center gap-2 border border-slate-200 text-slate-700 px-7 py-3.5 rounded-xl font-semibold text-sm hover:border-slate-400 hover:bg-slate-50 transition-all">
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
            {["Free to use", "No credit card", "Instant setup"].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm">Powerful tools to help you understand and control your money.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover-lift cursor-default">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={19} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-14">Get started in 3 steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Create Account", desc: "Register free and set up your profile in seconds." },
              { step: "02", title: "Add Expenses", desc: "Log your daily expenses and assign them to categories." },
              { step: "03", title: "Track & Optimize", desc: "View reports and stay within budget with smart alerts." },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-6xl font-extrabold text-slate-100 mb-3">{item.step}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <TrendingUp size={28} className="mx-auto mb-5 text-slate-500" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control?</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">Join WealthWise and start making smarter financial decisions today.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all btn-press">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-slate-900 text-white w-5 h-5 rounded flex items-center justify-center">
            <DollarSign size={11} />
          </div>
          <span className="font-semibold text-slate-600 text-sm">WealthWise</span>
        </div>
        <p className="text-slate-400 text-xs">© 2026 WealthWise · AIUB Advanced Web Technology · Spring 2025-2026</p>
      </footer>
    </div>
  );
}