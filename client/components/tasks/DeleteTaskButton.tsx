"use client";

import React, { useState } from "react";
import { deleteTask } from "@/lib/api/tasks";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface DeleteTaskButtonProps {
  task: Task;
  currentUserId?: string | null;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  className?: string;
}

export function DeleteTaskButton({
  task,
  currentUserId,
  onSuccess,
  onError,
  className = "",
}: DeleteTaskButtonProps) {
  const [loading, setLoading] = useState(false);

  const isCreator = currentUserId && task.created_by === currentUserId;
  if (!isCreator) {
    return null;
  }

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteTask(task.id);
      onSuccess?.();
    } catch (err: any) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      isLoading={loading}
      onClick={handleDelete}
      className={className}
      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
    >
      Delete
    </Button>
  );
}
