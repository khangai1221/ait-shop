import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — AIT Shop" }] }),
  component: Categories,
});

function Categories() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <header className="mb-6 sm:mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-wider text-brand">
          {t("categories.browse")}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-1 sm:mt-2">
          {t("categories.all")}
        </h1>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((c, i) => {
          const sample = products.find((p) => p.category === c.name) || products[0];
          const tints = [
            "from-[#3FBAEB] to-[#1B8FCB]",
            "from-[#7C76D9] to-[#5A53B5]",
            "from-[#26B7B0] to-[#0F8A85]",
            "from-[#F59E0B] to-[#B97208]",
            "from-[#EF4444] to-[#B91C1C]",
            "from-[#111827] to-[#0a0f1c]",
          ];
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`relative h-56 sm:h-72 rounded-2xl sm:rounded-3xl p-5 sm:p-7 overflow-hidden bg-gradient-to-br ${tints[i % tints.length]} text-white group`}
            >
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70">
                  {c.count} {t("common.items")}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl mt-1">{c.name}</h2>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-white/85 max-w-[60%] sm:max-w-[55%]">
                  {c.tagline}
                </p>
              </div>
              <img
                src={sample.image}
                alt={c.name}
                loading="lazy"
                className="absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 h-40 sm:h-52 w-auto -rotate-12 group-hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
              />
              <span className="absolute bottom-4 sm:bottom-5 left-5 sm:left-7 text-xs sm:text-sm font-semibold">
                {t("categories.shop", { name: c.name })}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
