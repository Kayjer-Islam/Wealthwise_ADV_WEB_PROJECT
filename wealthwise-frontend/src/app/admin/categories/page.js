"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/layout/AdminNavbar";
import Modal from "../../../components/ui/Modal";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../../hooks/useAuth";
import { getCategories, createGlobalCategory } from "../../../lib/api";
import { Tag, Plus, Globe, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const { loading: authLoading } = useRequireAuth("admin");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data?.filter((c) => !c.isPersonal) || []);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Category name is required"); return; }
    if (form.name.trim().length < 2) { setError("Name must be at least 2 characters"); return; }
    setError("");
    setSubmitting(true);
    try {
      await createGlobalCategory({ name: form.name.trim() });
      toast.success(`Global category "${form.name}" created successfully!`);
      setIsModalOpen(false);
      setForm({ name: "" });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) toast.error("A category with this name already exists.");
      else toast.error("Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <><AdminNavbar /><LoadingSpinner message="Loading categories..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Global Categories</h1>
            <p className="text-slate-400 text-sm mt-1">{categories.length} categories available to all users</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all btn-press">
            <Plus size={16} />New Category
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3">
          <Globe size={16} className="text-blue-500 shrink-0" />
          <p className="text-blue-700 text-sm">Global categories are visible to all users and cannot be created by regular users.</p>
        </div>

        {/* Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover-lift cursor-default">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                  <Tag size={16} className="text-white" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Created {new Date(cat.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100">
            <EmptyState
              icon={Tag}
              title="No global categories"
              description="Create categories that all users can use for their expenses."
              action={
                <button onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
                  <Plus size={15} />Create First Category
                </button>
              }
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setError(""); setForm({ name: "" }); }} title="Create Global Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
            <input type="text" placeholder="e.g. Food, Rent, Transport..." value={form.name}
              onChange={(e) => { setForm({ name: e.target.value }); if (error) setError(""); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${error ? "border-red-300 bg-red-50" : "border-slate-200"}`}
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>
          <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
            This category will be visible to all registered users immediately.
          </p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsModalOpen(false); setError(""); }}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader size={15} className="animate-spin" />Creating...</> : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}