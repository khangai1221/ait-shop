import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/find-store")({
  head: () => ({ meta: [{ title: "Find a store — AIT Shop" }] }),
  component: FindStore,
});

function FindStore() {
  const { t } = useTranslation();
  return (
    <InfoPage
      tag={t("findStore.tag")}
      title={t("findStore.title")}
      description={t("findStore.desc")}
    >
      <InfoSection title={t("findStore.addressLabel")}>
        <p className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          {t("findStore.address")}
        </p>
      </InfoSection>
      <InfoSection title={t("findStore.hoursLabel")}>
        <p className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          {t("findStore.hours")}
        </p>
      </InfoSection>
      <InfoSection title={t("common.checkout")}>
        <p className="flex items-start gap-3">
          <ShoppingBag className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          {t("findStore.pickupNote")}
        </p>
      </InfoSection>
    </InfoPage>
  );
}
