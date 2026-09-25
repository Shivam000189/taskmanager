"use client";

import React from "react";
import Link from "next/link";
import { Task, Profile } from "@/lib/types";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { CompleteTaskButton } from "./CompleteTaskButton";
import { Calendar, User, ArrowUpRight } from "lucide-react";

interface TaskCardProps {
  task: Task;
  currentUserId?: string | null;
  assignee?: Profile | null;
  onTaskUpdated?: (updated: Task) => void;
}

export function TaskCard({
  task,
  currentUserId,
  assignee,
  onTaskUpdated,
}: TaskCardProps) {
  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isOverdue =
    task.due_date &&
    task.status === "pending" &&
    new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const assigneeName = assignee?.full_name || assignee?.email?.split("@")[0];
  const assigneeInitials = assigneeName
    ? assigneeName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all duration-150 hover:border-foreground/20 hover:shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <TaskStatusBadge status={task.status} />
          
          <Link
            href={`/tasks/${task.id}`}
            className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 rounded-full hover:bg-background"
            title="View details"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          href={`/tasks/${task.id}`}
          className="block text-base font-bold text-foreground hover:text-primary transition-colors tracking-tight line-clamp-2 mb-2"
        >
          {task.title}
        </Link>

        {task.description ? (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <div className="mb-4" />
        )}
      </div>

      <div className="pt-3 border-t border-border mt-auto flex items-center justify-between gap-3 text-xs">
        {formattedDueDate ? (
          <div
            suppressHydrationWarning
            className={`flex items-center gap-1.5 ${
              isOverdue
                ? "text-[#DC2626] font-semibold"
                : "text-muted-foreground"
            }`}
            title={isOverdue ? "Overdue" : "Due date"}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">{formattedDueDate}</span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground/60">No deadline</span>
        )}

        <div className="flex items-center gap-2">
          {task.status === "pending" && (
            <CompleteTaskButton
              task={task}
              currentUserId={currentUserId}
              onSuccess={onTaskUpdated}
            />
          )}

          <div className="flex items-center gap-1.5" title={assignee?.email || (task.assigned_to ? "Assigned" : "Unassigned")}>
            {assignee?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={assignee.avatar_url}
                alt={assigneeName || "Assignee"}
                className="h-6 w-6 rounded-full border border-border object-cover"
              />
            ) : task.assigned_to ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-[10px] font-bold">
                {assigneeInitials}
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground/60">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
