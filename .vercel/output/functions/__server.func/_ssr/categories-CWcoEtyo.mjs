import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as categories, p as products } from "./mock-data-DGThabGe.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "./shoe-6-BmZDyfVV.mjs";
import "./shoe-5-D0gWoJoO.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Categories() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm uppercase tracking-wider text-brand", children: t("categories.browse") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2", children: t("categories.all") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: categories.map((c, i) => {
      const sample = products.find((p) => p.category === c.name) || products[0];
      const tints = ["from-[#3FBAEB] to-[#1B8FCB]", "from-[#7C76D9] to-[#5A53B5]", "from-[#26B7B0] to-[#0F8A85]", "from-[#F59E0B] to-[#B97208]", "from-[#EF4444] to-[#B91C1C]", "from-[#111827] to-[#0a0f1c]"];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/category/$slug", params: {
        slug: c.slug
      }, className: `relative h-56 sm:h-72 rounded-2xl sm:rounded-3xl p-5 sm:p-7 overflow-hidden bg-gradient-to-br ${tints[i % tints.length]} text-white group`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] sm:text-xs uppercase tracking-wider text-white/70", children: [
            c.count,
            " ",
            t("common.items")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl mt-1", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm mt-1 sm:mt-2 text-white/85 max-w-[60%] sm:max-w-[55%]", children: c.tagline })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sample.image, alt: c.name, loading: "lazy", className: "absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 h-40 sm:h-52 w-auto -rotate-12 group-hover:rotate-0 transition-transform duration-500 drop-shadow-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-4 sm:bottom-5 left-5 sm:left-7 text-xs sm:text-sm font-semibold", children: t("categories.shop", {
          name: c.name
        }) })
      ] }, c.slug);
    }) })
  ] });
}
export {
  Categories as component
};
