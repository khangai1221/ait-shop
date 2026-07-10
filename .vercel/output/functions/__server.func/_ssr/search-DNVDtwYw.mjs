import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-Cxx21TjL.mjs";
import { m as mapDbProduct } from "./product-utils-BnsRFOMC.mjs";
import { P as ProductGrid } from "./ProductGrid-C1bVR41s.mjs";
import { R as Route$n } from "./router-CJ0AhuTC.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { S as Search, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-NH-cEY17.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
import "./shoe-6-BmZDyfVV.mjs";
import "./shoe-5-D0gWoJoO.mjs";
import "./ProductCard-Bh4Cm5LO.mjs";
import "./format-price-C5cwcbm-.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
function SearchPage() {
  const {
    t
  } = useTranslation();
  const {
    q: initial
  } = Route$n.useSearch();
  const [q, setQ] = reactExports.useState(initial ?? "");
  const {
    data: dbProducts = []
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const results = reactExports.useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return dbProducts.map(mapDbProduct).filter((p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
  }, [dbProducts, q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-8", children: t("common.search") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xl mb-6 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: t("search.placeholder"), className: "w-full h-12 sm:h-13 pl-11 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-full border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" }),
      q && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQ(""), className: "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-full hover:bg-muted transition", "aria-label": "Clear search", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" }) })
    ] }),
    q.trim() === "" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: t("search.typeToSearch") }) : results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 sm:py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl sm:text-2xl", children: [
        t("search.noResults"),
        " “",
        q,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2", children: t("search.noResultsHint") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6", children: [
        results.length,
        " ",
        t("search.results"),
        " “",
        q,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: results })
    ] })
  ] });
}
export {
  SearchPage as component
};
