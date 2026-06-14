import { createClient } from "@supabase/supabase-js";
import { getServerConfig } from "../config.server";

const url = "https://soeoluptfhyaopjuqbjr.supabase.co";

export function getSupabaseClient() {
  const config = getServerConfig();
  const serviceRoleKey = config.supabaseServiceRoleKey;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getBrowserSupabaseClient() {
  const anonPublic =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZW9sdXB0Zmh5YW9wanVxYmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzQzNDMsImV4cCI6MjA5Njc1MDM0M30.4vejRopNIWkbwPxx1V2bdMfg91aJ9ysr80rh-J8eA5I";

  return createClient(url, anonPublic);
}
