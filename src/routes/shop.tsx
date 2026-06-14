import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { Filters, emptyFilters, type FilterState } from "@/components/Filters";
import { ProductGrid } from "@/components/ProductGrid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Sneakers — AirStep" },
      { name: "description", content: "Browse the full AirStep collection." },
    ],
  }),
  component: Shop,
});

type SortKey = "newest" | "priceLowHigh" | "priceHighLow" | "popular";
const SORT_KEYS: SortKey[] = ["newest", "priceLowHigh", "priceHighLow", "popular"];

function activeFilterCount(f: FilterState): number {
  let count = 0;
  if (f.category) count++;
  if (f.sizes.length) count++;
  if (f.colors.length) count++;
  if (f.maxPrice < 300000) count++;
  return count;
}

function Shop() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const perPage = 8;

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const allProducts = useMemo(() => dbProducts.map(mapDbProduct), [dbProducts]);

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

  const filtered = useMemo(() => {
    let r = allProducts.filter((p) => p.price <= filters.maxPrice);
    if (filters.category) r = r.filter((p) => p.category === filters.category);
    if (filters.sizes.length) r = r.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length)
      r = r.filter((p) => p.colors.some((c) => filters.colors.includes(c)));
    if (sort === "priceLowHigh") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "priceHighLow") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "popular") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [allProducts, filters, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = activeFilterCount(filters);

  const updateFilters = (v: FilterState) => {
    setFilters(v);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <header className="mb-6 sm:mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-wider text-brand">{t("common.shop")}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2">
          {t("shop.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
          {t("shop.subtitle")}
        </p>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
        <div className="hidden lg:block">
          <Filters value={filters} onChange={updateFilters} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground shrink-0">
              {isLoading ? t("common.loading") : `${filtered.length} ${t("shop.products")}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-sm font-medium hover:bg-muted transition active:scale-[0.97]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t("shop.filters")}
                {activeCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold grid place-items-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 rounded-full border border-border px-3 sm:px-4 text-xs sm:text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand"
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
            <ProductGrid products={visible} />
          )}

          {pages > 1 && (
            <div className="mt-8 sm:mt-10 flex justify-center gap-1.5 sm:gap-2 flex-wrap">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 sm:h-10 w-9 sm:w-10 rounded-full text-xs sm:text-sm font-semibold transition active:scale-[0.95] ${
                    page === i + 1
                      ? "bg-brand text-brand-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
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
            <Filters value={filters} onChange={updateFilters} />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-8 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]"
            >
              {t("shop.showResults", { count: filtered.length })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
