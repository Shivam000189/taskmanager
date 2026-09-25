import { apiClient } from "./client";
import {
  Task,
  TaskResponse,
  TasksResponse,
  MessageResponse,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterScope,
} from "@/lib/types";

/**
 * Fetch tasks filtered by scope ("all" | "created" | "assigned")
 */
export async function getTasks(scope: TaskFilterScope = "all"): Promise<Task[]> {
  const query = scope !== "all" ? `?scope=${encodeURIComponent(scope)}` : "";
  const data = await apiClient<TasksResponse>(`/api/tasks${query}`, {
    method: "GET",
  });
  return data.tasks || [];
}

/**
 * Fetch a single task by ID
 */
export async function getTask(id: string): Promise<Task> {
  const data = await apiClient<TaskResponse>(`/api/tasks/${id}`, {
    method: "GET",
  });
  return data.task;
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const data = await apiClient<TaskResponse>("/api/tasks", {
    method: "POST",
    body: input,
  });
  return data.task;
}

/**
 * Update an existing task (creator only)
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const data = await apiClient<TaskResponse>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: input,
  });
  return data.task;
}

/**
 * Mark a task complete (creator or assignee)
 */
export async function completeTask(id: string): Promise<Task> {
  const data = await apiClient<TaskResponse>(`/api/tasks/${id}/complete`, {
    method: "PATCH",
  });
  return data.task;
}

/**
 * Delete a task (creator only)
 */
export async function deleteTask(id: string): Promise<{ message: string }> {
  return apiClient<MessageResponse>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}
