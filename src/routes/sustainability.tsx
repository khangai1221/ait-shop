import { createFileRoute } from "@tanstack/react-router";
import { Recycle, ShieldCheck, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/sustainability")({
  head: () => ({ meta: [{ title: "Sustainability — AirStep" }] }),
  component: Sustainability,
});

function Sustainability() {
  const { t } = useTranslation();
  const PILLARS = [
    { Icon: Recycle, title: t("sustainabilityPage.materialsTitle"), desc: t("sustainabilityPage.materialsDesc") },
    { Icon: ShieldCheck, title: t("sustainabilityPage.factoriesTitle"), desc: t("sustainabilityPage.factoriesDesc") },
    { Icon: Link2, title: t("sustainabilityPage.supplyTitle"), desc: t("sustainabilityPage.supplyDesc") },
  ];
  return (
    <InfoPage
      tag={t("sustainabilityPage.tag")}
      title={t("sustainabilityPage.title")}
      description={t("sustainabilityPage.desc")}
    >
      {PILLARS.map(({ Icon, title, desc }) => (
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
