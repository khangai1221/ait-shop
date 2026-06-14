import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function Spinner() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
    </div>
  );
}

function ProductPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = Route.useParams();

  const { data: dbProduct, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({ data: { id: parseInt(id) } }),
  });

  const { data: allDbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [size, setSize] = useState(42);
  const [color, setColor] = useState("#3B82F6");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(() => {
    setActiveImage(0);
    return dbProduct ? mapDbProduct(dbProduct) : null;
  }, [dbProduct]);
  const related = useMemo(
    () =>
      product
        ? allDbProducts
            .map(mapDbProduct)
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
        : [],
    [allDbProducts, product],
  );
  if (isLoading) return <Spinner />;
  if (!product) throw notFound();

  const liked = wishlist.includes(product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const badges = [
    { Icon: Truck, label: t("product.freeDelivery"), sub: t("product.ordersOver") },
    { Icon: RotateCcw, label: t("product.returns30"), sub: t("product.hassleFree") },
    { Icon: ShieldCheck, label: t("product.secureCheckout"), sub: t("product.encrypted") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
        <Link
          to="/shop"
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t("common.back")}
        </Link>
        <span className="hidden sm:inline">
          <Link to="/" className="hover:text-brand transition">
            {t("common.home")}
          </Link>
        </span>
        <span className="hidden sm:inline">/</span>
        <span className="hidden sm:inline">
          <Link to="/shop" className="hover:text-brand transition">
            {t("common.shop")}
          </Link>
        </span>
        <span className="hidden sm:inline">/</span>
        <span className="text-ink truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
        <div>
          {/* Main image with prev/next arrows */}
          <div className="relative aspect-square rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#EBF7FD] to-[#D5EDFA] overflow-hidden">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10 transition-opacity duration-200"
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)
                  }
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-md hover:bg-white transition active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5 text-ink" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-md hover:bg-white transition active:scale-95"
                >
                  <ChevronRight className="h-5 w-5 text-ink" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === activeImage ? "w-5 bg-brand" : "w-1.5 bg-brand/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip — product's own images */}
          {product.images.length > 1 && (
            <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`snap-start shrink-0 w-16 sm:w-20 aspect-square rounded-xl sm:rounded-2xl bg-muted grid place-items-center transition ${
                    i === activeImage
                      ? "ring-2 ring-brand"
                      : "opacity-60 hover:opacity-100 hover:ring-2 ring-brand/40"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-contain p-1.5 sm:p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-brand">
            {product.category}
          </p>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 sm:h-4 w-3.5 sm:w-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {product.rating.toFixed(1)} · 128 {t("product.reviews")}
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl mt-4 sm:mt-5">
            {formatPrice(product.price, language)}
            {product.oldPrice && (
              <span className="ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground line-through">
                {formatPrice(product.oldPrice, language)}
              </span>
            )}
          </p>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-5 sm:mt-7">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              {t("common.size")}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-10 sm:h-11 w-10 sm:w-11 rounded-full text-xs sm:text-sm font-semibold transition active:scale-95 ${
                    size === s ? "bg-ink text-white" : "border border-border hover:border-brand"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              {t("common.color")}
            </p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ background: c }}
                  className={`h-8 sm:h-9 w-8 sm:w-9 rounded-full border-2 transition active:scale-90 ${
                    color === c ? "border-brand ring-2 ring-brand/40" : "border-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              {t("common.quantity")}
            </p>
            <div className="inline-flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-10 sm:h-11 w-10 sm:w-11 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition"
              >
                <Minus className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </button>
              <span className="px-3 sm:px-4 text-sm sm:text-base font-semibold min-w-[2rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-10 sm:h-11 w-10 sm:w-11 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition"
              >
                <Plus className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {t("common.outOfStock")}
              </span>
            ) : lowStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {t("common.onlyLeft", { count: product.stock })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t("common.inStock")}
              </span>
            )}
          </div>

          <div className="mt-4 sm:mt-5 flex gap-3 lg:sticky lg:bottom-4">
            <button
              onClick={() => {
                if (!outOfStock) addToCart(product, size, color, qty);
              }}
              disabled={outOfStock}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 sm:h-13 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.97] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" /> {t("common.addToCart")}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`h-12 sm:h-13 w-12 sm:w-13 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full border-2 transition active:scale-95 ${
                liked ? "bg-brand/10 border-brand text-brand" : "border-border hover:border-brand"
              }`}
            >
              <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            {badges.map(({ Icon, label, sub }) => (
              <div
                key={label}
                className="rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4 text-center sm:text-left"
              >
                <Icon className="h-4 sm:h-5 w-4 sm:w-5 text-brand mx-auto sm:mx-0" />
                <p className="text-xs sm:text-sm font-semibold mt-1.5 sm:mt-2">{label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 sm:mt-20">
          <h2 className="font-display text-2xl sm:text-3xl mb-4 sm:mb-6">
            {t("product.youMightAlsoLike")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
