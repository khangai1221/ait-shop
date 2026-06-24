import shoe1 from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-2.png";
import shoe3 from "@/assets/shoe-3.png";
import shoe4 from "@/assets/shoe-4.png";
import shoe5 from "@/assets/shoe-5.png";
import shoe6 from "@/assets/shoe-6.png";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  description: string;
  colors: string[];
  sizes: number[];
  image: string;
  images: string[];
  rating: number;
  badge?: string;
  stock: number;
};

const IMAGES = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

const NAMES = [
  "AIT Shop Glide 1",
  "Velocity Runner",
  "Court Master 23",
  "Urban Drift",
  "Trail Blazer Pro",
  "Cloud Walk 270",
  "Street Icon Low",
  "Boost Trainer X",
  "Heritage Court 6",
  "Phantom Run",
  "Vapor Lite",
  "Studio Flex",
  "Hyper Pulse",
  "Apex Field",
  "Echo Lifestyle",
  "Summit Hike",
  "Pace Setter 90",
  "Glow Court",
  "Drift Mid",
  "Origin White",
];

const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const COLORS = ["#3B82F6", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#111827", "#FFFFFF"];

export const products: Product[] = NAMES.map((name, i) => ({
  id: `p-${i + 1}`,
  name,
  price: 89000 + ((i * 13) % 191000),
  oldPrice: i % 4 === 0 ? 89000 + ((i * 13) % 191000) + 40000 : undefined,
  category: CATEGORIES[i % CATEGORIES.length],
  description:
    "Engineered for everyday performance. Breathable mesh upper, responsive cushioning, and a durable rubber outsole built to keep up with your stride — from city blocks to weekend trails.",
  colors: [
    COLORS[i % COLORS.length],
    COLORS[(i + 2) % COLORS.length],
    COLORS[(i + 4) % COLORS.length],
  ],
  sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  image: IMAGES[i % IMAGES.length],
  images: [IMAGES[i % IMAGES.length]],
  rating: 3.5 + ((i * 7) % 15) / 10,
  badge: i % 5 === 0 ? "New" : i % 7 === 0 ? "-30%" : undefined,
  stock: i % 9 === 0 ? 0 : 10 + i * 3,
}));

export const categories = [
  { slug: "running", name: "Running", count: 24, tagline: "Built for the long run." },
  { slug: "basketball", name: "Basketball", count: 18, tagline: "Own the court." },
  { slug: "lifestyle", name: "Lifestyle", count: 32, tagline: "Everyday icons." },
  { slug: "training", name: "Training", count: 21, tagline: "Push your limits." },
  { slug: "sneakers", name: "Sneakers", count: 40, tagline: "Street-ready classics." },
  { slug: "sale", name: "Sale", count: 12, tagline: "Up to 50% off." },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const heroProduct = products[5];
