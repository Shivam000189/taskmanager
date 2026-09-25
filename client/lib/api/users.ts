import { apiClient } from "./client";
import { CurrentUserResponse, Profile, UsersResponse } from "@/lib/types";

/**
 * Fetch the current authenticated user's profile from the Flask backend
 */
export async function getCurrentUser(): Promise<CurrentUserResponse["user"]> {
  const data = await apiClient<CurrentUserResponse>("/api/users/me", {
    method: "GET",
  });
  return data.user;
}

/**
 * Search users by name or email (for assignee picker)
 */
export async function searchUsers(searchQuery: string = ""): Promise<Profile[]> {
  const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const data = await apiClient<UsersResponse>(`/api/users${query}`, {
    method: "GET",
  });
  return data.users || [];
}
