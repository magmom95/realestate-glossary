'use client';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] animate-in"
      style={{ animationDuration: '0.25s' }}
    >
      <div className={`
        flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium
        shadow-[0_8px_32px_rgba(0,0,0,0.5)] border backdrop-blur-sm
        ${type === 'success'
          ? 'bg-[#1c1c1c] border-[rgba(82,183,136,0.3)] text-[#52b788]'
          : 'bg-[#1c1c1c] border-[rgba(224,82,82,0.3)] text-[#e05252]'
        }
      `}>
        <span>{type === 'success' ? '✓' : '✕'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

// Toast 상태 관리 훅
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const show = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}
