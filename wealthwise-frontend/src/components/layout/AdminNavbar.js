"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { DollarSign, LayoutDashboard, Users, Tag, Receipt, LogOut, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/expenses", label: "All Expenses", icon: Receipt },
];

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="bg-white text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center">
            <DollarSign size={17} />
          </div>
          <span className="font-bold text-white text-lg">WealthWise</span>
          <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href ? "bg-white/15 text-white" : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
            <Shield size={13} className="text-white/60" />
            <span className="text-sm font-medium text-white/80">{user?.name}</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            <LogOut size={15} />Logout
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 space-y-1 fade-in">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === href ? "bg-white/15 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}>
              <Icon size={15} />{label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-400 flex items-center gap-1.5">
              <LogOut size={14} />Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}