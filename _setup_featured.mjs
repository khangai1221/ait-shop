/**
 * Run once with:  node _setup_featured.mjs
 *
 * What it does:
 *  1. Adds `featured BOOLEAN NOT NULL DEFAULT TRUE` column to products (idempotent)
 *  2. Sets featured = FALSE for any product that only has 1 image and no imageUrls
 *     (those probably have a busy background / aren't proper product shots)
 *  3. For every product with fewer than 3 images it searches DuckDuckGo for
 *     additional angle shots, downloads them, uploads to Supabase, and updates the DB.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "products";

if (!DB_URL || !SUPABASE_KEY) {
  console.error("Missing DATABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const sql = postgres(DB_URL, { ssl: "require" });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Step 1: Add column ────────────────────────────────────────────────────────
async function addColumn() {
  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT TRUE
  `;
  console.log("✓ featured column ready");
}

// ── Step 2: Mark products without proper images as not featured ──────────────
async function markUnfeatured() {
  const result = await sql`
    UPDATE products
    SET featured = FALSE
    WHERE (image_urls IS NULL OR image_urls = '[]' OR image_urls = '')
      AND featured = TRUE
    RETURNING id, name
  `;
  console.log(
    `✓ Marked ${result.length} products without imageUrls as not featured`,
  );
}

// ── Step 3: Add angle images to products with < 3 images ────────────────────
async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDdgImages(query) {
  // Step A — get VQD token
  const search = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=images`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      },
    },
  );
  const html = await search.text();
  const vqdMatch = html.match(/vqd=['"]([^'"]+)['"]/);
  if (!vqdMatch) throw new Error("No VQD token");

  await delay(400);

  // Step B — fetch image results
  const res = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqdMatch[1]}&f=,,,,,&p=1`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        Referer: "https://duckduckgo.com/",
      },
    },
  );
  const json = await res.json();
  return (json.results ?? []).map((r) => r.image).filter(Boolean);
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/124" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") ?? "image/jpeg";
  if (!ct.startsWith("image/")) throw new Error("Not an image");
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType: ct };
}

async function uploadToSupabase(buffer, contentType, prefix) {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl;
}

async function addAngleImages() {
  const products = await sql`
    SELECT id, name, image_urls
    FROM products
    WHERE featured = TRUE
    ORDER BY id
  `;

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    let existing = [];
    try {
      if (product.image_urls) existing = JSON.parse(product.image_urls);
    } catch {}

    if (existing.length >= 3) {
      skipped++;
      continue;
    }

    const needed = 3 - existing.length;
    console.log(`[${product.id}] ${product.name} — needs ${needed} more image(s)`);

    const queries = [
      `${product.name} shoe side view white background`,
      `${product.name} sneaker all angles product shot`,
      `${product.name} shoe 360 view`,
    ].slice(0, needed + 2); // try a couple extras in case some fail

    const newUrls = [];
    for (const q of queries) {
      if (newUrls.length >= needed) break;
      try {
        const imgUrls = await getDdgImages(q);
        for (const imgUrl of imgUrls.slice(0, 6)) {
          if (newUrls.length >= needed) break;
          try {
            const { buffer, contentType } = await downloadImage(imgUrl);
            const publicUrl = await uploadToSupabase(buffer, contentType, `p${product.id}-angle`);
            newUrls.push(publicUrl);
            console.log(`  ✓ uploaded angle image ${newUrls.length}/${needed}`);
            await delay(300);
          } catch {
            // skip bad image
          }
        }
        await delay(600);
      } catch (e) {
        console.log(`  ⚠ search failed: ${e.message}`);
      }
    }

    if (newUrls.length > 0) {
      const merged = [...existing, ...newUrls];
      await sql`
        UPDATE products
        SET image_urls = ${JSON.stringify(merged)},
            updated_at = NOW()
        WHERE id = ${product.id}
      `;
      updated++;
      console.log(`  → saved ${newUrls.length} new images (total: ${merged.length})`);
    } else {
      console.log(`  ⚠ no images found`);
    }

    await delay(1000);
  }

  console.log(`\n✓ Angle images: ${updated} products updated, ${skipped} already had 3+`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await addColumn();
    await markUnfeatured();
    await addAngleImages();
    console.log("\n✅ Done! Run `node _setup_featured.mjs` again anytime to fill gaps.");
  } catch (e) {
    console.error("Fatal:", e);
    process.exit(1);
  } finally {
    await sql.end();
  }
})();
