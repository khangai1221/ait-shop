import { createClient } from "@supabase/supabase-js";
import { getServerConfig } from "../config.server";

function getUrl() {
  return process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
}

export function getSupabaseClient() {
  const config = getServerConfig();
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(getUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getBrowserSupabaseClient() {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!anonKey) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY");
  }
  return createClient(getUrl(), anonKey);
}
