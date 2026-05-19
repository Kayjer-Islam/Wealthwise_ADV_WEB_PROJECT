"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { DollarSign, LayoutDashboard, Receipt, Wallet, Tag, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/categories", label: "Categories", icon: Tag },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <DollarSign size={17} />
          </div>
          <span className="font-bold text-slate-900 text-lg">WealthWise</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={13} className="text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.name}</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
            <LogOut size={15} />Logout
          </button>
        </div>

        <button className="md:hidden text-slate-600" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1 fade-in">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}>
              <Icon size={15} />{label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500 flex items-center gap-1.5">
              <LogOut size={14} />Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}