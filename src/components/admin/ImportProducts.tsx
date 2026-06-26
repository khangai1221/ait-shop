import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  ImagePlus,
  Eye,
  Check,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseImportFile,
  finalizeProductImport,
  checkProductDuplicates,
} from "@/lib/api/import-products";
import { recomputeStatus, type ImportedProduct } from "@/lib/utils/product-import";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "processing" | "preview" | "importing" | "done";

type ImportResults = {
  imported: number;
  skipped: number;
  failed: number;
  needsReview: number;
};

type DuplicateDecision = "skip" | "import_anyway" | "replace";

// ── Size chips ────────────────────────────────────────────────────────────────

function SizeChips({
  sizes,
  onChange,
}: {
  sizes: string[];
  onChange: (next: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const trimmed = input.trim();
    if (trimmed && !sizes.includes(trimmed)) onChange([...sizes, trimmed]);
    setInput("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {sizes.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium bg-brand/10 text-brand rounded-full"
        >
          {s}
          <button
            type="button"
            onClick={() => onChange(sizes.filter((x) => x !== s))}
            className="hover:text-red-500 transition"
          >
            ×
          </button>
        </span>
      ))}
      {adding ? (
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
            if (e.key === "Escape") { setAdding(false); setInput(""); }
          }}
          onBlur={commit}
          placeholder="37"
          className="w-14 text-xs border border-border bg-background rounded-full px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand"
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={() => { setAdding(true); }}
          className="px-2 py-0.5 text-xs text-brand border border-brand/40 rounded-full hover:bg-brand/5 transition"
        >
          + Add size
        </button>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ImportedProduct["status"] }) {
  if (status === "ready")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
        <CheckCircle2 className="h-3 w-3" /> Ready
      </span>
    );
  if (status === "review_required")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
        <AlertTriangle className="h-3 w-3" /> Review required
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
      <AlertCircle className="h-3 w-3" /> Invalid
    </span>
  );
}

// ── Image preview modal ───────────────────────────────────────────────────────

function ImagePreviewModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-white/70"
        >
          <X className="h-6 w-6" />
        </button>
        <img src={src} alt="Product" className="w-full rounded-xl object-contain max-h-[80vh]" />
      </div>
    </div>
  );
}

// ── Image cell ────────────────────────────────────────────────────────────────

