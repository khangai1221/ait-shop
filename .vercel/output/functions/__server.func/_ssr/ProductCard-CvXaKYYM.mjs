import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useLanguage, a as useStore } from "./router-o9ajxtaq.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { H as Heart, a as ShoppingBag } from "../_libs/lucide-react.mjs";
function ProductCardInner({ product }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const liked = wishlist.includes(product.id);
  const outOfStock = product.stock === 0;
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) addToCart(product);
  };
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/product/$id",
        params: { id: product.id },
        className: "block relative overflow-hidden rounded-2xl bg-muted/50 aspect-square",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition" }),
          product.badge && !outOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-ink text-white", children: product.badge }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image,
              alt: product.name,
              loading: "lazy",
              className: "absolute inset-0 h-full w-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleToggleWishlist,
              "aria-label": t("common.wishlist"),
              className: `absolute top-3 right-3 z-10 h-9 w-9 grid place-items-center rounded-full shadow-lg transition active:scale-95 ${liked ? "bg-brand text-brand-foreground" : "bg-white/90 text-ink hover:bg-white backdrop-blur-sm"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4", fill: liked ? "currentColor" : "none" })
            }
          ),
          !outOfStock && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-card-actions flex sm:hidden absolute inset-x-3 bottom-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleAddToCart,
                className: "flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-brand text-brand-foreground text-xs font-semibold active:scale-[0.97]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
                  " ",
                  t("common.addToCart")
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-card-actions hidden sm:flex absolute inset-x-3 bottom-3 items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleAddToCart,
                className: "flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-deep transition active:scale-[0.97]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
                  " ",
                  t("common.addToCart")
                ]
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 sm:pt-4 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: product.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/product/$id",
          params: { id: product.id },
          className: "block mt-1 font-semibold text-sm leading-tight hover:text-brand transition line-clamp-2",
          children: product.name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base", children: formatPrice(product.price) }),
        product.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatPrice(product.oldPrice) }),
        !outOfStock && product.stock <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-500 font-medium", children: t("common.onlyLeft", { count: product.stock }) })
      ] })
    ] })
  ] });
}
const ProductCard = reactExports.memo(ProductCardInner);
export {
  ProductCard as P
};
