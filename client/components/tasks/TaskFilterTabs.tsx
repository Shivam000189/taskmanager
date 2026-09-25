import React from "react";
import { TaskFilterScope } from "@/lib/types";

interface TaskFilterTabsProps {
  currentScope: TaskFilterScope;
  onChange: (scope: TaskFilterScope) => void;
  counts?: {
    all?: number;
    created?: number;
    assigned?: number;
  };
}

export function TaskFilterTabs({
  currentScope,
  onChange,
  counts,
}: TaskFilterTabsProps) {
  const tabs: { id: TaskFilterScope; label: string; count?: number }[] = [
    { id: "all", label: "All Tasks", count: counts?.all },
    { id: "created", label: "Created by me", count: counts?.created },
    { id: "assigned", label: "Assigned to me", count: counts?.assigned },
  ];

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-surface border border-border">
      {tabs.map((tab) => {
        const isActive = currentScope === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-1.5 px-3.5 sm:px-4 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-white shadow-none"
                : "text-muted-foreground hover:text-foreground hover:bg-background/70"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground border border-border/80"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
