import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { ProductGrid } from "@/components/ProductGrid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: "Search — AIT Shop" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useTranslation();
  const { q: initial } = Route.useSearch();
  const [q, setQ] = useState(initial ?? "");

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return dbProducts
      .map(mapDbProduct)
      .filter(
        (p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower),
      );
  }, [dbProducts, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-8">
        {t("common.search")}
      </h1>
      <div className="relative max-w-xl mb-6 sm:mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full h-12 sm:h-13 pl-11 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-full border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-full hover:bg-muted transition"
            aria-label="Clear search"
          >
            <X className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {q.trim() === "" ? (
        <p className="text-xs sm:text-sm text-muted-foreground">{t("search.typeToSearch")}</p>
      ) : results.length === 0 ? (
        <div className="py-12 sm:py-16 text-center">
          <p className="font-display text-xl sm:text-2xl">
            {t("search.noResults")} &ldquo;{q}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {t("search.noResultsHint")}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            {results.length} {t("search.results")} &ldquo;{q}&rdquo;
          </p>
          <ProductGrid products={results} />
        </>
      )}
    </div>
  );
}
