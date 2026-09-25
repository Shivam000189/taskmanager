"use client";

import React, { useState, useEffect, useRef } from "react";
import { searchUsers } from "@/lib/api/users";
import { Profile } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";
import { Search, User, X, Check } from "lucide-react";

interface AssigneePickerProps {
  value: string | null;
  onChange: (userId: string | null, profile?: Profile | null) => void;
  initialProfile?: Profile | null;
  label?: string;
  error?: string;
  className?: string;
}

export function AssigneePicker({
  value,
  onChange,
  initialProfile,
  label = "Assignee",
  error,
  className = "",
}: AssigneePickerProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(
    initialProfile || null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile && initialProfile.id === value) {
      setSelectedProfile(initialProfile);
    } else if (!value) {
      setSelectedProfile(null);
    }
  }, [value, initialProfile]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(query.trim());
        setUsers(results);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: Profile) => {
    setSelectedProfile(user);
    onChange(user.id, user);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProfile(null);
    onChange(null, null);
    setQuery("");
    inputRef.current?.focus();
  };

  const displayName = selectedProfile?.full_name || selectedProfile?.email?.split("@")[0];
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </label>
      )}

      {selectedProfile ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2">
          <div className="flex items-center gap-2.5">
            {selectedProfile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedProfile.avatar_url}
                alt={displayName || "User"}
                className="h-7 w-7 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {selectedProfile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setQuery("");
              }}
              className="text-xs font-semibold text-primary hover:text-primary-hover px-2.5 py-1 rounded-full hover:bg-background transition-colors cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-background transition-colors cursor-pointer"
              title="Remove assignee"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search by name or email (or leave unassigned)..."
            className={`w-full rounded-xl border bg-surface pl-10 pr-10 py-2.5 text-sm text-foreground transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              error ? "border-[#DC2626] focus:border-[#DC2626]" : "border-border focus:border-primary"
            }`}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-[#DC2626] font-medium">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-2xl border border-border bg-surface py-1.5 shadow-lg shadow-black/5">
          <button
            type="button"
            onClick={() => {
              onChange(null, null);
              setSelectedProfile(null);
              setIsOpen(false);
              setQuery("");
            }}
            className="flex w-full items-center justify-between px-4 py-2 text-left text-xs font-semibold text-muted-foreground hover:bg-background transition-colors cursor-pointer"
          >
            <span>Leave unassigned</span>
            {!value && <Check className="h-4 w-4 text-primary" />}
          </button>

          <div className="border-t border-border my-1" />

          {loading ? (
            <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
              <Spinner size="sm" className="mr-2" /> Searching users...
            </div>
          ) : users.length > 0 ? (
            users.map((u) => {
              const isSelected = value === u.id;
              const uName = u.full_name || u.email.split("@")[0];
              const uInitials = uName
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U";

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelect(u)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-background cursor-pointer ${
                    isSelected ? "bg-background" : ""
                  }`}
                >
                  {u.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.avatar_url}
                      alt={uName}
                      className="h-7 w-7 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary border border-border text-xs font-bold">
                      {uInitials}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate">
                      {uName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {u.email}
                    </p>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center text-xs text-muted-foreground">
              {query ? `No users found matching "${query}"` : "Start typing to search team"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
