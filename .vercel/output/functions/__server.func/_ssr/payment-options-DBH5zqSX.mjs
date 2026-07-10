import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as InfoPage, a as InfoSection } from "./InfoPage-EcIBjjaV.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { B as Banknote, f as Store, g as MapPin } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function PaymentOptions() {
  const {
    t
  } = useTranslation();
  const METHODS = [{
    Icon: Banknote,
    title: t("paymentPage.cashTitle"),
    desc: t("paymentPage.cashDesc")
  }, {
    Icon: Store,
    title: t("paymentPage.bankTitle"),
    desc: t("paymentPage.bankDesc")
  }, {
    Icon: MapPin,
    title: t("paymentPage.pickupTitle"),
    desc: t("paymentPage.pickupDesc")
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("paymentPage.tag"), title: t("paymentPage.title"), description: t("paymentPage.desc"), children: METHODS.map(({
    Icon,
    title,
    desc
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
    desc
  ] }) }, title)) });
}
export {
  PaymentOptions as component
};
