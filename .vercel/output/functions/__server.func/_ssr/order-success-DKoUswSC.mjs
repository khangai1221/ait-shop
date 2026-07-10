import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as Route$i } from "./router-DA4WPAAH.mjs";
import "../_libs/sonner.mjs";
import "../_libs/clerk__clerk-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { i as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "./server-CNKxx3CJ.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "../_libs/zod.mjs";
function Success() {
  const {
    t
  } = useTranslation();
  const {
    orderId
  } = Route$i.useSearch();
  const orderNumber = orderId ?? "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 mx-auto rounded-full bg-brand/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10 text-brand" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mt-6", children: t("orderSuccess.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3", children: t("orderSuccess.desc", {
      id: orderNumber
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border border-border p-6 text-left bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg mb-3", children: t("orderSuccess.whatsNext") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-muted-foreground space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          t("orderSuccess.step1")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          t("orderSuccess.step2")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          t("orderSuccess.step3")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "mt-8 inline-flex px-7 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("orderSuccess.continueShopping") })
  ] });
}
export {
  Success as component
};
