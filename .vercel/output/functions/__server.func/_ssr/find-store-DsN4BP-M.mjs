import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as InfoPage, a as InfoSection } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { g as MapPin, m as Clock, a as ShoppingBag } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function FindStore() {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoPage, { tag: t("findStore.tag"), title: t("findStore.title"), description: t("findStore.desc"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title: t("findStore.addressLabel"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
      t("findStore.address")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title: t("findStore.hoursLabel"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
      t("findStore.hours")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title: t("common.checkout"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
      t("findStore.pickupNote")
    ] }) })
  ] });
}
export {
  FindStore as component
};
