import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db, ensureReady } from "../db";
import { products, productSizes } from "../db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { requireAdmin } from "../server-auth";
import {
  normalizePrice,
  normalizeSizes,
  detectColumnSwap,
  detectSuspiciousPrice,
  generateSlug,
  recomputeStatus,
  makeImportId,
  type ImportedProduct,
} from "../utils/product-import";

// ── Supabase upload helper ────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
const BUCKET = "products";

async function uploadImageBuffer(
  buffer: Buffer,
  contentType: string,
  fileName: string,
): Promise<string | null> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `imports/${Date.now()}-${safeName}`;
    const { data: upload, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType, upsert: false });
    if (error) return null;
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(upload.path);
    return publicUrl;
  } catch {
    return null;
  }
}

// ── DOCX parser ───────────────────────────────────────────────────────────────

async function parseDocx(buffer: Buffer): Promise<ImportedProduct[]> {
  const mammoth = await import("mammoth");
  const cheerio = await import("cheerio");

  const imageMap = new Map<string, { data: Buffer; contentType: string }>();

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const imgBuffer = await image.read();
        const id = `img_${imageMap.size}`;
        imageMap.set(id, { data: imgBuffer, contentType: image.contentType });
        return { src: id };
      }),
    },
  );

  const $ = cheerio.load(result.value);
  const rows: ImportedProduct[] = [];

  // Find all table rows — the first row is usually a header
  const tableRows = $("table tr").toArray();
  const dataRows = tableRows.length > 1 ? tableRows.slice(1) : tableRows;

  for (const tr of dataRows) {
    const cells = $(tr).find("td, th").toArray();
    if (cells.length < 2) continue;

    const warnings: string[] = [];

    // ── Cell 1: product name + image ─────────────────────────────────────────
    const firstCell = $(cells[0]);
    const imgSrc = firstCell.find("img").attr("src") ?? null;
    firstCell.find("img").remove();
    const rawName = firstCell.text().replace(/\s+/g, " ").trim();

    // ── Cells 2-4 ────────────────────────────────────────────────────────────
    let rawCell2 = cells[1] ? $(cells[1]).text().replace(/\s+/g, " ").trim() : "";
    let rawCell3 = cells[2] ? $(cells[2]).text().replace(/\s+/g, " ").trim() : "";
    let rawCell4 = cells[3] ? $(cells[3]).text().replace(/\s+/g, " ").trim() : "";

    // Detect column swap: selling-price and sizes reversed
    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }

    const buyingPriceRaw = rawCell2;
    const sellingPriceRaw = rawCell3;
    const sizesRaw = rawCell4;

    // Price normalisation
    const buyingPrice = normalizePrice(buyingPriceRaw);
    let sellingPrice = normalizePrice(sellingPriceRaw);

    if (buyingPriceRaw && buyingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(buyingPriceRaw);
      if (suspicious)
        warnings.push(
          `Buying price "${buyingPriceRaw}" looks truncated — suggested value: ${suggestion?.toLocaleString()}.`,
        );
      else warnings.push(`Could not parse buying price: "${buyingPriceRaw}".`);
    }
    if (sellingPriceRaw && sellingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(sellingPriceRaw);
      if (suspicious) {
        sellingPrice = suggestion;
        warnings.push(
          `Selling price "${sellingPriceRaw}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`,
        );
      } else {
        warnings.push(`Could not parse selling price: "${sellingPriceRaw}".`);
      }
    }

    // Size normalisation
    const availableSizes = normalizeSizes(sizesRaw);
    if (sizesRaw && !availableSizes.length) {
      warnings.push(`Could not parse sizes: "${sizesRaw}".`);
    }

    // Image: upload embedded data-URL image to Supabase now for preview URL
    let imageUrl: string | null = null;
    if (imgSrc && imageMap.has(imgSrc)) {
      const { data, contentType } = imageMap.get(imgSrc)!;
      const ext = contentType.split("/")[1] ?? "jpg";
      const uploaded = await uploadImageBuffer(data, contentType, `${rawName || "product"}.${ext}`);
      imageUrl = uploaded;
    }

    const product: ImportedProduct = {
      id: makeImportId(),
      name: rawName,
      image: imageUrl,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings,
      status: "ready",
    };
    product.status = recomputeStatus(product);

    if (!rawName && !sellingPrice) continue; // blank row
    rows.push(product);
  }

  return rows;
}

