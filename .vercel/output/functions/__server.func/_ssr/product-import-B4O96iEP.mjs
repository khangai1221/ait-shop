function makeImportId() {
  return Math.random().toString(36).slice(2, 10);
}
function normalizePrice(input) {
  if (!input || typeof input !== "string") return null;
  const cleaned = input.toLowerCase().replace(/[₮₹\s,''.’‘]/g, "").trim();
  const match = cleaned.match(/^(\d+(?:\.\d+)?)(k)?$/);
  if (!match) return null;
  let amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  if (match[2] === "k") amount *= 1e3;
  return Math.round(amount);
}
function detectSuspiciousPrice(raw) {
  const stripped = raw.replace(/\s/g, "");
  if (/^\d{1,3},\d{2}$/.test(stripped) || /^\d{1,3}\.\d{2}$/.test(stripped)) {
    const asThousands = normalizePrice(raw.replace(/[,.](\d{2})$/, "$1") + "0");
    return { suspicious: true, suggestion: asThousands };
  }
  return { suspicious: false, suggestion: null };
}
function normalizeSizes(input) {
  if (!input || typeof input !== "string") return [];
  const cleaned = input.replace(/\s+/g, "").replace(/[–—]/g, "-");
  const sizes = /* @__PURE__ */ new Set();
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
function isSizelikeText(text) {
  if (!text) return false;
  const t = text.replace(/\s/g, "");
  return /^(\d{2}(-\d{2})?)(,(\d{2}(-\d{2})?))*$/.test(t);
}
function isPricelikeText(text) {
  if (!text) return false;
  const n = normalizePrice(text);
  return n !== null && n > 1e4;
}
function detectColumnSwap(cell3, cell4) {
  return isSizelikeText(cell3.trim()) && isPricelikeText(cell4.trim());
}
function generateSlug(name, existingSlugs) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!existingSlugs || !existingSlugs.has(base)) return base;
  let n = 2;
  while (existingSlugs.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
function recomputeStatus(p) {
  if (!p.name || !p.sellingPrice) return "invalid";
  if (!p.image || p.buyingPrice === null || !p.availableSizes.length || p.warnings.length) {
    return "review_required";
  }
  return "ready";
}
export {
  detectSuspiciousPrice as a,
  normalizeSizes as b,
  detectColumnSwap as d,
  generateSlug as g,
  makeImportId as m,
  normalizePrice as n,
  recomputeStatus as r
};
