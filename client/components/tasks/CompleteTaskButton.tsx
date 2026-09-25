"use client";

import React, { useState } from "react";
import { completeTask } from "@/lib/api/tasks";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

interface CompleteTaskButtonProps {
  task: Task;
  currentUserId?: string | null;
  onSuccess?: (updatedTask: Task) => void;
  onError?: (err: Error) => void;
  className?: string;
}

export function CompleteTaskButton({
  task,
  currentUserId,
  onSuccess,
  onError,
  className = "",
}: CompleteTaskButtonProps) {
  const [loading, setLoading] = useState(false);

  const isCreator = currentUserId && task.created_by === currentUserId;
  const isAssignee = currentUserId && task.assigned_to === currentUserId;
  const canComplete = task.status === "pending" && (isCreator || isAssignee);

  if (!canComplete) {
    return null;
  }

  const handleComplete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      setLoading(true);
      const updated = await completeTask(task.id);
      onSuccess?.(updated);
    } catch (err: any) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="sm"
      isLoading={loading}
      onClick={handleComplete}
      className={className}
      leftIcon={<Check className="h-3.5 w-3.5" />}
    >
      Mark Complete
    </Button>
  );
}
