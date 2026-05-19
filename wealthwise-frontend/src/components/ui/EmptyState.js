export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-300" />
      </div>
      <h3 className="font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-5 max-w-xs leading-relaxed">{description}</p>
      {action}
    </div>
  );
}