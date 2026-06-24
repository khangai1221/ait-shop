import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/newsletter")({
   head: () => ({ meta: [{ title: "Newsletter — AIT Shop" }] }),
  component: Newsletter,
});

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t("newsletter.success"));
    setEmail("");
  };

  return (
    <InfoPage tag={t("newsletter.tag")} title={t("newsletter.title")} description={t("newsletter.desc")}>
      <form
        onSubmit={submit}
        className="rounded-2xl border border-border p-6 sm:p-8 bg-card flex flex-col sm:flex-row gap-3"
      >
        <label className="flex-1 relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.placeholder")}
            className="w-full h-12 pl-11 pr-4 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <button
          type="submit"
          className="h-12 px-6 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]"
        >
          {t("newsletter.subscribe")}
        </button>
      </form>
      <p className="text-xs text-muted-foreground text-center">{t("newsletter.privacyNote")}</p>
    </InfoPage>
  );
}
