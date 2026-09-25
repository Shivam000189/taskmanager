import { apiClient } from "./client";
import {
  Comment,
  CommentsResponse,
  CommentResponse,
  MessageResponse,
} from "@/lib/types";

export async function getComments(taskId: string): Promise<Comment[]> {
  const data = await apiClient<CommentsResponse>(`/api/tasks/${taskId}/comments`, {
    method: "GET",
  });
  return data.comments || [];
}

export async function createComment(
  taskId: string,
  content: string
): Promise<Comment> {
  const data = await apiClient<CommentResponse>(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    body: { content },
  });
  return data.comment;
}

export async function deleteComment(
  taskId: string,
  commentId: string
): Promise<void> {
  await apiClient<MessageResponse>(
    `/api/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
}