// ── XLSX parser ───────────────────────────────────────────────────────────────

async function parseXlsx(buffer: Buffer): Promise<ImportedProduct[]> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer", cellText: true, cellNF: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];

  // Get rows as arrays of strings
  const rawRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const rows: ImportedProduct[] = [];

  // Skip header row (first row if it contains non-numeric text in col 2)
  const startIdx =
    rawRows.length > 0 &&
    rawRows[0][1] &&
    normalizePrice(String(rawRows[0][1])) === null &&
    isNaN(Number(String(rawRows[0][1]).replace(/[,.\s]/g, "")))
      ? 1
      : 0;

  for (let i = startIdx; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rawName = String(row[0] ?? "").trim();
    let rawCell2 = String(row[1] ?? "").trim();
    let rawCell3 = String(row[2] ?? "").trim();
    let rawCell4 = String(row[3] ?? "").trim();

    if (!rawName && !rawCell2 && !rawCell3 && !rawCell4) continue;

    const warnings: string[] = [];

    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }

    const buyingPrice = normalizePrice(rawCell2);
    let sellingPrice = normalizePrice(rawCell3);

    if (rawCell2 && buyingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(rawCell2);
      if (suspicious)
        warnings.push(`Buying price "${rawCell2}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
      else warnings.push(`Could not parse buying price: "${rawCell2}".`);
    }
    if (rawCell3 && sellingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(rawCell3);
      if (suspicious) {
        sellingPrice = suggestion;
        warnings.push(`Selling price "${rawCell3}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`);
      } else {
        warnings.push(`Could not parse selling price: "${rawCell3}".`);
      }
    }

    const availableSizes = normalizeSizes(rawCell4);
    if (rawCell4 && !availableSizes.length) {
      warnings.push(`Could not parse sizes: "${rawCell4}".`);
    }

    // XLSX embedded images are not reliably extractable; mark for review
    const product: ImportedProduct = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings: [...warnings, "Image not extracted from XLSX — please add manually."],
      status: "ready",
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }

  return rows;
}

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if ((ch === "," || ch === ";") && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function parseCsv(buffer: Buffer): Promise<ImportedProduct[]> {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  const firstCells = parseCsvLine(lines[0]);
  const isHeader =
    firstCells.length >= 2 &&
    normalizePrice(firstCells[1]) === null &&
    isNaN(Number(firstCells[1].replace(/[,.\s]/g, "")));

  const startIdx = isHeader ? 1 : 0;
  const rows: ImportedProduct[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const rawName = cols[0] ?? "";
    let rawCell2 = cols[1] ?? "";
    let rawCell3 = cols[2] ?? "";
    let rawCell4 = cols[3] ?? "";
    if (!rawName && !rawCell2 && !rawCell3 && !rawCell4) continue;

    const warnings: string[] = [];

    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }

    const buyingPrice = normalizePrice(rawCell2);
    let sellingPrice = normalizePrice(rawCell3);

    if (rawCell2 && buyingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(rawCell2);
      if (suspicious)
        warnings.push(`Buying price "${rawCell2}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
      else warnings.push(`Could not parse buying price: "${rawCell2}".`);
    }
    if (rawCell3 && sellingPrice === null) {
      const { suspicious, suggestion } = detectSuspiciousPrice(rawCell3);
      if (suspicious) {
        sellingPrice = suggestion;
        warnings.push(`Selling price "${rawCell3}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`);
      } else {
        warnings.push(`Could not parse selling price: "${rawCell3}".`);
      }
    }

    const availableSizes = normalizeSizes(rawCell4);
    if (rawCell4 && !availableSizes.length) {
      warnings.push(`Could not parse sizes: "${rawCell4}".`);
    }

    const product: ImportedProduct = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings,
      status: "ready",
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }

  return rows;
}

// ── PDF parser ────────────────────────────────────────────────────────────────

