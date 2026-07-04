import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — AIT Shop" }] }),
  component: CartPage,
});

function CartPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { cart, updateQty, removeFromCart, cartTotal } = useStore();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const shipping = cartTotal > 100 || cartTotal === 0 ? 0 : 12;
  const total = cartTotal + shipping - discount;

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "AITSHOP10") setDiscount(cartTotal * 0.1);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <ShoppingBag className="h-10 sm:h-12 w-10 sm:w-12 mx-auto text-brand" />
        <h1 className="font-display text-3xl sm:text-4xl mt-4">{t("cart.empty")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">{t("cart.emptyDesc")}</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex px-6 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.97]"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex items-center gap-3 mb-6 sm:mb-10">
        <Link
          to="/shop"
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t("common.shop")}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">{t("cart.title")}</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
        <div className="space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id + item.size + item.color}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-border bg-card"
            >
              <div className="h-20 w-20 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-muted grid place-items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                      {item.product.category}
                    </p>
                    <h3 className="text-sm sm:font-semibold mt-0.5 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {t("cart.size")} {item.size}
                      <span
                        className="inline-block h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full align-middle ml-1.5"
                        style={{ background: item.color }}
                      />
                    </p>
                  </div>
                  <p className="font-display text-base sm:text-lg shrink-0">
                    {formatPrice(item.product.price * item.quantity, language)}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity - 1, item.size, item.color)
                      }
                      className="h-8 sm:h-9 w-8 sm:w-9 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition"
                    >
                      <Minus className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </button>
                    <span className="px-2 sm:px-3 text-xs sm:text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(item.product.id, item.quantity + 1, item.size, item.color)
                      }
                      className="h-8 sm:h-9 w-8 sm:w-9 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition"
                    >
                      <Plus className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive p-1.5 sm:p-2 active:scale-90 transition"
                  >
                    <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border p-5 sm:p-6 bg-card sm:sticky sm:top-24">
          <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-5">
            {t("cart.orderSummary")}
          </h2>
          <dl className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt>{t("common.subtotal")}</dt>
              <dd className="font-semibold">{formatPrice(cartTotal, language)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("common.shipping")}</dt>
              <dd>{shipping === 0 ? t("common.free") : formatPrice(shipping, language)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand">
                <dt>{t("common.discount")}</dt>
                <dd>−{formatPrice(discount, language)}</dd>
              </div>
            )}
          </dl>

          <div className="flex gap-2 mt-4 sm:mt-5">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder={t("common.promoCode")}
              className="flex-1 h-10 px-3 rounded-full border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              onClick={applyPromo}
              className="px-3 sm:px-4 h-10 rounded-full bg-muted text-xs sm:text-sm font-medium hover:bg-muted/70 active:scale-[0.97]"
            >
              {t("common.apply")}
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">{t("cart.promoHint")}</p>

          <div className="border-t border-border mt-4 sm:mt-5 pt-4 sm:pt-5 flex justify-between font-display text-lg sm:text-xl">
            <span>{t("common.total")}</span>
            <span>{formatPrice(total, language)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-4 sm:mt-6 block text-center h-12 leading-[3rem] rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]"
          >
            {t("cart.checkout")} →
          </Link>
          <Link
            to="/shop"
            className="mt-2 sm:mt-3 block text-center text-xs sm:text-sm text-muted-foreground hover:text-brand"
          >
            {t("cart.continueShopping")}
          </Link>

          {/* Store info */}
          <div className="mt-5 pt-5 border-t border-border space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pick-up &amp; Pay in Person
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
              <span>
                Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303
                тоот
              </span>
            </div>
            <a
              href="tel:+97694468252"
              className="flex gap-2 text-xs text-muted-foreground hover:text-brand transition"
            >
              <Phone className="h-3.5 w-3.5 text-brand shrink-0" />
              +976 9446 8252
            </a>
            <a
              href="mailto:contact@aitshop.com"
              className="flex gap-2 text-xs text-muted-foreground hover:text-brand transition"
            >
              <Mail className="h-3.5 w-3.5 text-brand shrink-0" />
              contact@aitshop.com
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
