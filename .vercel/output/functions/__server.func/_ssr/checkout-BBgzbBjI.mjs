import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useLanguage, a as useStore } from "./router-DToCCjPL.mjs";
import "../_libs/clerk__clerk-react.mjs";
import { c as createOrder } from "./orders-BS13y5AI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as formatPrice } from "./format-price-C5cwcbm-.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { Q as useUser } from "../_libs/clerk__shared.mjs";
import { o as ChevronLeft, p as Lock, i as Smartphone, f as Store, g as MapPin, e as Truck, j as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "./createSsrRpc-IxLg67WK.mjs";
import "./server-BMY1Y0f7.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-5 sm:p-6 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg sm:text-xl mb-3 sm:mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 sm:space-y-4", children })
  ] });
}
function Input({
  label,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: "mt-1 w-full h-11 px-3 sm:px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base" })
  ] });
}
function FakeQRCode({
  total
}) {
  const totalMnt = Math.round(total);
  const {
    t
  } = useTranslation();
  const cells = [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-brand/30 bg-gradient-to-br from-[#0057b7]/5 to-[#0057b7]/10 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[#0057b7] grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-[#0057b7]", children: "QPay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t("checkout.qpayNote") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl p-3 shadow-sm shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "140", height: "140", viewBox: "0 0 21 21", children: cells.map((c, i) => c ? /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: i % 21 + 0.05, y: Math.floor(i / 21) + 0.05, width: "0.9", height: "0.9", fill: "#0057b7" }, i) : null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("checkout.scanQpay") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl mt-1 text-[#0057b7]", children: [
          "₮",
          totalMnt.toLocaleString("mn-MN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "AirStep Mongolia" })
      ] })
    ] })
  ] });
}
function Checkout() {
  const {
    t
  } = useTranslation();
  const {
    language
  } = useLanguage();
  const {
    cart,
    cartTotal,
    clearCart
  } = useStore();
  const {
    user
  } = useUser();
  const navigate = useNavigate();
  const [delivery, setDelivery] = reactExports.useState("standard");
  const [payment, setPayment] = reactExports.useState("qpay");
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [paymentStep, setPaymentStep] = reactExports.useState("idle");
  const formRef = reactExports.useRef(null);
  const isPickup = payment === "pickup";
  const shipping = isPickup ? 0 : delivery === "express" ? 61200 : cartTotal > 34e4 ? 0 : 40800;
  const total = cartTotal + shipping;
  const submit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error(t("checkout.emptyCart"));
      return;
    }
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email") || user?.primaryEmailAddress?.emailAddress || "";
    const phone = formData.get("phone");
    if (!email) {
      toast.error(t("checkout.emailRequired"));
      return;
    }
    if (!phone) {
      toast.error(t("checkout.phoneRequired"));
      return;
    }
    const shippingAddress = isPickup ? t("checkout.pickupAddress") : `${firstName} ${lastName}, ${formData.get("address")}, ${formData.get("city")} ${formData.get("zip")}, ${formData.get("country")}`;
    setIsProcessing(true);
    setPaymentStep("processing");
    await new Promise((r) => setTimeout(r, 1800));
    setPaymentStep("done");
    await new Promise((r) => setTimeout(r, 600));
    try {
      const order = await createOrder({
        data: {
          email,
          displayName: `${firstName} ${lastName}`.trim() || user?.fullName || void 0,
          totalAmount: total,
          paymentMethod: payment,
          shippingAddress,
          items: cart.map((item) => ({
            productId: null,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price
          }))
        }
      });
      clearCart();
      navigate({
        to: "/order-success",
        search: {
          orderId: order.id
        }
      });
    } catch (err) {
      console.error(err);
      toast.error(t("checkout.failed"));
      setPaymentStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };
  if (cart.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-4", children: t("checkout.emptyCart") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: t("checkout.emptyDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: t("checkout.shopNow") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 sm:mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-xs font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
        t("common.cart")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl", children: t("checkout.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
        " ",
        t("checkout.secureCheckout")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { ref: formRef, onSubmit: submit, className: "grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: t("checkout.contact"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.email"), name: "email", type: "email", required: true, defaultValue: user?.primaryEmailAddress?.emailAddress ?? "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: `${t("common.phone")} *`, name: "phone", type: "tel", required: true, placeholder: "99001234" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: t("common.payment"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: [{
            id: "qpay",
            Icon: Smartphone,
            label: t("checkout.qpay"),
            sub: t("checkout.qpayDesc")
          }, {
            id: "pickup",
            Icon: Store,
            label: t("checkout.pickupStore"),
            sub: t("checkout.pickupStoreDesc")
          }].map(({
            id,
            Icon,
            label,
            sub
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${payment === id ? "border-brand bg-brand/5" : "border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "payment", value: id, checked: payment === id, onChange: () => setPayment(id), className: "sr-only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-9 w-9 rounded-xl grid place-items-center shrink-0 ${payment === id ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
            ] })
          ] }, id)) }),
          payment === "qpay" && /* @__PURE__ */ jsxRuntimeExports.jsx(FakeQRCode, { total }),
          payment === "pickup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-border bg-muted/30 p-4 flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-brand shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: t("checkout.storeAddress") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t("checkout.storeAddressVal") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("checkout.storeHours") })
            ] })
          ] })
        ] }),
        !isPickup && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: t("checkout.shippingAddress"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.firstName"), name: "firstName", required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.lastName"), name: "lastName", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.address"), name: "address", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.city"), name: "city", required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.state"), name: "state" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.zip"), name: "zip", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: t("common.country"), name: "country", defaultValue: "Mongolia", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("checkout.delivery"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: [{
            id: "standard",
            Icon: Truck,
            label: t("checkout.standard"),
            sub: t("checkout.days35"),
            price: cartTotal > 34e4 ? t("common.free") : formatPrice(40800)
          }, {
            id: "express",
            Icon: Truck,
            label: t("checkout.express"),
            sub: t("checkout.days12"),
            price: formatPrice(61200)
          }].map(({
            id,
            Icon,
            label,
            sub,
            price
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${delivery === id ? "border-brand bg-brand/5" : "border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "delivery", value: id, checked: delivery === id, onChange: () => setDelivery(id), className: "sr-only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-brand" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: price })
          ] }, id)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:sticky lg:top-24 h-fit rounded-2xl border border-border p-5 sm:p-6 bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl sm:text-2xl mb-4", children: [
          t("checkout.orderLabel"),
          " (",
          cart.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-64 overflow-auto", children: cart.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-muted grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.product.image, alt: "", className: "h-full w-full object-contain p-1" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: i.product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              t("common.size"),
              " ",
              i.size,
              " · ",
              t("checkout.qty"),
              " ",
              i.quantity
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: formatPrice(i.product.price * i.quantity) })
        ] }, i.product.id + i.size)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-2 text-sm mt-5 pt-5 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.subtotal") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatPrice(cartTotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.shipping") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: isPickup ? t("common.free") : shipping === 0 ? t("common.free") : formatPrice(shipping) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display text-lg pt-3 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: t("common.total") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatPrice(total) })
          ] })
        ] }),
        paymentStep === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl bg-brand/5 border border-brand/20 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-brand", children: t("checkout.processing") })
        ] }),
        paymentStep === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6 text-emerald-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-emerald-700", children: t("checkout.approved") })
        ] }),
        paymentStep === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: isProcessing, className: "mt-5 w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep active:scale-[0.98] transition disabled:opacity-60", children: [
          t("checkout.placeOrder"),
          " · ",
          formatPrice(total)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "mt-2.5 block text-center text-xs sm:text-sm text-muted-foreground hover:text-brand", children: t("checkout.backToCart") })
      ] })
    ] })
  ] });
}
export {
  Checkout as component
};
