import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useLanguage, a as useStore } from "./router-DA4WPAAH.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { a as ShoppingBag, n as ChevronLeft, p as Minus, q as Plus, b as Trash2, g as MapPin, m as Phone, j as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-CNKxx3CJ.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "../_libs/zod.mjs";
function CartPage() {
  const {
    t
  } = useTranslation();
  const {
    language
  } = useLanguage();
  const {
    cart,
    updateQty,
    removeFromCart,
    cartTotal
  } = useStore();
  const [promo, setPromo] = reactExports.useState("");
  const [discount, setDiscount] = reactExports.useState(0);
  const shipping = cartTotal > 100 || cartTotal === 0 ? 0 : 12;
  const total = cartTotal + shipping - discount;
  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "AITSHOP10") setDiscount(cartTotal * 0.1);
  };
  if (cart.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-10 sm:h-12 w-10 sm:w-12 mx-auto text-brand" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl mt-4", children: t("cart.empty") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground mt-2", children: t("cart.emptyDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "mt-6 inline-flex px-6 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.97]", children: t("cart.continueShopping") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
        t("common.shop")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl", children: t("cart.title") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 sm:space-y-4", children: cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 sm:h-28 sm:w-28 shrink-0 rounded-xl bg-muted grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.product.image, alt: item.product.name, className: "h-full w-full object-contain p-2" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground", children: item.product.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:font-semibold mt-0.5 truncate", children: item.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1", children: [
                t("cart.size"),
                " ",
                item.size,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full align-middle ml-1.5", style: {
                  background: item.color
                } })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base sm:text-lg shrink-0", children: formatPrice(item.product.price * item.quantity) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 sm:mt-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center border border-border rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(item.product.id, item.quantity - 1, item.size, item.color), className: "h-8 sm:h-9 w-8 sm:w-9 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 sm:h-3.5 w-3 sm:w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 sm:px-3 text-xs sm:text-sm font-semibold", children: item.quantity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(item.product.id, item.quantity + 1, item.size, item.color), className: "h-8 sm:h-9 w-8 sm:w-9 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 sm:h-3.5 w-3 sm:w-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeFromCart(item.product.id, item.size, item.color), className: "text-muted-foreground hover:text-destructive p-1.5 sm:p-2 active:scale-90 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 sm:h-4 w-3.5 sm:w-4" }) })
          ] })
        ] })
      ] }, item.product.id + item.size + item.color)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "h-fit rounded-2xl border border-border p-5 sm:p-6 bg-card sm:sticky sm:top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl mb-4 sm:mb-5", children: t("cart.orderSummary") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-2 sm:space-y-3 text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.subtotal") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold", children: formatPrice(cartTotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.shipping") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: shipping === 0 ? t("common.free") : formatPrice(shipping) })
          ] }),
          discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-brand", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.discount") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { children: [
              "−",
              formatPrice(discount)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4 sm:mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: promo, onChange: (e) => setPromo(e.target.value), placeholder: t("common.promoCode"), className: "flex-1 h-10 px-3 rounded-full border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: applyPromo, className: "px-3 sm:px-4 h-10 rounded-full bg-muted text-xs sm:text-sm font-medium hover:bg-muted/70 active:scale-[0.97]", children: t("common.apply") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground mt-2", children: t("cart.promoHint") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border mt-4 sm:mt-5 pt-4 sm:pt-5 flex justify-between font-display text-lg sm:text-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.total") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/checkout", className: "mt-4 sm:mt-6 block text-center h-12 leading-[3rem] rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]", children: [
          t("cart.checkout"),
          " →"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "mt-2 sm:mt-3 block text-center text-xs sm:text-sm text-muted-foreground hover:text-brand", children: t("cart.continueShopping") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-5 border-t border-border space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Pick-up & Pay in Person" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-brand shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+97694468252", className: "flex gap-2 text-xs text-muted-foreground hover:text-brand transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-brand shrink-0" }),
            "+976 9446 8252"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:contact@aitshop.com", className: "flex gap-2 text-xs text-muted-foreground hover:text-brand transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 text-brand shrink-0" }),
            "contact@aitshop.com"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  CartPage as component
};
