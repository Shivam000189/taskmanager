"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const authError =
          params.get("error_description") ||
          hashParams.get("error_description") ||
          params.get("error") ||
          hashParams.get("error");

        if (authError) {
          throw new Error(decodeURIComponent(authError));
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          if (mounted) router.replace("/tasks");
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession && mounted) {
            subscription.unsubscribe();
            router.replace("/tasks");
          }
        });

        setTimeout(() => {
          if (mounted) {
            subscription.unsubscribe();
            supabase.auth.getSession().then(({ data: { session: s } }) => {
              if (s) {
                router.replace("/tasks");
              } else {
                setError("Authentication timed out. Please try logging in again.");
              }
            });
          }
        }, 5000);
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to complete authentication.");
        }
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-surface p-8 text-center shadow-none">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Authentication Error
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            {error}
          </p>
          <div className="mt-6">
            <Link href="/login">
              <Button variant="primary">Return to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Spinner size="lg" />
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Completing sign in...
        </h2>
        <p className="text-xs text-muted-foreground">
          Setting up your workspace session. Redirecting to your dashboard shortly.
        </p>
      </div>
    </div>
  );
}
