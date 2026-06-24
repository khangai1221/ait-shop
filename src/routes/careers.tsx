import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/careers")({
   head: () => ({ meta: [{ title: "Careers — AIT Shop" }] }),
  component: Careers,
});

function Careers() {
  const { t } = useTranslation();
  return (
    <InfoPage tag={t("careersPage.tag")} title={t("careersPage.title")} description={t("careersPage.desc")}>
      <div className="rounded-2xl border border-border p-8 sm:p-12 text-center bg-card">
        <Briefcase className="h-8 w-8 mx-auto text-brand mb-4" />
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">{t("careersPage.cta")}</p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
        >
          {t("careersPage.button")}
        </Link>
      </div>
    </InfoPage>
  );
}
