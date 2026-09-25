import { apiClient } from "./client";
import { CurrentUserResponse, Profile, UsersResponse } from "@/lib/types";

export async function getCurrentUser(): Promise<CurrentUserResponse["user"]> {
  const data = await apiClient<CurrentUserResponse>("/api/users/me", {
    method: "GET",
  });
  return data.user;
}

export async function searchUsers(searchQuery: string = ""): Promise<Profile[]> {
  const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const data = await apiClient<UsersResponse>(`/api/users${query}`, {
    method: "GET",
  });
  return data.users || [];
}
