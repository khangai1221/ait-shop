import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import "../_libs/clerk__clerk-react.mjs";
import { g as getOrdersByEmail } from "./orders-BS13y5AI.mjs";
import { b as Route$j } from "./router-DToCCjPL.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { Q as useUser } from "../_libs/clerk__shared.mjs";
import { U as User, P as Package, g as MapPin, h as Settings, a as ShoppingBag } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./createSsrRpc-IxLg67WK.mjs";
import "./server-BMY1Y0f7.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand/10 text-brand",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600"
};
function Profile() {
  const {
    t
  } = useTranslation();
  const {
    user,
    isSignedIn,
    isLoaded
  } = useUser();
  const TABS = [{
    id: "profile",
    label: t("profile.title"),
    Icon: User
  }, {
    id: "orders",
    label: t("profile.orders"),
    Icon: Package
  }, {
    id: "addresses",
    label: t("profile.addresses"),
    Icon: MapPin
  }, {
    id: "settings",
    label: t("profile.settings"),
    Icon: Settings
  }];
  const {
    tab: initialTab
  } = Route$j.useSearch();
  const [tab, setTab] = reactExports.useState(initialTab ?? "profile");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const {
    data: orders = [],
    isLoading: ordersLoading
  } = useQuery({
    queryKey: ["user-orders", email],
    queryFn: () => getOrdersByEmail(),
    enabled: !!email && tab === "orders"
  });
  if (!isLoaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) });
  }
  if (!isSignedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-4", children: t("profile.signInPrompt") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: t("profile.signInDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("common.signIn") })
    ] });
  }
  const initial = (user.fullName ?? user.firstName ?? "U")[0].toUpperCase();
  const memberYear = user.createdAt ? new Date(user.createdAt).getFullYear() : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-4 mb-10", children: [
      user.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.imageUrl, alt: "", className: "h-16 w-16 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-display text-2xl", children: initial }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: user.fullName ?? user.firstName ?? t("profile.myAccount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          email,
          " · ",
          t("profile.memberSince", {
            year: memberYear
          })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[240px_1fr] gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: TABS.map(({
        id,
        label,
        Icon
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(id), className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${tab === id ? "bg-brand/10 text-brand" : "hover:bg-muted text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
        " ",
        label
      ] }, id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-8 bg-card", children: [
        tab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: t("profile.profileInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.firstName"), defaultValue: user.firstName ?? "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.lastName"), defaultValue: user.lastName ?? "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.email"), defaultValue: email, readOnly: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("common.phone"), defaultValue: user.phoneNumbers?.[0]?.phoneNumber ?? "" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("profile.clerkNote") })
        ] }),
        tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-5", children: t("profile.orderHistory") }),
          ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-muted-foreground", children: t("profile.loadingOrders") }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("profile.noOrders") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "mt-4 inline-flex px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition items-center gap-2", children: t("profile.startShopping") })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold", children: [
                  "#",
                  String(o.id).padStart(5, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.status] ?? "bg-muted text-muted-foreground"}`, children: o.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg", children: [
                "$",
                o.totalAmount.toFixed(2)
              ] })
            ] }),
            o.items && o.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border space-y-1", children: o.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                item.productName,
                " × ",
                item.quantity
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "$",
                (item.unitPrice * item.quantity).toFixed(2)
              ] })
            ] }, item.id)) })
          ] }, o.id)) })
        ] }),
        tab === "addresses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-5", children: t("profile.savedAddresses") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-xl border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-brand", children: t("profile.defaultLabel") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mt-2", children: t("profile.homeLabel") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("profile.addressHint") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 rounded-xl border border-dashed border-border grid place-items-center text-muted-foreground text-sm cursor-pointer hover:bg-muted", children: t("profile.addAddress") })
          ] })
        ] }),
        tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-5", children: t("profile.accountSettings") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 text-sm", children: [[t("profile.emailNotif"), t("profile.emailNotifDesc")], [t("profile.smsAlerts"), t("profile.smsAlertsDesc")], [t("profile.personalized"), t("profile.personalizedDesc")]].map(([title, sub]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, className: "h-5 w-9 appearance-none rounded-full bg-muted checked:bg-brand transition relative cursor-pointer" })
          ] }, title)) })
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  defaultValue,
  readOnly
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue, readOnly, className: "mt-1 w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand read-only:opacity-60 read-only:cursor-default" })
  ] });
}
export {
  Profile as component
};