function ImageCell({
  image,
  name,
  onReplace,
  onRemove,
}: {
  image: string | null;
  name: string;
  onReplace: (dataUrl: string, fileName: string) => void;
  onRemove: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onReplace(reader.result as string, file.name);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="relative group h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-contain p-1" />
      ) : (
        <div className="h-full w-full grid place-items-center">
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-0.5">
        {image && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            title="Preview"
            className="text-white text-[9px] hover:text-brand-foreground transition"
          >
            <ZoomIn className="h-3 w-3 mx-auto" />
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Replace"
          className="text-white text-[9px] hover:text-brand-foreground transition"
        >
          <Upload className="h-3 w-3 mx-auto" />
        </button>
        {image && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove"
            className="text-red-400 text-[9px] hover:text-red-300 transition"
          >
            <Trash2 className="h-3 w-3 mx-auto" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />
      {previewOpen && image && (
        <ImagePreviewModal src={image} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}

// ── Edit product modal ────────────────────────────────────────────────────────

function EditProductModal({
  product,
  onSave,
  onClose,
}: {
  product: ImportedProduct;
  onSave: (updated: ImportedProduct) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ImportedProduct>({ ...product });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ImportedProduct>(key: K, value: ImportedProduct[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("image", reader.result as string);
      set("imageFileName", file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    const updated = { ...form, status: recomputeStatus(form) };
    onSave(updated);
  };

  const inputCls =
    "w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl">Edit product</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Image */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">
              Image
            </label>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-xl border border-border overflow-hidden bg-muted grid place-items-center shrink-0">
                {form.image ? (
                  <img src={form.image} alt={form.name} className="h-full w-full object-contain p-1" />
                ) : (
                  <ImagePlus className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition"
                >
                  {form.image ? "Replace image" : "Add image"}
                </button>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => { set("image", null); set("imageFileName", null); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition"
                  >
                    Remove image
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleImageFile} />
            </div>
          </div>

          {/* Name */}
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Product name *
            </span>
            <input
              className={`mt-1 ${inputCls}`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="NEW BALANCE 990V6"
            />
          </label>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Buying price (₮)
              </span>
              <input
                className={`mt-1 ${inputCls}`}
                type="number"
                min={0}
                value={form.buyingPrice ?? ""}
                onChange={(e) =>
                  set("buyingPrice", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="80000"
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Selling price (₮) *
              </span>
              <input
                className={`mt-1 ${inputCls}`}
                type="number"
                min={0}
                value={form.sellingPrice ?? ""}
                onChange={(e) =>
                  set("sellingPrice", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="290000"
              />
            </label>
          </div>

          {/* Sizes */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">
              Available sizes
            </span>
            <SizeChips
              sizes={form.availableSizes}
              onChange={(next) => set("availableSizes", next)}
            />
          </div>

          {/* Warnings */}
          {form.warnings.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 space-y-1">
              {form.warnings.map((w, i) => (
                <p key={i} className="flex gap-1.5">
                  <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {w}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Save
          </button>
          <button
            onClick={onClose}
            className="px-5 h-10 rounded-full border border-border text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Duplicate badge ───────────────────────────────────────────────────────────

function DuplicateBadge({
  onDecide,
}: {
  onDecide: (d: DuplicateDecision) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-medium"
      >
        <AlertTriangle className="h-2.5 w-2.5" /> Possible duplicate
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-card rounded-xl border border-border shadow-lg p-2 text-xs whitespace-nowrap">
          <button onClick={() => { onDecide("skip"); setOpen(false); }} className="block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted">Skip</button>
          <button onClick={() => { onDecide("import_anyway"); setOpen(false); }} className="block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted">Import anyway</button>
          <button onClick={() => { onDecide("replace"); setOpen(false); }} className="block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-red-500">Replace existing</button>
        </div>
      )}
    </div>
  );
}

// ── Preview table row ─────────────────────────────────────────────────────────

function ProductRow({
  product,
  selected,
  duplicateDecision,
  onToggle,
  onEdit,
  onDelete,
  onImageReplace,
  onImageRemove,
  onDuplicateDecide,
}: {
  product: ImportedProduct;
  selected: boolean;
  duplicateDecision?: DuplicateDecision;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImageReplace: (url: string, name: string) => void;
  onImageRemove: () => void;
  onDuplicateDecide: (d: DuplicateDecision) => void;
}) {
  const [warningsOpen, setWarningsOpen] = useState(false);
  const isSkipped = duplicateDecision === "skip";

  return (
    <tr className={`border-t border-border transition ${isSkipped ? "opacity-40" : "hover:bg-muted/30"}`}>
      {/* Select */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          disabled={product.status === "invalid" || isSkipped}
          className="h-4 w-4 rounded border-border accent-brand"
        />
      </td>

      {/* Image */}
      <td className="px-2 py-3">
        <ImageCell
          image={product.image}
          name={product.name}
          onReplace={onImageReplace}
          onRemove={onImageRemove}
        />
      </td>

      {/* Name */}
      <td className="px-3 py-3 max-w-[180px]">
        <p className="font-medium text-sm truncate">{product.name || <span className="text-muted-foreground italic">—</span>}</p>
        {product.possibleDuplicate && duplicateDecision === undefined && (
          <DuplicateBadge onDecide={onDuplicateDecide} />
        )}
        {duplicateDecision === "replace" && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">Replaces existing</span>
        )}
        {duplicateDecision === "skip" && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Skipped</span>
        )}
        {product.sourcePage && (
          <p className="text-[10px] text-muted-foreground">p.{product.sourcePage}</p>
        )}
      </td>

      {/* Buying price (admin-only) */}
      <td className="px-3 py-3 text-sm text-muted-foreground">
        {product.buyingPrice != null ? (
          <span>₮{product.buyingPrice.toLocaleString("mn-MN")}</span>
        ) : (
          <span className="text-red-400">—</span>
        )}
      </td>

      {/* Selling price */}
      <td className="px-3 py-3 text-sm font-display">
        {product.sellingPrice != null ? (
          <span>₮{product.sellingPrice.toLocaleString("mn-MN")}</span>
        ) : (
          <span className="text-red-400">—</span>
        )}
      </td>

      {/* Sizes */}
      <td className="px-3 py-3">
        {product.availableSizes.length > 0 ? (
          <div className="flex flex-wrap gap-0.5">
            {product.availableSizes.map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-red-400">Missing</span>
        )}
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1">
          <StatusBadge status={product.status} />
          {product.warnings.length > 0 && (
            <button
              type="button"
              onClick={() => setWarningsOpen((o) => !o)}
              className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:underline"
            >
              {warningsOpen ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
              {product.warnings.length} warning{product.warnings.length > 1 ? "s" : ""}
            </button>
          )}
          {warningsOpen && (
            <div className="text-[10px] text-amber-700 space-y-0.5 mt-0.5">
              {product.warnings.map((w, i) => <p key={i}>• {w}</p>)}
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-brand/10 text-brand transition"
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── File upload area ──────────────────────────────────────────────────────────

const ACCEPTED = ".pdf,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png";
const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "image/jpeg",
  "image/png",
];
const MAX_BYTES = 18 * 1024 * 1024; // 18 MB

function UploadArea({
  onFile,
}: {
  onFile: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_BYTES) {
      toast.error("File is too large (max 18 MB)");
      return;
    }
    onFile(file);
  };

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [],
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition cursor-pointer select-none ${
        dragging ? "border-brand bg-brand/5" : "border-border hover:border-brand/60 hover:bg-muted/30"
      } flex flex-col items-center justify-center gap-4 py-14 px-8 text-center`}
    >
      <div className="h-16 w-16 rounded-2xl bg-brand/10 grid place-items-center">
        <Upload className="h-7 w-7 text-brand" />
      </div>
      <div>
        <p className="font-semibold text-base">Drag & drop your product file here</p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to select — PDF, DOCX, XLSX, CSV, JPG, PNG
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Maximum file size: 18 MB</p>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition"
      >
        Select file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ImportProducts({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("");
  const [items, setItems] = useState<ImportedProduct[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [duplicateDecisions, setDuplicateDecisions] = useState<
    Record<string, DuplicateDecision | undefined>
  >({});
  const [results, setResults] = useState<ImportResults | null>(null);

  // ── Parsing mutation ─────────────────────────────────────────────────────

  const parseMutation = useMutation({
    mutationFn: async (file: File) => {
      const arrayBuf = await file.arrayBuffer();
      // Chunk the conversion — spreading a large Uint8Array directly into
      // String.fromCharCode exceeds the JS call-stack argument limit.
      const uint8 = new Uint8Array(arrayBuf);
      let binary = "";
      for (let i = 0; i < uint8.length; i += 8192) {
        binary += String.fromCharCode(...uint8.subarray(i, i + 8192));
      }
      const base64 = btoa(binary);
      return parseImportFile({
        data: {
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        },
      });
    },
    onSuccess: async (rows) => {
      setItems(rows);
      // Auto-select all ready rows
      setSelected(new Set(rows.filter((r) => r.status !== "invalid").map((r) => r.id)));
      setPhase("preview");

      // Check for duplicates
      const dupeData = await checkProductDuplicates({
        data: {
          items: rows.map((r) => ({
            importId: r.id,
            name: r.name,
            sellingPrice: r.sellingPrice,
          })),
        },
      });

      setItems((prev) =>
        prev.map((p) => ({
          ...p,
          possibleDuplicate: dupeData[p.id]?.isDuplicate ?? false,
          duplicateProductId: dupeData[p.id]?.existingId,
        })),
      );
    },
    onError: (err) => {
      toast.error((err as Error).message ?? "Failed to parse file");
      setPhase("idle");
    },
  });

  // ── Import mutation ──────────────────────────────────────────────────────

  const importMutation = useMutation({
    mutationFn: (toImport: ImportedProduct[]) =>
      finalizeProductImport({ data: { items: toImport } }),
    onSuccess: (res) => {
      setResults(res);
      setPhase("done");
    },
    onError: (err) => {
      toast.error((err as Error).message ?? "Import failed");
      setPhase("preview");
    },
  });

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    setFileName(file.name);
    setPhase("processing");
    parseMutation.mutate(file);
  };

  const toggleAll = () => {
    const selectable = items.filter((i) => i.status !== "invalid").map((i) => i.id);
    if (selected.size === selectable.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(selectable));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const updateItem = (updated: ImportedProduct) =>
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleImageReplace = (id: string, dataUrl: string, fileName: string) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, image: dataUrl, imageFileName: fileName, status: recomputeStatus({ ...p, image: dataUrl }) }
          : p,
      ),
    );

  const handleImageRemove = (id: string) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, image: null, imageFileName: null, status: recomputeStatus({ ...p, image: null }) } : p,
      ),
    );

  const handleDuplicateDecide = (id: string, decision: DuplicateDecision) => {
    setDuplicateDecisions((prev) => ({ ...prev, [id]: decision }));
    if (decision === "skip") {
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } else {
      setSelected((prev) => new Set([...prev, id]));
    }
  };

  const handleImport = () => {
    const toImport = items
      .filter((p) => {
        if (!selected.has(p.id)) return false;
        const decision = duplicateDecisions[p.id];
        if (p.possibleDuplicate && !decision) return true; // import anyway by default
        if (decision === "skip") return false;
        return true;
      })
      .map((p) => {
        const decision = duplicateDecisions[p.id];
        return {
          ...p,
          overwriteExistingId:
            decision === "replace" ? (p.duplicateProductId ?? null) : null,
        };
      });

    if (toImport.length === 0) {
      toast.error("No products selected");
      return;
    }
    setPhase("importing");
    importMutation.mutate(toImport);
  };

  const reset = () => {
    setPhase("idle");
    setFileName("");
    setItems([]);
    setSelected(new Set());
    setEditingId(null);
    setDuplicateDecisions({});
    setResults(null);
  };

  // ── Counts for the preview header ────────────────────────────────────────

  const selectable = items.filter((i) => i.status !== "invalid");
  const readyCount = items.filter((i) => i.status === "ready").length;
  const reviewCount = items.filter((i) => i.status === "review_required").length;
  const invalidCount = items.filter((i) => i.status === "invalid").length;
  const editingProduct = items.find((p) => p.id === editingId) ?? null;

  // ── Render: idle ─────────────────────────────────────────────────────────

  if (phase === "idle") {
    return (
      <div className="max-w-2xl mx-auto">
        <UploadArea onFile={handleFile} />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "PDF", icon: "📄" },
            { label: "DOCX", icon: "📝" },
            { label: "XLSX / CSV", icon: "📊" },
            { label: "JPG / PNG", icon: "🖼️" },
          ].map((t) => (
            <div key={t.label} className="rounded-xl border border-border p-3 text-center">
              <div className="text-2xl">{t.icon}</div>
              <p className="text-xs font-medium mt-1">{t.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground mb-1">Expected table structure:</p>
          <p>Column 1: Product name + image &nbsp;|&nbsp; Column 2: Buying price &nbsp;|&nbsp; Column 3: Selling price &nbsp;|&nbsp; Column 4: Available sizes</p>
        </div>
      </div>
    );
  }

  // ── Render: processing ───────────────────────────────────────────────────

  if (phase === "processing") {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="h-14 w-14 rounded-full border-4 border-brand border-t-transparent animate-spin mx-auto" />
        <p className="mt-6 font-semibold text-lg">Processing file…</p>
        <p className="text-sm text-muted-foreground mt-1 truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground mt-2">Extracting product data — this may take a moment</p>
      </div>
    );
  }

  // ── Render: done ─────────────────────────────────────────────────────────

  if (phase === "done" && results) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
        <h2 className="font-display text-2xl mt-5">Import completed</h2>
        <div className="mt-6 rounded-2xl border border-border overflow-hidden text-sm">
          {[
            { label: "Successfully imported", value: results.imported, color: "text-emerald-600" },
            { label: "Needs review (drafted)", value: results.needsReview, color: "text-amber-600" },
            { label: "Skipped", value: results.skipped, color: "text-muted-foreground" },
            { label: "Failed", value: results.failed, color: "text-red-500" },
          ].map(({ label, value, color }, i) => (
            <div key={i} className="flex justify-between px-5 py-3 border-b border-border last:border-b-0">
              <span className="text-muted-foreground">{label}</span>
              <span className={`font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={onDone}
            className="px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition"
          >
            View product list
          </button>
          <button
            onClick={reset}
            className="px-6 h-11 rounded-full border border-border font-semibold hover:bg-muted transition"
          >
            Import another file
          </button>
        </div>
      </div>
    );
  }

  // ── Render: importing ────────────────────────────────────────────────────

  if (phase === "importing") {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="h-14 w-14 rounded-full border-4 border-brand border-t-transparent animate-spin mx-auto" />
        <p className="mt-6 font-semibold text-lg">Importing products…</p>
        <p className="text-sm text-muted-foreground mt-1">
          Saving {selected.size} product{selected.size !== 1 ? "s" : ""} to the database
        </p>
      </div>
    );
  }

  // ── Render: preview ──────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h3 className="font-display text-lg">Import preview</h3>
          <p className="text-sm text-muted-foreground truncate max-w-xs">{fileName}</p>
        </div>
        <div className="sm:ml-auto flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {readyCount} ready
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            {reviewCount} review
          </span>
          {invalidCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600">
              {invalidCount} invalid
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {selected.size} selected
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === selectable.length && selectable.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border accent-brand"
                  />
                </th>
                <th className="px-2 py-3 text-left font-medium">Image</th>
                <th className="px-3 py-3 text-left font-medium">Product name</th>
                <th className="px-3 py-3 text-left font-medium">Buying price</th>
                <th className="px-3 py-3 text-left font-medium">Selling price</th>
                <th className="px-3 py-3 text-left font-medium">Available sizes</th>
                <th className="px-3 py-3 text-left font-medium">Status</th>
                <th className="px-3 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No products extracted from this file
                  </td>
                </tr>
              )}
              {items.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  selected={selected.has(p.id)}
                  duplicateDecision={duplicateDecisions[p.id]}
                  onToggle={() => toggleOne(p.id)}
                  onEdit={() => setEditingId(p.id)}
                  onDelete={() => deleteItem(p.id)}
                  onImageReplace={(url, name) => handleImageReplace(p.id, url, name)}
                  onImageRemove={() => handleImageRemove(p.id)}
                  onDuplicateDecide={(d) => handleDuplicateDecide(p.id, d)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleImport}
          disabled={selected.size === 0}
          className="px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand-deep disabled:opacity-50 transition flex items-center gap-2"
        >
          <Check className="h-4 w-4" /> Import {selected.size} selected product{selected.size !== 1 ? "s" : ""}
        </button>
        <button
          onClick={reset}
          className="px-6 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition"
        >
          Cancel import
        </button>
      </div>

      {/* Edit modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={(updated) => {
            updateItem(updated);
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
