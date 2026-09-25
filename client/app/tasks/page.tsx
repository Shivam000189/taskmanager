"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getTasks } from "@/lib/api/tasks";
import { Task, TaskFilterScope } from "@/lib/types";
import { Navbar } from "@/components/layout/Navbar";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilterTabs } from "@/components/tasks/TaskFilterTabs";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Plus, RotateCw } from "lucide-react";

export default function TasksPage() {
  const { session, user, loading: authLoading } = useRequireAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scope, setScope] = useState<TaskFilterScope>("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTasks = useCallback(async (currentScope: TaskFilterScope) => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getTasks(currentScope);
      setTasks(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTasks(scope);
    }
  }, [scope, session, fetchTasks]);

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Compute tab counts
  const tabCounts = useMemo(() => {
    if (!user) return undefined;
    return {
      all: scope === "all" ? tasks.length : undefined,
      created: scope === "all" ? tasks.filter((t) => t.created_by === user.id).length : undefined,
      assigned: scope === "all" ? tasks.filter((t) => t.assigned_to === user.id).length : undefined,
    };
  }, [tasks, user, scope]);

  if (authLoading || (!session && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Section header row: Title on left, actions on right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your projects, assignments, and team milestones
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTasks(scope)}
              disabled={loading}
              title="Refresh task list"
              leftIcon={<RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
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
        </div>

        {/* Filter tabs row (segmented control pill) */}
        <div className="mb-8">
          <TaskFilterTabs
            currentScope={scope}
            onChange={(newScope) => setScope(newScope)}
            counts={tabCounts}
          />
        </div>

        {/* Error banner */}
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          className="mb-6"
        />

        {/* Tasks grid / loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="lg" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loading tasks...
            </p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            currentScope={scope}
            currentUserId={user?.id}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </main>
    </div>
  );
}
