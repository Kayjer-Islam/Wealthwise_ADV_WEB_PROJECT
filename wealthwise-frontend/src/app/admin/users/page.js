"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/layout/AdminNavbar";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useRequireAuth } from "../../../hooks/useAuth";
import { getAllUsers, deleteUser } from "../../../lib/api";
import { Users, Trash2, Search, Loader, Shield, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { loading: authLoading } = useRequireAuth("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This will remove all their data.`)) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      toast.success(`User "${name}" deleted successfully.`);
      fetchData();
    } catch {
      toast.error("Failed to delete user.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) return <><AdminNavbar /><LoadingSpinner message="Loading users..." /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-slate-400 text-sm mt-1">{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm input-focus bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100">
          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-50">
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <span className="col-span-4">Name</span>
                <span className="col-span-4">Email</span>
                <span className="col-span-2">Role</span>
                <span className="col-span-1">Joined</span>
                <span className="col-span-1"></span>
              </div>
              {filtered.map((user, i) => (
                <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-800 truncate">{user.name}</span>
                  </div>
                  <div className="col-span-4 text-sm text-slate-500 truncate">{user.email}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${
                      user.role === "admin" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {user.role === "admin" ? <Shield size={11} /> : <User size={11} />}
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-1 text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {user.role !== "admin" && (
                      <button onClick={() => handleDelete(user.id, user.name)} disabled={deleting === user.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        {deleting === user.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} title={search ? "No users found" : "No users yet"} description={search ? "Try a different search." : "No users have registered yet."} />
          )}
        </div>
      </div>
    </div>
  );
}