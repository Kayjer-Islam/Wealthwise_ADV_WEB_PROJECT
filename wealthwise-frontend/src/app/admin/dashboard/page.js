"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/layout/AdminNavbar";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../../hooks/useAuth";
import { getAllUsers, getAllReports, getAllExpenses } from "../../../lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Receipt, DollarSign, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("admin");
  const [reports, setReports] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, expenseRes, userRes] = await Promise.all([
          getAllReports(), getAllExpenses(), getAllUsers()
        ]);
        setReports(reportRes.data);
        setExpenses(expenseRes.data?.slice(0, 5) || []);
        setUsers(userRes.data || []);
      } catch {
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchData();
  }, [authLoading]);

  if (authLoading || loading) return <><AdminNavbar /><LoadingSpinner message="Loading admin dashboard..." /></>;

  const totalExpenses = reports?.report?.reduce((sum, u) => sum + Number(u.totalExpenses), 0) || 0;
  const chartData = reports?.report?.filter((u) => u.totalExpenses > 0).map((u) => ({
    name: u.name.split(" ")[0],
    spent: Number(u.totalExpenses),
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.name}. Here is the platform overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Users" value={reports?.totalUsers || 0} icon={Users} color="bg-blue-500" subtitle="Registered accounts" />
          <StatCard title="Total Expenses" value={reports?.report?.reduce((s, u) => s + u.expenseCount, 0) || 0} icon={Receipt} color="bg-violet-500" subtitle="All transactions" />
          <StatCard title="Platform Spending" value={`৳${totalExpenses.toFixed(2)}`} icon={DollarSign} color="bg-slate-900" subtitle="Total across all users" />
          <StatCard title="Active Users" value={reports?.report?.filter((u) => u.expenseCount > 0).length || 0} icon={TrendingUp} color="bg-emerald-500" subtitle="Users with expenses" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Spending by User</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }} formatter={(v) => [`৳${v}`, "Spent"]} />
                  <Bar dataKey="spent" fill="#0f172a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-60 text-slate-300 text-sm">No expense data available yet</div>
            )}
          </div>

          {/* User Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">User Overview</h2>
              <Link href="/admin/users" className="text-xs text-slate-400 hover:text-slate-900">View all →</Link>
            </div>
            {reports?.report?.length > 0 ? (
              <div className="space-y-3">
                {reports.report.slice(0, 5).map((u, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 leading-none">{u.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{u.expenseCount} expenses</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">৳{Number(u.totalExpenses).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-300 text-sm">No users yet</div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Recent Expenses (All Users)</h2>
            <Link href="/admin/expenses" className="text-sm text-slate-400 hover:text-slate-900">View all →</Link>
          </div>
          {expenses.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {expenses.map((exp, i) => (
                <div key={i} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Receipt size={14} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{exp.description || "Expense"}</p>
                      <p className="text-xs text-slate-400">{exp.user?.name} · {exp.category?.name} · {new Date(exp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">৳{Number(exp.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-300 text-sm py-8">No expenses recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}