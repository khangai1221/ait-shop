import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-0wB96ryw.mjs";
import { m as mapDbProduct } from "./product-utils-BeoWexCX.mjs";
import { P as ProductGrid } from "./ProductGrid-JO8xVENu.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./router-DA4WPAAH.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./server-CNKxx3CJ.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "./ProductCard-C68Qoa4u.mjs";
import "./format-price-C5cwcbm-.mjs";
function SalePage() {
  const {
    t
  } = useTranslation();
  const {
    data: dbProducts = [],
    isLoading
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const onSale = reactExports.useMemo(() => dbProducts.map(mapDbProduct).filter((p) => p.oldPrice !== void 0 || p.category === "Sale" || p.badge?.includes("%")), [dbProducts]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-to-br from-[#EF4444] to-[#B91C1C] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-white/80", children: t("sale.tag") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl lg:text-6xl mt-3", children: t("sale.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/85 max-w-xl", children: t("sale.subtitle") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: onSale }) })
  ] });
}
export {
  SalePage as component
};
