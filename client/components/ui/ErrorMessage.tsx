import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onDismiss,
  className = "",
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-red-200 bg-[#FEF2F2] p-4 text-sm text-[#991B1B] ${className}`}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626] mt-0.5" />
      <div className="flex-1 font-medium">{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer rounded-full"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
