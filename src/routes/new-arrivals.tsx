import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { ProductGrid } from "@/components/ProductGrid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/new-arrivals")({
   head: () => ({ meta: [{ title: "New Arrivals — AIT Shop" }] }),
  component: NewArrivals,
});

function NewArrivals() {
  const { t } = useTranslation();
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const fresh = useMemo(() => dbProducts.slice(0, 12).map(mapDbProduct), [dbProducts]);

  return (
    <>
      <section className="bg-gradient-to-br from-[#7C76D9] to-[#5A53B5] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">{t("newArrivals.tag")}</p>
          <h1 className="font-display text-5xl lg:text-6xl mt-3">{t("newArrivals.title")}</h1>
          <p className="mt-3 text-white/85 max-w-xl">{t("newArrivals.subtitle")}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="py-20 grid place-items-center">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        ) : (
          <ProductGrid products={fresh} />
        )}
      </div>
    </>
  );
}
