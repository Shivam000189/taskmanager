/**
 * Server-side Supabase client helper.
 * In this architecture, all user authentication and Bearer token issuance occurs in the client
 * to communicate directly with the Flask backend. This server utility provides a standard
 * stateless client for any server components or server actions if needed.
 */

import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
