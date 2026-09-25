export interface Task {
  id: string; // uuid
  title: string;
  description: string | null;
  status: "pending" | "completed";
  due_date: string | null; // ISO date
  created_by: string; // uuid
  assigned_to: string | null; // uuid
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Profile {
  id: string; // uuid
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CurrentUserResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
  };
}

export interface UsersResponse {
  users: Profile[];
}

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface MessageResponse {
  message: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
}

export type TaskFilterScope = "all" | "created" | "assigned";
