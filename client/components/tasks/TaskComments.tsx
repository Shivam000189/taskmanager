"use client";

import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types";
import { getComments, createComment, deleteComment } from "@/lib/api/comments";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { MessageSquare, Send, Trash2, User } from "lucide-react";

interface TaskCommentsProps {
  taskId: string;
  currentUserId?: string | null;
}

export function TaskComments({ taskId, currentUserId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchComments() {
      try {
        setLoading(true);
        setError(null);
        const data = await getComments(taskId);
        if (mounted) {
          setComments(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load comments");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (taskId) {
      fetchComments();
    }

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newContent.trim();
    if (!trimmed || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const created = await createComment(taskId, trimmed);
      setComments((prev) => [...prev, created]);
      setNewContent("");
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = async (commentId: string) => {
    if (deletingId) return;
    try {
      setDeletingId(commentId);
      setError(null);
      await deleteComment(taskId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      setError(err.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6 transition-all">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Comments
          </h3>
          <span className="rounded-full bg-border/60 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {comments.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="md" />
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              No comments yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Start the discussion or leave updates regarding this task.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const author = comment.user;
            const authorName = author?.full_name || author?.email?.split("@")[0] || "Team Member";
            const initials = authorName
              .split(" ")
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase() || "U";
            const isOwner = currentUserId && comment.user_id === currentUserId;

            return (
              <div
                key={comment.id}
                className="group relative flex gap-3.5 rounded-xl border border-border/60 bg-background/50 p-4 transition-all hover:border-border"
              >
                {author?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatar_url}
                    alt={authorName}
                    className="h-8 w-8 rounded-full object-cover border border-border shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-xs font-bold mt-0.5">
                    {initials}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">
                        {authorName}
                      </span>
                      {author?.email && (
                        <span className="text-[11px] text-muted-foreground/60 truncate max-w-[180px]">
                          {author.email}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground/50">
                        • {formatTimestamp(comment.created_at)}
                      </span>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-500 rounded hover:bg-background disabled:opacity-50"
                        title="Delete comment"
                      >
                        {deletingId === comment.id ? (
                          <Spinner size="sm" className="h-3.5 w-3.5" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="rounded-xl border border-border bg-background focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/60 transition-all">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment... (Ctrl+Enter to post)"
            rows={3}
            className="w-full resize-none bg-transparent p-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-border/50 px-3 py-2 bg-surface/50 rounded-b-xl">
            <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">
              Press <kbd className="rounded border border-border px-1 py-0.5 text-[10px] font-mono">Ctrl+Enter</kbd> to submit
            </span>
            <div className="ml-auto">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!newContent.trim() || submitting}
                isLoading={submitting}
                leftIcon={<Send className="h-3 w-3" />}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
