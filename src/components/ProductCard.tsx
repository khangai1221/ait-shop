import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const liked = wishlist.includes(product.id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative overflow-hidden rounded-2xl bg-muted/50 aspect-square"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
        {product.badge && !outOfStock && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-ink text-white">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
        />
        <button
          onClick={handleToggleWishlist}
          aria-label={t("common.wishlist")}
          className={`absolute top-3 right-3 z-10 h-9 w-9 grid place-items-center rounded-full shadow-lg transition active:scale-95 ${
            liked
              ? "bg-brand text-brand-foreground"
              : "bg-white/90 text-ink hover:bg-white backdrop-blur-sm"
          }`}
        >
          <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
        </button>
        {!outOfStock && (
          <>
            <div className="product-card-actions flex sm:hidden absolute inset-x-3 bottom-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-brand text-brand-foreground text-xs font-semibold active:scale-[0.97]"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> {t("common.addToCart")}
              </button>
            </div>
            <div className="product-card-actions hidden sm:flex absolute inset-x-3 bottom-3 items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-deep transition active:scale-[0.97]"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> {t("common.addToCart")}
              </button>
            </div>
          </>
        )}
      </Link>
      <div className="pt-3 sm:pt-4 px-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block mt-1 font-semibold text-sm leading-tight hover:text-brand transition line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-display text-base">{formatPrice(product.price, language)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice, language)}
            </span>
          )}
          {!outOfStock && product.stock <= 5 && (
            <span className="text-[10px] text-amber-500 font-medium">
              {t("common.onlyLeft", { count: product.stock })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
