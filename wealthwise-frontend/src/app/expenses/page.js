"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../hooks/useAuth";
import { getMyExpenses, createExpense, deleteExpense, getCategories } from "../../lib/api";
import { Receipt, Plus, Trash2, Search, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function ExpensesPage() {
  const { loading: authLoading } = useRequireAuth("user");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ amount: "", description: "", categoryId: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const [expRes, catRes] = await Promise.all([getMyExpenses(), getCategories()]);
      setExpenses(expRes.data.expenses || []);
      setTotal(expRes.data.total || 0);
      setCategories(catRes.data || []);
    } catch {
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading]);

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a valid positive amount";
    if (!form.categoryId) e.categoryId = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createExpense({ amount: Number(form.amount), description: form.description, categoryId: Number(form.categoryId) });
      toast.success("Expense added successfully!");
      setIsModalOpen(false);
      setForm({ amount: "", description: "", categoryId: "" });
      setErrors({});
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("category")) toast.error("Selected category not found.");
      else if (msg.toLowerCase().includes("budget")) toast.error("Budget exceeded! An alert has been sent.");
      else toast.error("Failed to add expense. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    setDeleting(id);
    try {
      await deleteExpense(id);
      toast.success("Expense deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete expense.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = expenses.filter((e) =>
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) return <><Navbar /><LoadingSpinner message="Loading expenses..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
            <p className="text-slate-400 text-sm mt-1">
              Total spent: <span className="font-semibold text-slate-700">৳{Number(total).toFixed(2)}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{expenses.length} transactions</span>
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
            <Plus size={16} />Add Expense
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by description or category..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm input-focus bg-white"
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-100">
          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {/* Table Header */}
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <span className="col-span-5">Description</span>
                <span className="col-span-3">Category</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-1 text-right">Amount</span>
                <span className="col-span-1"></span>
              </div>
              {filtered.map((exp, i) => (
                <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Receipt size={14} className="text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 truncate">{exp.description || "—"}</span>
                  </div>
                  <div className="col-span-3">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {exp.category?.name || "—"}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs text-slate-400">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 text-right font-semibold text-slate-900 text-sm">
                    ৳{Number(exp.amount).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => handleDelete(exp.id)} disabled={deleting === exp.id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                      {deleting === exp.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title={search ? "No results found" : "No expenses yet"}
              description={search ? "Try a different search term." : "Add your first expense to start tracking your spending."}
              action={!search && (
                <button onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
                  <Plus size={15} />Add Expense
                </button>
              )}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setErrors({}); setForm({ amount: "", description: "", categoryId: "" }); }} title="Add New Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (৳)</label>
            <input type="number" step="0.01" placeholder="0.00" value={form.amount}
              onChange={(e) => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: "" }); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.amount ? "border-red-300 bg-red-50" : "border-slate-200"}`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1.5">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select value={form.categoryId}
              onChange={(e) => { setForm({ ...form, categoryId: e.target.value }); if (errors.categoryId) setErrors({ ...errors, categoryId: "" }); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.categoryId ? "border-red-300 bg-red-50" : "border-slate-200"}`}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name} {cat.isPersonal ? "(Personal)" : "(Global)"}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1.5">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400">(optional)</span></label>
            <input type="text" placeholder="e.g. Lunch at restaurant" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm input-focus"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsModalOpen(false); setErrors({}); }}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader size={15} className="animate-spin" />Adding...</> : "Add Expense"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}