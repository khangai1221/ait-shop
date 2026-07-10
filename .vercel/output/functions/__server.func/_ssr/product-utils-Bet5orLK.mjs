import { s as shoe, f as shoe2$1, g as shoe3, h as shoe4, i as shoe5, j as shoe2 } from "./router-o9ajxtaq.mjs";
const SHOE_IMAGES = [shoe, shoe2$1, shoe3, shoe4, shoe5, shoe2];
function resolveUrl(url, fallbackIndex) {
  if (/^[1-6]$/.test(url.trim())) return SHOE_IMAGES[parseInt(url.trim()) - 1];
  if (url.startsWith("http")) return url;
  return SHOE_IMAGES[fallbackIndex % 6];
}
function mapDbProduct(p) {
  let images = [];
  if (p.imageUrls) {
    try {
      const parsed = JSON.parse(p.imageUrls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed.map((u) => resolveUrl(u, p.id - 1));
      }
    } catch {
    }
  }
  if (images.length === 0) {
    images = [resolveUrl(p.imageUrl?.trim() ?? "", p.id - 1)];
  }
  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? void 0,
    category: p.category ?? "Sneakers",
    description: p.description ?? "",
    colors: p.colors ? JSON.parse(p.colors) : ["#3B82F6", "#111827", "#FFFFFF"],
    sizes: p.sizes ? JSON.parse(p.sizes) : [38, 39, 40, 41, 42, 43, 44, 45],
    image: images[0],
    images,
    rating: p.rating ?? 4,
    badge: p.badge ?? void 0,
    stock: p.stock,
    featured: p.featured ?? true
  };
}
export {
  mapDbProduct as m
};
