"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../hooks/useAuth";
import { getMyBudgets, createBudget, updateBudget, getCategories } from "../../lib/api";
import { Wallet, Plus, Pencil, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function BudgetsPage() {
  const { loading: authLoading } = useRequireAuth("user");
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [form, setForm] = useState({ limitAmount: "", categoryId: "" });
  const [editForm, setEditForm] = useState({ limitAmount: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [budgetRes, catRes] = await Promise.all([getMyBudgets(), getCategories()]);
      setBudgets(budgetRes.data || []);
      setCategories(catRes.data || []);
    } catch {
      toast.error("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.limitAmount || Number(form.limitAmount) <= 0) errs.limitAmount = "Enter a valid amount";
    if (!form.categoryId) errs.categoryId = "Select a category";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await createBudget({ limitAmount: Number(form.limitAmount), categoryId: Number(form.categoryId) });
      toast.success("Budget created successfully!");
      setIsCreateOpen(false);
      setForm({ limitAmount: "", categoryId: "" });
      setErrors({});
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) toast.error("You already have a budget for this category. Edit it instead.");
      else toast.error("Failed to create budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.limitAmount || Number(editForm.limitAmount) <= 0) {
      setErrors({ limitAmount: "Enter a valid amount" });
      return;
    }
    setSubmitting(true);
    try {
      await updateBudget(selectedBudget.id, { limitAmount: Number(editForm.limitAmount) });
      toast.success("Budget updated successfully!");
      setIsEditOpen(false);
      setSelectedBudget(null);
      setErrors({});
      fetchData();
    } catch {
      toast.error("Failed to update budget.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <><Navbar /><LoadingSpinner message="Loading budgets..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Budgets</h1>
            <p className="text-slate-400 text-sm mt-1">{budgets.length} active budget{budgets.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
            <Plus size={16} />Add Budget
          </button>
        </div>

        {/* Budget Cards */}
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((budget, i) => {
              const limit = Number(budget.limitAmount);
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Wallet size={15} className="text-violet-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{budget.category?.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 ml-10">
                        {budget.category?.isPersonal ? "Personal category" : "Global category"}
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedBudget(budget); setEditForm({ limitAmount: budget.limitAmount }); setIsEditOpen(true); }}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
                      <Pencil size={13} />Edit
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Limit</span>
                      <span className="font-semibold text-slate-900">৳{limit.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Set on {new Date(budget.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100">
            <EmptyState
              icon={Wallet}
              title="No budgets set"
              description="Create budgets for your expense categories to track spending limits and get alerts."
              action={
                <button onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
                  <Plus size={15} />Create Budget
                </button>
              }
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setErrors({}); setForm({ limitAmount: "", categoryId: "" }); }} title="Create Budget">
        <form onSubmit={handleCreate} className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Budget Limit (৳)</label>
            <input type="number" step="0.01" placeholder="0.00" value={form.limitAmount}
              onChange={(e) => { setForm({ ...form, limitAmount: e.target.value }); if (errors.limitAmount) setErrors({ ...errors, limitAmount: "" }); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.limitAmount ? "border-red-300 bg-red-50" : "border-slate-200"}`}
            />
            {errors.limitAmount && <p className="text-red-500 text-xs mt-1.5">{errors.limitAmount}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsCreateOpen(false); setErrors({}); }}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader size={15} className="animate-spin" />Creating...</> : "Create Budget"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setErrors({}); }} title={`Edit Budget — ${selectedBudget?.category?.name}`}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Budget Limit (৳)</label>
            <input type="number" step="0.01" placeholder="0.00" value={editForm.limitAmount}
              onChange={(e) => { setEditForm({ limitAmount: e.target.value }); if (errors.limitAmount) setErrors({}); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${errors.limitAmount ? "border-red-300 bg-red-50" : "border-slate-200"}`}
            />
            {errors.limitAmount && <p className="text-red-500 text-xs mt-1.5">{errors.limitAmount}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsEditOpen(false); setErrors({}); }}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader size={15} className="animate-spin" />Updating...</> : "Update Budget"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}