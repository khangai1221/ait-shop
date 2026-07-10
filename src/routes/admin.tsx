import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Plus,
  List,
  Bell,
  Search,
  User,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit,
  X,
  Check,
  Shield,
  LogIn,
  Upload,
  FileUp,
  BarChart2,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Menu,
} from "lucide-react";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getAdminStats,
  uploadProductImage,
} from "@/lib/api/products";
import { ImportProducts } from "@/components/admin/ImportProducts";
import {
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
  exportAnalyticsCsv,
  deleteAllOrders,
} from "@/lib/api/orders";
import { getAllUsers, checkAdminAccess, setUserAdmin } from "@/lib/api/users";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AIT Shop" }] }),
  component: AdminPage,
});

type Section =
  | "dashboard"
  | "analytics"
  | "products"
  | "add-product"
  | "import-products"
  | "orders"
  | "customers";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand/10 text-brand",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const inputCls =
  "w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function AdminLayout({
  activeSection,
  setActiveSection,
  children,
}: {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
    { id: "dashboard", label: t("admin.dashboard"), Icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", Icon: BarChart2 },
    { id: "orders", label: t("common.orders"), Icon: ShoppingCart },
    { id: "customers", label: t("common.customers"), Icon: Users },
    { id: "products", label: t("admin.productList"), Icon: List },
    { id: "add-product", label: t("admin.addProduct"), Icon: Plus },
    { id: "import-products", label: "Import Products", Icon: FileUp },
  ];

  const selectSection = (id: Section) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30 overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static column on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#1A2B4C] text-white flex flex-col transition-all duration-300
          lg:relative lg:translate-x-0 lg:shrink-0
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[72px]" : "w-[240px]"}
        `}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <span className="shrink-0 h-8 w-8 rounded-lg bg-brand inline-flex items-center justify-center font-black text-white text-base select-none">
            A
          </span>
          {!collapsed && (
            <span className="font-display text-lg">
              AIT <span className="text-brand">SHOP</span>
            </span>
          )}
          {/* Close on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1 rounded hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Collapse on desktop */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 rounded hover:bg-white/10 hidden lg:block"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded hover:bg-white/10 ml-auto hidden lg:block"
            >
              <ChevronDown className="h-3 w-3 -rotate-90" />
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {!collapsed && (
            <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-white/40">
              {t("common.admin")}
            </p>
          )}
          {NAV.map((item) => {
            const active = item.id === activeSection;
            return (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition ${active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <item.Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl hover:bg-white/5 p-2">
            <div className="h-8 w-8 rounded-full bg-brand/80 grid place-items-center text-xs font-bold shrink-0">
              {user?.firstName?.[0] ?? "A"}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">
                  {user?.fullName ?? t("common.admin")}
                </p>
                <p className="text-[10px] text-white/50 truncate">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0">
          {/* Hamburger on mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-base sm:text-xl capitalize truncate">
            {activeSection.replace("-", " ")}
          </h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder={t("admin.searchPlaceholder")}
                className="w-48 lg:w-64 h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" />
            </button>
            <div className="h-9 w-9 rounded-full bg-brand/20 grid place-items-center">
              <User className="h-4 w-4 text-brand" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function DashboardSection() {
  const { t } = useTranslation();
  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: () => getAdminStats() });
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders(),
  });
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const WEEK_DATA = [52, 40, 38, 28, 41, 55, 49, 42, 36, 28, 34, 25];
  const maxV = Math.max(...WEEK_DATA);
  const H = 160;
  const W = 100;
  const step = W / (WEEK_DATA.length - 1);
  const linePath = WEEK_DATA.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - (v / maxV) * H}`,
  ).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: t("common.customers"),
            value: String(new Set(orders.map((o) => o.userId)).size || 0),
            color: "bg-blue-500",
          },
          {
            label: t("common.products"),
            value: String(stats?.totalProducts ?? "..."),
            color: "bg-teal-500",
          },
          { label: "In Stock", value: String(stats?.inStock ?? "..."), color: "bg-emerald-500" },
          {
            label: "Out of Stock",
            value: String(stats?.outOfStock ?? "..."),
            color: "bg-orange-500",
          },
          {
            label: "Revenue",
            value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
            color: "bg-sky-500",
          },
        ].map((it) => (
          <div key={it.label} className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{it.label}</p>
            <p className="text-2xl font-display mt-1">{it.value}</p>
            <div className={`h-1.5 rounded-full mt-3 ${it.color}`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Revenue",
              value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
              sub: "All time",
              up: true,
            },
            { label: t("common.orders"), value: String(orders.length), sub: "All time", up: true },
            {
              label: "Pending / Cancelled",
              value: `${pendingCount} / ${cancelledCount}`,
              sub: "Need attention",
              up: false,
            },
          ].map((card) => (
            <div key={card.label} className="bg-card rounded-2xl border border-border p-5">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-display mt-3">{card.value}</p>
              <span
                className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${card.up ? "text-brand" : "text-amber-500"}`}
              >
                {card.up ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {card.sub}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground font-medium mb-2">{t("admin.weeklyTrend")}</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32 mt-2">
            <defs>
              <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#adminGrad)" opacity={0.4} />
            <path
              d={linePath}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5">
          <h3 className="font-display text-lg">{t("admin.recentOrders")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border text-muted-foreground text-xs">
                <th className="px-5 py-3 text-left font-medium">{t("admin.orderId")}</th>
                <th className="px-5 py-3 text-left font-medium">{t("common.customers")}</th>
                <th className="px-5 py-3 text-left font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 text-left font-medium">{t("common.status")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("common.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    {t("admin.noOrders")}
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">#{String(o.id).padStart(5, "0")}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{o.userEmail ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-display">
                      ₮{o.totalAmount.toLocaleString("mn-MN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const qc = useQueryClient();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["sales-stats"],
    queryFn: () => getSalesStats(),
  });
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fmt = (n: number) => `₮${n.toLocaleString("mn-MN")}`;

  const pct = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  const handleExport = async () => {
    const csv = await exportAnalyticsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ait-shop-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await deleteAllOrders();
      qc.invalidateQueries({ queryKey: ["sales-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("All order data has been reset.");
      setConfirmReset(false);
    } catch {
      toast.error("Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  const daily = stats?.dailyRevenue ?? [];
  const maxRev = Math.max(...daily.map((d) => d.revenue), 1);
  const H = 120;
  const W = 100;
  const step = daily.length > 1 ? W / (daily.length - 1) : W;
  const linePath = daily
    .map((d, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - (d.revenue / maxRev) * H}`)
    .join(" ");
  const areaPath =
    daily.length > 0 ? `${linePath} L ${(daily.length - 1) * step} ${H} L 0 ${H} Z` : "";

  const periods = [
    { label: "Today", data: stats?.today },
    { label: "This Week", data: stats?.thisWeek, compare: stats?.lastWeek },
    { label: "Last Week", data: stats?.lastWeek },
    { label: "This Month", data: stats?.thisMonth, compare: stats?.lastMonth },
    { label: "Last Month", data: stats?.lastMonth },
    { label: "All Time", data: stats?.allTime },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Sales Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Revenue and order breakdown by period
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
          >
            <RefreshCw className="h-4 w-4" /> Reset Stats
          </button>
        </div>
      </div>

      {/* Period cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-4 animate-pulse h-24"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {periods.map(({ label, data, compare }) => {
            const change = compare !== undefined ? pct(data?.revenue ?? 0, compare.revenue) : null;
            return (
              <div key={label} className="bg-card rounded-2xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-display mt-1 truncate">{fmt(data?.revenue ?? 0)}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{data?.orders ?? 0} orders</span>
                  {change !== null && (
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(change)}% vs prior
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue chart — last 30 days */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <p className="text-sm font-medium mb-1">Daily Revenue — Last 30 Days</p>
        <p className="text-xs text-muted-foreground mb-4">Excludes cancelled orders</p>
        {daily.length > 0 ? (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaPath && <path d={areaPath} fill="url(#analyticsGrad)" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            No data yet
          </div>
        )}
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
          <span>{daily[0]?.date ?? ""}</span>
          <span>{daily[daily.length - 1]?.date ?? ""}</span>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-lg">Top Products by Revenue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            All time, excluding cancelled orders
          </p>
        </div>
        {isLoading ? (
          <div className="p-5 animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-lg" />
            ))}
          </div>
        ) : !stats?.topProducts?.length ? (
          <p className="p-5 text-sm text-muted-foreground">No sales data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="px-5 py-3 text-left font-medium">#</th>
                  <th className="px-5 py-3 text-left font-medium">Product</th>
                  <th className="px-5 py-3 text-right font-medium">Units Sold</th>
                  <th className="px-5 py-3 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((p, idx) => (
                  <tr key={p.name} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3 text-muted-foreground font-medium">{idx + 1}</td>
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{p.quantity}</td>
                    <td className="px-5 py-3 text-right font-display">{fmt(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset confirmation modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display text-lg text-red-600">Reset All Order Data?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This will permanently delete <strong>all orders and order items</strong> from the
              database. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {resetting ? "Deleting…" : "Yes, Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersSection() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["admin-orders"], queryFn: () => getAllOrders() });
  const handleStatus = async (id: number, status: string) => {
    await updateOrderStatus({
      data: {
        id,
        status: status as "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
      },
    });
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    toast.success(t("admin.updated"));
  };
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5">
        <h3 className="font-display text-lg">{t("admin.allOrders")}</h3>
        <p className="text-sm text-muted-foreground">
          {orders.length} {t("admin.totalLabel")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border text-muted-foreground text-xs">
              <th className="px-5 py-3 text-left font-medium">{t("admin.orderId")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.customers")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.date")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.payment")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.status")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("common.amount")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.update")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  {t("common.loading")}
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-red-500">
                  {error instanceof Error ? error.message : "Failed to load orders"}
                </td>
              </tr>
            )}
            {!isLoading && !isError && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  {t("admin.noOrders")}
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-5 py-3.5 font-medium">#{String(o.id).padStart(5, "0")}</td>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{o.userName ?? t("admin.guest")}</p>
                  <p className="text-xs text-muted-foreground">{o.userEmail}</p>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground capitalize">
                  {o.paymentMethod ?? "card"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-5 py-3.5 text-right font-display">
                  ₮{o.totalAmount.toLocaleString("mn-MN")}
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatus(o.id, e.target.value)}
                    className="text-xs h-8 px-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersSection() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => getAllUsers(),
  });
  const [toggling, setToggling] = useState<number | null>(null);

  const handleToggleAdmin = async (userId: number, currentlyAdmin: boolean) => {
    setToggling(userId);
    try {
      await setUserAdmin({ data: { userId, isAdmin: !currentlyAdmin } });
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success(currentlyAdmin ? "Admin access removed." : "Admin access granted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5">
        <h3 className="font-display text-lg">{t("common.customers")}</h3>
        <p className="text-sm text-muted-foreground">
          {customers.length} {t("admin.totalLabel")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border text-muted-foreground text-xs">
              <th className="px-5 py-3 text-left font-medium">{t("common.customers")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.email")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.joined")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.orders")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("common.spent")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.role")}</th>
              <th className="px-5 py-3 text-left font-medium">Access</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  {t("common.loading")}
                </td>
              </tr>
            )}
            {!isLoading && customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  {t("admin.noCustomers")}
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-brand/20 grid place-items-center text-xs font-bold text-brand shrink-0">
                      {(c.displayName ?? c.email)[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{c.displayName ?? "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3.5">{c.orderCount ?? 0}</td>
                <td className="px-5 py-3.5 text-right font-display">
                  ₮{Number(c.totalSpent ?? 0).toLocaleString("mn-MN")}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.isAdmin ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}
                  >
                    {c.isAdmin ? t("common.admin") : t("common.customers")}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleToggleAdmin(c.id, !!c.isAdmin)}
                    disabled={toggling === c.id}
                    className={`text-xs h-7 px-3 rounded-full font-medium border transition disabled:opacity-50 ${
                      c.isAdmin
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-brand/30 text-brand hover:bg-brand/5"
                    }`}
                  >
                    {toggling === c.id ? "…" : c.isAdmin ? "Remove admin" : "Make admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ProductFormData = {
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
  category: string;
  badge: string;
  description: string;
  imageUrls: string[];
  colors: string;
  sizes: string;
  rating: string;
  featured: boolean;
};

const EMPTY_FORM: ProductFormData = {
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
  rating: "4.5",
  featured: true,
};

function parseFormToData(form: ProductFormData) {
  return {
    name: form.name.trim(),
    price: parseFloat(form.price),
    oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
    stock: parseInt(form.stock) || 0,
    category: form.category || undefined,
    badge: form.badge.trim() || undefined,
    description: form.description.trim() || undefined,
    imageUrls: form.imageUrls.length > 0 ? form.imageUrls : undefined,
    colors: form.colors
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    sizes: form.sizes
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n)),
    rating: parseFloat(form.rating) || 4.0,
    featured: form.featured,
  };
}

function productToForm(p: Record<string, unknown>): ProductFormData {
  let imageUrls: string[] = [];
  if (p.imageUrls) {
    try {
      const parsed = JSON.parse(p.imageUrls as string) as string[];
      imageUrls = parsed.filter((u) => u.startsWith("http"));
    } catch {
      // ignore invalid JSON
    }
  }
  if (imageUrls.length === 0 && p.imageUrl && (p.imageUrl as string).startsWith("http")) {
    imageUrls = [p.imageUrl as string];
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
    colors: p.colors ? (JSON.parse(p.colors as string) as string[]).join(", ") : "",
    sizes: p.sizes ? (JSON.parse(p.sizes as string) as number[]).join(", ") : "",
    rating: String(p.rating ?? "4.5"),
    featured: p.featured !== false && p.featured !== 0,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
  });
}

function ProductForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ProductFormData;
  onSave: (d: ProductFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ProductFormData>(initial);
  const [uploading, setUploading] = useState(false);

  const discountPercent = (() => {
    const price = parseFloat(form.price);
    const oldPrice = parseFloat(form.oldPrice);
    if (!oldPrice || !price || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  })();

  // Auto-fill the badge with the computed discount, but never overwrite a
  // custom badge (e.g. "New") — only touch it if it's empty or was itself
  // a previous auto-generated "-X%" badge.
  useEffect(() => {
    setForm((f) => {
      const isAutoBadge = f.badge === "" || /^-\d+%$/.test(f.badge);
      if (!isAutoBadge) return f;
      const next = discountPercent !== null ? `-${discountPercent}%` : "";
      return f.badge === next ? f : { ...f, badge: next };
    });
  }, [discountPercent]);
  const set =
    (key: Exclude<keyof ProductFormData, "imageUrls">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fileBase64 = await fileToBase64(file);
          const { url } = await uploadProductImage({
            data: {
              fileName: file.name || `paste-${Date.now()}.png`,
              fileBase64,
              contentType: file.type,
            },
          });
          return url;
        }),
      );
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...urls] }));
      toast.success(t("admin.imageUploaded"));
    } catch {
      toast.error(t("admin.imageUploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await uploadFiles(files);
    e.target.value = "";
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageFiles = items
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (imageFiles.length) uploadFiles(imageFiles);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeImage = (index: number) =>
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== index) }));

  const moveImage = (from: number, to: number) =>
    setForm((f) => {
      const imgs = [...f.imageUrls];
      const [item] = imgs.splice(from, 1);
      imgs.splice(to, 0, item);
      return { ...f, imageUrls: imgs };
    });

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label={t("admin.productName")}>
          <input
            className={inputCls}
            value={form.name}
            onChange={set("name")}
            placeholder="AIT Shop Glide 1"
          />
        </FormField>
        <FormField label={t("common.category")}>
          <select className={inputCls} value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label={`${t("common.price")} (₮) *`}>
          <input
            className={inputCls}
            type="number"
            min="0"
            step="100"
            value={form.price}
            onChange={set("price")}
            placeholder="302600"
          />
        </FormField>
        <FormField label={`${t("common.oldPrice")} (₮)`}>
          <input
            className={inputCls}
            type="number"
            min="0"
            step="100"
            value={form.oldPrice}
            onChange={set("oldPrice")}
            placeholder={t("common.optional")}
          />
          {discountPercent !== null && (
            <p className="mt-1 text-xs font-semibold text-brand">-{discountPercent}% off</p>
          )}
        </FormField>
        <FormField label={t("common.stock")}>
          <input
            className={inputCls}
            type="number"
            min="0"
            value={form.stock}
            onChange={set("stock")}
          />
        </FormField>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label={t("common.badge")}>
          <input
            className={inputCls}
            value={form.badge}
            onChange={set("badge")}
            placeholder={t("common.optional")}
          />
        </FormField>
        <FormField label={`${t("common.rating")} (0-5)`}>
          <input
            className={inputCls}
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={set("rating")}
          />
        </FormField>
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none py-1">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-brand" : "bg-border"}`}
          />
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0"}`}
          />
        </div>
        <span className="text-sm font-medium">
          Show on homepage{" "}
          <span className="text-muted-foreground font-normal">
            (only products with clean, no-background images)
          </span>
        </span>
      </label>

      {/* Multi-image upload */}
      <FormField label={`${t("admin.images")} *`}>
        <div className="space-y-3">
          {form.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.imageUrls.map((url, i) => (
                <div key={url + i} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className={`h-20 w-20 rounded-xl object-cover border-2 transition ${
                      i === 0 ? "border-brand" : "border-border"
                    }`}
                  />
                  {i === 0 && (
                    <span className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-brand text-white text-[9px] font-bold grid place-items-center shadow">
                      1
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(i, i - 1)}
                        className="text-white text-[10px] font-semibold hover:text-brand-foreground"
                      >
                        ← {t("admin.moveFirst")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <label
              className={`cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border text-sm transition ${
                uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? t("admin.uploading") : t("admin.addImages")}
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            <span className="text-xs text-muted-foreground">
              or{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[11px]">
                Ctrl+V
              </kbd>{" "}
              to paste
            </span>
            {form.imageUrls.length === 0 && (
              <span className="text-xs text-red-500 font-medium">{t("admin.noImages")}</span>
            )}
          </div>
          {form.imageUrls.length > 1 && (
            <p className="text-xs text-muted-foreground">{t("admin.firstImageIsCover")}</p>
          )}
        </div>
      </FormField>

      <FormField label={t("admin.colorsHint")}>
        <input className={inputCls} value={form.colors} onChange={set("colors")} />
      </FormField>
      <FormField label={t("admin.sizesHint")}>
        <input className={inputCls} value={form.sizes} onChange={set("sizes")} />
      </FormField>
      <FormField label={t("common.description")}>
        <textarea
          className={`${inputCls} h-24 resize-none py-2.5`}
          value={form.description}
          onChange={set("description")}
          placeholder={t("admin.descPlaceholder")}
        />
      </FormField>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving || uploading || !form.name || !form.price || form.imageUrls.length === 0}
          className="px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand-deep disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            t("admin.saving")
          ) : (
            <>
              <Check className="h-4 w-4" /> {t("admin.saveProduct")}
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-6 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted"
        >
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
}

function AddProductSection({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const handleSave = async (form: ProductFormData) => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      await createProduct({ data: parseFormToData(form) });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(t("admin.created"));
      onDone();
    } catch {
      toast.error(t("admin.failedCreate"));
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="bg-card rounded-2xl border border-border p-6 max-w-2xl">
      <h3 className="font-display text-xl mb-6">{t("admin.addNew")}</h3>
      <ProductForm onSave={handleSave} onCancel={onDone} saving={saving} />
    </div>
  );
}

function ProductsSection({ onAddNew, onImport }: { onAddNew: () => void; onImport: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: prods = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getAdminProducts(),
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = prods.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(t("admin.deleteConfirm", { name }))) return;
    await deleteProduct({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success(t("admin.deleted"));
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Delete all ${prods.length} products? This cannot be undone.`)) return;
    await deleteAllProducts();
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success("All products deleted.");
  };

  const handleEditSave = async (form: ProductFormData) => {
    if (!editId) return;
    setEditSaving(true);
    try {
      await updateProduct({ data: { id: editId, ...parseFormToData(form) } });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
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
    return (
      <div className="bg-card rounded-2xl border border-border p-6 max-w-2xl">
        <h3 className="font-display text-xl mb-6">Edit — {editingProduct.name}</h3>
        <ProductForm
          initial={productToForm(editingProduct as unknown as Record<string, unknown>)}
          onSave={handleEditSave}
          onCancel={() => setEditId(null)}
          saving={editSaving}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h3 className="font-display text-lg">{t("admin.productList")}</h3>
          <p className="text-sm text-muted-foreground">
            {prods.length} {t("common.products")}
          </p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder={t("admin.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 pr-3 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand w-44"
            />
          </div>
          <button
            onClick={onImport}
            className="h-9 px-4 rounded-full border border-border text-sm font-medium flex items-center gap-1.5 hover:bg-muted transition"
          >
            <FileUp className="h-3.5 w-3.5" /> Import file
          </button>
          <button
            onClick={onAddNew}
            className="h-9 px-4 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-deep flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> {t("admin.addProduct")}
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={prods.length === 0}
            className="h-9 px-4 rounded-full border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border text-muted-foreground text-xs">
              <th className="px-5 py-3 text-left font-medium">{t("common.product")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.category")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.price")}</th>
              <th className="px-5 py-3 text-left font-medium">Buying price</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.stock")}</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.rating")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted-foreground">
                  {t("admin.loadingProducts")}
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted-foreground">
                  {search ? t("admin.noMatch") : t("admin.noProducts")}
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0">
                      {p.imageUrl && !/^[1-6]$/.test(p.imageUrl.trim()) ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-[180px]">{p.name}</p>
                      {p.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{p.category ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span className="font-display">₮{Number(p.price).toLocaleString("mn-MN")}</span>
                  {p.oldPrice && (
                    <span className="ml-1.5 text-xs text-muted-foreground line-through">
                      ₮{Number(p.oldPrice).toLocaleString("mn-MN")}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground text-sm">
                  {(p as Record<string, unknown>).buyingPrice != null
                    ? `₮${Number((p as Record<string, unknown>).buyingPrice).toLocaleString("mn-MN")}`
                    : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-emerald-600"}`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {(() => {
                    const s = (p as Record<string, unknown>).status as string | undefined;
                    if (s === "draft")
                      return (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          Draft
                        </span>
                      );
                    return (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                        Published
                      </span>
                    );
                  })()}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  ⭐ {p.rating?.toFixed(1) ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditId(p.id)}
                      className="p-1.5 rounded-lg hover:bg-brand/10 text-brand"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPage() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useUser();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  const { data: access, isLoading: accessLoading } = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => checkAdminAccess(),
    enabled: isLoaded && isSignedIn,
  });

  if (!isLoaded || (isSignedIn && accessLoading)) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30">
        <div className="bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center">
          <Shield className="h-10 w-10 text-brand mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">{t("admin.accessRequired")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("admin.signInPrompt")}</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
          >
            <LogIn className="h-4 w-4" /> {t("common.signIn")}
          </a>
        </div>
      </div>
    );
  }

  if (!access?.isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30">
        <div className="bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center">
          <Shield className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">{t("admin.accessRequired")}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This account does not have admin access.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full border border-border font-semibold hover:bg-muted transition"
          >
            {t("common.goHome")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && <DashboardSection />}
      {activeSection === "analytics" && <AnalyticsSection />}
      {activeSection === "orders" && <OrdersSection />}
      {activeSection === "customers" && <CustomersSection />}
      {activeSection === "products" && (
        <ProductsSection
          onAddNew={() => setActiveSection("add-product")}
          onImport={() => setActiveSection("import-products")}
        />
      )}
      {activeSection === "add-product" && (
        <AddProductSection onDone={() => setActiveSection("products")} />
      )}
      {activeSection === "import-products" && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-xl mb-6">Import Products</h3>
          <ImportProducts onDone={() => setActiveSection("products")} />
        </div>
      )}
    </AdminLayout>
  );
}
