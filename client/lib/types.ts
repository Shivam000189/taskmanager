export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
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

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: Profile | null;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface CommentResponse {
  comment: Comment;
}
