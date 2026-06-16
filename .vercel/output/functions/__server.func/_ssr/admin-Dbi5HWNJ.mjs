import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import "../_libs/clerk__clerk-react.mjs";
import { u as updateProduct, i as importProducts, d as deleteProduct, c as createProduct, a as uploadProductImage, b as getAdminStats, g as getProducts } from "./products-9cTqsarn.mjs";
import { u as updateOrderStatus, a as getAllOrders } from "./orders-BS13y5AI.mjs";
import { c as createSsrRpc } from "./createSsrRpc-IxLg67WK.mjs";
import { b as createServerFn } from "./server-BMY1Y0f7.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { Q as useUser } from "../_libs/clerk__shared.mjs";
import { s as Shield, t as LogIn, u as LayoutDashboard, v as ShoppingCart, w as Users, x as List, r as Plus, X, C as ChevronDown, S as Search, y as Bell, U as User, A as ArrowUpRight, z as ArrowDownRight, D as Upload, P as Package, E as SquarePen, b as Trash2, J as Check } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/isbot.mjs";
import "../_libs/i18next.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/swr.mjs";
import "../_libs/dequal.mjs";
const checkAdminAccess = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8df9de6de2a59d7c3702aac406e4b2c5ac17713f7222465a6cc0c92e6c45335c"));
const getAllUsers = createServerFn({
  method: "GET"
}).handler(createSsrRpc("072a656888d2fe65f1bb5c7197d3704bb20707043c90746fb109d8a4cb22bfba"));
createServerFn({
  method: "POST"
}).inputValidator(objectType({
  email: stringType().email(),
  clerkId: stringType().optional(),
  displayName: stringType().optional()
})).handler(createSsrRpc("e8c74c55881c87d3f2647e4851fc3c3276c5ff44520fbf7c0e143668b2c6d050"));
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand/10 text-brand",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600"
};
const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const inputCls = "w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand";
function FormField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
function StatusBadge({
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }),
    status
  ] });
}
function AdminLayout({
  activeSection,
  setActiveSection,
  children
}) {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useUser();
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const NAV = [{
    id: "dashboard",
    label: t("admin.dashboard"),
    Icon: LayoutDashboard
  }, {
    id: "orders",
    label: t("common.orders"),
    Icon: ShoppingCart
  }, {
    id: "customers",
    label: t("common.customers"),
    Icon: Users
  }, {
    id: "products",
    label: t("admin.productList"),
    Icon: List
  }, {
    id: "add-product",
    label: t("admin.addProduct"),
    Icon: Plus
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `bg-[#1A2B4C] text-white flex flex-col transition-all duration-300 shrink-0 ${collapsed ? "w-[72px]" : "w-[240px]"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 h-16 border-b border-white/10", children: [
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg", children: [
          "AIR",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand", children: "STEP" })
        ] }),
        collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm mx-auto", children: "A" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(true), className: "ml-auto p-1 rounded hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) }),
        collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(false), className: "p-1 rounded hover:bg-white/10 ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 -rotate-90" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-4", children: [
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-2 text-[10px] uppercase tracking-widest text-white/40", children: t("common.admin") }),
        NAV.map((item) => {
          const active = item.id === activeSection;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveSection(item.id), className: `w-full flex items-center gap-3 px-5 py-2.5 text-sm transition ${active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.Icon, { className: "h-4 w-4 shrink-0" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
          ] }, item.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl hover:bg-white/5 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-brand/80 grid place-items-center text-xs font-bold shrink-0", children: user?.firstName?.[0] ?? "A" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium truncate", children: user?.fullName ?? t("common.admin") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/50 truncate", children: user?.primaryEmailAddress?.emailAddress ?? "" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 bg-background border-b border-border flex items-center gap-4 px-6 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl capitalize", children: activeSection.replace("-", " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: t("admin.searchPlaceholder"), className: "w-64 h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative p-2 rounded-full hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-brand/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-brand" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto p-6", children })
    ] })
  ] });
}
function DashboardSection() {
  const {
    t
  } = useTranslation();
  const {
    data: stats
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats()
  });
  const {
    data: orders = []
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders()
  });
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const WEEK_DATA = [52, 40, 38, 28, 41, 55, 49, 42, 36, 28, 34, 25];
  const maxV = Math.max(...WEEK_DATA);
  const H = 160;
  const W = 100;
  const step = W / (WEEK_DATA.length - 1);
  const linePath = WEEK_DATA.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - v / maxV * H}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: [{
      label: t("common.customers"),
      value: String(new Set(orders.map((o) => o.userId)).size || 0),
      color: "bg-blue-500"
    }, {
      label: t("common.products"),
      value: String(stats?.totalProducts ?? "..."),
      color: "bg-teal-500"
    }, {
      label: "In Stock",
      value: String(stats?.inStock ?? "..."),
      color: "bg-emerald-500"
    }, {
      label: "Out of Stock",
      value: String(stats?.outOfStock ?? "..."),
      color: "bg-orange-500"
    }, {
      label: "Revenue",
      value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
      color: "bg-sky-500"
    }].map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: it.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display mt-1", children: it.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 rounded-full mt-3 ${it.color}` })
    ] }, it.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4", children: [{
        label: "Total Revenue",
        value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
        sub: "All time",
        up: true
      }, {
        label: t("common.orders"),
        value: String(orders.length),
        sub: "All time",
        up: true
      }, {
        label: "Pending / Cancelled",
        value: `${pendingCount} / ${cancelledCount}`,
        sub: "Need attention",
        up: false
      }].map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: card.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display mt-3", children: card.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium flex items-center gap-0.5 mt-1 ${card.up ? "text-brand" : "text-amber-500"}`, children: [
          card.up ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3 w-3" }),
          card.sub
        ] })
      ] }, card.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-2", children: t("admin.weeklyTrend") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "w-full h-32 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "adminGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#0EA5E9" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaPath, fill: "url(#adminGrad)", opacity: 0.4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: linePath, fill: "none", stroke: "#0EA5E9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.recentOrders") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("admin.orderId") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.date") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.status") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.amount") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: orders.slice(0, 5).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noOrders") }) }) : orders.slice(0, 5).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 font-medium", children: [
            "#",
            String(o.id).padStart(5, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.userEmail ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            o.totalAmount.toLocaleString("mn-MN")
          ] })
        ] }, o.id)) })
      ] }) })
    ] })
  ] });
}
function OrdersSection() {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders()
  });
  const handleStatus = async (id, status) => {
    await updateOrderStatus({
      data: {
        id,
        status
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-orders"]
    });
    toast.success(t("admin.updated"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.allOrders") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        orders.length,
        " ",
        t("admin.totalLabel")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("admin.orderId") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.date") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.payment") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.status") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.update") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("common.loading") }) }),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-red-500", children: error instanceof Error ? error.message : "Failed to load orders" }) }),
        !isLoading && !isError && orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noOrders") }) }),
        orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 font-medium", children: [
            "#",
            String(o.id).padStart(5, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.userName ?? t("admin.guest") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: o.userEmail })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground capitalize", children: o.paymentMethod ?? "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            o.totalAmount.toLocaleString("mn-MN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: o.status, onChange: (e) => handleStatus(o.id, e.target.value), className: "text-xs h-8 px-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-brand", children: ORDER_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) }) })
        ] }, o.id))
      ] })
    ] }) })
  ] });
}
function CustomersSection() {
  const {
    t
  } = useTranslation();
  const {
    data: customers = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => getAllUsers()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("common.customers") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        customers.length,
        " ",
        t("admin.totalLabel")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.joined") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.orders") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.spent") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.role") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-muted-foreground", children: t("common.loading") }) }),
        !isLoading && customers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noCustomers") }) }),
        customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-brand/20 grid place-items-center text-xs font-bold text-brand shrink-0", children: (c.displayName ?? c.email)[0].toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.displayName ?? "—" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: c.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: c.orderCount ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            Number(c.totalSpent ?? 0).toLocaleString("mn-MN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${c.isAdmin ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`, children: c.isAdmin ? t("common.admin") : t("common.customers") }) })
        ] }, c.id))
      ] })
    ] }) })
  ] });
}
const EMPTY_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  stock: "10",
  category: "Sneakers",
  badge: "",
  description: "",
  imageUrls: [],
  colors: "#3B82F6, #111827, #FFFFFF",
  sizes: "38, 39, 40, 41, 42, 43, 44, 45",
  rating: "4.5"
};
function parseFormToData(form) {
  return {
    name: form.name.trim(),
    price: parseFloat(form.price),
    oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : void 0,
    stock: parseInt(form.stock) || 0,
    category: form.category || void 0,
    badge: form.badge.trim() || void 0,
    description: form.description.trim() || void 0,
    imageUrls: form.imageUrls.length > 0 ? form.imageUrls : void 0,
    colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
    sizes: form.sizes.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n)),
    rating: parseFloat(form.rating) || 4
  };
}
function productToForm(p) {
  let imageUrls = [];
  if (p.imageUrls) {
    try {
      const parsed = JSON.parse(p.imageUrls);
      imageUrls = parsed.filter((u) => u.startsWith("http"));
    } catch {
    }
  }
  if (imageUrls.length === 0 && p.imageUrl && p.imageUrl.startsWith("http")) {
    imageUrls = [p.imageUrl];
  }
  return {
    name: String(p.name ?? ""),
    price: String(p.price ?? ""),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    stock: String(p.stock ?? "0"),
    category: String(p.category ?? "Sneakers"),
    badge: String(p.badge ?? ""),
    description: String(p.description ?? ""),
    imageUrls,
    colors: p.colors ? JSON.parse(p.colors).join(", ") : "",
    sizes: p.sizes ? JSON.parse(p.sizes).join(", ") : "",
    rating: String(p.rating ?? "4.5")
  };
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}
function ProductForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saving
}) {
  const {
    t
  } = useTranslation();
  const [form, setForm] = reactExports.useState(initial);
  const [uploading, setUploading] = reactExports.useState(false);
  const discountPercent = (() => {
    const price = parseFloat(form.price);
    const oldPrice = parseFloat(form.oldPrice);
    if (!oldPrice || !price || oldPrice <= price) return null;
    return Math.round((oldPrice - price) / oldPrice * 100);
  })();
  reactExports.useEffect(() => {
    setForm((f) => {
      const isAutoBadge = f.badge === "" || /^-\d+%$/.test(f.badge);
      if (!isAutoBadge) return f;
      const next = discountPercent !== null ? `-${discountPercent}%` : "";
      return f.badge === next ? f : {
        ...f,
        badge: next
      };
    });
  }, [discountPercent]);
  const set = (key) => (e) => setForm((f) => ({
    ...f,
    [key]: e.target.value
  }));
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fileBase64 = await fileToBase64(file);
        const {
          url
        } = await uploadProductImage({
          data: {
            fileName: file.name,
            fileBase64,
            contentType: file.type
          }
        });
        return url;
      }));
      setForm((f) => ({
        ...f,
        imageUrls: [...f.imageUrls, ...urls]
      }));
      toast.success(t("admin.imageUploaded"));
    } catch {
      toast.error(t("admin.imageUploadFailed"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const removeImage = (index) => setForm((f) => ({
    ...f,
    imageUrls: f.imageUrls.filter((_, i) => i !== index)
  }));
  const moveImage = (from, to) => setForm((f) => {
    const imgs = [...f.imageUrls];
    const [item] = imgs.splice(from, 1);
    imgs.splice(to, 0, item);
    return {
      ...f,
      imageUrls: imgs
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.productName"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.name, onChange: set("name"), placeholder: "AirStep Glide 1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.category"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: inputCls, value: form.category, onChange: set("category"), children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("common.price")} (₮) *`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", step: "100", value: form.price, onChange: set("price"), placeholder: "302600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormField, { label: `${t("common.oldPrice")} (₮)`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", step: "100", value: form.oldPrice, onChange: set("oldPrice"), placeholder: t("common.optional") }),
        discountPercent !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs font-semibold text-brand", children: [
          "-",
          discountPercent,
          "% off"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.stock"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", value: form.stock, onChange: set("stock") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.badge"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.badge, onChange: set("badge"), placeholder: t("common.optional") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("common.rating")} (0-5)`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", max: "5", step: "0.1", value: form.rating, onChange: set("rating") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("admin.images")} *`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      form.imageUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: form.imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: `Image ${i + 1}`, className: `h-20 w-20 rounded-xl object-cover border-2 transition ${i === 0 ? "border-brand" : "border-border"}` }),
        i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-brand text-white text-[9px] font-bold grid place-items-center shadow", children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1", children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => moveImage(i, i - 1), className: "text-white text-[10px] font-semibold hover:text-brand-foreground", children: [
            "← ",
            t("admin.moveFirst")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(i), className: "h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, url + i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border text-sm transition ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
          uploading ? t("admin.uploading") : t("admin.addImages"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, className: "sr-only", onChange: handleImageUpload, disabled: uploading })
        ] }),
        form.imageUrls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-red-500 font-medium", children: t("admin.noImages") })
      ] }),
      form.imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("admin.firstImageIsCover") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.colorsHint"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.colors, onChange: set("colors") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.sizesHint"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.sizes, onChange: set("sizes") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.description"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: `${inputCls} h-24 resize-none py-2.5`, value: form.description, onChange: set("description"), placeholder: t("admin.descPlaceholder") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(form), disabled: saving || uploading || !form.name || !form.price || form.imageUrls.length === 0, className: "px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand-deep disabled:opacity-50 flex items-center gap-2", children: saving ? t("admin.saving") : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
        " ",
        t("admin.saveProduct")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "px-6 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted", children: t("common.cancel") })
    ] })
  ] });
}
function AddProductSection({
  onDone
}) {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const [saving, setSaving] = reactExports.useState(false);
  const handleSave = async (form) => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      await createProduct({
        data: parseFormToData(form)
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-stats"]
      });
      toast.success(t("admin.created"));
      onDone();
    } catch {
      toast.error(t("admin.failedCreate"));
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mb-6", children: t("admin.addNew") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, { onSave: handleSave, onCancel: onDone, saving })
  ] });
}
function ProductsSection({
  onAddNew
}) {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const {
    data: prods = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts()
  });
  const [editId, setEditId] = reactExports.useState(null);
  const [editSaving, setEditSaving] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [importing, setImporting] = reactExports.useState(false);
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "docx") {
      toast.error("Only .xlsx or .docx files are supported");
      e.target.value = "";
      return;
    }
    setImporting(true);
    try {
      const fileBase64 = await fileToBase64(file);
      const result = await importProducts({
        data: {
          fileBase64,
          fileType: ext
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-stats"]
      });
      if (result.errors.length > 0) {
        toast.error(`Imported ${result.inserted}, ${result.errors.length} row(s) skipped — see console`);
        console.error("Import errors:", result.errors);
      } else {
        toast.success(`Imported ${result.inserted} products`);
      }
    } catch {
      toast.error("Import failed");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };
  const filtered = prods.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.category ?? "").toLowerCase().includes(search.toLowerCase()));
  const handleDelete = async (id, name) => {
    if (!confirm(t("admin.deleteConfirm", {
      name
    }))) return;
    await deleteProduct({
      data: {
        id
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-stats"]
    });
    toast.success(t("admin.deleted"));
  };
  const handleEditSave = async (form) => {
    if (!editId) return;
    setEditSaving(true);
    try {
      await updateProduct({
        data: {
          id: editId,
          ...parseFormToData(form)
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      setEditId(null);
      toast.success(t("admin.updated"));
    } catch {
      toast.error(t("admin.failedUpdate"));
    } finally {
      setEditSaving(false);
    }
  };
  const editingProduct = editId ? prods.find((p) => p.id === editId) : null;
  if (editId && editingProduct) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl mb-6", children: [
        "Edit — ",
        editingProduct.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, { initial: productToForm(editingProduct), onSave: handleEditSave, onCancel: () => setEditId(null), saving: editSaving })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.productList") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          prods.length,
          " ",
          t("common.products")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:ml-auto flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: t("admin.searchPlaceholder"), value: search, onChange: (e) => setSearch(e.target.value), className: "h-9 pl-8 pr-3 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand w-44" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `h-9 px-4 rounded-full border border-border text-sm font-medium flex items-center gap-1.5 cursor-pointer transition ${importing ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
          importing ? "Importing..." : "Import (.xlsx/.docx)",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".xlsx,.docx", className: "sr-only", onChange: handleImportFile, disabled: importing })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onAddNew, className: "h-9 px-4 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-deep flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " ",
          t("admin.addProduct")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.product") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.category") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.price") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.stock") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.rating") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.actions") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.loadingProducts") }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-muted-foreground", children: search ? t("admin.noMatch") : t("admin.noProducts") }) }),
        filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0", children: p.imageUrl && !/^[1-6]$/.test(p.imageUrl.trim()) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.imageUrl, alt: p.name, className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate max-w-[180px]", children: p.name }),
              p.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium", children: p.badge })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: p.category ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display", children: [
              "₮",
              Number(p.price).toLocaleString("mn-MN")
            ] }),
            p.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs text-muted-foreground line-through", children: [
              "₮",
              Number(p.oldPrice).toLocaleString("mn-MN")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-emerald-600"}`, children: p.stock }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-muted-foreground", children: [
            "⭐ ",
            p.rating?.toFixed(1) ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditId(p.id), className: "p-1.5 rounded-lg hover:bg-brand/10 text-brand", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id, p.name), className: "p-1.5 rounded-lg hover:bg-red-50 text-red-500", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }) })
        ] }, p.id))
      ] })
    ] }) })
  ] });
}
function AdminPage() {
  const {
    t
  } = useTranslation();
  const {
    isSignedIn,
    isLoaded
  } = useUser();
  const [activeSection, setActiveSection] = reactExports.useState("dashboard");
  const {
    data: access,
    isLoading: accessLoading
  } = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => checkAdminAccess(),
    enabled: isLoaded && isSignedIn
  });
  if (!isLoaded || isSignedIn && accessLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) });
  }
  if (!isSignedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-brand mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-2", children: t("admin.accessRequired") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: t("admin.signInPrompt") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/login", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
        " ",
        t("common.signIn")
      ] })
    ] }) });
  }
  if (!access?.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-red-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-2", children: t("admin.accessRequired") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "This account does not have admin access." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full border border-border font-semibold hover:bg-muted transition", children: t("common.goHome") })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { activeSection, setActiveSection, children: [
    activeSection === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, {}),
    activeSection === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersSection, {}),
    activeSection === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersSection, {}),
    activeSection === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsSection, { onAddNew: () => setActiveSection("add-product") }),
    activeSection === "add-product" && /* @__PURE__ */ jsxRuntimeExports.jsx(AddProductSection, { onDone: () => setActiveSection("products") })
  ] });
}
export {
  AdminPage as component
};
