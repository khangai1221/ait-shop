import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as getProductById, g as getProducts } from "./products-0wB96ryw.mjs";
import { m as mapDbProduct } from "./product-utils-BeoWexCX.mjs";
import { u as useLanguage, o as Route$2, a as useStore } from "./router-DA4WPAAH.mjs";
import { P as ProductCard } from "./ProductCard-C68Qoa4u.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { e as Truck, a5 as RotateCcw, c as ShieldCheck, n as ChevronLeft, a2 as ZoomIn, a6 as ChevronRight, a7 as Star, p as Minus, q as Plus, a as ShoppingBag, H as Heart, X } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
import "./server-CNKxx3CJ.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) });
}
function ZoomModal({
  images,
  active,
  onClose,
  onNext,
  onPrev
}) {
  const [scale, setScale] = reactExports.useState(1);
  const [origin, setOrigin] = reactExports.useState({
    x: 50,
    y: 50
  });
  reactExports.useEffect(() => {
    setScale(1);
    setOrigin({
      x: 50,
      y: 50
    });
  }, [active]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);
  const handleWheel = reactExports.useCallback((e) => {
    e.preventDefault();
    setScale((s) => Math.min(4, Math.max(1, s + (e.deltaY < 0 ? 0.3 : -0.3))));
  }, []);
  const handleMouseMove = reactExports.useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
    const y = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100));
    setOrigin({
      x,
      y
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-black/96 flex items-center justify-center animate-fade-in", onClick: onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/25 transition z-10", "aria-label": "Close zoom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center overflow-hidden", style: {
      width: "90vw",
      height: "90vh"
    }, onWheel: handleWheel, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: images[active], alt: "Zoomed product view", onMouseMove: handleMouseMove, style: {
      transformOrigin: `${origin.x}% ${origin.y}%`,
      transform: `scale(${scale})`,
      cursor: scale > 1 ? "crosshair" : "zoom-in",
      transition: scale === 1 ? "transform 0.25s ease" : "none"
    }, className: "max-w-full max-h-full object-contain select-none", draggable: false }) }),
    images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onPrev();
      }, className: "absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/25 transition", "aria-label": "Previous image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        onNext();
      }, className: "absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/25 transition", "aria-label": "Next image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2", children: images.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        const diff = i - active;
        if (diff > 0) for (let j = 0; j < diff; j++) onNext();
        else for (let j = 0; j < -diff; j++) onPrev();
      }, className: `h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/30"}` }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 right-6 text-white/30 text-xs hidden sm:block", children: scale > 1 ? "Hover to aim · Scroll to zoom" : "Scroll to zoom · Esc to close" })
  ] });
}
function ProductPage() {
  const {
    t
  } = useTranslation();
  const {
    language
  } = useLanguage();
  const {
    id
  } = Route$2.useParams();
  const {
    data: dbProduct,
    isLoading
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({
      data: {
        id: parseInt(id)
      }
    })
  });
  const {
    data: allDbProducts = []
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts()
  });
  const {
    addToCart,
    toggleWishlist,
    wishlist
  } = useStore();
  const [size, setSize] = reactExports.useState(42);
  const [color, setColor] = reactExports.useState("#3B82F6");
  const [qty, setQty] = reactExports.useState(1);
  const [activeImage, setActiveImage] = reactExports.useState(0);
  const [paused, setPaused] = reactExports.useState(false);
  const [zoomed, setZoomed] = reactExports.useState(false);
  const product = reactExports.useMemo(() => {
    setActiveImage(0);
    return dbProduct ? mapDbProduct(dbProduct) : null;
  }, [dbProduct]);
  const related = reactExports.useMemo(() => product ? allDbProducts.map(mapDbProduct).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [], [allDbProducts, product]);
  const images = product?.images ?? [];
  reactExports.useEffect(() => {
    if (images.length <= 1 || paused || zoomed) return;
    const id2 = setTimeout(() => {
      setActiveImage((i) => (i + 1) % images.length);
    }, 5e3);
    return () => clearTimeout(id2);
  }, [activeImage, paused, zoomed, images.length]);
  const goNext = reactExports.useCallback(() => setActiveImage((i) => (i + 1) % images.length), [images.length]);
  const goPrev = reactExports.useCallback(() => setActiveImage((i) => (i - 1 + images.length) % images.length), [images.length]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {});
  if (!product) throw notFound();
  const liked = wishlist.includes(product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const badges = [{
    Icon: Truck,
    label: t("product.freeDelivery"),
    sub: t("product.ordersOver")
  }, {
    Icon: RotateCcw,
    label: t("product.returns30"),
    sub: t("product.hassleFree")
  }, {
    Icon: ShieldCheck,
    label: t("product.secureCheckout"),
    sub: t("product.encrypted")
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
        t("common.back")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-brand transition", children: t("common.home") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "hover:text-brand transition", children: t("common.shop") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink truncate max-w-[200px]", children: product.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6 sm:gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-square rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#EBF7FD] to-[#D5EDFA] overflow-hidden cursor-zoom-in select-none", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), onClick: () => setZoomed(true), children: [
          images.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: `${product.name} view ${i + 1}`, className: `absolute inset-0 h-full w-full object-contain p-6 sm:p-10 transition-opacity duration-500 ${i === activeImage ? "opacity-100" : "opacity-0"}` }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 h-8 w-8 rounded-full bg-white/70 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4 text-ink/60" }) }),
          images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
              e.stopPropagation();
              goPrev();
            }, "aria-label": "Previous image", className: "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-md hover:bg-white transition active:scale-95 cursor-default", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5 text-ink" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
              e.stopPropagation();
              goNext();
            }, "aria-label": "Next image", className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-md hover:bg-white transition active:scale-95 cursor-default", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-ink" }) })
          ] }),
          images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 pb-3", children: images.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
              e.stopPropagation();
              setActiveImage(i);
            }, className: `h-1.5 rounded-full transition-all duration-300 cursor-default ${i === activeImage ? "w-5 bg-brand" : "w-1.5 bg-brand/30"}` }, i)) }),
            !paused && !zoomed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 bg-brand/50 animate-img-progress" }, `${activeImage}-prog`)
          ] })
        ] }),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide", children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImage(i), className: `snap-start shrink-0 w-16 sm:w-20 aspect-square rounded-xl sm:rounded-2xl bg-muted grid place-items-center transition ${i === activeImage ? "ring-2 ring-brand" : "opacity-60 hover:opacity-100 hover:ring-2 ring-brand/40"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: `${product.name} view ${i + 1}`, className: "h-full w-full object-contain p-1.5 sm:p-2" }) }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs uppercase tracking-wider text-brand", children: product.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-3.5 sm:h-4 w-3.5 sm:w-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}` }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs sm:text-sm text-muted-foreground", children: [
            product.rating.toFixed(1),
            " · 128 ",
            t("product.reviews")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl sm:text-3xl mt-4 sm:mt-5", children: [
          formatPrice(product.price),
          product.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground line-through", children: formatPrice(product.oldPrice) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 sm:mt-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2", children: t("common.size") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 sm:gap-2 flex-wrap", children: product.sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSize(s), className: `h-9 w-9 sm:h-11 sm:w-11 rounded-full text-xs font-semibold transition active:scale-95 ${size === s ? "bg-ink text-white" : "border border-border hover:border-brand"}`, children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 sm:mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2", children: t("common.color") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: product.colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setColor(c), style: {
            background: c
          }, className: `h-8 sm:h-9 w-8 sm:w-9 rounded-full border-2 transition active:scale-90 ${color === c ? "border-brand ring-2 ring-brand/40" : "border-border"}` }, c)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 sm:mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2", children: t("common.quantity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center border border-border rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(Math.max(1, qty - 1)), className: "h-10 sm:h-11 w-10 sm:w-11 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 sm:h-4 w-3.5 sm:w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 sm:px-4 text-sm sm:text-base font-semibold min-w-[2rem] text-center", children: qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(qty + 1), className: "h-10 sm:h-11 w-10 sm:w-11 grid place-items-center active:scale-90 hover:bg-muted rounded-full transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 sm:h-4 w-3.5 sm:w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 sm:mt-6", children: lowStock && !outOfStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm font-medium text-amber-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-amber-500" }),
          t("common.onlyLeft", {
            count: product.stock
          })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
          t("common.inStock")
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 sm:mt-5 flex gap-3 lg:sticky lg:bottom-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addToCart(product, size, color, qty), className: "flex-1 inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.97] shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
            " ",
            t("common.addToCart")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleWishlist(product.id), className: `h-12 sm:h-13 w-12 sm:w-13 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full border-2 transition active:scale-95 ${liked ? "bg-brand/10 border-brand text-brand" : "border-border hover:border-brand"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5", fill: liked ? "currentColor" : "none" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3", children: badges.map(({
          Icon,
          label,
          sub
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4 flex sm:block items-center gap-3 sm:gap-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-brand shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold sm:mt-2", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
          ] })
        ] }, label)) })
      ] })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 sm:mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl mb-4 sm:mb-6", children: t("product.youMightAlsoLike") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] }),
    zoomed && /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomModal, { images, active: activeImage, onClose: () => setZoomed(false), onNext: goNext, onPrev: goPrev })
  ] });
}
export {
  ProductPage as component
};
