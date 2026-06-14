import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
      { title: "AirStep — Step Into Motion" },
      {
        name: "description",
        content: "Bold sneakers built for every stride. Shop the latest drops from AirStep.",
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
  const [heroProduct, setHeroProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const { data: dbProducts = [], isPending } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  useEffect(() => {
    const mapped = dbProducts.map(mapDbProduct);
    setProducts(mapped);
    if (mapped.length > 0) {
      setHeroProduct(mapped[0]);
    }
  }, [dbProducts]);

  const thumbs = products.slice(0, 6);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of dbProducts) {
      const cat = p.category ?? "Sneakers";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    counts["Sale"] = dbProducts.filter((p) => p.oldPrice !== null).length;
    return counts;
  }, [dbProducts]);

  if (isPending || !heroProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3FBAEB] via-[#2DA9E0] to-[#1B8FCB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src={heroProduct.image}
              alt={heroProduct.name}
              width={1024}
              height={768}
              className="relative drop-shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-700 w-full h-auto max-h-[320px] sm:max-h-[400px] lg:max-h-[500px] object-contain"
            />
            <div className="relative mt-4 sm:mt-6 flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {thumbs.map((thumb) => (
                <Link
                  key={thumb.id}
                  to={"/product/$id"}
                  params={{ id: thumb.id }}
                  className="shrink-0 snap-start h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-white/20 backdrop-blur grid place-items-center hover:bg-white/30 transition"
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

          <div className="text-white order-1 lg:order-2">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80">
              {t("common.featuredDrop")}
            </p>
            <h2 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95]">
              {heroProduct.name}
            </h2>
            <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-display">
              {formatPrice(heroProduct.price, language)}
            </p>
            <p className="mt-3 sm:mt-4 text-white/85 max-w-md leading-relaxed text-sm sm:text-base">
              {heroProduct.description}
            </p>

            <div className="mt-5 sm:mt-6">
              <p className="text-xs sm:text-sm uppercase tracking-wider mb-2 text-white/80">{t("common.size")}</p>
              <div className="flex gap-2 flex-wrap">
                {heroProduct.sizes.map((s: number) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 sm:h-11 w-10 sm:w-11 rounded-full text-xs sm:text-sm font-semibold transition active:scale-95 ${
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

            <div className="mt-4 sm:mt-5">
              <p className="text-xs sm:text-sm uppercase tracking-wider mb-2 text-white/80">
                {t("common.color")}
              </p>
              <div className="flex gap-2">
                {heroProduct.colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`h-7 sm:h-8 w-7 sm:w-8 rounded-full border-2 transition active:scale-90 ${
                      color === c ? "border-white ring-2 ring-white/50" : "border-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-7 flex gap-3">
              <button
                onClick={() => addToCart(heroProduct, size, color)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-6 h-11 sm:h-12 rounded-full bg-white text-brand-deep font-semibold hover:bg-white/90 transition active:scale-[0.97]"
              >
                <ShoppingBag className="h-4 w-4" /> {t("common.addToCart")}
              </button>
              <Link
                to={"/product/$id"}
                params={{ id: heroProduct.id }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-6 h-11 sm:h-12 rounded-full border border-white/40 text-white hover:bg-white/10 transition active:scale-[0.97]"
              >
                {t("common.details")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wider text-brand">{t("common.featured")}</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-1">{t("home.thisWeeksPicks")}</h2>
          </div>
          <Link to={"/shop"} className="text-sm font-medium text-muted-foreground hover:text-brand">
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {products.slice(0, 3).map((p, i) => {
            const tints = ["bg-[#3FBAEB]", "bg-[#7C76D9]", "bg-[#26B7B0]"];
            return (
              <Link
                key={p.id}
                to={"/product/$id"}
                params={{ id: p.id }}
                className={`relative ${tints[i]} rounded-3xl p-6 text-white overflow-hidden group h-80`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-display text-xs">AIRSTEP</div>
                  <span className="font-display text-xl">{formatPrice(p.price, language)}</span>
                </div>
                <h3 className="font-display text-2xl mt-2 max-w-[60%]">{p.name}</h3>
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
        <h2 className="font-display text-3xl lg:text-4xl mb-8">{t("home.shopByCategory")}</h2>
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
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wider text-brand">{t("common.bestSellers")}</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-1">{t("home.lovedByEveryone")}</h2>
          </div>
          <Link to={"/shop"} className="text-sm font-medium text-muted-foreground hover:text-brand">
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
