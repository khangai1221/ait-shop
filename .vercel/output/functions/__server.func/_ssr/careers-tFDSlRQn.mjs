import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { I as InfoPage } from "./InfoPage-EcIBjjaV.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { r as Briefcase } from "../_libs/lucide-react.mjs";
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
function Careers() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("careersPage.tag"), title: t("careersPage.title"), description: t("careersPage.desc"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-8 sm:p-12 text-center bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-8 w-8 mx-auto text-brand mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed max-w-md mx-auto", children: t("careersPage.cta") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "mt-6 inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("careersPage.button") })
  ] }) });
}
export {
  Careers as component
};
