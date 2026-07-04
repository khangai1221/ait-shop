import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact us — AIT Shop" }] }),
  component: Contact,
});

function Contact() {
  const { t } = useTranslation();

  const FAQ = [
    [t("contact.q1"), t("contact.a1")],
    [t("contact.q2"), t("contact.a2")],
    [t("contact.q3"), t("contact.a3")],
    [t("contact.q4"), t("contact.a4")],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <p className="text-sm uppercase tracking-wider text-brand">{t("contact.title")}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl mt-2">
          {t("contact.heading")}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("contact.desc")}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {[
          { Icon: Mail, label: t("common.email"), val: "contact@aitshop.com" },
          { Icon: Phone, label: t("common.phone"), val: "+97694468252" },
          {
            Icon: MapPin,
            label: t("contact.flagship"),
            val: "Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот",
          },
        ].map(({ Icon, label, val }) => (
          <div key={label} className="rounded-2xl border border-border p-6">
            <Icon className="h-6 w-6 text-brand" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-3">{label}</p>
            <p className="font-semibold mt-1">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl border border-border p-5 sm:p-8 space-y-4 bg-card"
        >
          <h2 className="font-display text-2xl">{t("contact.sendMessage")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("common.name")} />
            <Field label={t("common.email")} type="email" />
          </div>
          <Field label={t("contact.subject")} />
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("contact.message")}
            </span>
            <textarea
              rows={5}
              className="mt-1 w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </label>
          <button className="w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition">
            {t("contact.send")}
          </button>
        </form>

        <div className="aspect-square lg:aspect-auto rounded-3xl overflow-hidden border border-border">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent("Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Их тойруу, Дархан төв, 303 тоот")}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="AIT Shop location — Дархан төв, Улаанбаатар"
          />
        </div>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-3xl text-center mb-8">{t("contact.faq")}</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-border p-5 open:bg-muted/40"
            >
              <summary className="font-semibold cursor-pointer flex justify-between items-center">
                {q}
                <span className="text-brand group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        className="mt-1 w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </label>
  );
}
