import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/investors")({
   head: () => ({ meta: [{ title: "Investors — AIT Shop" }] }),
  component: Investors,
});

function Investors() {
  const { t } = useTranslation();
  return (
    <InfoPage tag={t("investorsPage.tag")} title={t("investorsPage.title")} description={t("investorsPage.desc")}>
      <div className="rounded-2xl border border-border p-8 sm:p-12 text-center bg-card">
        <TrendingUp className="h-8 w-8 mx-auto text-brand mb-4" />
        <Link
          to="/contact"
          className="mt-2 inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
        >
          {t("investorsPage.button")}
        </Link>
      </div>
    </InfoPage>
  );
}
