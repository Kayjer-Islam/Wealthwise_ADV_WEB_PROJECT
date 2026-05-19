"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../hooks/useAuth";
import { getCategories, createPersonalCategory } from "../../lib/api";
import { Tag, Plus, Globe, User, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { loading: authLoading } = useRequireAuth("user");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
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
      await createPersonalCategory({ name: form.name.trim() });
      toast.success(`Personal category "${form.name}" created!`);
      setIsModalOpen(false);
      setForm({ name: "" });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) toast.error("You already have a category with this name.");
      else toast.error("Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const globalCats = categories.filter((c) => !c.isPersonal);
  const personalCats = categories.filter((c) => c.isPersonal);

  if (authLoading || loading) return <><Navbar /><LoadingSpinner message="Loading categories..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-400 text-sm mt-1">{globalCats.length} global · {personalCats.length} personal</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
            <Plus size={16} />Add Personal
          </button>
        </div>

        {/* Global Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Global Categories</h2>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{globalCats.length}</span>
          </div>
          {globalCats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {globalCats.map((cat, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 hover-lift cursor-default">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <Tag size={14} className="text-blue-500" />
                  </div>
                  <p className="font-medium text-slate-800 text-sm">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">by Admin</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-300 text-sm">
              No global categories yet. Ask your admin to create some.
            </div>
          )}
        </div>

        {/* Personal Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">My Personal Categories</h2>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{personalCats.length}</span>
          </div>
          {personalCats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {personalCats.map((cat, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 hover-lift cursor-default">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                    <Tag size={14} className="text-emerald-500" />
                  </div>
                  <p className="font-medium text-slate-800 text-sm">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Personal</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100">
              <EmptyState
                icon={Tag}
                title="No personal categories"
                description="Create your own custom categories for expenses that don't fit global ones."
                action={
                  <button onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all btn-press">
                    <Plus size={15} />Create Personal Category
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setError(""); setForm({ name: "" }); }} title="Create Personal Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
            <input type="text" placeholder="e.g. My Savings, Side Income..." value={form.name}
              onChange={(e) => { setForm({ name: e.target.value }); if (error) setError(""); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm input-focus ${error ? "border-red-300 bg-red-50" : "border-slate-200"}`}
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>
          <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
            Personal categories are only visible to you and can be used for your expenses.
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