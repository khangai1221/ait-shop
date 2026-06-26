import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";
import type { Product } from "./mock-data";

export const SHOE_IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

export type DbProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  description: string | null;
  imageUrl: string | null;
  imageUrls: string | null;
  category: string | null;
  badge: string | null;
  colors: string | null;
  sizes: string | null;
  rating: number | null;
  slug?: string | null;
  status?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
};

export type DbProductAdmin = DbProduct & {
  buyingPrice: number | null;
};

function resolveUrl(url: string, fallbackIndex: number): string {
  if (/^[1-6]$/.test(url.trim())) return SHOE_IMAGES[parseInt(url.trim()) - 1];
  if (url.startsWith("http")) return url;
  return SHOE_IMAGES[fallbackIndex % 6];
}

export function mapDbProduct(p: DbProduct): Product {
  let images: string[] = [];

  if (p.imageUrls) {
    try {
      const parsed = JSON.parse(p.imageUrls) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed.map((u) => resolveUrl(u, p.id - 1));
      }
    } catch {}
  }

  if (images.length === 0) {
    images = [resolveUrl(p.imageUrl?.trim() ?? "", p.id - 1)];
  }

  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    category: p.category ?? "Sneakers",
    description: p.description ?? "",
    colors: p.colors ? (JSON.parse(p.colors) as string[]) : ["#3B82F6", "#111827", "#FFFFFF"],
    sizes: p.sizes ? (JSON.parse(p.sizes) as number[]) : [38, 39, 40, 41, 42, 43, 44, 45],
    image: images[0],
    images,
    rating: p.rating ?? 4.0,
    badge: p.badge ?? undefined,
    stock: p.stock,
  };
}
