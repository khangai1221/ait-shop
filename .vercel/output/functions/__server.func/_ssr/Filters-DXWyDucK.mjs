import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useLanguage, e as categories } from "./router-DA4WPAAH.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const ALL_COLORS = ["#3B82F6", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#111827", "#FFFFFF"];
function Filters({
  value,
  onChange
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSection, { title: t("common.category"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChange({ ...value, category: null }),
          className: `block w-full text-left text-sm py-1.5 px-3 rounded-lg transition ${!value.category ? "bg-brand/10 text-brand font-medium" : "hover:bg-muted text-muted-foreground"}`,
          children: t("categories.all")
        }
      ),
      categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChange({ ...value, category: c.name }),
          className: `block w-full text-left text-sm py-1.5 px-3 rounded-lg transition ${value.category === c.name ? "bg-brand/10 text-brand font-medium" : "hover:bg-muted text-muted-foreground"}`,
          children: c.name
        },
        c.slug
      ))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterSection, { title: t("common.price"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: 2e5,
          max: 7e5,
          step: 1e4,
          value: value.maxPrice,
          onChange: (e) => onChange({ ...value, maxPrice: Number(e.target.value) }),
          className: "w-full accent-[color:var(--brand)]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(2e5) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-ink", children: [
          t("common.upTo"),
          " ",
          formatPrice(value.maxPrice)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSection, { title: t("common.size"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: ALL_SIZES.map((s) => {
      const active = value.sizes.includes(s);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChange({
            ...value,
            sizes: active ? value.sizes.filter((x) => x !== s) : [...value.sizes, s]
          }),
          className: `h-10 rounded-lg border text-sm font-medium transition ${active ? "bg-ink text-white border-ink" : "border-border hover:border-brand"}`,
          children: s
        },
        s
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSection, { title: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ALL_COLORS.map((c) => {
      const active = value.colors.includes(c);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChange({
            ...value,
            colors: active ? value.colors.filter((x) => x !== c) : [...value.colors, c]
          }),
          style: { background: c },
          className: `h-8 w-8 rounded-full border-2 transition ${active ? "border-brand ring-2 ring-brand/30" : "border-border"}`,
          "aria-label": c
        },
        c
      );
    }) }) })
  ] });
}
function FilterSection({ title, children }) {
  const [open, setOpen] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "flex w-full items-center justify-between mb-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm uppercase tracking-wider", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: open ? "−" : "+" })
        ]
      }
    ),
    open && children
  ] });
}
const emptyFilters = {
  sizes: [],
  colors: [],
  category: null,
  maxPrice: 7e5
};
export {
  Filters as F,
  emptyFilters as e
};
