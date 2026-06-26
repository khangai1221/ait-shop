import { createFileRoute } from "@tanstack/react-router";
import { Smartphone, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/payment-options")({
  head: () => ({ meta: [{ title: "Payment options — AIT Shop" }] }),
  component: PaymentOptions,
});

function PaymentOptions() {
  const { t } = useTranslation();
  const METHODS = [
    { Icon: Smartphone, title: t("paymentPage.qpayTitle"), desc: t("paymentPage.qpayDesc") },
    { Icon: Store, title: t("paymentPage.pickupTitle"), desc: t("paymentPage.pickupDesc") },
  ];
  return (
    <InfoPage
      tag={t("paymentPage.tag")}
      title={t("paymentPage.title")}
      description={t("paymentPage.desc")}
    >
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
