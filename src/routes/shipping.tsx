import { createFileRoute } from "@tanstack/react-router";
import { Truck, Zap, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/shipping")({
   head: () => ({ meta: [{ title: "Shipping & Delivery — AIT Shop" }] }),
  component: Shipping,
});

function Shipping() {
  const { t } = useTranslation();
  const METHODS = [
    { Icon: Truck, title: t("shippingPage.standardTitle"), desc: t("shippingPage.standardDesc") },
    { Icon: Zap, title: t("shippingPage.expressTitle"), desc: t("shippingPage.expressDesc") },
    { Icon: Store, title: t("shippingPage.pickupTitle"), desc: t("shippingPage.pickupDesc") },
  ];
  return (
    <InfoPage tag={t("shippingPage.tag")} title={t("shippingPage.title")} description={t("shippingPage.desc")}>
      {METHODS.map(({ Icon, title, desc }) => (
        <InfoSection key={title} title={title}>
          <p className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            {desc}
          </p>
        </InfoSection>
      ))}
    </InfoPage>
  );
}
