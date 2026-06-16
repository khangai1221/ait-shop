import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { InfoPage } from "@/components/InfoPage";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Site feedback — AirStep" }] }),
  component: Feedback,
});

function Feedback() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    toast.success(t("feedback.success"));
    setMessage("");
  };

  return (
    <InfoPage tag={t("feedback.tag")} title={t("feedback.title")} description={t("feedback.desc")}>
      <form onSubmit={submit} className="rounded-2xl border border-border p-6 sm:p-8 bg-card space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("feedback.label")}
          </span>
          <textarea
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedback.placeholder")}
            className="mt-1 w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <button
          type="submit"
          className="w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition active:scale-[0.98]"
        >
          {t("feedback.send")}
        </button>
      </form>
    </InfoPage>
  );
}
