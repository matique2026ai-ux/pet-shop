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
//
// If SUPABASE_SERVICE_ROLE_KEY is not configured we fall back to the anon
// client so the site keeps working, but admin writes then rely solely on RLS
// and are NOT secure against direct anon access. Configure the service-role
// key in Vercel + .env.local to enable the secure path.
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon client. Admin writes are insecure until this key is configured."
      );
    }
    return createClient();
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
