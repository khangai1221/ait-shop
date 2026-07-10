import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-aj_r1Weu.mjs";
import { m as mapDbProduct } from "./product-utils-Bet5orLK.mjs";
import { e as emptyFilters, F as Filters } from "./Filters-DjKbOEtk.mjs";
import { P as ProductGrid } from "./ProductGrid-CB0R9kvU.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { d as SlidersHorizontal, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./createSsrRpc-DYekWtB8.mjs";
import "./server-iErPJQYh.mjs";
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
import "./router-o9ajxtaq.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "./format-price-C5cwcbm-.mjs";
import "./ProductCard-CvXaKYYM.mjs";
const SORT_KEYS = ["newest", "priceLowHigh", "priceHighLow", "popular"];
function activeFilterCount(f) {
  let count = 0;
  if (f.category) count++;
  if (f.sizes.length) count++;
  if (f.colors.length) count++;
  if (f.maxPrice < 7e5) count++;
  return count;
}
function Shop() {
  const {
    t
  } = useTranslation();
  const [filters, setFilters] = reactExports.useState(emptyFilters);
  const [sort, setSort] = reactExports.useState("newest");
  const [page, setPage] = reactExports.useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = reactExports.useState(false);
  const perPage = 8;
  const {
    data: dbProducts = [],
    isLoading
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const allProducts = reactExports.useMemo(() => dbProducts.map(mapDbProduct), [dbProducts]);
  reactExports.useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterOpen]);
  const filtered = reactExports.useMemo(() => {
    let r = allProducts.filter((p) => p.price <= filters.maxPrice);
    if (filters.category) r = r.filter((p) => p.category === filters.category);
    if (filters.sizes.length) r = r.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length) r = r.filter((p) => p.colors.some((c) => filters.colors.includes(c)));
    if (sort === "priceLowHigh") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "priceHighLow") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "popular") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [allProducts, filters, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = activeFilterCount(filters);
  const updateFilters = (v) => {
    setFilters(v);
    setPage(1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm uppercase tracking-wider text-brand", children: t("common.shop") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2", children: t("shop.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground mt-2 max-w-xl", children: t("shop.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Filters, { value: filters, onChange: updateFilters }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: isLoading ? t("common.loading") : `${filtered.length} ${t("shop.products")}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMobileFilterOpen(true), className: "lg:hidden inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full border border-border text-xs sm:text-sm font-medium hover:bg-muted transition active:scale-[0.97] shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 shrink-0" }),
              t("shop.filters"),
              activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold grid place-items-center shrink-0", children: activeCount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "flex-1 sm:flex-none h-10 min-w-0 rounded-full border border-border px-3 sm:px-4 text-xs sm:text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand", children: SORT_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: t(`shop.${key}`) }, key)) })
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: visible }),
        pages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 sm:mt-10 flex justify-center gap-1.5 sm:gap-2 flex-wrap", children: Array.from({
          length: pages
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage(i + 1), className: `h-9 sm:h-10 w-9 sm:w-10 rounded-full text-xs sm:text-sm font-semibold transition active:scale-[0.95] ${page === i + 1 ? "bg-brand text-brand-foreground" : "border border-border hover:bg-muted"}`, children: i + 1 }, i)) })
      ] })
    ] }),
    mobileFilterOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-filter-drawer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "backdrop", onClick: () => setMobileFilterOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pull-indicator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: t("shop.filters") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileFilterOpen(false), className: "h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition", "aria-label": "Close filters", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filters, { value: filters, onChange: updateFilters }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileFilterOpen(false), className: "mt-8 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]", children: t("shop.showResults", {
          count: filtered.length
        }) })
      ] })
    ] })
  ] });
}
export {
  Shop as component
};
