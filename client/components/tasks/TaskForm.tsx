"use client";

import React, { useState } from "react";
import { Profile } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AssigneePicker } from "./AssigneePicker";
import { Save, X } from "lucide-react";

export interface TaskFormData {
  title: string;
  description?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  initialAssignee?: Profile | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initialData,
  initialAssignee,
  onSubmit,
  onCancel,
  submitLabel = "Save Task",
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const initialDateStr = initialData?.due_date
    ? new Date(initialData.due_date).toISOString().split("T")[0]
    : "";
  const [dueDate, setDueDate] = useState(initialDateStr);
  const [assignedTo, setAssignedTo] = useState<string | null>(
    initialData?.assigned_to ?? null
  );
  const [assigneeProfile, setAssigneeProfile] = useState<Profile | null>(
    initialAssignee ?? null
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFieldErrors({ title: "Title is required" });
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() ? description.trim() : null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        assigned_to: assignedTo || null,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage
        message={errorMessage}
        onDismiss={() => setErrorMessage(null)}
      />

      <Input
        label="Task Title"
        required
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (fieldErrors.title) setFieldErrors({});
        }}
        placeholder="e.g., Update analytics dashboard"
        error={fieldErrors.title}
        disabled={loading}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add background context, milestones, or notes..."
          disabled={loading}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-background disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="due_date"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
          >
            Due Date (Optional)
          </label>
          <input
            id="due_date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-background disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <AssigneePicker
            value={assignedTo}
            initialProfile={assigneeProfile}
            onChange={(newUserId, newProfile) => {
              setAssignedTo(newUserId);
              setAssigneeProfile(newProfile || null);
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
