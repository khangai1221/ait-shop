import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/news")({
   head: () => ({ meta: [{ title: "News — AIT Shop" }] }),
  component: News,
});

// Add news items here as they happen — newest first. Each item needs both languages.
const NEWS_ITEMS: { date: string; title: { en: string; mn: string }; body: { en: string; mn: string } }[] = [];

function News() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "mn" ? "mn" : "en";

  return (
    <InfoPage tag={t("newsPage.tag")} title={t("newsPage.title")} description={t("newsPage.desc")}>
      {NEWS_ITEMS.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Newspaper className="h-8 w-8 mx-auto mb-3" />
          {t("newsPage.empty")}
        </div>
      ) : (
        NEWS_ITEMS.map((item) => (
          <article key={item.date} className="rounded-2xl border border-border p-6 sm:p-8 bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.date}</p>
            <h2 className="font-display text-xl sm:text-2xl mt-1 mb-2">{item.title[lang]}</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.body[lang]}</p>
          </article>
        ))
      )}
    </InfoPage>
  );
}
