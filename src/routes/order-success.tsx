import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Route = createFileRoute("/order-success")({
  validateSearch: z.object({ orderId: z.number().optional() }),
  head: () => ({ meta: [{ title: "Order confirmed — AirStep" }] }),
  component: Success,
});

function Success() {
  const { t } = useTranslation();
  const { orderId } = Route.useSearch();
  const orderNumber = orderId ?? "—";
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="h-20 w-20 mx-auto rounded-full bg-brand/15 grid place-items-center">
        <CheckCircle2 className="h-10 w-10 text-brand" />
      </div>
      <h1 className="font-display text-4xl mt-6">{t("orderSuccess.title")}</h1>
      <p className="text-muted-foreground mt-3">
        {t("orderSuccess.desc", { id: orderNumber })}
      </p>
      <div className="mt-8 rounded-2xl border border-border p-6 text-left bg-card">
        <h2 className="font-display text-lg mb-3">{t("orderSuccess.whatsNext")}</h2>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• {t("orderSuccess.step1")}</li>
          <li>• {t("orderSuccess.step2")}</li>
          <li>• {t("orderSuccess.step3")}</li>
        </ul>
      </div>
      <Link
        to="/shop"
        className="mt-8 inline-flex px-7 py-3 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
      >
        {t("orderSuccess.continueShopping")}
      </Link>
    </div>
  );
}
