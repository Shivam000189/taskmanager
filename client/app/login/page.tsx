"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { CheckSquare } from "lucide-react";

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/tasks");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-none">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white mb-4">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              TaskManager
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize your tasks and stay on top of deadlines
            </p>
          </div>

          <ErrorMessage
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            className="mb-6"
          />

          {/* Primary Action Button */}
          <GoogleSignInButton
            onError={(err) => setErrorMessage(err.message || "Failed to sign in with Google")}
          />
        </div>
      </div>
    </div>
  );
}
