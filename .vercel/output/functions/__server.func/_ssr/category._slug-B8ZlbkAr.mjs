import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-0wB96ryw.mjs";
import { m as mapDbProduct } from "./product-utils-BeoWexCX.mjs";
import { q as Route, e as categories } from "./router-DA4WPAAH.mjs";
import { e as emptyFilters, F as Filters } from "./Filters-DXWyDucK.mjs";
import { P as ProductGrid } from "./ProductGrid-JO8xVENu.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { d as SlidersHorizontal, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tanstack__query-core.mjs";
import "./server-CNKxx3CJ.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "./format-price-C5cwcbm-.mjs";
import "./ProductCard-C68Qoa4u.mjs";
const SORT_KEYS = ["newest", "priceLowHigh", "priceHighLow", "popular"];
function activeFilterCount(f) {
  let count = 0;
  if (f.sizes.length) count++;
  if (f.colors.length) count++;
  if (f.maxPrice < 7e5) count++;
  return count;
}
function CategoryPage() {
  const {
    t
  } = useTranslation();
  const {
    slug
  } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw notFound();
  const [filters, setFilters] = reactExports.useState({
    ...emptyFilters,
    category: cat.name
  });
  const [sort, setSort] = reactExports.useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = reactExports.useState(false);
  const activeCount = activeFilterCount(filters);
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
  const {
    data: dbProducts = [],
    isLoading
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const filtered = reactExports.useMemo(() => {
    let r = dbProducts.map(mapDbProduct).filter((p) => p.category === cat.name && p.price <= filters.maxPrice);
    if (filters.sizes.length) r = r.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length) r = r.filter((p) => p.colors.some((c) => filters.colors.includes(c)));
    if (sort === "priceLowHigh") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "priceHighLow") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "popular") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [dbProducts, filters, sort, cat.name]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-white/80", children: t("common.categories") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-5xl lg:text-6xl mt-3", children: cat.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/85 max-w-xl text-sm sm:text-base", children: cat.tagline })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Filters, { value: filters, onChange: setFilters }) }),
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
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: filtered })
      ] })
    ] }) }),
    mobileFilterOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-filter-drawer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "backdrop", onClick: () => setMobileFilterOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pull-indicator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: t("shop.filters") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileFilterOpen(false), className: "h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition", "aria-label": "Close filters", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filters, { value: filters, onChange: setFilters }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileFilterOpen(false), className: "mt-8 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]", children: t("shop.showResults", {
          count: filtered.length
        }) })
      ] })
    ] })
  ] });
}
export {
  CategoryPage as component
};
