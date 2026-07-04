import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { categories } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AIT Shop — Step Into Motion" },
      {
        name: "description",
        content: "Bold sneakers built for every stride. Shop the latest drops from AIT Shop.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { addToCart } = useStore();
  const [size, setSize] = useState(42);
  const [color, setColor] = useState("#3B82F6");

  const { data: dbProducts = [], isPending } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const allProducts = useMemo(() => dbProducts.map(mapDbProduct), [dbProducts]);
  const products = useMemo(() => allProducts.filter((p) => p.featured !== false), [allProducts]);
  const heroProduct = products[0] ?? null;

  const thumbs = products.slice(0, 6);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      const cat = p.category ?? "Sneakers";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    counts["Sale"] = allProducts.filter((p) => p.oldPrice !== undefined).length;
    return counts;
  }, [allProducts]);

  if (isPending || !heroProduct) {
    return (
      <>
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-[#3FBAEB] via-[#2DA9E0] to-[#1B8FCB] animate-pulse">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 h-[320px] sm:h-[400px] lg:h-[500px] rounded-2xl bg-white/20" />
            <div className="order-1 lg:order-2 space-y-4">
              <div className="h-6 w-24 rounded-full bg-white/20" />
              <div className="h-12 w-3/4 rounded-xl bg-white/20" />
              <div className="h-4 w-1/2 rounded-lg bg-white/20" />
              <div className="h-12 w-40 rounded-full bg-white/20 mt-6" />
            </div>
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 rounded-xl bg-muted animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-square rounded-2xl bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3FBAEB] via-[#2DA9E0] to-[#1B8FCB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-4 sm:gap-10 items-center">
          {/* Image — first in DOM so it appears at top on mobile */}
          <div className="relative lg:order-1">
            <div className="overflow-hidden">
              <img
                src={heroProduct.image}
                alt={heroProduct.name}
                width={1024}
                height={768}
                fetchPriority="high"
                loading="eager"
                className="relative drop-shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-700 w-full h-auto max-h-[180px] sm:max-h-[400px] lg:max-h-[500px] object-contain"
              />
            </div>
            <div className="relative mt-3 sm:mt-6 flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {thumbs.map((thumb) => (
                <Link
                  key={thumb.id}
                  to={"/product/$id"}
                  params={{ id: thumb.id }}
                  className="shrink-0 snap-start h-12 w-12 sm:h-20 sm:w-20 rounded-xl bg-white/20 backdrop-blur grid place-items-center hover:bg-white/30 transition"
                >
                  <img
                    src={thumb.image}
                    alt={thumb.name}
                    className="h-full w-full object-contain p-1.5"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Text — second in DOM, appears on right on desktop */}
          <div className="text-white lg:order-2">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80">
              {t("home.featuredDrop")}
            </p>
            <h2 className="mt-1 sm:mt-3 font-display text-xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95]">
              {heroProduct.name}
            </h2>
            <p className="mt-1 sm:mt-2 text-lg sm:text-2xl lg:text-3xl font-display">
              {formatPrice(heroProduct.price, language)}
            </p>
            <p className="hidden sm:block mt-3 sm:mt-4 text-white/85 max-w-md leading-relaxed text-sm sm:text-base">
              {heroProduct.description}
            </p>

            <div className="mt-3 sm:mt-6">
              <p className="text-xs uppercase tracking-wider mb-1.5 sm:mb-2 text-white/80">
                {t("common.size")}
              </p>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {heroProduct.sizes.map((s: number) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-8 w-8 sm:h-11 sm:w-11 rounded-full text-xs font-semibold transition active:scale-95 ${
                      size === s
                        ? "bg-white text-brand-deep"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 sm:mt-5">
              <p className="text-xs uppercase tracking-wider mb-1.5 sm:mb-2 text-white/80">
                {t("common.color")}
              </p>
              <div className="flex gap-1.5 sm:gap-2">
                {heroProduct.colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`h-6 sm:h-8 w-6 sm:w-8 rounded-full border-2 transition active:scale-90 ${
                      color === c ? "border-white ring-2 ring-white/50" : "border-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-7 flex gap-2 sm:gap-3">
              <button
                onClick={() => addToCart(heroProduct, size, color)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 h-10 sm:h-12 rounded-full bg-white text-brand-deep text-sm sm:text-base font-semibold hover:bg-white/90 transition active:scale-[0.97]"
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />{" "}
                {t("common.addToCart")}
              </button>
              <Link
                to={"/product/$id"}
                params={{ id: heroProduct.id }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 h-10 sm:h-12 rounded-full border border-white/40 text-white text-sm sm:text-base hover:bg-white/10 transition active:scale-[0.97]"
              >
                {t("common.details")} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-wider text-brand">{t("common.featured")}</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl mt-1">
              {t("home.thisWeeksPicks")}
            </h2>
          </div>
          <Link
            to={"/shop"}
            className="text-sm font-medium text-muted-foreground hover:text-brand shrink-0 whitespace-nowrap pb-1"
          >
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {products.slice(0, 3).map((p, i) => {
            const tints = ["bg-[#3FBAEB]", "bg-[#7C76D9]", "bg-[#26B7B0]"];
            return (
              <Link
                key={p.id}
                to={"/product/$id"}
                params={{ id: p.id }}
                className={`relative ${tints[i]} rounded-3xl p-5 sm:p-6 text-white overflow-hidden group h-72 sm:h-80 ${i === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-display text-xs">AIT SHOP</div>
                  <span className="font-display text-xl">{formatPrice(p.price, language)}</span>
                </div>
                <h3 className="font-display text-lg sm:text-2xl mt-2 max-w-[60%]">{p.name}</h3>
                <p className="text-xs mt-2 text-white/80 max-w-[70%] line-clamp-3">
                  {p.description}
                </p>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="absolute -bottom-4 -right-4 h-56 w-auto -rotate-12 group-hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
                />
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-white text-ink text-xs font-semibold">
                  {t("common.shopNow")} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl mb-8">
          {t("home.shopByCategory")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={"/category/$slug"}
              params={{ slug: c.slug }}
              className="aspect-square rounded-2xl bg-muted hover:bg-brand/10 grid place-items-center text-center p-4 transition group"
            >
              <div>
                <div className="font-display text-lg group-hover:text-brand transition">
                  {c.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {categoryCounts[c.name] ?? 0} {t("common.items")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-wider text-brand">{t("common.bestSellers")}</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl mt-1">
              {t("home.lovedByEveryone")}
            </h2>
          </div>
          <Link
            to={"/shop"}
            className="text-sm font-medium text-muted-foreground hover:text-brand shrink-0 whitespace-nowrap pb-1"
          >
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(6, 14).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
