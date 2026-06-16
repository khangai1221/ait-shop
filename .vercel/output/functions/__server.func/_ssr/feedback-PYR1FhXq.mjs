import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as InfoPage } from "./InfoPage-BtIv5Kgm.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Feedback() {
  const {
    t
  } = useTranslation();
  const [message, setMessage] = reactExports.useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    toast.success(t("feedback.success"));
    setMessage("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPage, { tag: t("feedback.tag"), title: t("feedback.title"), description: t("feedback.desc"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "rounded-2xl border border-border p-6 sm:p-8 bg-card space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: t("feedback.label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 6, value: message, onChange: (e) => setMessage(e.target.value), placeholder: t("feedback.placeholder"), className: "mt-1 w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]", children: t("feedback.send") })
  ] }) });
}
export {
  Feedback as component
};
