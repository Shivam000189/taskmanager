import { supabase } from "@/lib/supabase/client";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

/**
 * Single place that reads the Supabase session and attaches the Authorization header.
 * Every api/*.ts function routes requests through apiClient.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Get current Supabase session access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers || {});

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
    });
  } catch (err: any) {
    throw new ApiError(
      0,
      "Unable to connect to the backend server. Please verify the API is running."
    );
  }

  // Handle empty or 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage: string;
    if (isJson && data && typeof data === "object") {
      errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    } else {
      errorMessage =
        response.status === 401
          ? "You must be signed in to perform this action."
          : response.status === 403
          ? "You do not have permission to access or modify this resource."
          : response.status === 404
          ? "The requested resource was not found."
          : `Server error (${response.status})`;
    }
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}
