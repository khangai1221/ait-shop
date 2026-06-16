import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as InfoPage, a as InfoSection } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { R as Recycle, c as ShieldCheck, L as Link2 } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Sustainability() {
  const {
    t
  } = useTranslation();
  const PILLARS = [{
    Icon: Recycle,
    title: t("sustainabilityPage.materialsTitle"),
    desc: t("sustainabilityPage.materialsDesc")
  }, {
    Icon: ShieldCheck,
    title: t("sustainabilityPage.factoriesTitle"),
    desc: t("sustainabilityPage.factoriesDesc")
  }, {
    Icon: Link2,
    title: t("sustainabilityPage.supplyTitle"),
    desc: t("sustainabilityPage.supplyDesc")
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("sustainabilityPage.tag"), title: t("sustainabilityPage.title"), description: t("sustainabilityPage.desc"), children: PILLARS.map(({
    Icon,
    title,
    desc
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(InfoSection, { title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
    desc
  ] }) }, title)) });
}
export {
  Sustainability as component
};
