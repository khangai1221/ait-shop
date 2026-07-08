/**
 * Removes backgrounds from images of 6 specific products.
 * Also repairs data corrupted by the first (buggy) run of this script.
 * Run with:  node _remove_bg.mjs
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { removeBackground } from "@imgly/background-removal-node";

const DB_URL = process.env.DATABASE_URL;
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "products";

if (!DB_URL || !SUPABASE_KEY) {
  console.error("Missing DATABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const sql = postgres(DB_URL, { ssl: "require" });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Recover real image URLs regardless of how mangled the stored value is.
 *
 * Known states:
 *  A) '["https://...","https://..."]'  — correct JSON array string → parse once
 *  B) '"[\\"https://...\\"]"'          — double-encoded → parse twice
 *  C) '["[","\"","h","t","t","p",...]' — char-array from buggy run → join + re-parse
 *  D) null / ""                         → []
 */
function recoverUrls(raw) {
  if (!raw) return [];

  // Already a JS array (postgres driver can auto-parse jsonb columns)
  let arr = Array.isArray(raw) ? raw : null;

  if (!arr && typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      // Not JSON at all — treat as single URL
      return raw.startsWith("http") ? [raw] : [];
    }
  }

  // If we still have a string after one parse → double-encoded
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch {
      return arr.startsWith("http") ? [arr] : [];
    }
  }

  if (!Array.isArray(arr)) return [];

  // Detect char-array corruption: most elements are ≤ 2 chars long
  const isCharArray =
    arr.length > 20 && arr.filter((c) => c.length <= 2).length > arr.length * 0.8;

  if (isCharArray) {
    // Join chars back into the original JSON string and re-parse
    const joined = arr.join("");
    try {
      const reparsed = JSON.parse(joined);
      if (Array.isArray(reparsed)) {
        return reparsed.filter((u) => typeof u === "string" && u.startsWith("http"));
      }
    } catch {}
    return [];
  }

  return arr.filter((u) => typeof u === "string" && u.startsWith("http"));
}

async function uploadPng(buffer, productId) {
  const path = `p${productId}-nobg-${Date.now()}.png`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: "image/png", upsert: false });
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl;
}

async function processImage(url, productId, label) {
  process.stdout.write(`    ${label} ... `);
  try {
    const blob = await removeBackground(url);
    const buffer = Buffer.from(await blob.arrayBuffer());
    const cleanUrl = await uploadPng(buffer, productId);
    console.log("✓");
    return cleanUrl;
  } catch (e) {
    console.log(`✗  (${String(e.message).slice(0, 70)})`);
    return null;
  }
}

(async () => {
  const products = await sql`
    SELECT id, name, image_url, image_urls
    FROM products
    WHERE (name ILIKE '%jordan 1 mid se%' AND name ILIKE '%split%')
       OR name ILIKE '%timberloop ek+%'
       OR name ILIKE '%flyknit nsw%'
       OR (name ILIKE '%1906r%' AND name ILIKE '%grey%')
       OR (name ILIKE '%zoom flight%98%')
       OR (name ILIKE '%jordan 10 retro%' AND name ILIKE '%smoke%')
    ORDER BY id
  `;

  if (products.length === 0) {
    console.error("No matching products found — check name fragments.");
    await sql.end();
    process.exit(1);
  }

  console.log(`Found ${products.length} product(s):\n`);

  for (const p of products) {
    const urls = recoverUrls(p.image_urls);

    if (urls.length === 0) {
      console.log(`[${p.id}] ${p.name} — ⚠ no recoverable images, skipping\n`);
      continue;
    }

    console.log(`[${p.id}] ${p.name}`);
    console.log(`  Recovered ${urls.length} image URL(s)`);
    console.log(`  Sample: ${urls[0].slice(0, 80)}...`);

    const cleanUrls = [];
    for (let i = 0; i < urls.length; i++) {
      const result = await processImage(urls[i], p.id, `[${i + 1}/${urls.length}]`);
      cleanUrls.push(result ?? urls[i]); // fall back to original on failure
    }

    await sql`
      UPDATE products
      SET image_url  = ${cleanUrls[0]},
          image_urls = ${JSON.stringify(cleanUrls)},
          updated_at = NOW()
      WHERE id = ${p.id}
    `;

    console.log(`  ✓ saved ${cleanUrls.length} clean image(s)\n`);
  }

  console.log("✅ Done!");
  await sql.end();
})();
