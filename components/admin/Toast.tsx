"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-lg px-5 py-3 text-sm font-medium shadow-card animate-in slide-in-from-bottom-4 fade-in",
        type === "success" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
        type === "error" && "bg-red-50 text-red-800 border border-red-200",
        type === "info" && "bg-blue-50 text-blue-800 border border-blue-200"
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type });
    },
    []
  );

  const ToastElement = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, ToastElement };
}
