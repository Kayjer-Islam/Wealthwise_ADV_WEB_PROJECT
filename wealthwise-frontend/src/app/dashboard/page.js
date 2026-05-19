"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import StatCard from "../../components/ui/StatCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../hooks/useAuth";
import { getMyReports, getMyExpenses, getMyBudgets } from "../../lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, Receipt, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("user");
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, expenseRes, budgetRes] = await Promise.all([
          getMyReports(), getMyExpenses(), getMyBudgets()
        ]);
        setSummary(reportRes.data);
        setExpenses(expenseRes.data.expenses?.slice(0, 5) || []);
        setBudgets(budgetRes.data || []);
      } catch {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchData();
  }, [authLoading]);

  if (authLoading || loading) return <><Navbar /><LoadingSpinner message="Loading your dashboard..." /></>;

  const chartData = summary?.categoryBreakdown?.map((c) => ({
    name: c.category,
    spent: Number(c.spent),
    budget: c.budget ? Number(c.budget) : 0,
  })) || [];

  const exceededCount = summary?.categoryBreakdown?.filter((c) => c.status === "exceeded").length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-2xl font-bold text-slate-900">Good day, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">Here is your financial overview</p>
        </div>

        {/* Alert Banner */}
        {exceededCount > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-6 flex items-center gap-3 fade-in">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">
              You have exceeded your budget in {exceededCount} {exceededCount === 1 ? "category" : "categories"}.
            </p>
            <Link href="/budgets" className="ml-auto text-red-600 text-xs font-semibold hover:underline shrink-0">Review →</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Spent" value={`৳${Number(summary?.totalExpense || 0).toFixed(2)}`} icon={DollarSign} color="bg-slate-900" subtitle="All time expenses" />
          <StatCard title="Transactions" value={expenses.length} icon={Receipt} color="bg-blue-500" subtitle="Recent transactions" />
          <StatCard title="Active Budgets" value={budgets.length} icon={Wallet} color="bg-violet-500" subtitle="Budget categories" />
          <StatCard title="Categories" value={summary?.totalCategories || 0} icon={TrendingUp} color="bg-emerald-500" subtitle="Expense categories" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Spending by Category</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }} formatter={(v) => [`৳${v}`, ""]} />
                  <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.spent > entry.budget && entry.budget > 0 ? "#ef4444" : "#0f172a"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-60 text-slate-300 text-sm">No expense data yet. Add your first expense!</div>
            )}
          </div>

          {/* Budget Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Budget Status</h2>
            {summary?.categoryBreakdown?.length > 0 ? (
              <div className="space-y-4">
                {summary.categoryBreakdown.map((cat, i) => {
                  const pct = cat.budget ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
                  const exceeded = cat.status === "exceeded";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700 truncate">{cat.category}</span>
                        <span className={`text-xs font-semibold shrink-0 ml-2 ${exceeded ? "text-red-500" : "text-emerald-600"}`}>
                          {exceeded ? "Exceeded" : "OK"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${exceeded ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{ width: `${cat.budget ? pct : 0}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-400">৳{Number(cat.spent).toFixed(0)}</span>
                        {cat.budget && <span className="text-xs text-slate-400">৳{Number(cat.budget).toFixed(0)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-300 text-sm text-center">Set budgets to track your spending limits</div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Recent Expenses</h2>
            <Link href="/expenses" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">View all →</Link>
          </div>
          {expenses.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {expenses.map((exp, i) => (
                <div key={i} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Receipt size={15} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{exp.description || "Expense"}</p>
                      <p className="text-xs text-slate-400">{exp.category?.name} · {new Date(exp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">৳{Number(exp.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-300 text-sm">No expenses yet. Start tracking your spending!</div>
          )}
        </div>
      </div>
    </div>
  );
}