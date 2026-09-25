import React from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-tight";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover active:opacity-95 shadow-none",
    secondary:
      "bg-accent-dark text-white hover:bg-accent-dark-hover active:opacity-95 shadow-none",
    outline:
      "border border-border bg-surface text-foreground hover:bg-background/80 active:bg-background shadow-none",
    danger:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:opacity-95 shadow-none",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-border/40 active:bg-border/60 shadow-none",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            size="sm"
            className={
              variant === "primary" || variant === "secondary" || variant === "danger"
                ? "text-white"
                : "text-primary"
            }
          />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
}
