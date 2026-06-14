import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Truck, MapPin, ChevronLeft, CheckCircle2, Lock, Store, Smartphone } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUser } from "@clerk/clerk-react";
import { createOrder } from "@/lib/api/orders";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — AirStep" }] }),
  component: Checkout,
});

type PaymentMethod = "qpay" | "pickup";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-5 sm:p-6 bg-card">
      <h2 className="font-display text-lg sm:text-xl mb-3 sm:mb-4">{title}</h2>
      <div className="space-y-3 sm:space-y-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="mt-1 w-full h-11 px-3 sm:px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base"
      />
    </label>
  );
}

function FakeQRCode({ total }: { total: number }) {
  const totalMnt = Math.round(total);
  const { t } = useTranslation();
  const cells = [
    1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0,
    0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
    0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1,
  ];

  return (
    <div className="mt-4 rounded-2xl border border-brand/30 bg-gradient-to-br from-[#0057b7]/5 to-[#0057b7]/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-[#0057b7] grid place-items-center">
          <Smartphone className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-[#0057b7]">QPay</p>
          <p className="text-[10px] text-muted-foreground">{t("checkout.qpayNote")}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="bg-white rounded-xl p-3 shadow-sm shrink-0">
          <svg width="140" height="140" viewBox="0 0 21 21">
            {cells.map((c, i) =>
              c ? (
                <rect
                  key={i}
                  x={(i % 21) + 0.05}
                  y={Math.floor(i / 21) + 0.05}
                  width="0.9"
                  height="0.9"
                  fill="#0057b7"
                />
              ) : null,
            )}
          </svg>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs text-muted-foreground">{t("checkout.scanQpay")}</p>
          <p className="font-display text-2xl mt-1 text-[#0057b7]">
            ₮{totalMnt.toLocaleString("mn-MN")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">AirStep Mongolia</p>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState<PaymentMethod>("qpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "done">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const isPickup = payment === "pickup";
  // Shipping in MNT: express = ₮61,200, standard free over ₮340,000, else ₮40,800
  const shipping = isPickup ? 0 : delivery === "express" ? 61200 : cartTotal > 340000 ? 0 : 40800;
  const total = cartTotal + shipping;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (cart.length === 0) {
      toast.error(t("checkout.emptyCart"));
      return;
    }

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email =
      (formData.get("email") as string) || user?.primaryEmailAddress?.emailAddress || "";
    const phone = formData.get("phone") as string;

    if (!email) {
      toast.error(t("checkout.emailRequired"));
      return;
    }
    if (!phone) {
      toast.error(t("checkout.phoneRequired"));
      return;
    }

    const shippingAddress = isPickup
      ? t("checkout.pickupAddress")
      : `${firstName} ${lastName}, ${formData.get("address")}, ${formData.get("city")} ${formData.get("zip")}, ${formData.get("country")}`;

    setIsProcessing(true);
    setPaymentStep("processing");

    await new Promise((r) => setTimeout(r, 1800));
    setPaymentStep("done");
    await new Promise((r) => setTimeout(r, 600));

    try {
      await createOrder({
        data: {
          email,
          displayName: `${firstName} ${lastName}`.trim() || user?.fullName || undefined,
          totalAmount: total,
          paymentMethod: payment,
          shippingAddress,
          items: cart.map((item) => ({
            productId: null,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      });
      clearCart();
      navigate({ to: "/order-success" });
    } catch (err) {
      console.error(err);
      toast.error(t("checkout.failed"));
      setPaymentStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">{t("checkout.emptyCart")}</h1>
        <p className="text-muted-foreground mb-6">{t("checkout.emptyDesc")}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
        >
          {t("checkout.shopNow")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex items-center gap-3 mb-6 sm:mb-10">
        <Link
          to="/cart"
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-xs font-medium"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t("common.cart")}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">{t("checkout.title")}</h1>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> {t("checkout.secureCheckout")}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={submit}
        className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10"
      >
        <div className="space-y-6 sm:space-y-8">
          <Section title={t("checkout.contact")}>
            <Input
              label={t("common.email")}
              name="email"
              type="email"
              required
              defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
            />
            <Input
              label={`${t("common.phone")} *`}
              name="phone"
              type="tel"
              required
              placeholder="99001234"
            />
          </Section>

          <Section title={t("common.payment")}>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    id: "qpay" as PaymentMethod,
                    Icon: Smartphone,
                    label: t("checkout.qpay"),
                    sub: t("checkout.qpayDesc"),
                  },
                  {
                    id: "pickup" as PaymentMethod,
                    Icon: Store,
                    label: t("checkout.pickupStore"),
                    sub: t("checkout.pickupStoreDesc"),
                  },
                ] as const
              ).map(({ id, Icon, label, sub }) => (
                <label
                  key={id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${payment === id ? "border-brand bg-brand/5" : "border-border"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payment === id}
                    onChange={() => setPayment(id)}
                    className="sr-only"
                  />
                  <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${payment === id ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                </label>
              ))}
            </div>

            {payment === "qpay" && <FakeQRCode total={total} />}

            {payment === "pickup" && (
              <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 flex gap-3">
                <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{t("checkout.storeAddress")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("checkout.storeAddressVal")}</p>
                  <p className="text-xs text-muted-foreground">{t("checkout.storeHours")}</p>
                </div>
              </div>
            )}
          </Section>

          {!isPickup && (
            <>
              <Section title={t("checkout.shippingAddress")}>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Input label={t("common.firstName")} name="firstName" required />
                  <Input label={t("common.lastName")} name="lastName" required />
                </div>
                <Input label={t("common.address")} name="address" required />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Input label={t("common.city")} name="city" required />
                  <Input label={t("common.state")} name="state" />
                  <Input label={t("common.zip")} name="zip" required />
                </div>
                <Input
                  label={t("common.country")}
                  name="country"
                  defaultValue="Mongolia"
                  required
                />
              </Section>

              <Section title={t("checkout.delivery")}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "standard",
                      Icon: Truck,
                      label: t("checkout.standard"),
                      sub: t("checkout.days35"),
                      price: cartTotal > 340000 ? t("common.free") : formatPrice(40800, language),
                    },
                    {
                      id: "express",
                      Icon: Truck,
                      label: t("checkout.express"),
                      sub: t("checkout.days12"),
                      price: formatPrice(61200, language),
                    },
                  ].map(({ id, Icon, label, sub, price }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${delivery === id ? "border-brand bg-brand/5" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={id}
                        checked={delivery === id}
                        onChange={() => setDelivery(id)}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5 text-brand" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      <span className="text-sm font-semibold">{price}</span>
                    </label>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border p-5 sm:p-6 bg-card">
          <h2 className="font-display text-xl sm:text-2xl mb-4">
            {t("checkout.orderLabel")} ({cart.length})
          </h2>
          <div className="space-y-3 max-h-64 overflow-auto">
            {cart.map((i) => (
              <div key={i.product.id + i.size} className="flex gap-3 text-sm">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-muted grid place-items-center shrink-0">
                  <img src={i.product.image} alt="" className="h-full w-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("common.size")} {i.size} · {t("checkout.qty")} {i.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatPrice(i.product.price * i.quantity, language)}
                </p>
              </div>
            ))}
          </div>
          <dl className="space-y-2 text-sm mt-5 pt-5 border-t border-border">
            <div className="flex justify-between">
              <dt>{t("common.subtotal")}</dt>
              <dd>{formatPrice(cartTotal, language)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("common.shipping")}</dt>
              <dd>
                {isPickup ? t("common.free") : shipping === 0 ? t("common.free") : formatPrice(shipping, language)}
              </dd>
            </div>
            <div className="flex justify-between font-display text-lg pt-3 border-t border-border">
              <dt>{t("common.total")}</dt>
              <dd>{formatPrice(total, language)}</dd>
            </div>
          </dl>

          {paymentStep === "processing" && (
            <div className="mt-5 rounded-xl bg-brand/5 border border-brand/20 p-4 text-center">
              <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium text-brand">{t("checkout.processing")}</p>
            </div>
          )}
          {paymentStep === "done" && (
            <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-700">{t("checkout.approved")}</p>
            </div>
          )}
          {paymentStep === "idle" && (
            <button
              type="submit"
              disabled={isProcessing}
              className="mt-5 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep active:scale-[0.98] transition disabled:opacity-60"
            >
              {t("checkout.placeOrder")} · {formatPrice(total, language)}
            </button>
          )}
          <Link
            to="/cart"
            className="mt-2.5 block text-center text-xs sm:text-sm text-muted-foreground hover:text-brand"
          >
            {t("checkout.backToCart")}
          </Link>
        </aside>
      </form>
    </div>
  );
}
