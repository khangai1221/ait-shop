import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { ProductGrid } from "@/components/ProductGrid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/sale")({
  head: () => ({ meta: [{ title: "Sale — AIT Shop" }] }),
  component: SalePage,
});

function SalePage() {
  const { t } = useTranslation();
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const onSale = useMemo(
    () =>
      dbProducts
        .map(mapDbProduct)
        .filter((p) => p.oldPrice !== undefined || p.category === "Sale" || p.badge?.includes("%")),
    [dbProducts],
  );

  return (
    <>
      <section className="bg-gradient-to-br from-[#EF4444] to-[#B91C1C] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">{t("sale.tag")}</p>
          <h1 className="font-display text-5xl lg:text-6xl mt-3">{t("sale.title")}</h1>
          <p className="mt-3 text-white/85 max-w-xl">{t("sale.subtitle")}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="py-20 grid place-items-center">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        ) : (
          <ProductGrid products={onSale} />
        )}
      </div>
    </>
  );
}
