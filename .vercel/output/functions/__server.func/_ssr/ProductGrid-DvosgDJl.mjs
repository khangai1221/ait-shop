import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as ProductCard } from "./ProductCard-B_kTLAIP.mjs";
function ProductGrid({ products }) {
  if (products.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 sm:py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl mb-2", children: "No products found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Try adjusting your filters or search term." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) });
}
export {
  ProductGrid as P
};
