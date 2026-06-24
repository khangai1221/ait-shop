import { createFileRoute } from "@tanstack/react-router";
import shoe from "@/assets/shoe-1.png";
import shoe2 from "@/assets/shoe-6.png";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
   head: () => ({ meta: [{ title: "About — AIT Shop" }] }),
  component: About,
});

function About() {
  const { t } = useTranslation();

  const STATS = [
    ["12M+", t("about.statPairs")],
    ["60+", t("about.statCountries")],
    ["180", t("about.statPartners")],
    ["98%", t("about.statHappy")],
  ];

  const VALUES = [
    [t("about.craftTitle"), t("about.craftDesc")],
    [t("about.perfTitle"), t("about.perfDesc")],
    [t("about.respTitle"), t("about.respDesc")],
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">{t("about.storyTag")}</p>
            <h1 className="font-display text-5xl lg:text-7xl mt-3 leading-[0.95]">
              {t("about.headline")}
            </h1>
            <p className="mt-5 text-white/90 max-w-md leading-relaxed">{t("about.intro")}</p>
          </div>
          <img src={shoe} alt="" className="drop-shadow-2xl -rotate-6" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-border p-8 text-center">
            <p className="font-display text-4xl text-brand">{n}</p>
            <p className="text-sm text-muted-foreground mt-2">{l}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <img src={shoe2} alt="" className="rounded-3xl bg-muted p-12" />
        <div>
          <p className="text-sm uppercase tracking-wider text-brand">{t("about.missionTag")}</p>
          <h2 className="font-display text-4xl mt-2">{t("about.missionHeading")}</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">{t("about.missionDesc")}</p>
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-display text-4xl text-center mb-12">{t("about.valuesHeading")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map(([title, desc]) => (
              <div key={title} className="rounded-2xl bg-background p-8">
                <p className="font-display text-2xl text-brand">{title}</p>
                <p className="text-muted-foreground mt-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
