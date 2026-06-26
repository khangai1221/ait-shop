import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { Package, MapPin, Settings, User, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { getOrdersByEmail } from "@/lib/api/orders";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/profile")({
  validateSearch: z.object({
    tab: z.enum(["profile", "orders", "addresses", "settings"]).optional(),
  }),
  head: () => ({ meta: [{ title: "My account — AIT Shop" }] }),
  component: Profile,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand/10 text-brand",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

function Profile() {
  const { t } = useTranslation();
  const { user, isSignedIn, isLoaded } = useUser();

  const TABS = [
    { id: "profile", label: t("profile.title"), Icon: User },
    { id: "orders", label: t("profile.orders"), Icon: Package },
    { id: "addresses", label: t("profile.addresses"), Icon: MapPin },
    { id: "settings", label: t("profile.settings"), Icon: Settings },
  ] as const;

  const { tab: initialTab } = Route.useSearch();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(initialTab ?? "profile");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["user-orders", email],
    queryFn: () => getOrdersByEmail(),
    enabled: !!email && tab === "orders",
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">{t("profile.signInPrompt")}</h1>
        <p className="text-muted-foreground mb-6">{t("profile.signInDesc")}</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
        >
          {t("common.signIn")}
        </Link>
      </div>
    );
  }

  const initial = (user.fullName ?? user.firstName ?? "U")[0].toUpperCase();
  const memberYear = user.createdAt ? new Date(user.createdAt).getFullYear() : "—";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-center gap-4 mb-10">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-display text-2xl">
            {initial}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl">
            {user.fullName ?? user.firstName ?? t("profile.myAccount")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {email} · {t("profile.memberSince", { year: memberYear })}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <nav className="space-y-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${tab === id ? "bg-brand/10 text-brand" : "hover:bg-muted text-muted-foreground"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border p-8 bg-card">
          {tab === "profile" && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl">{t("profile.profileInfo")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t("common.firstName")} defaultValue={user.firstName ?? ""} />
                <Field label={t("common.lastName")} defaultValue={user.lastName ?? ""} />
                <Field label={t("common.email")} defaultValue={email} readOnly />
                <Field
                  label={t("common.phone")}
                  defaultValue={user.phoneNumbers?.[0]?.phoneNumber ?? ""}
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("profile.clerkNote")}</p>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="font-display text-2xl mb-5">{t("profile.orderHistory")}</h2>
              {ordersLoading ? (
                <div className="py-10 text-center text-muted-foreground">
                  {t("profile.loadingOrders")}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-10 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("profile.noOrders")}</p>
                  <Link
                    to="/shop"
                    className="mt-4 inline-flex px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition items-center gap-2"
                  >
                    {t("profile.startShopping")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 rounded-xl border border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">#{String(o.id).padStart(5, "0")}</p>
                          <p className="text-xs text-muted-foreground">
                            {o.orderDate
                              ? new Date(o.orderDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {o.status}
                        </span>
                        <p className="font-display text-lg">${o.totalAmount.toFixed(2)}</p>
                      </div>
                      {o.items && o.items.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border space-y-1">
                          {o.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm text-muted-foreground"
                            >
                              <span>
                                {item.productName} × {item.quantity}
                              </span>
                              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="font-display text-2xl mb-5">{t("profile.savedAddresses")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border">
                  <p className="text-xs uppercase tracking-wider text-brand">
                    {t("profile.defaultLabel")}
                  </p>
                  <p className="font-semibold mt-2">{t("profile.homeLabel")}</p>
                  <p className="text-sm text-muted-foreground">{t("profile.addressHint")}</p>
                </div>
                <div className="p-5 rounded-xl border border-dashed border-border grid place-items-center text-muted-foreground text-sm cursor-pointer hover:bg-muted">
                  {t("profile.addAddress")}
                </div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div>
              <h2 className="font-display text-2xl mb-5">{t("profile.accountSettings")}</h2>
              <div className="space-y-4 text-sm">
                {[
                  [t("profile.emailNotif"), t("profile.emailNotifDesc")],
                  [t("profile.smsAlerts"), t("profile.smsAlertsDesc")],
                  [t("profile.personalized"), t("profile.personalizedDesc")],
                ].map(([title, sub]) => (
                  <div
                    key={title}
                    className="flex justify-between items-center p-4 rounded-xl border border-border"
                  >
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-9 appearance-none rounded-full bg-muted checked:bg-brand transition relative cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  readOnly,
}: {
  label: string;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="mt-1 w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand read-only:opacity-60 read-only:cursor-default"
      />
    </label>
  );
}
