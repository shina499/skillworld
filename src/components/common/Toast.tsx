import React, { useEffect } from 'react';
import { Sparkles, Award, CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'xp' | 'level' | 'achievement' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-stone-900/95 text-white p-4 rounded-2xl shadow-xl border border-stone-700/80 backdrop-blur flex items-start gap-3 animate-slide-in"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'achievement' ? (
              <Award className="w-5 h-5 text-amber-400" />
            ) : toast.type === 'level' ? (
              <Sparkles className="w-5 h-5 text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-sm text-stone-100">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-stone-300 mt-0.5 leading-snug">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
