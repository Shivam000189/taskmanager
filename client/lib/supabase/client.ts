/**
 * Supabase Client Auth Strategy:
 * We use `@supabase/supabase-js`'s built-in browser session persistence (localStorage)
 * rather than cookie-based SSR. 
 * Why: 
 * The task manager backend is a standalone Flask REST API that validates authentication 
 * purely via `Authorization: Bearer <access_token>` headers sent on each request. 
 * Since Next.js does not serve as an intermediate BFF/proxy with its own authenticated session cookie, 
 * browser-side session persistence via localStorage with `autoRefreshToken: true` and 
 * `detectSessionInUrl: true` integrates cleanly with client-side OAuth redirects, 
 * eliminates cookie synchronization overhead between Next.js and Flask, and provides immediate, 
 * reliable access to `session.access_token` across all authenticated client API calls.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, warn if environment variables are not configured
  if (typeof window !== "undefined") {
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
