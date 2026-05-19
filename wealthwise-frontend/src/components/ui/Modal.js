"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}