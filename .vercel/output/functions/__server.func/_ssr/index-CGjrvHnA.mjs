import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getProducts } from "./products-aj_r1Weu.mjs";
import { m as mapDbProduct } from "./product-utils-Bet5orLK.mjs";
import { u as useLanguage, a as useStore, e as categories } from "./router-o9ajxtaq.mjs";
import { P as ProductCard } from "./ProductCard-CvXaKYYM.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { a as ShoppingBag, a4 as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "./createSsrRpc-DYekWtB8.mjs";
import "./server-iErPJQYh.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
function Home() {
  const {
    t
  } = useTranslation();
  const {
    language
  } = useLanguage();
  const {
    addToCart
  } = useStore();
  const [size, setSize] = reactExports.useState(42);
  const [color, setColor] = reactExports.useState("#3B82F6");
  const {
    data: dbProducts = [],
    isPending
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const allProducts = reactExports.useMemo(() => dbProducts.map(mapDbProduct), [dbProducts]);
  const products = reactExports.useMemo(() => allProducts.filter((p) => p.featured !== false), [allProducts]);
  const heroProduct = products[0] ?? null;
  const thumbs = products.slice(0, 6);
  const categoryCounts = reactExports.useMemo(() => {
    const counts = {};
    for (const p of allProducts) {
      const cat = p.category ?? "Sneakers";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    counts["Sale"] = allProducts.filter((p) => p.oldPrice !== void 0).length;
    return counts;
  }, [allProducts]);
  if (isPending || !heroProduct) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-[#3FBAEB] via-[#2DA9E0] to-[#1B8FCB] animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "order-2 lg:order-1 h-[320px] sm:h-[400px] lg:h-[500px] rounded-2xl bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "order-1 lg:order-2 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-24 rounded-full bg-white/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-3/4 rounded-xl bg-white/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 rounded-lg bg-white/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-40 rounded-full bg-white/20 mt-6" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 rounded-xl bg-muted animate-pulse mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6", children: Array.from({
          length: 10
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-2xl bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 rounded bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-3/4 rounded bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/3 rounded bg-muted" })
        ] }, i)) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-[#3FBAEB] via-[#2DA9E0] to-[#1B8FCB]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-4 sm:gap-10 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative lg:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroProduct.image, alt: heroProduct.name, width: 1024, height: 768, fetchPriority: "high", loading: "eager", className: "relative drop-shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-700 w-full h-auto max-h-[180px] sm:max-h-[400px] lg:max-h-[500px] object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-3 sm:mt-6 flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide", children: thumbs.map((thumb) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: {
          id: thumb.id
        }, className: "shrink-0 snap-start h-12 w-12 sm:h-20 sm:w-20 rounded-xl bg-white/20 backdrop-blur grid place-items-center hover:bg-white/30 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumb.image, alt: thumb.name, className: "h-full w-full object-contain p-1.5" }) }, thumb.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white lg:order-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80", children: t("home.featuredDrop") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 sm:mt-3 font-display text-xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95]", children: heroProduct.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 sm:mt-2 text-lg sm:text-2xl lg:text-3xl font-display", children: formatPrice(heroProduct.price) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden sm:block mt-3 sm:mt-4 text-white/85 max-w-md leading-relaxed text-sm sm:text-base", children: heroProduct.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 sm:mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider mb-1.5 sm:mb-2 text-white/80", children: t("common.size") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 sm:gap-2 flex-wrap", children: heroProduct.sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSize(s), className: `h-8 w-8 sm:h-11 sm:w-11 rounded-full text-xs font-semibold transition active:scale-95 ${size === s ? "bg-white text-brand-deep" : "bg-white/15 text-white hover:bg-white/25"}`, children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 sm:mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider mb-1.5 sm:mb-2 text-white/80", children: t("common.color") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 sm:gap-2", children: heroProduct.colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setColor(c), style: {
            background: c
          }, className: `h-6 sm:h-8 w-6 sm:w-8 rounded-full border-2 transition active:scale-90 ${color === c ? "border-white ring-2 ring-white/50" : "border-white/40"}` }, c)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 sm:mt-7 flex gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addToCart(heroProduct, size, color), className: "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 h-10 sm:h-12 rounded-full bg-white text-brand-deep text-sm sm:text-base font-semibold hover:bg-white/90 transition active:scale-[0.97]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" }),
            " ",
            t("common.addToCart")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$id", params: {
            id: heroProduct.id
          }, className: "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 h-10 sm:h-12 rounded-full border border-white/40 text-white text-sm sm:text-base hover:bg-white/10 transition active:scale-[0.97]", children: [
            t("common.details"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-wider text-brand", children: t("common.featured") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl lg:text-4xl mt-1", children: t("home.thisWeeksPicks") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "text-sm font-medium text-muted-foreground hover:text-brand shrink-0 whitespace-nowrap pb-1", children: [
          t("common.viewAll"),
          " →"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5", children: products.slice(0, 3).map((p, i) => {
        const tints = ["bg-[#3FBAEB]", "bg-[#7C76D9]", "bg-[#26B7B0]"];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$id", params: {
          id: p.id
        }, className: `relative ${tints[i]} rounded-3xl p-5 sm:p-6 text-white overflow-hidden group h-72 sm:h-80 ${i === 2 ? "sm:col-span-2 md:col-span-1" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xs", children: "AIT SHOP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl", children: formatPrice(p.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg sm:text-2xl mt-2 max-w-[60%]", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-2 text-white/80 max-w-[70%] line-clamp-3", children: p.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, loading: "lazy", className: "absolute -bottom-4 -right-4 h-56 w-auto -rotate-12 group-hover:rotate-0 transition-transform duration-500 drop-shadow-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-5 left-5 inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-white text-ink text-xs font-semibold", children: [
            t("common.shopNow"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
          ] })
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl lg:text-4xl mb-8", children: t("home.shopByCategory") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/category/$slug", params: {
        slug: c.slug
      }, className: "aspect-square rounded-2xl bg-muted hover:bg-brand/10 grid place-items-center text-center p-4 transition group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg group-hover:text-brand transition", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          categoryCounts[c.name] ?? 0,
          " ",
          t("common.items")
        ] })
      ] }) }, c.slug)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-wider text-brand", children: t("common.bestSellers") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl lg:text-4xl mt-1", children: t("home.lovedByEveryone") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "text-sm font-medium text-muted-foreground hover:text-brand shrink-0 whitespace-nowrap pb-1", children: [
          t("common.viewAll"),
          " →"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6", children: products.slice(6, 14).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] })
  ] });
}
export {
  Home as component
};
