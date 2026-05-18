"use client";
import Link from "next/link";
import { ArrowRight, DollarSign, PieChart, Bell, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 flex flex-col items-center">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          scrolled ? "bg-white/80 backdrop-blur-xl py-4 shadow-sm border-b border-slate-100" : "bg-transparent py-8"
        }`}
      >
        <div className="w-full max-w-7xl px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-indigo-100 shadow-xl">
              <DollarSign size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">WealthWise</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-black shadow-lg hover:bg-indigo-600 hover:shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="w-full flex flex-col items-center pt-64 pb-48 px-6 text-center">
        <div className="max-w-5xl">
          <div className="inline-flex items-center bg-indigo-50 text-indigo-600 text-[12px] font-black px-6 py-2 rounded-full mb-10 border border-indigo-100 uppercase tracking-[0.2em]">
            Next-Gen Finance Tracking
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 tracking-tight leading-[1.05]">
            Control your wealth, <br /> 
            <span className="text-indigo-600">not the other way.</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            A beautiful, minimalist dashboard designed to help you track expenses, 
            manage budgets, and see your financial future clearly.
          </p>

          <div className="flex justify-center">
            <Link
              href="/register"
              className="group flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
            >
              Get Started Free 
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-40 px-6 bg-white flex justify-center border-y border-slate-50">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              {
                icon: <PieChart size={32} className="text-indigo-500" />,
                title: "Visual Budgeting",
                desc: "Beautiful charts that make understanding your spending habits effortless.",
              },
              {
                icon: <Bell size={32} className="text-amber-500" />,
                title: "Smart Alerts",
                desc: "Real-time notifications sent to your email when you approach limits.",
              },
              {
                icon: <Shield size={32} className="text-emerald-500" />,
                title: "Privacy First",
                desc: "Your financial data is encrypted and accessible only by you. Always.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center md:items-start group">
                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] group-hover:bg-indigo-50 transition-all duration-500 group-hover:-translate-y-2">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-5 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-48 px-6 bg-[#F8F9FB] flex justify-center">
        <div className="max-w-7xl w-full text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-24 tracking-tight">Simple Onboarding</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Sign Up", desc: "Create your secure account in under a minute." },
              { step: "02", title: "Log Data", desc: "Enter your daily expenses with one-click categories." },
              { step: "03", title: "Analyze", desc: "Get custom insights on how to optimize your savings." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-16 rounded-[4rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col items-center group">
                <span className="text-indigo-600 font-black text-sm mb-6 uppercase tracking-[0.3em]">Step {item.step}</span>
                <h4 className="text-3xl font-black text-slate-900 mb-5 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-lg font-light text-center leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full py-24 text-center bg-white border-t border-slate-100 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default">
          <div className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center">
            <DollarSign size={14} />
          </div>
          <span className="font-black text-slate-900 uppercase tracking-[0.4em] text-xs">WealthWise</span>
        </div>
        <p className="text-slate-400 text-xs font-black tracking-[0.2em] uppercase">
          &copy; 2026 WEALTHWISE &bull; ADVANCED WEB TECH PROJECT
        </p>
      </footer>
    </div>
  );
}