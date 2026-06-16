import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as InfoPage, a as InfoSection } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { e as Truck, Z as Zap, f as Store } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Shipping() {
  const {
    t
  } = useTranslation();
  const METHODS = [{
    Icon: Truck,
    title: t("shippingPage.standardTitle"),
    desc: t("shippingPage.standardDesc")
  }, {
    Icon: Zap,
    title: t("shippingPage.expressTitle"),
    desc: t("shippingPage.expressDesc")
  }, {
    Icon: Store,
    title: t("shippingPage.pickupTitle"),
    desc: t("shippingPage.pickupDesc")
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("shippingPage.tag"), title: t("shippingPage.title"), description: t("shippingPage.desc"), children: METHODS.map(({
    Icon,
    title,
    desc
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
    desc
  ] }) }, title)) });
}
export {
  Shipping as component
};
