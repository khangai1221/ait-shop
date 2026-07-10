import { c as createServerRpc, r as requireAdmin, f as checkRateLimit, p as products, g as clientIP, d as db, e as ensureReady, s as sanitize } from "./server-auth-0zDEtOvT.mjs";
import { b as createServerFn } from "./server-iErPJQYh.mjs";
import "../_libs/clerk__backend.mjs";
import "../_libs/postgres.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType, b as booleanType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
import { d as desc, e as eq } from "../_libs/drizzle-orm.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "node:crypto";
import "os";
import "fs";
import "net";
import "tls";
import "perf_hooks";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
const BUCKET = "products";
const ALLOWED_IMAGE_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const uploadProductImage_createServerFn_handler = createServerRpc({
  id: "b1d9b75e0df73aca5226bdf7e0e9f2735cb9c36203f49196e8fd30cd031d6d1b",
  name: "uploadProductImage",
  filename: "src/lib/api/products.ts"
}, (opts) => uploadProductImage.__executeServer(opts));
const uploadProductImage = createServerFn({
  method: "POST"
}).validator(objectType({
  fileName: stringType().max(255),
  fileBase64: stringType().max(MAX_IMAGE_BYTES * 1.4),
  // base64 inflates size ~33%
  contentType: stringType()
})).handler(uploadProductImage_createServerFn_handler, async ({
  data
}) => {
  const {
    userId
  } = await requireAdmin();
  checkRateLimit(`upload:${userId}`, 30, 6e4);
  if (!ALLOWED_IMAGE_TYPES.has(data.contentType)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
  }
  const buffer = Buffer.from(data.fileBase64, "base64");
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 8MB");
  }
  const {
    createClient
  } = await import("../_libs/supabase__supabase-js.mjs");
  const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const {
    data: buckets
  } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, {
      public: true
    });
  }
  const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const {
    data: upload,
    error
  } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: data.contentType,
    upsert: false
  });
  if (error) throw new Error(error.message);
  const {
    data: {
      publicUrl
    }
  } = supabase.storage.from(BUCKET).getPublicUrl(upload.path);
  return {
    url: publicUrl
  };
});
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
  featured: products.featured,
  createdAt: products.createdAt
};
const getProducts_createServerFn_handler = createServerRpc({
  id: "7c9d38576313a90b7aa69ef77dc61feb2559538a137a2c4aac57c9dc5a1ede0d",
  name: "getProducts",
  filename: "src/lib/api/products.ts"
}, (opts) => getProducts.__executeServer(opts));
const getProducts = createServerFn({
  method: "GET"
}).handler(getProducts_createServerFn_handler, async () => {
  checkRateLimit(`products:${clientIP()}`, 60, 6e4);
  return db.select(PUBLIC_PRODUCT_COLUMNS).from(products).orderBy(desc(products.createdAt));
});
const getAdminProducts_createServerFn_handler = createServerRpc({
  id: "ae7c40fa91b45b39ffcd7639a9c19fbeee75d564d7305ca7b30a90560a059904",
  name: "getAdminProducts",
  filename: "src/lib/api/products.ts"
}, (opts) => getAdminProducts.__executeServer(opts));
const getAdminProducts = createServerFn({
  method: "GET"
}).handler(getAdminProducts_createServerFn_handler, async () => {
  await requireAdmin();
  return db.select().from(products).orderBy(desc(products.createdAt));
});
const getProductById_createServerFn_handler = createServerRpc({
  id: "bb1060c02eb6108eabbfc1d9a045c9c7a2c3aad585862c64b0d21dbdffc23b36",
  name: "getProductById",
  filename: "src/lib/api/products.ts"
}, (opts) => getProductById.__executeServer(opts));
const getProductById = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType()
})).handler(getProductById_createServerFn_handler, async ({
  data
}) => {
  checkRateLimit(`product:${clientIP()}`, 120, 6e4);
  await ensureReady();
  const [product] = await db.select(PUBLIC_PRODUCT_COLUMNS).from(products).where(eq(products.id, data.id));
  return product ?? null;
});
const productSchema = objectType({
  name: stringType().min(1).max(200),
  price: numberType().positive().max(1e8),
  oldPrice: numberType().positive().max(1e8).nullable().optional(),
  stock: numberType().int().min(0).max(999999),
  description: stringType().max(2e3).optional(),
  imageUrl: stringType().max(500).optional(),
  imageUrls: arrayType(stringType().max(500)).max(10).optional(),
  category: stringType().max(100).optional(),
  badge: stringType().max(50).nullable().optional(),
  colors: arrayType(stringType().max(20)).max(10).optional(),
  sizes: arrayType(numberType()).max(20).optional(),
  rating: numberType().min(0).max(5).optional(),
  featured: booleanType().optional()
});
const createProduct_createServerFn_handler = createServerRpc({
  id: "071d3e76962d8aedf14b7eb3f9f693aab823595f9fa1e3d6ee4d3851fdc03db7",
  name: "createProduct",
  filename: "src/lib/api/products.ts"
}, (opts) => createProduct.__executeServer(opts));
const createProduct = createServerFn({
  method: "POST"
}).validator(productSchema).handler(createProduct_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  const {
    colors,
    sizes,
    imageUrls,
    ...rest
  } = data;
  const [product] = await db.insert(products).values({
    ...rest,
    name: sanitize(data.name),
    description: data.description ? sanitize(data.description, 2e3) : void 0,
    badge: data.badge ? sanitize(data.badge, 50) : data.badge,
    colors: colors ? JSON.stringify(colors) : null,
    sizes: sizes ? JSON.stringify(sizes) : null,
    imageUrls: imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls) : null
  }).returning();
  return product;
});
const updateProduct_createServerFn_handler = createServerRpc({
  id: "e3b5eb71359407d6d88ad1269ba5879332bc9ed446121bbf220a296f86f30b5f",
  name: "updateProduct",
  filename: "src/lib/api/products.ts"
}, (opts) => updateProduct.__executeServer(opts));
const updateProduct = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType()
}).merge(productSchema.partial())).handler(updateProduct_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  const {
    id,
    colors,
    sizes,
    imageUrls,
    ...rest
  } = data;
  const updateData = {
    ...rest,
    ...rest.name !== void 0 && {
      name: sanitize(rest.name)
    },
    ...rest.description !== void 0 && {
      description: sanitize(rest.description, 2e3)
    },
    ...rest.badge !== void 0 && rest.badge !== null && {
      badge: sanitize(rest.badge, 50)
    }
  };
  if (colors !== void 0) updateData.colors = JSON.stringify(colors);
  if (sizes !== void 0) updateData.sizes = JSON.stringify(sizes);
  if (imageUrls !== void 0) {
    updateData.imageUrls = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
  }
  const [product] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
  return product;
});
const deleteProduct_createServerFn_handler = createServerRpc({
  id: "42b7eecb730fa01dbdb05dc58e38f4adf995ebed3b73a53cd065b0569701cc40",
  name: "deleteProduct",
  filename: "src/lib/api/products.ts"
}, (opts) => deleteProduct.__executeServer(opts));
const deleteProduct = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType()
})).handler(deleteProduct_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, data.id));
  return {
    success: true
  };
});
const deleteAllProducts_createServerFn_handler = createServerRpc({
  id: "82cb2a0b6c636e4627ff20d9ed5ce8bdec757ada4588ea3d74302228057c90d7",
  name: "deleteAllProducts",
  filename: "src/lib/api/products.ts"
}, (opts) => deleteAllProducts.__executeServer(opts));
const deleteAllProducts = createServerFn({
  method: "POST"
}).handler(deleteAllProducts_createServerFn_handler, async () => {
  await requireAdmin();
  await db.delete(products);
  return {
    success: true
  };
});
const IMPORT_FIELD_MAP = {
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
  imageurl: "imageUrl"
};
async function parseXlsxRows(buffer) {
  const XLSX = await import("../_libs/xlsx.mjs");
  const workbook = XLSX.read(buffer, {
    type: "buffer"
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, {
    defval: ""
  });
}
async function parseDocxRows(buffer) {
  const mammoth = await import("../_libs/mammoth.mjs").then(function(n) {
    return n.i;
  });
  const cheerio = await import("../_libs/cheerio.mjs");
  const {
    value: html
  } = await mammoth.convertToHtml({
    buffer
  });
  const $ = cheerio.load(html);
  const table = $("table").first();
  if (table.length === 0) return [];
  const trs = table.find("tr");
  const headerCells = $(trs[0]).find("td, th").map((_, el) => $(el).text().trim()).get();
  const rows = [];
  trs.slice(1).each((_, tr) => {
    const cells = $(tr).find("td, th").map((_2, el) => $(el).text().trim()).get();
    const obj = {};
    headerCells.forEach((h, i) => {
      obj[h] = cells[i] ?? "";
    });
    rows.push(obj);
  });
  return rows;
}
const importProducts_createServerFn_handler = createServerRpc({
  id: "b601df3d2761c850fda4093e7be776556dcda89731d4460066e94a249117ba8b",
  name: "importProducts",
  filename: "src/lib/api/products.ts"
}, (opts) => importProducts.__executeServer(opts));
const importProducts = createServerFn({
  method: "POST"
}).validator(objectType({
  // ~7.5 MB raw file maximum (base64 inflates ~33%)
  fileBase64: stringType().max(10 * 1024 * 1024),
  fileType: enumType(["xlsx", "docx"])
})).handler(importProducts_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await ensureReady();
  const buffer = Buffer.from(data.fileBase64, "base64");
  const rawRows = data.fileType === "xlsx" ? await parseXlsxRows(buffer) : await parseDocxRows(buffer);
  const toInsert = [];
  const errors = [];
  rawRows.forEach((raw, idx) => {
    const row = {};
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
    const colorsArr = row.colors ? row.colors.split(",").map((c) => c.trim()).filter(Boolean) : null;
    const sizesArr = row.sizes ? row.sizes.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n)) : null;
    toInsert.push({
      name: sanitize(name, 200),
      price,
      oldPrice: oldPriceNum && oldPriceNum > 0 ? oldPriceNum : null,
      stock: isNaN(stockNum) ? 0 : stockNum,
      description: row.description ? sanitize(row.description, 2e3) : null,
      imageUrl: row.imageUrl || null,
      category: row.category || null,
      badge: row.badge ? sanitize(row.badge, 50) : null,
      colors: colorsArr && colorsArr.length > 0 ? JSON.stringify(colorsArr) : null,
      sizes: sizesArr && sizesArr.length > 0 ? JSON.stringify(sizesArr) : null,
      rating: ratingNum
    });
  });
  if (toInsert.length > 0) {
    await db.insert(products).values(toInsert);
  }
  return {
    inserted: toInsert.length,
    errors
  };
});
const getAdminStats_createServerFn_handler = createServerRpc({
  id: "94b289747e1d40ed431132e1c51a9445c5e2c2372884eb0c4fc9cfb590ab00af",
  name: "getAdminStats",
  filename: "src/lib/api/products.ts"
}, (opts) => getAdminStats.__executeServer(opts));
const getAdminStats = createServerFn({
  method: "GET"
}).handler(getAdminStats_createServerFn_handler, async () => {
  await requireAdmin();
  const allProducts = await db.select().from(products);
  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => p.stock > 0).length;
  const outOfStock = allProducts.filter((p) => p.stock === 0).length;
  return {
    totalProducts,
    inStock,
    outOfStock
  };
});
export {
  createProduct_createServerFn_handler,
  deleteAllProducts_createServerFn_handler,
  deleteProduct_createServerFn_handler,
  getAdminProducts_createServerFn_handler,
  getAdminStats_createServerFn_handler,
  getProductById_createServerFn_handler,
  getProducts_createServerFn_handler,
  importProducts_createServerFn_handler,
  updateProduct_createServerFn_handler,
  uploadProductImage_createServerFn_handler
};
