import { useState } from "react";
import { categories } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";
import { formatPrice } from "@/lib/format-price";

export type FilterState = {
  sizes: number[];
  colors: string[];
  category: string | null;
  maxPrice: number;
};

const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const ALL_COLORS = ["#3B82F6", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#111827", "#FFFFFF"];

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const langPrefix = language === "mn" ? "/mn" : "/en";
  const localizedPath = (path: string) => {
    if (path === "/") return langPrefix;
    return `${langPrefix}${path}`;
  };
  return (
    <aside className="space-y-8">
      <FilterSection title={t("common.category")}>
        <div className="space-y-1.5">
          <button
            onClick={() => onChange({ ...value, category: null })}
            className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition ${
              !value.category
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {t("common.allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onChange({ ...value, category: c.name })}
              className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition ${
                value.category === c.name
                  ? "bg-brand/10 text-brand font-medium"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t("common.price")}>
        <input
          type="range"
          min={89000}
          max={300000}
          step={10000}
          value={value.maxPrice}
          onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) })}
          className="w-full accent-[color:var(--brand)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatPrice(89000)}</span>
          <span className="font-semibold text-ink">{t("common.upTo")} {formatPrice(value.maxPrice)}</span>
        </div>
      </FilterSection>

      <FilterSection title={t("common.size")}>
        <div className="grid grid-cols-4 gap-2">
          {ALL_SIZES.map((s) => {
            const active = value.sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() =>
                  onChange({
                    ...value,
                    sizes: active ? value.sizes.filter((x) => x !== s) : [...value.sizes, s],
                  })
                }
                className={`h-10 rounded-lg border text-sm font-medium transition ${
                  active ? "bg-ink text-white border-ink" : "border-border hover:border-brand"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => {
            const active = value.colors.includes(c);
            return (
              <button
                key={c}
                onClick={() =>
                  onChange({
                    ...value,
                    colors: active ? value.colors.filter((x) => x !== c) : [...value.colors, c],
                  })
                }
                style={{ background: c }}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  active ? "border-brand ring-2 ring-brand/30" : "border-border"
                }`}
                aria-label={c}
              />
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between mb-3"
      >
        <h3 className="font-display text-sm uppercase tracking-wider">{title}</h3>
        <span className="text-muted-foreground text-xs">{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}

export const emptyFilters: FilterState = { sizes: [], colors: [], category: null, maxPrice: 300000 };
