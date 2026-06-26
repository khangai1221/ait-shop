// ── Shared type for the import preview ───────────────────────────────────────

export type ImportedProduct = {
  id: string;
  name: string;
  /** data URL (during preview) or Supabase URL (after upload) */
  image: string | null;
  imageFileName: string | null;
  buyingPrice: number | null;
  sellingPrice: number | null;
  availableSizes: string[];
  sourcePage: number | null;
  status: "ready" | "review_required" | "invalid";
  warnings: string[];
  /** flagged after duplicate check */
  possibleDuplicate?: boolean;
  duplicateProductId?: number;
};

export function makeImportId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ── Price normalisation (from spec) ──────────────────────────────────────────

export function normalizePrice(input: string): number | null {
  if (!input || typeof input !== "string") return null;

  const cleaned = input
    .toLowerCase()
    .replace(/[₮₹\s,''.’‘]/g, "")
    .trim();

  const match = cleaned.match(/^(\d+(?:\.\d+)?)(k)?$/);
  if (!match) return null;

  let amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;

  if (match[2] === "k") amount *= 1000;

  return Math.round(amount);
}

/**
 * Returns null when the number looks suspiciously truncated (e.g. "199,00"
 * which is probably "199,000" not "19900").
 * The caller should mark the row as review_required and suggest the corrected value.
 */
export function detectSuspiciousPrice(raw: string): { suspicious: boolean; suggestion: number | null } {
  const stripped = raw.replace(/\s/g, "");
  // Pattern: digits comma exactly two digits at end — likely missing a trailing zero
  if (/^\d{1,3},\d{2}$/.test(stripped) || /^\d{1,3}\.\d{2}$/.test(stripped)) {
    const asThousands = normalizePrice(raw.replace(/[,.](\d{2})$/, "$1") + "0");
    return { suspicious: true, suggestion: asThousands };
  }
  return { suspicious: false, suggestion: null };
}

// ── Size normalisation (from spec) ────────────────────────────────────────────

export function normalizeSizes(input: string): string[] {
  if (!input || typeof input !== "string") return [];

  const cleaned = input
    .replace(/\s+/g, "")
    .replace(/[–—]/g, "-");

  const sizes = new Set<number>();

  for (const part of cleaned.split(",")) {
    if (/^\d{2}$/.test(part)) {
      sizes.add(Number(part));
      continue;
    }

    const range = part.match(/^(\d{2})-(\d{2})$/);
    if (!range) continue;

    const start = Number(range[1]);
    const end = Number(range[2]);
    if (start > end || end - start > 15) continue;

    for (let size = start; size <= end; size++) {
      sizes.add(size);
    }
  }

  return [...sizes].sort((a, b) => a - b).map(String);
}

export function isSizelikeText(text: string): boolean {
  if (!text) return false;
  const t = text.replace(/\s/g, "");
  // looks like: 37, 37-39, 36,38,40, 36-39,44, etc.
  return /^(\d{2}(-\d{2})?)(,(\d{2}(-\d{2})?))*$/.test(t);
}

export function isPricelikeText(text: string): boolean {
  if (!text) return false;
  const n = normalizePrice(text);
  return n !== null && n > 10_000;
}

/**
 * Detect when selling-price and sizes columns are swapped.
 * Returns true if cell3 looks like sizes and cell4 looks like a price.
 */
export function detectColumnSwap(cell3: string, cell4: string): boolean {
  return isSizelikeText(cell3.trim()) && isPricelikeText(cell4.trim());
}

// ── Slug generation ──────────────────────────────────────────────────────────

export function generateSlug(name: string, existingSlugs?: Set<string>): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (!existingSlugs || !existingSlugs.has(base)) return base;
  let n = 2;
  while (existingSlugs.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// ── Row-level status computation ─────────────────────────────────────────────

export function computeStatus(
  p: Pick<ImportedProduct, "name" | "image" | "sellingPrice" | "availableSizes" | "warnings">,
): ImportedProduct["status"] {
  if (!p.name || !p.sellingPrice) return "invalid";
  if (!p.image || !p.availableSizes.length || p.warnings.length) return "review_required";
  return "ready";
}

// We add buyingPrice here for the full check
export function recomputeStatus(p: ImportedProduct): ImportedProduct["status"] {
  if (!p.name || !p.sellingPrice) return "invalid";
  if (!p.image || p.buyingPrice === null || !p.availableSizes.length || p.warnings.length) {
    return "review_required";
  }
  return "ready";
}
