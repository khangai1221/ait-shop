import { s as shoe, a as shoe2$1 } from "./shoe-6-BmZDyfVV.mjs";
import { s as shoe2, a as shoe3, b as shoe4, c as shoe5 } from "./shoe-5-D0gWoJoO.mjs";
const IMAGES = [shoe, shoe2, shoe3, shoe4, shoe5, shoe2$1];
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
  "Origin White"
];
const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const COLORS = ["#3B82F6", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#111827", "#FFFFFF"];
const products = NAMES.map((name, i) => ({
  id: `p-${i + 1}`,
  name,
  price: 89e3 + i * 13 % 191e3,
  oldPrice: i % 4 === 0 ? 89e3 + i * 13 % 191e3 + 4e4 : void 0,
  category: CATEGORIES[i % CATEGORIES.length],
  description: "Engineered for everyday performance. Breathable mesh upper, responsive cushioning, and a durable rubber outsole built to keep up with your stride — from city blocks to weekend trails.",
  colors: [
    COLORS[i % COLORS.length],
    COLORS[(i + 2) % COLORS.length],
    COLORS[(i + 4) % COLORS.length]
  ],
  sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  image: IMAGES[i % IMAGES.length],
  images: [IMAGES[i % IMAGES.length]],
  rating: 3.5 + i * 7 % 15 / 10,
  badge: i % 5 === 0 ? "New" : i % 7 === 0 ? "-30%" : void 0,
  stock: i % 9 === 0 ? 0 : 10 + i * 3
}));
const categories = [
  { slug: "running", name: "Running", count: 24, tagline: "Built for the long run." },
  { slug: "basketball", name: "Basketball", count: 18, tagline: "Own the court." },
  { slug: "lifestyle", name: "Lifestyle", count: 32, tagline: "Everyday icons." },
  { slug: "training", name: "Training", count: 21, tagline: "Push your limits." },
  { slug: "sneakers", name: "Sneakers", count: 40, tagline: "Street-ready classics." },
  { slug: "sale", name: "Sale", count: 12, tagline: "Up to 50% off." }
];
products[5];
export {
  categories as c,
  products as p
};
