import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: "Returns — AirStep" }] }),
  component: Returns,
});

function Returns() {
  const { t } = useTranslation();
  const STEPS = [
    [t("returnsPage.step1Title"), t("returnsPage.step1Desc")],
    [t("returnsPage.step2Title"), t("returnsPage.step2Desc")],
    [t("returnsPage.step3Title"), t("returnsPage.step3Desc")],
  ];
  return (
    <InfoPage tag={t("returnsPage.tag")} title={t("returnsPage.title")} description={t("returnsPage.desc")}>
      <ol className="space-y-4">
        {STEPS.map(([title, desc]) => (
          <li key={title} className="rounded-2xl border border-border p-6 sm:p-8 bg-card">
            <h2 className="font-display text-lg sm:text-xl mb-2">{title}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{desc}</p>
          </li>
        ))}
      </ol>
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/contact" className="text-brand font-medium hover:underline">
          {t("common.contactUs")}
        </Link>
      </p>
    </InfoPage>
  );
}
