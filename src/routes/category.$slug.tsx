import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { categories } from "@/lib/mock-data";
import { Filters, emptyFilters, type FilterState } from "@/components/Filters";
import { ProductGrid } from "@/components/ProductGrid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

type SortKey = "newest" | "priceLowHigh" | "priceHighLow" | "popular";
const SORT_KEYS: SortKey[] = ["newest", "priceLowHigh", "priceHighLow", "popular"];

function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw notFound();

  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, category: cat.name });
  const [sort, setSort] = useState<SortKey>("newest");

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const filtered = useMemo(() => {
    let r = dbProducts
      .map(mapDbProduct)
      .filter((p) => p.category === cat.name && p.price <= filters.maxPrice);
    if (filters.sizes.length) r = r.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length)
      r = r.filter((p) => p.colors.some((c) => filters.colors.includes(c)));
    if (sort === "priceLowHigh") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "priceHighLow") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "popular") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [dbProducts, filters, sort, cat.name]);

  return (
    <>
      <section className="bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">{t("common.categories")}</p>
          <h1 className="font-display text-5xl lg:text-6xl mt-3">{cat.name}</h1>
          <p className="mt-3 text-white/85 max-w-xl">{cat.tagline}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[260px_1fr] gap-10">
        <Filters value={filters} onChange={setFilters} />
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? t("common.loading") : `${filtered.length} ${t("shop.products")}`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-full border border-border px-4 text-sm bg-background"
            >
              {SORT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`shop.${key}`)}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <div className="py-20 grid place-items-center">
              <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </>
  );
}
