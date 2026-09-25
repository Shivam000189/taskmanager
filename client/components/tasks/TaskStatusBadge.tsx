import React from "react";

export type TaskBadgeStatus = "pending" | "completed" | "progress" | "review";

interface TaskStatusBadgeProps {
  status: "pending" | "completed" | string;
  className?: string;
  showDot?: boolean;
}

export function TaskStatusBadge({
  status,
  className = "",
  showDot = true,
}: TaskStatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; dot: string }
  > = {
    pending: {
      label: "Pending",
      bg: "bg-[var(--status-todo-bg)]",
      text: "text-[var(--status-todo-text)]",
      dot: "bg-[var(--status-todo-text)]",
    },
    completed: {
      label: "Completed",
      bg: "bg-[var(--status-done-bg)]",
      text: "text-[var(--status-done-text)]",
      dot: "bg-[var(--status-done-text)]",
    },
    progress: {
      label: "In Progress",
      bg: "bg-[var(--status-progress-bg)]",
      text: "text-[var(--status-progress-text)]",
      dot: "bg-[var(--status-progress-text)]",
    },
    review: {
      label: "In Review",
      bg: "bg-[var(--status-review-bg)]",
      text: "text-[var(--status-review-text)]",
      dot: "bg-[var(--status-review-text)]",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight transition-colors ${config.bg} ${config.text} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