function decodePdfStr(raw: string): string {
  return raw
    .replace(/\\(\d{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
    .replace(/\\n/g, " ")
    .replace(/\\r/g, "")
    .replace(/\\\\/g, "\\")
    .replace(/\\(.)/g, "$1");
}

function parseContentStreamText(content: string): string[] {
  const lines: string[] = [];
  let cur: string[] = [];
  const re =
    /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj|\[([\s\S]*?)\]\s*TJ|T[*dD]|ET/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const tok = m[0];
    if (m[1] !== undefined) {
      cur.push(decodePdfStr(m[1]));
    } else if (m[2] !== undefined) {
      const tjRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
      let tm: RegExpExecArray | null;
      while ((tm = tjRe.exec(m[2])) !== null) cur.push(decodePdfStr(tm[1]));
    } else if (tok === "ET" || tok.startsWith("T")) {
      const j = cur.join("").trim();
      if (j) lines.push(j);
      cur = [];
    }
  }
  const last = cur.join("").trim();
  if (last) lines.push(last);
  return lines;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { inflateSync, inflateRawSync } = await import(/* @vite-ignore */ "node:zlib");

  const allLines: string[] = [];
  let pos = 0;

  while (pos < buffer.length) {
    // Find the literal bytes "stream"
    const si = buffer.indexOf(Buffer.from("stream"), pos);
    if (si === -1) break;

    // The PDF spec requires "stream" to be immediately followed by \n or \r\n.
    // Skip non-stream occurrences (e.g. "/FlateDecode" contains no newline after "stream").
    let di = si + 6;
    if (buffer[di] === 0x20) di++; // some generators add a trailing space
    if (buffer[di] === 0x0d) di++; // CR
    if (buffer[di] !== 0x0a) { pos = si + 6; continue; } // must have LF
    di++; // consume LF — di now points at first byte of stream data

    // Look back up to 1 KB for the object dictionary
    const lookBack = buffer.slice(Math.max(0, si - 1024), si).toString("latin1");

    // Try to read /Length directly (common case). Indirect refs (/Length N R)
    // are skipped; we fall back to the endstream search in that case.
    const lenMatch = lookBack.match(/\/Length\s+(\d+)\b(?!\s*\d+\s+\d+\s+R)/);
    let dataEnd: number;
    if (lenMatch) {
      dataEnd = di + parseInt(lenMatch[1], 10);
    } else {
      const ei = buffer.indexOf(Buffer.from("endstream"), di);
      if (ei === -1) { pos = si + 6; continue; }
      dataEnd = ei;
    }

    const streamBuf = buffer.slice(di, dataEnd);
    const isFlate = /\/FlateDecode|\/Fl(?=[\s\/\[>])/.test(lookBack);

    let content: string | null = null;

    if (isFlate) {
      // Try zlib-wrapped first (most common), then raw deflate as fallback
      for (const fn of [inflateSync, inflateRawSync] as const) {
        try {
          const dec = fn(streamBuf);
          // PDFs may encode text as UTF-16BE (starts with BOM FEFF) or Latin-1
          const hasBom = dec[0] === 0xfe && dec[1] === 0xff;
          content = hasBom ? dec.toString("utf16le") : dec.toString("latin1");
          if (content.includes("BT")) break;
          content = null; // no text ops — try next decompressor
        } catch { /* try next */ }
      }
    } else {
      const raw = streamBuf.toString("latin1");
      if (raw.includes("BT")) content = raw;
    }

    if (content) allLines.push(...parseContentStreamText(content));

    pos = dataEnd + 9; // step past "endstream"
  }

  return allLines.join("\n");
}

async function parsePdf(buffer: Buffer): Promise<ImportedProduct[]> {
  // ── Claude API path (works with any PDF format) ───────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey });
      const base64 = buffer.toString("base64");

      const prompt = `Extract every shoe product from this PDF catalog.
The document has a table with 4 columns: product name, buying price, selling price, available sizes.

For each product row (skip the header), return exactly:
- "name": the product name
- "buyingPriceRaw": the buying price as written (e.g. "80,000" or "80.000")
- "sellingPriceRaw": the selling price as written (e.g. "290,000" or "₮300,000" or "230k")
- "sizesRaw": the sizes as written (e.g. "37,39" or "36-39")

Process every page. Return ONLY a JSON array, no markdown:
[{"name":"...","buyingPriceRaw":"...","sellingPriceRaw":"...","sizesRaw":"..."}]`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8096,
        messages: [
          {
            role: "user",
            content: [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: base64 },
              } as any,
              { type: "text", text: prompt },
            ],
          },
        ],
      });

      const responseText = response.content.find((c) => c.type === "text")?.text ?? "";
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]) as Array<{
          name: string | null;
          buyingPriceRaw: string | null;
          sellingPriceRaw: string | null;
          sizesRaw: string | null;
        }>;

        const rows: ImportedProduct[] = [];
        for (const e of extracted) {
          if (!e.name?.trim()) continue;
          const warnings: string[] = [
            "PDF image extraction not supported — please add image manually.",
          ];

          const buyingPrice = e.buyingPriceRaw ? normalizePrice(e.buyingPriceRaw) : null;
          let sellingPrice = e.sellingPriceRaw ? normalizePrice(e.sellingPriceRaw) : null;

          if (e.buyingPriceRaw && buyingPrice === null) {
            const { suspicious, suggestion } = detectSuspiciousPrice(e.buyingPriceRaw);
            if (suspicious)
              warnings.push(`Buying price "${e.buyingPriceRaw}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
            else warnings.push(`Could not parse buying price: "${e.buyingPriceRaw}".`);
          }
          if (e.sellingPriceRaw && sellingPrice === null) {
            const { suspicious, suggestion } = detectSuspiciousPrice(e.sellingPriceRaw);
            if (suspicious) {
              sellingPrice = suggestion;
              warnings.push(`Selling price "${e.sellingPriceRaw}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`);
            } else {
              warnings.push(`Could not parse selling price: "${e.sellingPriceRaw}".`);
            }
          }

          const availableSizes = e.sizesRaw ? normalizeSizes(e.sizesRaw) : [];
          if (e.sizesRaw && !availableSizes.length)
            warnings.push(`Could not parse sizes: "${e.sizesRaw}".`);

          const product: ImportedProduct = {
            id: makeImportId(),
            name: e.name.trim(),
            image: null,
            imageFileName: null,
            buyingPrice,
            sellingPrice,
            availableSizes,
            sourcePage: null,
            warnings,
            status: "ready",
          };
          product.status = recomputeStatus(product);
          rows.push(product);
        }
        if (rows.length > 0) return rows;
      }
    } catch (err) {
      console.error("[parsePdf] Claude API extraction failed:", err);
      // fall through to text extraction
    }
  }

  // ── Text extraction fallback (no API key, or Claude call failed) ──────────
  const text = await extractPdfText(buffer);

  if (!text.trim()) {
    return [
      {
        id: makeImportId(),
        name: "",
        image: null,
        imageFileName: null,
        buyingPrice: null,
        sellingPrice: null,
        availableSizes: [],
        sourcePage: null,
        status: "review_required",
        warnings: [
          "No readable text found in this PDF (possibly scanned or image-based). " +
            "Please convert your product list to XLSX, CSV, or DOCX for best results.",
        ],
      },
    ];
  }

  const rows: ImportedProduct[] = [];
  const rawLines = text.split("\n");
  let pageNumber = 1;

  for (const line of rawLines) {
    if (!line.trim()) continue;
    if (/page\s+\d+/i.test(line)) { pageNumber++; continue; }

    const cols = line.trim().split(/\s{2,}/);
    if (cols.length < 3) continue;

    const rawName = cols[0].trim();
    let rawCell2 = cols[1]?.trim() ?? "";
    let rawCell3 = cols[2]?.trim() ?? "";
    let rawCell4 = cols[3]?.trim() ?? "";

    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
    }

    const buyingPrice = normalizePrice(rawCell2);
    const sellingPrice = normalizePrice(rawCell3);
    if (!sellingPrice) continue;

    const availableSizes = normalizeSizes(rawCell4);
    const warnings: string[] = [
      "PDF image extraction not supported — please add image manually.",
    ];

    const product: ImportedProduct = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: pageNumber,
      warnings,
      status: "ready",
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }

  return rows;
}

