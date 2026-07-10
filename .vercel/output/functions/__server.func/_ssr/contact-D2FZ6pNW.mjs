import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { j as Mail, m as Phone, g as MapPin } from "../_libs/lucide-react.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
function Contact() {
  const {
    t
  } = useTranslation();
  const FAQ = [[t("contact.q1"), t("contact.a1")], [t("contact.q2"), t("contact.a2")], [t("contact.q3"), t("contact.a3")], [t("contact.q4"), t("contact.a4")]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-wider text-brand", children: t("contact.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-6xl mt-2", children: t("contact.heading") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-xl mx-auto", children: t("contact.desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid lg:grid-cols-3 gap-6 mb-12", children: [{
      Icon: Mail,
      label: t("common.email"),
      val: "contact@aitshop.com"
    }, {
      Icon: Phone,
      label: t("common.phone"),
      val: "+97694468252"
    }, {
      Icon: MapPin,
      label: t("contact.flagship"),
      val: "Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот"
    }].map(({
      Icon,
      label,
      val
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-brand" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-3", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mt-1", children: val })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "rounded-3xl border border-border p-5 sm:p-8 space-y-4 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: t("contact.sendMessage") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.email"), type: "email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("contact.subject") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: t("contact.message") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 5, className: "mt-1 w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("contact.send") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square lg:aspect-auto rounded-3xl overflow-hidden border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: `https://maps.google.com/maps?q=${encodeURIComponent("Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот")}&output=embed`, width: "100%", height: "100%", style: {
        border: 0
      }, allowFullScreen: true, loading: "lazy", referrerPolicy: "strict-origin-when-cross-origin", title: "AIT Shop location — Дархан төв, Улаанбаатар" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-center mb-8", children: t("contact.faq") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto space-y-3", children: FAQ.map(([q, a]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group rounded-2xl border border-border p-5 open:bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "font-semibold cursor-pointer flex justify-between items-center", children: [
          q,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand group-open:rotate-45 transition", children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: a })
      ] }, q)) })
    ] })
  ] });
}
function Field({
  label,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, className: "mt-1 w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand" })
  ] });
}
export {
  Contact as component
};
