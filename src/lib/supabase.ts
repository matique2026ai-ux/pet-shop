import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public/anonymous client — used only for operations that RLS permits for the
// anon role (public reads). Never use this for privileged writes.
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Privileged server-only client using the service-role key. This BYPASSES RLS,
// so it must ONLY be used inside API routes that are gated by the
// x-admin-secret check. The key must never be exposed to the browser
// (do NOT prefix it with NEXT_PUBLIC_).
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations cannot run."
    );
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
