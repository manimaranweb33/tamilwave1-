"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect } from "react";

export function AdminToast({
  message,
  type = "success",
  onClose
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[110] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl ${
        type === "success" ? "border-wave/40 bg-panel text-zinc-100" : "border-red-800 bg-panel text-red-100"
      }`}
      role="status"
    >
      {type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-wave" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-200" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
