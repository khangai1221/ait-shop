  /**
 * Removes backgrounds from ALL product images.
 * Safe to re-run — skips products whose images already have "-nobg-" in the URL.
 * Run with:  node _remove_bg_all.mjs
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

/** Recover real image URLs regardless of how the data was stored / corrupted */
function recoverUrls(raw) {
  if (!raw) return [];

  let arr = Array.isArray(raw) ? raw : null;

  if (!arr && typeof raw === "string") {
    try { arr = JSON.parse(raw); } catch {
      return raw.startsWith("http") ? [raw] : [];
    }
  }

  // Double-encoded string
  if (typeof arr === "string") {
    try { arr = JSON.parse(arr); } catch {
      return arr.startsWith("http") ? [arr] : [];
    }
  }

  if (!Array.isArray(arr)) return [];

  // Char-array corruption: most elements are ≤ 2 chars (individual URL characters)
  const isCharArray =
    arr.length > 20 && arr.filter((c) => c.length <= 2).length > arr.length * 0.8;

  if (isCharArray) {
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
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
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
  const allProducts = await sql`
    SELECT id, name, image_url, image_urls
    FROM products
    ORDER BY id
  `;

  console.log(`Total products: ${allProducts.length}\n`);

  let done = 0, skipped = 0, failed = 0;

  for (const p of allProducts) {
    const urls = recoverUrls(p.image_urls);

    // No images at all
    if (urls.length === 0) {
      console.log(`[${p.id}] ${p.name} — ⚠ no images, skipping`);
      skipped++;
      continue;
    }

    // Already processed — all images have "-nobg-" in the URL
    if (urls.every((u) => u.includes("-nobg-"))) {
      skipped++;
      continue;
    }

    console.log(`[${p.id}] ${p.name}  (${urls.length} images)`);

    const cleanUrls = [];
    for (let i = 0; i < urls.length; i++) {
      // Skip individual images already processed
      if (urls[i].includes("-nobg-")) {
        cleanUrls.push(urls[i]);
        console.log(`    [${i + 1}/${urls.length}] already clean, kept`);
        continue;
      }
      const result = await processImage(urls[i], p.id, `[${i + 1}/${urls.length}]`);
      if (result === null) failed++;
      cleanUrls.push(result ?? urls[i]);
    }

    await sql`
      UPDATE products
      SET image_url  = ${cleanUrls[0]},
          image_urls = ${JSON.stringify(cleanUrls)},
          updated_at = NOW()
      WHERE id = ${p.id}
    `;

    done++;
    console.log(`  ✓ ${p.name} done  [${done}/${allProducts.length - skipped}]\n`);
  }

  console.log(`\n✅ Finished!`);
  console.log(`   Processed : ${done} products`);
  console.log(`   Skipped   : ${skipped} (no images or already clean)`);
  console.log(`   Image ✗   : ${failed} individual images fell back to originals`);

  await sql.end();
})();
