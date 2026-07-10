import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-Cxx21TjL.mjs";
import { m as mapDbProduct } from "./product-utils-BnsRFOMC.mjs";
import { u as useLanguage, a as useStore } from "./router-CJ0AhuTC.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { H as Heart, b as Trash2, a as ShoppingBag } from "../_libs/lucide-react.mjs";
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
import "./server-NH-cEY17.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "./shoe-6-BmZDyfVV.mjs";
import "./shoe-5-D0gWoJoO.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
function Wishlist() {
  const {
    t
  } = useTranslation();
  const {
    language
  } = useLanguage();
  const {
    wishlist,
    toggleWishlist,
    addToCart
  } = useStore();
  const {
    data: dbProducts = []
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const items = reactExports.useMemo(() => dbProducts.map(mapDbProduct).filter((p) => wishlist.includes(p.id)), [dbProducts, wishlist]);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-12 w-12 mx-auto text-brand" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mt-4", children: t("wishlist.empty") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: t("wishlist.emptyDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "mt-6 inline-flex px-6 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("wishlist.browseShop") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl sm:text-4xl lg:text-5xl mb-8 sm:mb-10", children: [
      t("common.wishlist"),
      " (",
      items.length,
      ")"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border p-5 bg-card group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: {
        id: p.id
      }, className: "block aspect-square rounded-2xl bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "h-full w-full object-contain p-4 group-hover:scale-110 transition" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-between items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground truncate", children: p.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mt-1 truncate", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg mt-1", children: formatPrice(p.price) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleWishlist(p.id), className: "p-2 text-muted-foreground hover:text-destructive shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addToCart(p), className: "mt-4 w-full inline-flex justify-center items-center gap-2 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
        " ",
        t("wishlist.moveToCart")
      ] })
    ] }, p.id)) })
  ] });
}
export {
  Wishlist as component
};
