"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getTask, updateTask } from "@/lib/api/tasks";
import { searchUsers } from "@/lib/api/users";
import { Task, Profile } from "@/lib/types";
import { Navbar } from "@/components/layout/Navbar";
import { TaskForm, TaskFormData } from "@/components/tasks/TaskForm";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ArrowLeft } from "lucide-react";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const { session, user, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [assigneeProfile, setAssigneeProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !taskId) return;

    let mounted = true;
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await getTask(taskId);
        if (!mounted) return;

        // Verify creator permission - creator only
        if (user && taskData.created_by !== user.id) {
          router.replace(`/tasks/${taskId}`);
          return;
        }

        setTask(taskData);

        if (taskData.assigned_to) {
          try {
            const users = await searchUsers("");
            if (mounted) {
              const assignee = users.find((u) => u.id === taskData.assigned_to);
              if (assignee) setAssigneeProfile(assignee);
            }
          } catch {
            // Ignore assignee fetch failure
          }
        }
      } catch (err: any) {
        if (mounted) {
          setErrorMessage(err.message || "Failed to load task for editing.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTask();

    return () => {
      mounted = false;
    };
  }, [session, taskId, user, router]);

  const handleUpdate = async (formData: TaskFormData) => {
    await updateTask(taskId, {
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      assigned_to: formData.assigned_to,
    });

    router.push(`/tasks/${taskId}`);
  };

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

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <Link
            href={`/tasks/${taskId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Task
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Edit task
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Update task details, schedule, or team assignment
          </p>
        </div>

        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          className="mb-6"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loading task details...
            </p>
          </div>
        ) : task ? (
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-none">
            <TaskForm
              initialData={{
                title: task.title,
                description: task.description,
                due_date: task.due_date,
                assigned_to: task.assigned_to,
              }}
              initialAssignee={assigneeProfile}
              onSubmit={handleUpdate}
              onCancel={() => router.push(`/tasks/${taskId}`)}
              submitLabel="Save changes"
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
