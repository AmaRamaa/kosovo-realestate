'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextType { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

let listeners: ((toast: Toast) => void)[] = [];

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2);
  listeners.forEach(l => l({ id, message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useState(() => {
    const listener = (t: Toast) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000);
    };
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  });

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'bg-secondary-50 text-secondary-800 border-secondary-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-primary-50 text-primary-800 border-primary-200',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn('flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-up', colors[t.type])}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
