import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { mapDbProduct } from "@/lib/product-utils";
import { useStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/wishlist")({
   head: () => ({ meta: [{ title: "Wishlist — AIT Shop" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const items = useMemo(
    () => dbProducts.map(mapDbProduct).filter((p) => wishlist.includes(p.id)),
    [dbProducts, wishlist],
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Heart className="h-12 w-12 mx-auto text-brand" />
        <h1 className="font-display text-4xl mt-4">{t("wishlist.empty")}</h1>
        <p className="text-muted-foreground mt-2">{t("wishlist.emptyDesc")}</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex px-6 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
        >
          {t("wishlist.browseShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl lg:text-5xl mb-10">
        {t("common.wishlist")} ({items.length})
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="rounded-3xl border border-border p-5 bg-card group">
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              className="block aspect-square rounded-2xl bg-muted overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-contain p-4 group-hover:scale-110 transition"
              />
            </Link>
            <div className="mt-4 flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </p>
                <h3 className="font-semibold mt-1">{p.name}</h3>
                <p className="font-display text-lg mt-1">{formatPrice(p.price, language)}</p>
              </div>
              <button
                onClick={() => toggleWishlist(p.id)}
                className="p-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart(p)}
              className="mt-4 w-full inline-flex justify-center items-center gap-2 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
            >
              <ShoppingBag className="h-4 w-4" /> {t("wishlist.moveToCart")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
