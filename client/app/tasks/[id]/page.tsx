"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getTask } from "@/lib/api/tasks";
import { searchUsers } from "@/lib/api/users";
import { Task, Profile } from "@/lib/types";
import { Navbar } from "@/components/layout/Navbar";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { CompleteTaskButton } from "@/components/tasks/CompleteTaskButton";
import { DeleteTaskButton } from "@/components/tasks/DeleteTaskButton";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  User,
} from "lucide-react";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const { session, user, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [assigneeProfile, setAssigneeProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !taskId) return;

    let mounted = true;
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const taskData = await getTask(taskId);
        if (!mounted) return;
        setTask(taskData);

        try {
          const users = await searchUsers("");
          if (mounted) {
            const creator = users.find((u) => u.id === taskData.created_by);
            const assignee = users.find((u) => u.id === taskData.assigned_to);
            if (creator) setCreatorProfile(creator);
            if (assignee) setAssigneeProfile(assignee);
          }
        } catch {
        }
      } catch (err: any) {
        if (mounted) {
          setErrorMessage(err.message || "Failed to load task details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTaskDetails();

    return () => {
      mounted = false;
    };
  }, [session, taskId]);

  if (authLoading || (!session && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  const isCreator = user && task && task.created_by === user.id;

  const formattedDueDate = task?.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isOverdue =
    task?.due_date &&
    task.status === "pending" &&
    new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const formattedCreatedAt = task?.created_at
    ? new Date(task.created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const formattedUpdatedAt = task?.updated_at
    ? new Date(task.updated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const assigneeName = assigneeProfile?.full_name || assigneeProfile?.email?.split("@")[0];
  const assigneeInitials = assigneeName
    ? assigneeName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const creatorName = isCreator
    ? "You"
    : creatorProfile?.full_name || creatorProfile?.email?.split("@")[0] || "Workspace Member";
  const creatorInitials = creatorName
    ? creatorName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          className="mb-6"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="lg" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loading task details...
            </p>
          </div>
        ) : task ? (
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <TaskStatusBadge status={task.status} />
                  {isOverdue && (
                    <span className="text-xs font-bold text-[#DC2626]">
                      Overdue
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {task.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CompleteTaskButton
                  task={task}
                  currentUserId={user?.id}
                  onSuccess={(updated) => setTask(updated)}
                  onError={(err) => setErrorMessage(err.message)}
                />

                {isCreator && (
                  <>
                    <Link href={`/tasks/${task.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit className="h-3.5 w-3.5" />}
                      >
                        Edit
                      </Button>
                    </Link>

                    <DeleteTaskButton
                      task={task}
                      currentUserId={user?.id}
                      onSuccess={() => router.push("/tasks")}
                      onError={(err) => setErrorMessage(err.message)}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Description
              </h3>
              {task.description ? (
                <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              ) : (
                <p className="text-xs italic text-muted-foreground/60">
                  No description provided for this task.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 text-sm">
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Assigned To
                </h4>
                {task.assigned_to ? (
                  <div className="flex items-center gap-3">
                    {assigneeProfile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={assigneeProfile.avatar_url}
                        alt={assigneeName || "Assignee"}
                        className="h-8 w-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-xs font-bold">
                        {assigneeInitials}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {assigneeProfile?.full_name || "Assigned User"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {assigneeProfile?.email || task.assigned_to}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Unassigned</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-background/50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Created By
                </h4>
                <div className="flex items-center gap-3">
                  {creatorProfile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={creatorProfile.avatar_url}
                      alt={creatorName}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-dark/10 text-accent-dark border border-border text-xs font-bold">
                      {creatorInitials}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {creatorName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {creatorProfile?.email || task.created_by}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-1">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Due Date
                  </h4>
                  <p
                    suppressHydrationWarning
                    className={`mt-0.5 text-xs font-semibold ${isOverdue ? "text-[#DC2626]" : "text-foreground"}`}
                  >
                    {formattedDueDate || "No deadline specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-1">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Activity History
                  </h4>
                  <p suppressHydrationWarning className="mt-0.5 text-xs text-muted-foreground">
                    Created {formattedCreatedAt}
                  </p>
                  {formattedUpdatedAt && formattedUpdatedAt !== formattedCreatedAt && (
                    <p suppressHydrationWarning className="text-xs text-muted-foreground/75">
                      Updated {formattedUpdatedAt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
