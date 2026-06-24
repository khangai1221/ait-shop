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
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminStats,
  uploadProductImage,
  importProducts,
} from "@/lib/api/products";
import { getAllOrders, updateOrderStatus } from "@/lib/api/orders";
import { getAllUsers, checkAdminAccess } from "@/lib/api/users";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AIT Shop" }] }),
  component: AdminPage,
});

type Section = "dashboard" | "products" | "add-product" | "orders" | "customers";

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

  const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
    { id: "dashboard", label: t("admin.dashboard"), Icon: LayoutDashboard },
    { id: "orders", label: t("common.orders"), Icon: ShoppingCart },
    { id: "customers", label: t("common.customers"), Icon: Users },
    { id: "products", label: t("admin.productList"), Icon: List },
    { id: "add-product", label: t("admin.addProduct"), Icon: Plus },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside
        className={`bg-[#1A2B4C] text-white flex flex-col transition-all duration-300 shrink-0 ${collapsed ? "w-[72px]" : "w-[240px]"}`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <img
            src="https://scontent.fsin15-2.fna.fbcdn.net/v/t1.15752-9/467483286_956491719731551_4684893202213182403_n.jpg?stp=dst-jpg_p120x120_tt6&_nc_cat=107&ccb=1-7&_nc_sid=029a7d&_nc_ohc=hdYyXLdJg-EQ7kNvwEK2IVz&_nc_oc=AdqXyO-rUBV5QmW2BY_jnP_uZwLqFp2qa75XzaedJ1ES6twbO72uqB7WS_0wXcqNBVs&_nc_zt=23&_nc_ht=scont65ent.fsin15-2.fna&_nc_ss=7b2a8&oh=03_Q7cD5gGGvJm47O7iJFKBdjxV7m1FvdkcnTZjp_uVpF-G3-2idw&oe=6A5945C7"
            alt="AIT Shop logo"
            className={`shrink-0 object-cover ${collapsed ? "h-8 w-8 rounded-lg" : "h-8 w-8 rounded-lg"}`}
          />
          {!collapsed && (
            <span className="font-display text-lg">
              AIT <span className="text-brand">SHOP</span>
            </span>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 rounded hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded hover:bg-white/10 ml-auto"
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
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition ${active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center gap-4 px-6 shrink-0">
          <h1 className="font-display text-xl capitalize">{activeSection.replace("-", " ")}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder={t("admin.searchPlaceholder")}
                className="w-64 h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
        <main className="flex-1 overflow-auto p-6">{children}</main>
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
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => getAllUsers(),
  });
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
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  {t("common.loading")}
                </td>
              </tr>
            )}
            {!isLoading && customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fileBase64 = await fileToBase64(file);
          const { url } = await uploadProductImage({
            data: { fileName: file.name, fileBase64, contentType: file.type },
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
      e.target.value = "";
    }
  };

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
          <div className="flex items-center gap-3">
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

function ProductsSection({ onAddNew }: { onAddNew: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: prods = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = await importProducts({ data: { fileBase64, fileType: ext } });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      if (result.errors.length > 0) {
        toast.error(
          `Imported ${result.inserted}, ${result.errors.length} row(s) skipped — see console`,
        );
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
          <label
            className={`h-9 px-4 rounded-full border border-border text-sm font-medium flex items-center gap-1.5 cursor-pointer transition ${
              importing ? "opacity-50 pointer-events-none" : "hover:bg-muted"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            {importing ? "Importing..." : "Import (.xlsx/.docx)"}
            <input
              type="file"
              accept=".xlsx,.docx"
              className="sr-only"
              onChange={handleImportFile}
              disabled={importing}
            />
          </label>
          <button
            onClick={onAddNew}
            className="h-9 px-4 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-deep flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> {t("admin.addProduct")}
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
              <th className="px-5 py-3 text-left font-medium">{t("common.stock")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.rating")}</th>
              <th className="px-5 py-3 text-left font-medium">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  {t("admin.loadingProducts")}
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
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
                <td className="px-5 py-3.5">
                  <span
                    className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-emerald-600"}`}
                  >
                    {p.stock}
                  </span>
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
      {activeSection === "orders" && <OrdersSection />}
      {activeSection === "customers" && <CustomersSection />}
      {activeSection === "products" && (
        <ProductsSection onAddNew={() => setActiveSection("add-product")} />
      )}
      {activeSection === "add-product" && (
        <AddProductSection onDone={() => setActiveSection("products")} />
      )}
    </AdminLayout>
  );
}
