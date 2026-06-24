import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db, ensureReady } from "../db";
import { products } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, sanitize, checkRateLimit } from "../server-auth";

const SUPABASE_URL = "https://soeoluptfhyaopjuqbjr.supabase.co";
const BUCKET = "products";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

export const uploadProductImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileName: z.string().max(255),
      fileBase64: z.string().max(MAX_IMAGE_BYTES * 1.4), // base64 inflates size ~33%
      contentType: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = await requireAdmin();
    checkRateLimit(`upload:${userId}`, 30, 60_000);

    if (!ALLOWED_IMAGE_TYPES.has(data.contentType)) {
      throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
    }

    const buffer = Buffer.from(data.fileBase64, "base64");
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error("Image must be smaller than 8MB");
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }

    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${safeName}`;

    const { data: upload, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: data.contentType, upsert: false });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(upload.path);

    return { url: publicUrl };
  });

const SEED_PRODUCTS = [
  {
    name: "AIT Shop Glide 1",
    price: 302600,
    oldPrice: 438600,
    stock: 42,
    category: "Running",
    badge: "New",
    imageUrl: "1",
    colors: '["#3B82F6","#0EA5E9","#10B981"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.8,
    description:
      "Engineered for everyday performance. Breathable mesh upper, responsive cushioning, and a durable rubber outsole built to keep up with your stride — from city blocks to weekend trails.",
  },
  {
    name: "Velocity Runner",
    price: 346800,
    stock: 31,
    category: "Running",
    imageUrl: "2",
    colors: '["#111827","#EF4444","#3B82F6"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.5,
    description:
      "Built for speed. A lightweight frame with precision cushioning lets you push your pace without sacrificing comfort over long distances.",
  },
  {
    name: "Court Master 23",
    price: 391000,
    stock: 18,
    category: "Basketball",
    badge: "New",
    imageUrl: "3",
    colors: '["#F59E0B","#111827","#EF4444"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.7,
    description:
      "Dominate the court with superior ankle support, court-gripping outsole, and impact-absorbing foam. Designed with pro athletes in mind.",
  },
  {
    name: "Urban Drift",
    price: 435200,
    stock: 25,
    category: "Lifestyle",
    imageUrl: "4",
    colors: '["#10B981","#FFFFFF","#3B82F6"]',
    sizes: "[38,39,40,41,42,43,44]",
    rating: 4.3,
    description:
      "Where street style meets everyday comfort. Clean silhouette, premium materials, and a cushioned footbed that keeps you fresh from morning to night.",
  },
  {
    name: "Trail Blazer Pro",
    price: 479400,
    oldPrice: 615400,
    stock: 14,
    category: "Running",
    badge: "-30%",
    imageUrl: "5",
    colors: '["#0EA5E9","#F59E0B","#10B981"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.6,
    description:
      "Conquer off-road terrain with a rugged grip outsole and waterproof upper. This trail shoe handles everything from muddy paths to rocky climbs.",
  },
  {
    name: "Cloud Walk 270",
    price: 523600,
    stock: 37,
    category: "Lifestyle",
    imageUrl: "6",
    colors: '["#EF4444","#FFFFFF","#111827"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.9,
    description:
      "Step into cloud-like comfort. The 270° air unit and plush foam midsole deliver an unmatched cushioning experience for all-day wear.",
  },
  {
    name: "Street Icon Low",
    price: 567800,
    stock: 22,
    category: "Sneakers",
    imageUrl: "1",
    colors: '["#FFFFFF","#3B82F6","#F59E0B"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.4,
    description:
      "A classic silhouette reimagined for modern streets. Premium leather-look upper with a retro-inspired sole that pairs with anything in your wardrobe.",
  },
  {
    name: "Boost Trainer X",
    price: 612000,
    stock: 9,
    category: "Training",
    imageUrl: "2",
    colors: '["#111827","#EF4444","#0EA5E9"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.6,
    description:
      "Engineered for the gym and beyond. Energy-return foam, a lockdown fit, and multi-directional traction make this the ultimate cross-trainer.",
  },
  {
    name: "Heritage Court 6",
    price: 302600,
    oldPrice: 404600,
    stock: 28,
    category: "Basketball",
    badge: "Sale",
    imageUrl: "3",
    colors: '["#3B82F6","#10B981","#EF4444"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.2,
    description:
      "A retro court icon brought back in premium colorways. Lightweight canvas upper with a vulcanized sole that's as stylish as it is durable.",
  },
  {
    name: "Phantom Run",
    price: 346800,
    stock: 16,
    category: "Running",
    imageUrl: "4",
    colors: '["#F59E0B","#FFFFFF","#111827"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.5,
    description:
      "A ghost on the track. Ultra-lightweight construction with a zero-drop profile for natural running mechanics and minimal ground feel.",
  },
  {
    name: "Vapor Lite",
    price: 391000,
    stock: 33,
    category: "Training",
    imageUrl: "5",
    colors: '["#10B981","#3B82F6","#F59E0B"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.3,
    description:
      "Feather-light and flexible, the Vapor Lite moves with you through every workout. Breathable mesh keeps feet cool when intensity climbs.",
  },
  {
    name: "Studio Flex",
    price: 435200,
    stock: 20,
    category: "Training",
    badge: "New",
    imageUrl: "6",
    colors: '["#EF4444","#0EA5E9","#FFFFFF"]',
    sizes: "[38,39,40,41,42,43,44]",
    rating: 4.7,
    description:
      "Designed for studio sessions and beyond. The flexible split-sole construction provides superior grip for yoga, Pilates, and dance workouts.",
  },
  {
    name: "Hyper Pulse",
    price: 479400,
    stock: 7,
    category: "Running",
    imageUrl: "1",
    colors: '["#FFFFFF","#EF4444","#10B981"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.8,
    description:
      "Feel the pulse of every step. Carbon-fiber plate technology and nitrogen-injected foam create an explosive energy return for race day performance.",
  },
  {
    name: "Apex Field",
    price: 523600,
    oldPrice: 659600,
    stock: 11,
    category: "Training",
    badge: "-20%",
    imageUrl: "2",
    colors: '["#3B82F6","#111827","#0EA5E9"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.4,
    description:
      "From turf to track, the Apex Field delivers. Multi-surface traction and a reinforced toe box make this the go-to choice for field athletes.",
  },
  {
    name: "Echo Lifestyle",
    price: 567800,
    stock: 45,
    category: "Lifestyle",
    imageUrl: "3",
    colors: '["#F59E0B","#3B82F6","#EF4444"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.1,
    description:
      "Make a statement with every stride. Bold colorways and an oversized sole unit put the Echo Lifestyle at the forefront of sneaker culture.",
  },
  {
    name: "Summit Hike",
    price: 612000,
    stock: 19,
    category: "Running",
    imageUrl: "4",
    colors: '["#10B981","#F59E0B","#FFFFFF"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.6,
    description:
      "Built for those who go the distance. A waterproof membrane, aggressive lug pattern, and ankle collar support tackle the toughest mountain trails.",
  },
  {
    name: "Pace Setter 90",
    price: 302600,
    oldPrice: 438600,
    stock: 26,
    category: "Running",
    badge: "-30%",
    imageUrl: "5",
    colors: '["#0EA5E9","#111827","#3B82F6"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.3,
    description:
      "A throwback runner updated with modern comfort tech. Retro design lines meet contemporary foam cushioning in this timeless performance shoe.",
  },
  {
    name: "Glow Court",
    price: 346800,
    stock: 38,
    category: "Basketball",
    imageUrl: "6",
    colors: '["#FFFFFF","#10B981","#F59E0B"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.5,
    description:
      "Light up the court in the Glow Court. Reflective detailing and a high-visibility colorway combine with locked-down support for standout play.",
  },
  {
    name: "Drift Mid",
    price: 391000,
    stock: 21,
    category: "Sneakers",
    imageUrl: "1",
    colors: '["#EF4444","#3B82F6","#111827"]',
    sizes: "[39,40,41,42,43,44,45]",
    rating: 4.2,
    description:
      "The mid-top silhouette reimagined for the streets. Extended ankle collar, premium nubuck, and a cupsole construction built to last.",
  },
  {
    name: "Origin White",
    price: 435200,
    stock: 15,
    category: "Sneakers",
    imageUrl: "2",
    colors: '["#FFFFFF","#FFFFFF","#FFFFFF"]',
    sizes: "[38,39,40,41,42,43,44,45]",
    rating: 4.9,
    description:
      "Pure. Clean. Iconic. The Origin White strips everything back to essentials — a pristine white leather upper and minimal branding for a timeless look.",
  },
];

async function ensureSeeded() {
  await ensureReady();
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length === 0) {
    await db.insert(products).values(
      SEED_PRODUCTS.map((p) => ({
        name: p.name,
        price: p.price,
        oldPrice: "oldPrice" in p ? (p.oldPrice ?? null) : null,
        stock: p.stock,
        description: p.description ?? null,
        imageUrl: p.imageUrl ?? null,
        category: p.category ?? null,
        badge: p.badge ?? null,
        colors: p.colors ?? null,
        sizes: p.sizes ?? null,
        rating: p.rating ?? null,
      })),
    );
  }
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureSeeded();
    return db.select().from(products).orderBy(desc(products.createdAt));
  } catch (err) {
    console.error("DB unavailable, returning seed data:", err);
    return SEED_PRODUCTS.map((p, idx) => ({
      id: idx + 1,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      stock: p.stock,
      description: p.description ?? null,
      imageUrl: p.imageUrl ?? null,
      imageUrls: null,
      category: p.category ?? null,
      badge: p.badge ?? null,
      colors: p.colors ?? null,
      sizes: p.sizes ?? null,
      rating: p.rating ?? null,
      createdAt: new Date(),
    }));
  }
});

export const getProductById = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await ensureReady();
    const [product] = await db.select().from(products).where(eq(products.id, data.id));
    return product ?? null;
  });

const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive().max(100_000_000),
  oldPrice: z.number().positive().max(100_000_000).nullable().optional(),
  stock: z.number().int().min(0).max(999_999),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().max(500).optional(),
  imageUrls: z.array(z.string().max(500)).max(10).optional(),
  category: z.string().max(100).optional(),
  badge: z.string().max(50).nullable().optional(),
  colors: z.array(z.string().max(20)).max(10).optional(),
  sizes: z.array(z.number()).max(20).optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const createProduct = createServerFn({ method: "POST" })
  .validator(productSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { colors, sizes, imageUrls, ...rest } = data;
    const [product] = await db
      .insert(products)
      .values({
        ...rest,
        name: sanitize(data.name),
        description: data.description ? sanitize(data.description, 2000) : undefined,
        badge: data.badge ? sanitize(data.badge, 50) : data.badge,
        colors: colors ? JSON.stringify(colors) : null,
        sizes: sizes ? JSON.stringify(sizes) : null,
        imageUrls: imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
      })
      .returning();
    return product;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }).merge(productSchema.partial()))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, colors, sizes, imageUrls, ...rest } = data;
    const updateData: Record<string, unknown> = {
      ...rest,
      ...(rest.name !== undefined && { name: sanitize(rest.name) }),
      ...(rest.description !== undefined && { description: sanitize(rest.description, 2000) }),
      ...(rest.badge !== undefined && rest.badge !== null && { badge: sanitize(rest.badge, 50) }),
    };
    if (colors !== undefined) updateData.colors = JSON.stringify(colors);
    if (sizes !== undefined) updateData.sizes = JSON.stringify(sizes);
    if (imageUrls !== undefined) {
      updateData.imageUrls = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
    }
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await db.delete(products).where(eq(products.id, data.id));
    return { success: true };
  });

// ── Bulk import from Excel (.xlsx) or Word (.docx) ───────────────────────────

const IMPORT_FIELD_MAP: Record<string, string> = {
  name: "name",
  price: "price",
  oldprice: "oldPrice",
  stock: "stock",
  category: "category",
  badge: "badge",
  description: "description",
  colors: "colors",
  sizes: "sizes",
  rating: "rating",
  imageurl: "imageUrl",
};

async function parseXlsxRows(buffer: Buffer): Promise<Record<string, unknown>[]> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

async function parseDocxRows(buffer: Buffer): Promise<Record<string, unknown>[]> {
  const mammoth = await import("mammoth");
  const cheerio = await import("cheerio");
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const $ = cheerio.load(html);
  const table = $("table").first();
  if (table.length === 0) return [];
  const trs = table.find("tr");
  const headerCells = $(trs[0])
    .find("td, th")
    .map((_, el) => $(el).text().trim())
    .get();
  const rows: Record<string, unknown>[] = [];
  trs.slice(1).each((_, tr) => {
    const cells = $(tr)
      .find("td, th")
      .map((_, el) => $(el).text().trim())
      .get();
    const obj: Record<string, unknown> = {};
    headerCells.forEach((h, i) => {
      obj[h] = cells[i] ?? "";
    });
    rows.push(obj);
  });
  return rows;
}

export const importProducts = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileBase64: z.string(),
      fileType: z.enum(["xlsx", "docx"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureReady();

    const buffer = Buffer.from(data.fileBase64, "base64");
    const rawRows =
      data.fileType === "xlsx" ? await parseXlsxRows(buffer) : await parseDocxRows(buffer);

    const toInsert: (typeof products.$inferInsert)[] = [];
    const errors: string[] = [];

    rawRows.forEach((raw, idx) => {
      const row: Record<string, string> = {};
      for (const [key, value] of Object.entries(raw)) {
        const norm = key.toLowerCase().replace(/[\s_]+/g, "");
        const field = IMPORT_FIELD_MAP[norm];
        if (field) row[field] = String(value ?? "").trim();
      }

      const name = row.name;
      const price = parseFloat(row.price);

      if (!name) {
        errors.push(`Row ${idx + 2}: missing name`);
        return;
      }
      if (!price || price <= 0) {
        errors.push(`Row ${idx + 2} (${name}): missing or invalid price`);
        return;
      }

      const oldPriceNum = row.oldPrice ? parseFloat(row.oldPrice) : null;
      const stockNum = row.stock ? parseInt(row.stock, 10) : 0;
      const ratingNum = row.rating ? parseFloat(row.rating) : null;
      const colorsArr = row.colors
        ? row.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : null;
      const sizesArr = row.sizes
        ? row.sizes
            .split(",")
            .map((s) => parseFloat(s.trim()))
            .filter((n) => !isNaN(n))
        : null;

      toInsert.push({
        name: sanitize(name, 200),
        price,
        oldPrice: oldPriceNum && oldPriceNum > 0 ? oldPriceNum : null,
        stock: isNaN(stockNum) ? 0 : stockNum,
        description: row.description ? sanitize(row.description, 2000) : null,
        imageUrl: row.imageUrl || null,
        category: row.category || null,
        badge: row.badge ? sanitize(row.badge, 50) : null,
        colors: colorsArr && colorsArr.length > 0 ? JSON.stringify(colorsArr) : null,
        sizes: sizesArr && sizesArr.length > 0 ? JSON.stringify(sizesArr) : null,
        rating: ratingNum,
      });
    });

    if (toInsert.length > 0) {
      await db.insert(products).values(toInsert);
    }

    return { inserted: toInsert.length, errors };
  });

export const getAdminStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const allProducts = await db.select().from(products);
  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => p.stock > 0).length;
  const outOfStock = allProducts.filter((p) => p.stock === 0).length;
  return { totalProducts, inStock, outOfStock };
});
