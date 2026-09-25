"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/api/users";
import { CurrentUserResponse } from "@/lib/types";

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (currentToken?: string) => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setProfile(userData);
      }
    } catch {
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || "",
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0],
          avatar_url:
            user.user_metadata?.avatar_url || user.user_metadata?.picture,
        });
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            setProfile({
              id: initialSession.user.id,
              email: initialSession.user.email || "",
              name:
                initialSession.user.user_metadata?.full_name ||
                initialSession.user.user_metadata?.name ||
                initialSession.user.email?.split("@")[0],
              avatar_url:
                initialSession.user.user_metadata?.avatar_url ||
                initialSession.user.user_metadata?.picture,
            });
            fetchProfile();
          }
        }
      } catch (err) {
        console.error("Failed to retrieve Supabase session:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        setProfile({
          id: newSession.user.id,
          email: newSession.user.email || "",
          name:
            newSession.user.user_metadata?.full_name ||
            newSession.user.user_metadata?.name ||
            newSession.user.email?.split("@")[0],
          avatar_url:
            newSession.user.user_metadata?.avatar_url ||
            newSession.user.user_metadata?.picture,
        });
        fetchProfile();
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      router.push("/login");
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
