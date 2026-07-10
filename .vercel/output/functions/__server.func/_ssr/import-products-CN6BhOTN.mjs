import { c as createServerRpc, r as requireAdmin, e as ensureReady, d as db, p as products, h as productSizes } from "./server-auth-BuYCZsXK.mjs";
import { c as createServerFn } from "./server-CNKxx3CJ.mjs";
import { g as generateSlug, d as detectColumnSwap, n as normalizePrice, a as detectSuspiciousPrice, b as normalizeSizes, m as makeImportId, r as recomputeStatus } from "./product-import-B4O96iEP.mjs";
import "../_libs/clerk__backend.mjs";
import "../_libs/postgres.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { i as ilike, e as eq } from "../_libs/drizzle-orm.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "node:crypto";
import "os";
import "fs";
import "net";
import "tls";
import "perf_hooks";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://soeoluptfhyaopjuqbjr.supabase.co";
const BUCKET = "products";
async function uploadImageBuffer(buffer, contentType, fileName) {
  try {
    const {
      createClient
    } = await import("../_libs/supabase__supabase-js.mjs");
    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const {
      data: buckets
    } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, {
        public: true
      });
    }
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `imports/${Date.now()}-${safeName}`;
    const {
      data: upload,
      error
    } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType,
      upsert: false
    });
    if (error) return null;
    const {
      data: {
        publicUrl
      }
    } = supabase.storage.from(BUCKET).getPublicUrl(upload.path);
    return publicUrl;
  } catch {
    return null;
  }
}
async function parseDocx(buffer) {
  const mammoth = await import("../_libs/mammoth.mjs").then(function(n) {
    return n.i;
  });
  const cheerio = await import("../_libs/cheerio.mjs");
  const imageMap = /* @__PURE__ */ new Map();
  const result = await mammoth.convertToHtml({
    buffer
  }, {
    convertImage: mammoth.images.imgElement(async (image) => {
      const imgBuffer = await image.read();
      const id = `img_${imageMap.size}`;
      imageMap.set(id, {
        data: imgBuffer,
        contentType: image.contentType
      });
      return {
        src: id
      };
    })
  });
  const $ = cheerio.load(result.value);
  const rows = [];
  const tableRows = $("table tr").toArray();
  const dataRows = tableRows.length > 1 ? tableRows.slice(1) : tableRows;
  for (const tr of dataRows) {
    const cells = $(tr).find("td, th").toArray();
    if (cells.length < 2) continue;
    const warnings = [];
    const firstCell = $(cells[0]);
    const imgSrc = firstCell.find("img").attr("src") ?? null;
    firstCell.find("img").remove();
    const rawName = firstCell.text().replace(/\s+/g, " ").trim();
    let rawCell2 = cells[1] ? $(cells[1]).text().replace(/\s+/g, " ").trim() : "";
    let rawCell3 = cells[2] ? $(cells[2]).text().replace(/\s+/g, " ").trim() : "";
    let rawCell4 = cells[3] ? $(cells[3]).text().replace(/\s+/g, " ").trim() : "";
    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }
    const buyingPriceRaw = rawCell2;
    const sellingPriceRaw = rawCell3;
    const sizesRaw = rawCell4;
    const buyingPrice = normalizePrice(buyingPriceRaw);
    let sellingPrice = normalizePrice(sellingPriceRaw);
    if (buyingPriceRaw && buyingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(buyingPriceRaw);
      if (suspicious) warnings.push(`Buying price "${buyingPriceRaw}" looks truncated — suggested value: ${suggestion?.toLocaleString()}.`);
      else warnings.push(`Could not parse buying price: "${buyingPriceRaw}".`);
    }
    if (sellingPriceRaw && sellingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(sellingPriceRaw);
      if (suspicious) {
        sellingPrice = suggestion;
        warnings.push(`Selling price "${sellingPriceRaw}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`);
      } else {
        warnings.push(`Could not parse selling price: "${sellingPriceRaw}".`);
      }
    }
    const availableSizes = normalizeSizes(sizesRaw);
    if (sizesRaw && !availableSizes.length) {
      warnings.push(`Could not parse sizes: "${sizesRaw}".`);
    }
    let imageUrl = null;
    if (imgSrc && imageMap.has(imgSrc)) {
      const {
        data,
        contentType
      } = imageMap.get(imgSrc);
      const ext = contentType.split("/")[1] ?? "jpg";
      const uploaded = await uploadImageBuffer(data, contentType, `${rawName || "product"}.${ext}`);
      imageUrl = uploaded;
    }
    const product = {
      id: makeImportId(),
      name: rawName,
      image: imageUrl,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings,
      status: "ready"
    };
    product.status = recomputeStatus(product);
    if (!rawName && !sellingPrice) continue;
    rows.push(product);
  }
  return rows;
}
async function parseXlsx(buffer) {
  const XLSX = await import("../_libs/xlsx.mjs");
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellText: true,
    cellNF: true
  });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false
  });
  const rows = [];
  const startIdx = rawRows.length > 0 && rawRows[0][1] && normalizePrice(String(rawRows[0][1])) === null && isNaN(Number(String(rawRows[0][1]).replace(/[,.\s]/g, ""))) ? 1 : 0;
  for (let i = startIdx; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rawName = String(row[0] ?? "").trim();
    let rawCell2 = String(row[1] ?? "").trim();
    let rawCell3 = String(row[2] ?? "").trim();
    let rawCell4 = String(row[3] ?? "").trim();
    if (!rawName && !rawCell2 && !rawCell3 && !rawCell4) continue;
    const warnings = [];
    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }
    const buyingPrice = normalizePrice(rawCell2);
    let sellingPrice = normalizePrice(rawCell3);
    if (rawCell2 && buyingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(rawCell2);
      if (suspicious) warnings.push(`Buying price "${rawCell2}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
      else warnings.push(`Could not parse buying price: "${rawCell2}".`);
    }
    if (rawCell3 && sellingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(rawCell3);
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
    const product = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings: [...warnings, "Image not extracted from XLSX — please add manually."],
      status: "ready"
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }
  return rows;
}
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else inQuotes = !inQuotes;
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
async function parseCsv(buffer) {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const firstCells = parseCsvLine(lines[0]);
  const isHeader = firstCells.length >= 2 && normalizePrice(firstCells[1]) === null && isNaN(Number(firstCells[1].replace(/[,.\s]/g, "")));
  const startIdx = isHeader ? 1 : 0;
  const rows = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const rawName = cols[0] ?? "";
    let rawCell2 = cols[1] ?? "";
    let rawCell3 = cols[2] ?? "";
    let rawCell4 = cols[3] ?? "";
    if (!rawName && !rawCell2 && !rawCell3 && !rawCell4) continue;
    const warnings = [];
    if (detectColumnSwap(rawCell3, rawCell4)) {
      [rawCell3, rawCell4] = [rawCell4, rawCell3];
      warnings.push("Selling price and available-size columns were automatically swapped.");
    }
    const buyingPrice = normalizePrice(rawCell2);
    let sellingPrice = normalizePrice(rawCell3);
    if (rawCell2 && buyingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(rawCell2);
      if (suspicious) warnings.push(`Buying price "${rawCell2}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
      else warnings.push(`Could not parse buying price: "${rawCell2}".`);
    }
    if (rawCell3 && sellingPrice === null) {
      const {
        suspicious,
        suggestion
      } = detectSuspiciousPrice(rawCell3);
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
    const product = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: null,
      warnings,
      status: "ready"
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }
  return rows;
}
function decodePdfStr(raw) {
  return raw.replace(/\\(\d{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8))).replace(/\\n/g, " ").replace(/\\r/g, "").replace(/\\\\/g, "\\").replace(/\\(.)/g, "$1");
}
function parseContentStreamText(content) {
  const lines = [];
  let cur = [];
  const re = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj|\[([\s\S]*?)\]\s*TJ|T[*dD]|ET/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const tok = m[0];
    if (m[1] !== void 0) {
      cur.push(decodePdfStr(m[1]));
    } else if (m[2] !== void 0) {
      const tjRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
      let tm;
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
async function extractPdfText(buffer) {
  const {
    inflateSync,
    inflateRawSync
  } = await import(
    /* @vite-ignore */
    "node:zlib"
  );
  const allLines = [];
  let pos = 0;
  while (pos < buffer.length) {
    const si = buffer.indexOf(Buffer.from("stream"), pos);
    if (si === -1) break;
    let di = si + 6;
    if (buffer[di] === 32) di++;
    if (buffer[di] === 13) di++;
    if (buffer[di] !== 10) {
      pos = si + 6;
      continue;
    }
    di++;
    const lookBack = buffer.slice(Math.max(0, si - 1024), si).toString("latin1");
    const lenMatch = lookBack.match(/\/Length\s+(\d+)\b(?!\s*\d+\s+\d+\s+R)/);
    let dataEnd;
    if (lenMatch) {
      dataEnd = di + parseInt(lenMatch[1], 10);
    } else {
      const ei = buffer.indexOf(Buffer.from("endstream"), di);
      if (ei === -1) {
        pos = si + 6;
        continue;
      }
      dataEnd = ei;
    }
    const streamBuf = buffer.slice(di, dataEnd);
    const isFlate = /\/FlateDecode|\/Fl(?=[\s\/\[>])/.test(lookBack);
    let content = null;
    if (isFlate) {
      for (const fn of [inflateSync, inflateRawSync]) {
        try {
          const dec = fn(streamBuf);
          const hasBom = dec[0] === 254 && dec[1] === 255;
          content = hasBom ? dec.toString("utf16le") : dec.toString("latin1");
          if (content.includes("BT")) break;
          content = null;
        } catch {
        }
      }
    } else {
      const raw = streamBuf.toString("latin1");
      if (raw.includes("BT")) content = raw;
    }
    if (content) allLines.push(...parseContentStreamText(content));
    pos = dataEnd + 9;
  }
  return allLines.join("\n");
}
async function parsePdf(buffer) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const Anthropic = (await import("../_libs/anthropic-ai__sdk.mjs")).default;
      const client = new Anthropic({
        apiKey
      });
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
        messages: [{
          role: "user",
          content: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64
              }
            },
            {
              type: "text",
              text: prompt
            }
          ]
        }]
      });
      const responseText = response.content.find((c) => c.type === "text")?.text ?? "";
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]);
        const rows2 = [];
        for (const e of extracted) {
          if (!e.name?.trim()) continue;
          const warnings = ["PDF image extraction not supported — please add image manually."];
          const buyingPrice = e.buyingPriceRaw ? normalizePrice(e.buyingPriceRaw) : null;
          let sellingPrice = e.sellingPriceRaw ? normalizePrice(e.sellingPriceRaw) : null;
          if (e.buyingPriceRaw && buyingPrice === null) {
            const {
              suspicious,
              suggestion
            } = detectSuspiciousPrice(e.buyingPriceRaw);
            if (suspicious) warnings.push(`Buying price "${e.buyingPriceRaw}" looks truncated — suggested: ${suggestion?.toLocaleString()}.`);
            else warnings.push(`Could not parse buying price: "${e.buyingPriceRaw}".`);
          }
          if (e.sellingPriceRaw && sellingPrice === null) {
            const {
              suspicious,
              suggestion
            } = detectSuspiciousPrice(e.sellingPriceRaw);
            if (suspicious) {
              sellingPrice = suggestion;
              warnings.push(`Selling price "${e.sellingPriceRaw}" looks truncated — using ${suggestion?.toLocaleString()}. Please confirm.`);
            } else {
              warnings.push(`Could not parse selling price: "${e.sellingPriceRaw}".`);
            }
          }
          const availableSizes = e.sizesRaw ? normalizeSizes(e.sizesRaw) : [];
          if (e.sizesRaw && !availableSizes.length) warnings.push(`Could not parse sizes: "${e.sizesRaw}".`);
          const product = {
            id: makeImportId(),
            name: e.name.trim(),
            image: null,
            imageFileName: null,
            buyingPrice,
            sellingPrice,
            availableSizes,
            sourcePage: null,
            warnings,
            status: "ready"
          };
          product.status = recomputeStatus(product);
          rows2.push(product);
        }
        if (rows2.length > 0) return rows2;
      }
    } catch (err) {
      console.error("[parsePdf] Claude API extraction failed:", err);
    }
  }
  const text = await extractPdfText(buffer);
  if (!text.trim()) {
    return [{
      id: makeImportId(),
      name: "",
      image: null,
      imageFileName: null,
      buyingPrice: null,
      sellingPrice: null,
      availableSizes: [],
      sourcePage: null,
      status: "review_required",
      warnings: ["No readable text found in this PDF (possibly scanned or image-based). Please convert your product list to XLSX, CSV, or DOCX for best results."]
    }];
  }
  const rows = [];
  const rawLines = text.split("\n");
  let pageNumber = 1;
  for (const line of rawLines) {
    if (!line.trim()) continue;
    if (/page\s+\d+/i.test(line)) {
      pageNumber++;
      continue;
    }
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
    const warnings = ["PDF image extraction not supported — please add image manually."];
    const product = {
      id: makeImportId(),
      name: rawName,
      image: null,
      imageFileName: null,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: pageNumber,
      warnings,
      status: "ready"
    };
    product.status = recomputeStatus(product);
    rows.push(product);
  }
  return rows;
}
async function parseImage(buffer, mimeType, fileName) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const imageUrl = await uploadImageBuffer(buffer, mimeType, fileName);
    return [{
      id: makeImportId(),
      name: "",
      image: imageUrl,
      imageFileName: fileName,
      buyingPrice: null,
      sellingPrice: null,
      availableSizes: [],
      sourcePage: 1,
      status: "review_required",
      warnings: ["ANTHROPIC_API_KEY is not set — automatic extraction from images is unavailable. Please fill in the product details manually."]
    }];
  }
  const Anthropic = (await import("../_libs/anthropic-ai__sdk.mjs")).default;
  const client = new Anthropic({
    apiKey
  });
  const mediaType = mimeType;
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
  let extracted = [];
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: [{
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64
          }
        }, {
          type: "text",
          text: prompt
        }]
      }]
    });
    const text = response.content.find((c) => c.type === "text")?.text ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) extracted = JSON.parse(jsonMatch[0]);
  } catch {
    return [{
      id: makeImportId(),
      name: "",
      image: null,
      imageFileName: fileName,
      buyingPrice: null,
      sellingPrice: null,
      availableSizes: [],
      sourcePage: 1,
      status: "review_required",
      warnings: ["Claude Vision extraction failed — please fill in details manually."]
    }];
  }
  const sharedImageUrl = await uploadImageBuffer(buffer, mimeType, fileName);
  return extracted.map((e, idx) => {
    const warnings = [];
    const buyingPrice = e.buyingPriceRaw ? normalizePrice(e.buyingPriceRaw) : null;
    const sellingPrice = e.sellingPriceRaw ? normalizePrice(e.sellingPriceRaw) : null;
    const availableSizes = e.sizesRaw ? normalizeSizes(e.sizesRaw) : [];
    if (e.buyingPriceRaw && buyingPrice === null) warnings.push(`Could not parse buying price: "${e.buyingPriceRaw}".`);
    if (e.sellingPriceRaw && sellingPrice === null) warnings.push(`Could not parse selling price: "${e.sellingPriceRaw}".`);
    if (e.sizesRaw && !availableSizes.length) warnings.push(`Could not parse sizes: "${e.sizesRaw}".`);
    const product = {
      id: makeImportId(),
      name: e.name ?? "",
      image: sharedImageUrl,
      imageFileName: fileName,
      buyingPrice,
      sellingPrice,
      availableSizes,
      sourcePage: 1,
      warnings,
      status: "ready"
    };
    product.status = recomputeStatus(product);
    return product;
  });
}
const ALLOWED_MIME_TYPES = /* @__PURE__ */ new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/csv", "application/pdf", "image/jpeg", "image/jpg", "image/png"]);
const parseImportFile_createServerFn_handler = createServerRpc({
  id: "72fcec613cafb5a2519a4ad4455cd26ccb0114b31fc5c39a920f63c701d6dccf",
  name: "parseImportFile",
  filename: "src/lib/api/import-products.ts"
}, (opts) => parseImportFile.__executeServer(opts));
const parseImportFile = createServerFn({
  method: "POST"
}).validator(objectType({
  // ~18 MB file max (base64 inflates ~33%)
  fileBase64: stringType().max(24e6),
  fileName: stringType().max(255),
  mimeType: stringType().max(128)
})).handler(parseImportFile_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  const mime = data.mimeType.toLowerCase().split(";")[0].trim();
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    throw new Error(`Unsupported file type: ${mime}`);
  }
  const buffer = Buffer.from(data.fileBase64, "base64");
  const ext = data.fileName.split(".").pop()?.toLowerCase() ?? "";
  let rows = [];
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
const checkProductDuplicates_createServerFn_handler = createServerRpc({
  id: "2ac40e083cd3006573712a88d250c9be04466be4f2abe3bf0ff4af307c81ea83",
  name: "checkProductDuplicates",
  filename: "src/lib/api/import-products.ts"
}, (opts) => checkProductDuplicates.__executeServer(opts));
const checkProductDuplicates = createServerFn({
  method: "POST"
}).validator(objectType({
  items: arrayType(objectType({
    importId: stringType(),
    name: stringType(),
    sellingPrice: numberType().nullable()
  }))
})).handler(checkProductDuplicates_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await ensureReady();
  const results = {};
  for (const item of data.items) {
    if (!item.name) {
      results[item.importId] = {
        isDuplicate: false
      };
      continue;
    }
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existing = await db.select({
      id: products.id,
      price: products.price
    }).from(products).where(ilike(products.name, item.name.trim())).limit(1);
    if (existing.length > 0) {
      results[item.importId] = {
        isDuplicate: true,
        existingId: existing[0].id
      };
    } else {
      results[item.importId] = {
        isDuplicate: false
      };
    }
  }
  return results;
});
const ImportedProductSchema = objectType({
  id: stringType(),
  name: stringType(),
  image: stringType().nullable(),
  imageFileName: stringType().nullable(),
  buyingPrice: numberType().nullable(),
  sellingPrice: numberType().nullable(),
  availableSizes: arrayType(stringType()),
  sourcePage: numberType().nullable(),
  status: enumType(["ready", "review_required", "invalid"]),
  warnings: arrayType(stringType()),
  possibleDuplicate: booleanType().optional(),
  duplicateProductId: numberType().optional(),
  overwriteExistingId: numberType().nullable().optional()
});
const finalizeProductImport_createServerFn_handler = createServerRpc({
  id: "e69310f4dbd9a9531c6b5767b594341cc0fac0b2d00b84683a129a68d359e2cb",
  name: "finalizeProductImport",
  filename: "src/lib/api/import-products.ts"
}, (opts) => finalizeProductImport.__executeServer(opts));
const finalizeProductImport = createServerFn({
  method: "POST"
}).validator(objectType({
  items: arrayType(ImportedProductSchema).min(1).max(500)
})).handler(finalizeProductImport_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await ensureReady();
  const existingSlugRows = await db.select({
    slug: products.slug
  }).from(products);
  const existingSlugs = new Set(existingSlugRows.map((r) => r.slug).filter(Boolean));
  let imported = 0;
  let skipped = 0;
  let failed = 0;
  for (const item of data.items) {
    if (!item.name || !item.sellingPrice) {
      skipped++;
      continue;
    }
    try {
      const slug = generateSlug(item.name, existingSlugs);
      existingSlugs.add(slug);
      const sizesJson = item.availableSizes.length > 0 ? JSON.stringify(item.availableSizes.map(Number).filter((n) => !isNaN(n))) : null;
      let productId;
      if (item.overwriteExistingId) {
        const [updated] = await db.update(products).set({
          name: item.name,
          price: item.sellingPrice,
          buyingPrice: item.buyingPrice,
          imageUrl: item.image,
          sizes: sizesJson,
          slug,
          status: "draft",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(products.id, item.overwriteExistingId)).returning({
          id: products.id
        });
        productId = updated.id;
        await db.delete(productSizes).where(eq(productSizes.productId, productId));
      } else {
        const [inserted] = await db.insert(products).values({
          name: item.name,
          price: item.sellingPrice,
          buyingPrice: item.buyingPrice,
          stock: 0,
          imageUrl: item.image,
          sizes: sizesJson,
          slug,
          status: "draft",
          createdAt: /* @__PURE__ */ new Date()
        }).returning({
          id: products.id
        });
        productId = inserted.id;
      }
      if (item.availableSizes.length > 0) {
        await db.insert(productSizes).values(item.availableSizes.map((size) => ({
          productId,
          size,
          available: true
        }))).onConflictDoNothing();
      }
      imported++;
    } catch (err) {
      console.error("Failed to import product:", item.name, err);
      failed++;
    }
  }
  return {
    imported,
    skipped,
    failed,
    needsReview: 0
  };
});
const setProductStatus_createServerFn_handler = createServerRpc({
  id: "5859936cb0d7cbf69458aa9796400eabb4c7142a2825e7af864200764136696f",
  name: "setProductStatus",
  filename: "src/lib/api/import-products.ts"
}, (opts) => setProductStatus.__executeServer(opts));
const setProductStatus = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType(),
  status: enumType(["draft", "published"])
})).handler(setProductStatus_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin();
  await ensureReady();
  await db.update(products).set({
    status: data.status,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(products.id, data.id));
  return {
    ok: true
  };
});
export {
  checkProductDuplicates_createServerFn_handler,
  finalizeProductImport_createServerFn_handler,
  parseImportFile_createServerFn_handler,
  setProductStatus_createServerFn_handler
};
