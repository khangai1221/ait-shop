import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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

function activeFilterCount(f: FilterState): number {
  let count = 0;
  if (f.sizes.length) count++;
  if (f.colors.length) count++;
  if (f.maxPrice < 700000) count++;
  return count;
}

function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw notFound();

  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, category: cat.name });
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeCount = activeFilterCount(filters);

  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterOpen]);

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">
            {t("common.categories")}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl mt-3">{cat.name}</h1>
          <p className="mt-3 text-white/85 max-w-xl text-sm sm:text-base">{cat.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
          <div className="hidden lg:block">
            <Filters value={filters} onChange={setFilters} />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isLoading ? t("common.loading") : `${filtered.length} ${t("shop.products")}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full border border-border text-xs sm:text-sm font-medium hover:bg-muted transition active:scale-[0.97] shrink-0"
                >
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  {t("shop.filters")}
                  {activeCount > 0 && (
                    <span className="h-5 w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold grid place-items-center shrink-0">
                      {activeCount}
                    </span>
                  )}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="flex-1 sm:flex-none h-10 min-w-0 rounded-full border border-border px-3 sm:px-4 text-xs sm:text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {SORT_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t(`shop.${key}`)}
                    </option>
                  ))}
                </select>
              </div>
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
      </div>

      {mobileFilterOpen && (
        <div className="mobile-filter-drawer">
          <div className="backdrop" onClick={() => setMobileFilterOpen(false)} />
          <div className="panel">
            <div className="pull-indicator" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">{t("shop.filters")}</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Filters value={filters} onChange={setFilters} />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-8 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]"
            >
              {t("shop.showResults", { count: filtered.length })}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
