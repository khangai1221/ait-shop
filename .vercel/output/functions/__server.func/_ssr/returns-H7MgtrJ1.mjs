import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { I as InfoPage } from "./InfoPage-BtIv5Kgm.mjs";
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
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Returns() {
  const {
    t
  } = useTranslation();
  const STEPS = [[t("returnsPage.step1Title"), t("returnsPage.step1Desc")], [t("returnsPage.step2Title"), t("returnsPage.step2Desc")], [t("returnsPage.step3Title"), t("returnsPage.step3Desc")]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoPage, { tag: t("returnsPage.tag"), title: t("returnsPage.title"), description: t("returnsPage.desc"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-4", children: STEPS.map(([title, desc]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border p-6 sm:p-8 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg sm:text-xl mb-2", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: desc })
    ] }, title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-brand font-medium hover:underline", children: t("common.contactUs") }) })
  ] });
}
export {
  Returns as component
};
