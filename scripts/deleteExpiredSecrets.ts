// This script deletes secrets that are expired or have been viewed (if one-time access)
// Intended to be run as a scheduled job (e.g., with cron or serverless scheduler)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Service Role Key are required");
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteExpiredAndViewedSecrets() {
  // Delete expired secrets
  const now = new Date().toISOString();
  const { error: expiredError } = await supabase
    .from("secrets")
    .delete()
    .or(
      `and(expires_at.lte.${now},expires_at.not.is.null()),and(viewed.eq.true,one_time_access.eq.true)`
    );

  if (expiredError) {
    console.error("Error deleting expired/viewed secrets:", expiredError);
    process.exit(1);
  }
  console.log("Expired and viewed one-time secrets deleted successfully.");
}

deleteExpiredAndViewedSecrets();
