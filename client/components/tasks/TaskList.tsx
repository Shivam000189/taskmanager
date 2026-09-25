"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Task, Profile, TaskFilterScope } from "@/lib/types";
import { searchUsers } from "@/lib/api/users";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/Button";
import { Plus, CheckSquare } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  currentScope: TaskFilterScope;
  currentUserId?: string | null;
  onTaskUpdated?: (updated: Task) => void;
}

export function TaskList({
  tasks,
  currentScope,
  currentUserId,
  onTaskUpdated,
}: TaskListProps) {
  const [profilesMap, setProfilesMap] = useState<Record<string, Profile>>({});

  useEffect(() => {
    const assignedIds = Array.from(
      new Set(tasks.map((t) => t.assigned_to).filter(Boolean) as string[])
    );

    const missingIds = assignedIds.filter((id) => !profilesMap[id]);
    if (missingIds.length === 0) return;

    let mounted = true;
    searchUsers("").then((allUsers) => {
      if (!mounted) return;
      const newMap: Record<string, Profile> = {};
      allUsers.forEach((u) => {
        newMap[u.id] = u;
      });
      setProfilesMap((prev) => ({ ...prev, ...newMap }));
    }).catch(() => {
    });

    return () => {
      mounted = false;
    };
  }, [tasks]);

  if (tasks.length === 0) {
    const emptyMessages = {
      all: {
        title: "No tasks yet",
        description: "Organize your workflow by creating your first task.",
        showButton: true,
      },
      created: {
        title: "No tasks created by you",
        description: "You haven't initiated any tasks yet.",
        showButton: true,
      },
      assigned: {
        title: "No tasks assigned to you",
        description: "You're all caught up! No active tasks are assigned to you.",
        showButton: false,
      },
    };

    const empty = emptyMessages[currentScope];

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border text-muted-foreground mb-4">
          <CheckSquare className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {empty.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          {empty.description}
        </p>
        {empty.showButton && (
          <div className="mt-5">
            <Link href="/tasks/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New Task
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          currentUserId={currentUserId}
          assignee={task.assigned_to ? profilesMap[task.assigned_to] : null}
          onTaskUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
}
