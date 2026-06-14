import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/mock-data";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-16 sm:py-20 text-center">
        <p className="font-display text-2xl mb-2">No products found</p>
        <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
