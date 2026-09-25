"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

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
