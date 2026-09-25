"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { createTask } from "@/lib/api/tasks";
import { Navbar } from "@/components/layout/Navbar";
import { TaskForm, TaskFormData } from "@/components/tasks/TaskForm";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowLeft } from "lucide-react";

export default function NewTaskPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const handleCreateTask = async (data: TaskFormData) => {
    const newTask = await createTask({
      title: data.title,
      description: data.description || null,
      due_date: data.due_date || null,
      assigned_to: data.assigned_to || null,
    });

    router.push(`/tasks/${newTask.id}`);
  };

  if (authLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create task
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Assign work, set deadlines, and notify teammates
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-none">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => router.push("/tasks")}
            submitLabel="Create task"
          />
        </div>
      </main>
    </div>
  );
}
