"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * Route guard hook that ensures the user is authenticated.
 * If not authenticated after initial session check, automatically redirects to /login.
 */
export function useRequireAuth() {
  const { session, user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  return {
    session,
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: Boolean(session),
  };
}
