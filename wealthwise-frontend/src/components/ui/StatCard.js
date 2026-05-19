export default function StatCard({ title, value, subtitle, icon: Icon, color = "bg-slate-900" }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`${color} text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
          <Icon size={18} />
        </div>
      </div>
      {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
    </div>
  );
}