// ── Image (JPG/PNG) parser — uses Claude Vision when API key is present ───────

async function parseImage(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<ImportedProduct[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Upload image to Supabase so the admin can at least preview it
    const imageUrl = await uploadImageBuffer(buffer, mimeType, fileName);
    return [
      {
        id: makeImportId(),
        name: "",
        image: imageUrl,
        imageFileName: fileName,
        buyingPrice: null,
        sellingPrice: null,
        availableSizes: [],
        sourcePage: 1,
        status: "review_required",
        warnings: [
          "ANTHROPIC_API_KEY is not set — automatic extraction from images is unavailable. Please fill in the product details manually.",
        ],
      },
    ];
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  const mediaType = mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const base64 = buffer.toString("base64");

  const prompt = `You are extracting product data from a catalog image. The image shows a table with products.

For each product row you see, extract:
1. Product name (text from the first column/cell)
2. Buying price (second column — what the shop paid)
3. Selling price (third column — what customers pay)
4. Available shoe sizes (fourth column — e.g. "37,39" or "36-39")

Return a JSON array with this exact structure, no markdown:
[
  {
    "name": "PRODUCT NAME",
    "buyingPriceRaw": "80,000",
    "sellingPriceRaw": "290,000",
    "sizesRaw": "37,39"
  }
]

If a field is missing or unclear, use null. Only return the JSON array, nothing else.`;

  let extracted: Array<{
    name: string;
    buyingPriceRaw: string | null;
    sellingPriceRaw: string | null;
    sizesRaw: string | null;
  }> = [];

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = response.content.find((c) => c.type === "text")?.text ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) extracted = JSON.parse(jsonMatch[0]);
  } catch {
    return [
      {
        id: makeImportId(),
        name: "",
        image: null,
        imageFileName: fileName,
        buyingPrice: null,
        sellingPrice: null,
        availableSizes: [],
        sourcePage: 1,
        status: "review_required",
        warnings: ["Claude Vision extraction failed — please fill in details manually."],
      },
    ];
  }

  // Upload image once for preview
  const sharedImageUrl = await uploadImageBuffer(buffer, mimeType, fileName);

  return extracted.map((e, idx) => {
    const warnings: string[] = [];
    const buyingPrice = e.buyingPriceRaw ? normalizePrice(e.buyingPriceRaw) : null;
    const sellingPrice = e.sellingPriceRaw ? normalizePrice(e.sellingPriceRaw) : null;
    const availableSizes = e.sizesRaw ? normalizeSizes(e.sizesRaw) : [];

    if (e.buyingPriceRaw && buyingPrice === null)
      warnings.push(`Could not parse buying price: "${e.buyingPriceRaw}".`);
    if (e.sellingPriceRaw && sellingPrice === null)
      warnings.push(`Could not parse selling price: "${e.sellingPriceRaw}".`);
    if (e.sizesRaw && !availableSizes.length)
      warnings.push(`Could not parse sizes: "${e.sizesRaw}".`);

    const product: ImportedProduct = {
      id: makeImportId(),
      name: e.name ?? "",
      image: sharedImageUrl,
      imageFileName: fileName,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: 1,
      warnings,
      status: "ready",
    };
    product.status = recomputeStatus(product);
    return product;
  });
}

