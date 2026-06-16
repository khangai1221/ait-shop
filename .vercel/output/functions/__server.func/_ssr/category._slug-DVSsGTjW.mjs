import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-9cTqsarn.mjs";
import { m as mapDbProduct } from "./product-utils-CixKNlJi.mjs";
import { c as categories } from "./mock-data-BoS7PP-5.mjs";
import { e as emptyFilters, F as Filters } from "./Filters-DfMudzPJ.mjs";
import { P as ProductGrid } from "./ProductGrid-DvosgDJl.mjs";
import { f as Route } from "./router-DToCCjPL.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tanstack__query-core.mjs";
import "./createSsrRpc-IxLg67WK.mjs";
import "./server-BMY1Y0f7.mjs";
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
import "./shoe-6-BmZDyfVV.mjs";
import "./shoe-5-D0gWoJoO.mjs";
import "./format-price-C5cwcbm-.mjs";
import "./ProductCard-B_kTLAIP.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
const SORT_KEYS = ["newest", "priceLowHigh", "priceHighLow", "popular"];
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-white/80", children: t("common.categories") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl lg:text-6xl mt-3", children: cat.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/85 max-w-xl", children: cat.tagline })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[260px_1fr] gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Filters, { value: filters, onChange: setFilters }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? t("common.loading") : `${filtered.length} ${t("shop.products")}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "h-10 rounded-full border border-border px-4 text-sm bg-background", children: SORT_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: t(`shop.${key}`) }, key)) })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: filtered })
      ] })
    ] })
  ] });
}
export {
  CategoryPage as component
};
