"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/layout/AdminNavbar";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../../hooks/useAuth";
import { getAllExpenses } from "../../../lib/api";
import { Receipt, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminExpensesPage() {
  const { loading: authLoading } = useRequireAuth("admin");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllExpenses();
        setExpenses(res.data || []);
      } catch {
        toast.error("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchData();
  }, [authLoading]);

  const filtered = expenses.filter((e) =>
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (authLoading || loading) return <><AdminNavbar /><LoadingSpinner message="Loading all expenses..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-2xl font-bold text-slate-900">All Expenses</h1>
          <p className="text-slate-400 text-sm mt-1">
            {expenses.length} total transactions ·
            <span className="font-semibold text-slate-600 ml-1">৳{total.toFixed(2)} platform spending</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by user, description, or category..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm input-focus bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100">
          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-50">
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <span className="col-span-3">Description</span>
                <span className="col-span-2">User</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-2 text-right">Amount</span>
              </div>
              {filtered.map((exp, i) => (
                <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Receipt size={13} className="text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 truncate">{exp.description || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {exp.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-600 truncate">{exp.user?.name}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {exp.category?.name || "—"}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs text-slate-400">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 text-right font-semibold text-slate-900 text-sm">
                    ৳{Number(exp.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Receipt} title={search ? "No results found" : "No expenses recorded"} description={search ? "Try a different search." : "No users have added expenses yet."} />
          )}
        </div>
      </div>
    </div>
  );
}