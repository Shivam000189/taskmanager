"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { CheckSquare, LogOut, Plus } from "lucide-react";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const displayAvatar =
    profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Compute initials fallback
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/tasks"
            className="flex items-center gap-2.5 font-bold text-lg text-foreground group tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-105">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <span>TaskManager</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/tasks"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors ${
                pathname === "/tasks"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tasks/new">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Task
            </Button>
          </Link>

          {/* User profile & Sign out */}
          <div className="flex items-center gap-3 pl-2 border-l border-border">
            <div className="flex items-center gap-2.5">
              {displayAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="h-8 w-8 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-xs font-bold">
                  {initials}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-foreground leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                  {user?.email}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              title="Sign out"
              className="text-muted-foreground hover:text-foreground hover:bg-background"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
            >
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
