import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { MapPin, Phone, Mail, ChevronLeft, CheckCircle2, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUser } from "@clerk/clerk-react";
import { createOrder } from "@/lib/api/orders";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — AIT Shop" }] }),
  component: Checkout,
});

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

function Checkout() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "done">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const total = cartTotal;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    setIsProcessing(true);
    setPaymentStep("processing");

    await new Promise((r) => setTimeout(r, 1200));
    setPaymentStep("done");
    await new Promise((r) => setTimeout(r, 500));

    try {
      const order = await createOrder({
        data: {
          email,
          displayName: `${firstName} ${lastName}`.trim() || user?.fullName || undefined,
          totalAmount: total,
          paymentMethod: "pickup",
          shippingAddress:
            "Meet & pay — Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот",
          items: cart.map((item) => ({
            productId: null,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      });
      clearCart();
      navigate({ to: "/order-success", search: { orderId: order.id } });
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
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-xs font-medium shrink-0"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t("common.cart")}
        </Link>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl min-w-0">{t("checkout.title")}</h1>
        <div className="ml-auto hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Lock className="h-3.5 w-3.5" /> {t("checkout.secureCheckout")}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={submit}
        className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Contact */}
          <Section title={t("checkout.contact")}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Input label={t("common.firstName")} name="firstName" required />
              <Input label={t("common.lastName")} name="lastName" required />
            </div>
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
              placeholder="+97694468252"
            />
          </Section>

          {/* Payment */}
          <Section title={t("checkout.payment")}>
            <div className="rounded-2xl border border-brand bg-brand/5 p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand text-brand-foreground grid place-items-center shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Pay at Our Store</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Place your order online, then visit our store to pay and collect your shoes. No
                  online payment required.
                </p>
              </div>
            </div>

            {/* Store location map */}
            <div className="rounded-2xl overflow-hidden border border-border">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent("Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот")}&output=embed`}
                width="100%"
                height="280"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="AIT Shop location — Дархан төв, Улаанбаатар"
              />
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p>
                  Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв,
                  303 тоот
                </p>
              </div>
              <a
                href="tel:+97694468252"
                className="flex items-center gap-3 text-muted-foreground hover:text-brand transition"
              >
                <Phone className="h-4 w-4 text-brand shrink-0" />
                +976 9446 8252
              </a>
              <a
                href="mailto:contact@aitshop.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-brand transition"
              >
                <Mail className="h-4 w-4 text-brand shrink-0" />
                contact@aitshop.com
              </a>
            </div>
          </Section>
        </div>

        {/* Order summary sidebar */}
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
            <div className="flex justify-between text-emerald-600">
              <dt>{t("common.shipping")}</dt>
              <dd>{t("common.free")}</dd>
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
