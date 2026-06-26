import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db, ensureReady } from "../db";
import { products } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, sanitize, checkRateLimit, clientIP } from "../server-auth";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
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

// Public columns — buyingPrice is intentionally omitted
const PUBLIC_PRODUCT_COLUMNS = {
  id: products.id,
  name: products.name,
  price: products.price,
  oldPrice: products.oldPrice,
  stock: products.stock,
  description: products.description,
  imageUrl: products.imageUrl,
  imageUrls: products.imageUrls,
  category: products.category,
  badge: products.badge,
  colors: products.colors,
  sizes: products.sizes,
  rating: products.rating,
  slug: products.slug,
  status: products.status,
  createdAt: products.createdAt,
} as const;

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  checkRateLimit(`products:${clientIP()}`, 60, 60_000);
  return db
    .select(PUBLIC_PRODUCT_COLUMNS)
    .from(products)
    .orderBy(desc(products.createdAt));
});

// Admin-only: includes buyingPrice, status, slug
export const getAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db.select().from(products).orderBy(desc(products.createdAt));
});

export const getProductById = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    checkRateLimit(`product:${clientIP()}`, 120, 60_000);
    await ensureReady();
    const [product] = await db
      .select(PUBLIC_PRODUCT_COLUMNS)
      .from(products)
      .where(eq(products.id, data.id));
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

export const deleteAllProducts = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  await db.delete(products);
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
      // ~7.5 MB raw file maximum (base64 inflates ~33%)
      fileBase64: z.string().max(10 * 1024 * 1024),
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
