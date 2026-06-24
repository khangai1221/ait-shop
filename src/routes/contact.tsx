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
        <h1 className="font-display text-5xl lg:text-6xl mt-2">{t("contact.heading")}</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("contact.desc")}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {[
          { Icon: Mail, label: t("common.email"), val: "contact@aitshop.com" },
          { Icon: Phone, label: t("common.phone"), val: "+1 (555) 123-4567" },
          { Icon: MapPin, label: t("contact.flagship"), val: "120 Market St, San Francisco" },
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
          className="rounded-3xl border border-border p-8 space-y-4 bg-card"
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

        <div className="aspect-square lg:aspect-auto rounded-3xl bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] relative overflow-hidden grid place-items-center">
          <div className="text-white text-center p-8">
            <MapPin className="h-10 w-10 mx-auto" />
            <p className="font-display text-2xl mt-4">120 Market Street</p>
            <p className="text-white/80 mt-1">San Francisco, CA 94103</p>
            <p className="text-sm text-white/70 mt-4">{t("contact.hours")}</p>
          </div>
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
