import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db, ensureReady } from "../db";
import { products } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, sanitize } from "../server-auth";

const SUPABASE_URL = "https://soeoluptfhyaopjuqbjr.supabase.co";
const BUCKET = "products";

export const uploadProductImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      fileName: z.string(),
      fileBase64: z.string(),
      contentType: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }

    const buffer = Buffer.from(data.fileBase64, "base64");
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
  { name: "AirStep Glide 1", price: 302600, oldPrice: 438600, stock: 42, category: "Running", badge: "New", imageUrl: "1", colors: '["#3B82F6","#0EA5E9","#10B981"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.8, description: "Engineered for everyday performance. Breathable mesh upper, responsive cushioning, and a durable rubber outsole built to keep up with your stride — from city blocks to weekend trails." },
  { name: "Velocity Runner", price: 346800, stock: 31, category: "Running", imageUrl: "2", colors: '["#111827","#EF4444","#3B82F6"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.5, description: "Built for speed. A lightweight frame with precision cushioning lets you push your pace without sacrificing comfort over long distances." },
  { name: "Court Master 23", price: 391000, stock: 18, category: "Basketball", badge: "New", imageUrl: "3", colors: '["#F59E0B","#111827","#EF4444"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.7, description: "Dominate the court with superior ankle support, court-gripping outsole, and impact-absorbing foam. Designed with pro athletes in mind." },
  { name: "Urban Drift", price: 435200, stock: 25, category: "Lifestyle", imageUrl: "4", colors: '["#10B981","#FFFFFF","#3B82F6"]', sizes: '[38,39,40,41,42,43,44]', rating: 4.3, description: "Where street style meets everyday comfort. Clean silhouette, premium materials, and a cushioned footbed that keeps you fresh from morning to night." },
  { name: "Trail Blazer Pro", price: 479400, oldPrice: 615400, stock: 14, category: "Running", badge: "-30%", imageUrl: "5", colors: '["#0EA5E9","#F59E0B","#10B981"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.6, description: "Conquer off-road terrain with a rugged grip outsole and waterproof upper. This trail shoe handles everything from muddy paths to rocky climbs." },
  { name: "Cloud Walk 270", price: 523600, stock: 37, category: "Lifestyle", imageUrl: "6", colors: '["#EF4444","#FFFFFF","#111827"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.9, description: "Step into cloud-like comfort. The 270° air unit and plush foam midsole deliver an unmatched cushioning experience for all-day wear." },
  { name: "Street Icon Low", price: 567800, stock: 22, category: "Sneakers", imageUrl: "1", colors: '["#FFFFFF","#3B82F6","#F59E0B"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.4, description: "A classic silhouette reimagined for modern streets. Premium leather-look upper with a retro-inspired sole that pairs with anything in your wardrobe." },
  { name: "Boost Trainer X", price: 612000, stock: 9, category: "Training", imageUrl: "2", colors: '["#111827","#EF4444","#0EA5E9"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.6, description: "Engineered for the gym and beyond. Energy-return foam, a lockdown fit, and multi-directional traction make this the ultimate cross-trainer." },
  { name: "Heritage Court 6", price: 302600, oldPrice: 404600, stock: 28, category: "Basketball", badge: "Sale", imageUrl: "3", colors: '["#3B82F6","#10B981","#EF4444"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.2, description: "A retro court icon brought back in premium colorways. Lightweight canvas upper with a vulcanized sole that's as stylish as it is durable." },
  { name: "Phantom Run", price: 346800, stock: 16, category: "Running", imageUrl: "4", colors: '["#F59E0B","#FFFFFF","#111827"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.5, description: "A ghost on the track. Ultra-lightweight construction with a zero-drop profile for natural running mechanics and minimal ground feel." },
  { name: "Vapor Lite", price: 391000, stock: 33, category: "Training", imageUrl: "5", colors: '["#10B981","#3B82F6","#F59E0B"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.3, description: "Feather-light and flexible, the Vapor Lite moves with you through every workout. Breathable mesh keeps feet cool when intensity climbs." },
  { name: "Studio Flex", price: 435200, stock: 20, category: "Training", badge: "New", imageUrl: "6", colors: '["#EF4444","#0EA5E9","#FFFFFF"]', sizes: '[38,39,40,41,42,43,44]', rating: 4.7, description: "Designed for studio sessions and beyond. The flexible split-sole construction provides superior grip for yoga, Pilates, and dance workouts." },
  { name: "Hyper Pulse", price: 479400, stock: 7, category: "Running", imageUrl: "1", colors: '["#FFFFFF","#EF4444","#10B981"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.8, description: "Feel the pulse of every step. Carbon-fiber plate technology and nitrogen-injected foam create an explosive energy return for race day performance." },
  { name: "Apex Field", price: 523600, oldPrice: 659600, stock: 11, category: "Training", badge: "-20%", imageUrl: "2", colors: '["#3B82F6","#111827","#0EA5E9"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.4, description: "From turf to track, the Apex Field delivers. Multi-surface traction and a reinforced toe box make this the go-to choice for field athletes." },
  { name: "Echo Lifestyle", price: 567800, stock: 45, category: "Lifestyle", imageUrl: "3", colors: '["#F59E0B","#3B82F6","#EF4444"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.1, description: "Make a statement with every stride. Bold colorways and an oversized sole unit put the Echo Lifestyle at the forefront of sneaker culture." },
  { name: "Summit Hike", price: 612000, stock: 19, category: "Running", imageUrl: "4", colors: '["#10B981","#F59E0B","#FFFFFF"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.6, description: "Built for those who go the distance. A waterproof membrane, aggressive lug pattern, and ankle collar support tackle the toughest mountain trails." },
  { name: "Pace Setter 90", price: 302600, oldPrice: 438600, stock: 26, category: "Running", badge: "-30%", imageUrl: "5", colors: '["#0EA5E9","#111827","#3B82F6"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.3, description: "A throwback runner updated with modern comfort tech. Retro design lines meet contemporary foam cushioning in this timeless performance shoe." },
  { name: "Glow Court", price: 346800, stock: 38, category: "Basketball", imageUrl: "6", colors: '["#FFFFFF","#10B981","#F59E0B"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.5, description: "Light up the court in the Glow Court. Reflective detailing and a high-visibility colorway combine with locked-down support for standout play." },
  { name: "Drift Mid", price: 391000, stock: 21, category: "Sneakers", imageUrl: "1", colors: '["#EF4444","#3B82F6","#111827"]', sizes: '[39,40,41,42,43,44,45]', rating: 4.2, description: "The mid-top silhouette reimagined for the streets. Extended ankle collar, premium nubuck, and a cupsole construction built to last." },
  { name: "Origin White", price: 435200, stock: 15, category: "Sneakers", imageUrl: "2", colors: '["#FFFFFF","#FFFFFF","#FFFFFF"]', sizes: '[38,39,40,41,42,43,44,45]', rating: 4.9, description: "Pure. Clean. Iconic. The Origin White strips everything back to essentials — a pristine white leather upper and minimal branding for a timeless look." },
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
  .inputValidator(z.object({ id: z.number() }))
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
  .inputValidator(productSchema)
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
  .inputValidator(z.object({ id: z.number() }).merge(productSchema.partial()))
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
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await db.delete(products).where(eq(products.id, data.id));
    return { success: true };
  });

export const getAdminStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const allProducts = await db.select().from(products);
  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => p.stock > 0).length;
  const outOfStock = allProducts.filter((p) => p.stock === 0).length;
  return { totalProducts, inStock, outOfStock };
});