// ── Server function: parse a file and return preview rows ─────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export const parseImportFile = createServerFn({ method: "POST" })
  .validator(
    z.object({
      // ~18 MB file max (base64 inflates ~33%)
      fileBase64: z.string().max(24_000_000),
      fileName: z.string().max(255),
      mimeType: z.string().max(128),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();

    const mime = data.mimeType.toLowerCase().split(";")[0].trim();
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      throw new Error(`Unsupported file type: ${mime}`);
    }

    const buffer = Buffer.from(data.fileBase64, "base64");
    const ext = data.fileName.split(".").pop()?.toLowerCase() ?? "";

    let rows: ImportedProduct[] = [];

    if (ext === "docx" || mime.includes("wordprocessingml")) {
      rows = await parseDocx(buffer);
    } else if (ext === "xlsx" || ext === "xls" || mime.includes("spreadsheetml")) {
      rows = await parseXlsx(buffer);
    } else if (ext === "csv" || mime === "text/csv") {
      rows = await parseCsv(buffer);
    } else if (ext === "pdf" || mime === "application/pdf") {
      rows = await parsePdf(buffer);
    } else if (["jpg", "jpeg", "png"].includes(ext) || mime.startsWith("image/")) {
      rows = await parseImage(buffer, mime, data.fileName);
    } else {
      throw new Error(`Unsupported file extension: ${ext}`);
    }

    return rows;
  });

