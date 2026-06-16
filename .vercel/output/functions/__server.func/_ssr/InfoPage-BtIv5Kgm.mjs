import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function InfoPage({
  tag,
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-wider text-brand", children: tag }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl mt-2", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children })
  ] });
}
function InfoSection({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border p-6 sm:p-8 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3", children })
  ] });
}
export {
  InfoPage as I,
  InfoSection as a
};
