import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as InfoPage } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { k as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Newsletter() {
  const {
    t
  } = useTranslation();
  const [email, setEmail] = reactExports.useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t("newsletter.success"));
    setEmail("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoPage, { tag: t("newsletter.tag"), title: t("newsletter.title"), description: t("newsletter.desc"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "rounded-2xl border border-border p-6 sm:p-8 bg-card flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: t("newsletter.placeholder"), className: "w-full h-12 pl-11 pr-4 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-12 px-6 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]", children: t("newsletter.subscribe") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: t("newsletter.privacyNote") })
  ] });
}
export {
  Newsletter as component
};