// ── Server function: check for duplicates ─────────────────────────────────────

export const checkProductDuplicates = createServerFn({ method: "POST" })
  .validator(
    z.object({
      items: z.array(
        z.object({
          importId: z.string(),
          name: z.string(),
          sellingPrice: z.number().nullable(),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureReady();

    const results: Record<string, { isDuplicate: boolean; existingId?: number }> = {};

    for (const item of data.items) {
      if (!item.name) { results[item.importId] = { isDuplicate: false }; continue; }
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const existing = await db
        .select({ id: products.id, price: products.price })
        .from(products)
        .where(ilike(products.name, item.name.trim()))
        .limit(1);

      if (existing.length > 0) {
        results[item.importId] = { isDuplicate: true, existingId: existing[0].id };
      } else {
        results[item.importId] = { isDuplicate: false };
      }
    }

    return results;
  });

// ── Server function: finalise the import ─────────────────────────────────────

const ImportedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  imageFileName: z.string().nullable(),
  buyingPrice: z.number().nullable(),
  sellingPrice: z.number().nullable(),
  availableSizes: z.array(z.string()),
  sourcePage: z.number().nullable(),
  status: z.enum(["ready", "review_required", "invalid"]),
  warnings: z.array(z.string()),
  possibleDuplicate: z.boolean().optional(),
  duplicateProductId: z.number().optional(),
  overwriteExistingId: z.number().nullable().optional(),
});

export const finalizeProductImport = createServerFn({ method: "POST" })
  .validator(
    z.object({
      items: z.array(ImportedProductSchema).min(1).max(500),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureReady();

    // Collect existing slugs to avoid duplicates
    const existingSlugRows = await db.select({ slug: products.slug }).from(products);
    const existingSlugs = new Set(existingSlugRows.map((r) => r.slug).filter(Boolean) as string[]);

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (const item of data.items) {
      if (!item.name || !item.sellingPrice) { skipped++; continue; }

      try {
        const slug = generateSlug(item.name, existingSlugs);
        existingSlugs.add(slug);

        const sizesJson =
          item.availableSizes.length > 0
            ? JSON.stringify(item.availableSizes.map(Number).filter((n) => !isNaN(n)))
            : null;

        let productId: number;

        if (item.overwriteExistingId) {
          // Replace an existing product
          const [updated] = await db
            .update(products)
            .set({
              name: item.name,
              price: item.sellingPrice,
              buyingPrice: item.buyingPrice,
              imageUrl: item.image,
              sizes: sizesJson,
              slug,
              status: "draft",
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.overwriteExistingId))
            .returning({ id: products.id });
          productId = updated.id;

          // Re-create sizes
          await db.delete(productSizes).where(eq(productSizes.productId, productId));
        } else {
          const [inserted] = await db
            .insert(products)
            .values({
              name: item.name,
              price: item.sellingPrice,
              buyingPrice: item.buyingPrice,
              stock: 0,
              imageUrl: item.image,
              sizes: sizesJson,
              slug,
              status: "draft",
              createdAt: new Date(),
            })
            .returning({ id: products.id });
          productId = inserted.id;
        }

        // Create productSizes records
        if (item.availableSizes.length > 0) {
          await db
            .insert(productSizes)
            .values(
              item.availableSizes.map((size) => ({ productId, size, available: true })),
            )
            .onConflictDoNothing();
        }

        imported++;
      } catch (err) {
        console.error("Failed to import product:", item.name, err);
        failed++;
      }
    }

    return { imported, skipped, failed, needsReview: 0 };
  });

// ── Server function: publish/unpublish a product ──────────────────────────────

export const setProductStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number(), status: z.enum(["draft", "published"]) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureReady();
    await db
      .update(products)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(products.id, data.id));
    return { ok: true };
  });
