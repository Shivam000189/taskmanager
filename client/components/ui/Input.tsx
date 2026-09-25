import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
          >
            {label}
            {props.required && <span className="text-[#DC2626] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-foreground transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error
              ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20"
              : "border-border focus:border-primary"
          } disabled:bg-background disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-[#DC2626] font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
