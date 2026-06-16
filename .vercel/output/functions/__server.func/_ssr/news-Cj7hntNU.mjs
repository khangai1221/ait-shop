import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as InfoPage } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { N as Newspaper } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
const NEWS_ITEMS = [];
function News() {
  const {
    t,
    i18n
  } = useTranslation();
  const lang = i18n.language === "mn" ? "mn" : "en";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("newsPage.tag"), title: t("newsPage.title"), description: t("newsPage.desc"), children: NEWS_ITEMS.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-8 w-8 mx-auto mb-3" }),
    t("newsPage.empty")
  ] }) : NEWS_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border p-6 sm:p-8 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: item.date }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl mt-1 mb-2", children: item.title[lang] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: item.body[lang] })
  ] }, item.date)) });
}
export {
  News as component
};
