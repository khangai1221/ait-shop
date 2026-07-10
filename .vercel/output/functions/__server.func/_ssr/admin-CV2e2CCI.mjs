import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import "../_libs/clerk__clerk-react.mjs";
import { u as updateProduct, d as deleteAllProducts, a as deleteProduct, c as createProduct, b as uploadProductImage, e as getAdminStats, f as getAdminProducts } from "./products-0wB96ryw.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as setUserAdmin, f as createSsrRpc, m as getAllUsers, l as checkAdminAccess } from "./router-DA4WPAAH.mjs";
import { c as createServerFn } from "./server-CNKxx3CJ.mjs";
import { r as recomputeStatus } from "./product-import-B4O96iEP.mjs";
import { e as exportAnalyticsCsv, d as deleteAllOrders, u as updateOrderStatus, a as getAllOrders, b as getSalesStats } from "./orders-C_S3CKkU.mjs";
import "../_libs/i18next.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { Q as useUser } from "../_libs/clerk__shared.mjs";
import { s as Shield, t as LogIn, u as LayoutDashboard, v as ChartNoAxesColumn, w as ShoppingCart, x as Users, y as List, q as Plus, z as FileUp, X, C as ChevronDown, M as Menu, S as Search, A as Bell, U as User, D as ArrowUpRight, E as ArrowDownRight, J as Download, K as RefreshCw, k as TrendingUp, O as TrendingDown, b as Trash2, P as Package, Q as SquarePen, i as CircleCheck, V as Check, W as Upload, _ as ChevronUp, $ as Pen, a0 as ImagePlus, a1 as TriangleAlert, a2 as ZoomIn, a3 as CircleAlert } from "../_libs/lucide-react.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
const parseImportFile = createServerFn({
  method: "POST"
}).validator(objectType({
  // ~18 MB file max (base64 inflates ~33%)
  fileBase64: stringType().max(24e6),
  fileName: stringType().max(255),
  mimeType: stringType().max(128)
})).handler(createSsrRpc("72fcec613cafb5a2519a4ad4455cd26ccb0114b31fc5c39a920f63c701d6dccf"));
const checkProductDuplicates = createServerFn({
  method: "POST"
}).validator(objectType({
  items: arrayType(objectType({
    importId: stringType(),
    name: stringType(),
    sellingPrice: numberType().nullable()
  }))
})).handler(createSsrRpc("2ac40e083cd3006573712a88d250c9be04466be4f2abe3bf0ff4af307c81ea83"));
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
const finalizeProductImport = createServerFn({
  method: "POST"
}).validator(objectType({
  items: arrayType(ImportedProductSchema).min(1).max(500)
})).handler(createSsrRpc("e69310f4dbd9a9531c6b5767b594341cc0fac0b2d00b84683a129a68d359e2cb"));
createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType(),
  status: enumType(["draft", "published"])
})).handler(createSsrRpc("5859936cb0d7cbf69458aa9796400eabb4c7142a2825e7af864200764136696f"));
function SizeChips({
  sizes,
  onChange
}) {
  const [adding, setAdding] = reactExports.useState(false);
  const [input, setInput] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const commit = () => {
    const trimmed = input.trim();
    if (trimmed && !sizes.includes(trimmed)) onChange([...sizes, trimmed]);
    setInput("");
    setAdding(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
    sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium bg-brand/10 text-brand rounded-full",
        children: [
          s,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange(sizes.filter((x) => x !== s)),
              className: "hover:text-red-500 transition",
              children: "×"
            }
          )
        ]
      },
      s
    )),
    adding ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setAdding(false);
            setInput("");
          }
        },
        onBlur: commit,
        placeholder: "37",
        className: "w-14 text-xs border border-border bg-background rounded-full px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand",
        autoFocus: true
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          setAdding(true);
        },
        className: "px-2 py-0.5 text-xs text-brand border border-brand/40 rounded-full hover:bg-brand/5 transition",
        children: "+ Add size"
      }
    )
  ] });
}
function StatusBadge$1({ status }) {
  if (status === "ready")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      " Ready"
    ] });
  if (status === "review_required")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
      " Review required"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
    " Invalid"
  ] });
}
function ImagePreviewModal({ src, onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl w-full", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "absolute -top-10 right-0 text-white hover:text-white/70",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "Product", className: "w-full rounded-xl object-contain max-h-[80vh]" })
      ] })
    }
  );
}
function ImageCell({
  image,
  name,
  onReplace,
  onRemove
}) {
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onReplace(reader.result, file.name);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0", children: [
    image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: name, className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-0.5", children: [
      image && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPreviewOpen(true),
          title: "Preview",
          className: "text-white text-[9px] hover:text-brand-foreground transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-3 w-3 mx-auto" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => fileInputRef.current?.click(),
          title: "Replace",
          className: "text-white text-[9px] hover:text-brand-foreground transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3 mx-auto" })
        }
      ),
      image && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onRemove,
          title: "Remove",
          className: "text-red-400 text-[9px] hover:text-red-300 transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mx-auto" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: "sr-only",
        onChange: handleFile
      }
    ),
    previewOpen && image && /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePreviewModal, { src: image, onClose: () => setPreviewOpen(false) })
  ] });
}
function EditProductModal({
  product,
  onSave,
  onClose
}) {
  const [form, setForm] = reactExports.useState({ ...product });
  const fileInputRef = reactExports.useRef(null);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("image", reader.result);
      set("imageFileName", file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleSave = () => {
    const updated = { ...form, status: recomputeStatus(form) };
    onSave(updated);
  };
  const inputCls2 = "w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl w-full max-w-xl p-6 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl", children: "Edit product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-full hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5", children: "Image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-xl border border-border overflow-hidden bg-muted grid place-items-center shrink-0", children: form.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image, alt: form.name, className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-7 w-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                className: "text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition",
                children: form.image ? "Replace image" : "Add image"
              }
            ),
            form.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  set("image", null);
                  set("imageFileName", null);
                },
                className: "text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition",
                children: "Remove image"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "sr-only", onChange: handleImageFile })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Product name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: `mt-1 ${inputCls2}`,
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "NEW BALANCE 990V6"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Buying price (₮)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: `mt-1 ${inputCls2}`,
              type: "number",
              min: 0,
              value: form.buyingPrice ?? "",
              onChange: (e) => set("buyingPrice", e.target.value === "" ? null : Number(e.target.value)),
              placeholder: "80000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Selling price (₮) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: `mt-1 ${inputCls2}`,
              type: "number",
              min: 0,
              value: form.sellingPrice ?? "",
              onChange: (e) => set("sellingPrice", e.target.value === "" ? null : Number(e.target.value)),
              placeholder: "290000"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5", children: "Available sizes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SizeChips,
          {
            sizes: form.availableSizes,
            onChange: (next) => set("availableSizes", next)
          }
        )
      ] }),
      form.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 space-y-1", children: form.warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 shrink-0 mt-0.5" }),
        " ",
        w
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleSave,
          className: "px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " Save"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "px-5 h-10 rounded-full border border-border text-sm font-medium hover:bg-muted transition",
          children: "Cancel"
        }
      )
    ] })
  ] }) });
}
function DuplicateBadge({
  onDecide
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-medium",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
          " Possible duplicate"
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 mt-1 z-10 bg-card rounded-xl border border-border shadow-lg p-2 text-xs whitespace-nowrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        onDecide("skip");
        setOpen(false);
      }, className: "block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted", children: "Skip" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        onDecide("import_anyway");
        setOpen(false);
      }, className: "block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted", children: "Import anyway" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        onDecide("replace");
        setOpen(false);
      }, className: "block w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-red-500", children: "Replace existing" })
    ] })
  ] });
}
function ProductRow({
  product,
  selected,
  duplicateDecision,
  onToggle,
  onEdit,
  onDelete,
  onImageReplace,
  onImageRemove,
  onDuplicateDecide
}) {
  const [warningsOpen, setWarningsOpen] = reactExports.useState(false);
  const isSkipped = duplicateDecision === "skip";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-t border-border transition ${isSkipped ? "opacity-40" : "hover:bg-muted/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        checked: selected,
        onChange: onToggle,
        disabled: product.status === "invalid" || isSkipped,
        className: "h-4 w-4 rounded border-border accent-brand"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageCell,
      {
        image: product.image,
        name: product.name,
        onReplace: onImageReplace,
        onRemove: onImageRemove
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 max-w-[180px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: product.name || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "—" }) }),
      product.possibleDuplicate && duplicateDecision === void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(DuplicateBadge, { onDecide: onDuplicateDecide }),
      duplicateDecision === "replace" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700", children: "Replaces existing" }),
      duplicateDecision === "skip" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground", children: "Skipped" }),
      product.sourcePage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
        "p.",
        product.sourcePage
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-sm text-muted-foreground", children: product.buyingPrice != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "₮",
      product.buyingPrice.toLocaleString("mn-MN")
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "—" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-sm font-display", children: product.sellingPrice != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "₮",
      product.sellingPrice.toLocaleString("mn-MN")
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "—" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: product.availableSizes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-0.5", children: product.availableSizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium", children: s }, s)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-red-400", children: "Missing" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge$1, { status: product.status }),
      product.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setWarningsOpen((o) => !o),
          className: "flex items-center gap-0.5 text-[10px] text-amber-600 hover:underline",
          children: [
            warningsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-2.5 w-2.5" }),
            product.warnings.length,
            " warning",
            product.warnings.length > 1 ? "s" : ""
          ]
        }
      ),
      warningsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-amber-700 space-y-0.5 mt-0.5", children: product.warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "• ",
        w
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onEdit,
          className: "p-1.5 rounded-lg hover:bg-brand/10 text-brand transition",
          title: "Edit",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onDelete,
          className: "p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition",
          title: "Delete",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
        }
      )
    ] }) })
  ] });
}
const ACCEPTED = ".pdf,.docx,.xlsx,.xls,.csv,.jpg,.jpeg,.png";
const MAX_BYTES = 18 * 1024 * 1024;
function UploadArea({
  onFile
}) {
  const [dragging, setDragging] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const handleFile = (file) => {
    if (file.size > MAX_BYTES) {
      toast.error("File is too large (max 18 MB)");
      return;
    }
    onFile(file);
  };
  const onDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    []
  );
  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onDrop,
      onDragOver,
      onDragLeave,
      onClick: () => inputRef.current?.click(),
      className: `relative rounded-2xl border-2 border-dashed transition cursor-pointer select-none ${dragging ? "border-brand bg-brand/5" : "border-border hover:border-brand/60 hover:bg-muted/30"} flex flex-col items-center justify-center gap-4 py-14 px-8 text-center`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-brand/10 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7 text-brand" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-base", children: "Drag & drop your product file here" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "or click to select — PDF, DOCX, XLSX, CSV, JPG, PNG" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Maximum file size: 18 MB" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              inputRef.current?.click();
            },
            className: "px-5 h-10 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand-deep transition",
            children: "Select file"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: ACCEPTED,
            className: "sr-only",
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }
          }
        )
      ]
    }
  );
}
function ImportProducts({ onDone }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [fileName, setFileName] = reactExports.useState("");
  const [items, setItems] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [editingId, setEditingId] = reactExports.useState(null);
  const [duplicateDecisions, setDuplicateDecisions] = reactExports.useState({});
  const [results, setResults] = reactExports.useState(null);
  const parseMutation = useMutation({
    mutationFn: async (file) => {
      const arrayBuf = await file.arrayBuffer();
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
          mimeType: file.type || "application/octet-stream"
        }
      });
    },
    onSuccess: async (rows) => {
      setItems(rows);
      setSelected(new Set(rows.filter((r) => r.status !== "invalid").map((r) => r.id)));
      setPhase("preview");
      const dupeData = await checkProductDuplicates({
        data: {
          items: rows.map((r) => ({
            importId: r.id,
            name: r.name,
            sellingPrice: r.sellingPrice
          }))
        }
      });
      setItems(
        (prev) => prev.map((p) => ({
          ...p,
          possibleDuplicate: dupeData[p.id]?.isDuplicate ?? false,
          duplicateProductId: dupeData[p.id]?.existingId
        }))
      );
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to parse file");
      setPhase("idle");
    }
  });
  const importMutation = useMutation({
    mutationFn: (toImport) => finalizeProductImport({ data: { items: toImport } }),
    onSuccess: (res) => {
      setResults(res);
      setPhase("done");
    },
    onError: (err) => {
      toast.error(err.message ?? "Import failed");
      setPhase("preview");
    }
  });
  const handleFile = (file) => {
    setFileName(file.name);
    setPhase("processing");
    parseMutation.mutate(file);
  };
  const toggleAll = () => {
    const selectable2 = items.filter((i) => i.status !== "invalid").map((i) => i.id);
    if (selected.size === selectable2.length) {
      setSelected(/* @__PURE__ */ new Set());
    } else {
      setSelected(new Set(selectable2));
    }
  };
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const updateItem = (updated) => setItems((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const handleImageReplace = (id, dataUrl, fileName2) => setItems(
    (prev) => prev.map(
      (p) => p.id === id ? { ...p, image: dataUrl, imageFileName: fileName2, status: recomputeStatus({ ...p, image: dataUrl }) } : p
    )
  );
  const handleImageRemove = (id) => setItems(
    (prev) => prev.map(
      (p) => p.id === id ? { ...p, image: null, imageFileName: null, status: recomputeStatus({ ...p, image: null }) } : p
    )
  );
  const handleDuplicateDecide = (id, decision) => {
    setDuplicateDecisions((prev) => ({ ...prev, [id]: decision }));
    if (decision === "skip") {
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setSelected((prev) => /* @__PURE__ */ new Set([...prev, id]));
    }
  };
  const handleImport = () => {
    const toImport = items.filter((p) => {
      if (!selected.has(p.id)) return false;
      const decision = duplicateDecisions[p.id];
      if (p.possibleDuplicate && !decision) return true;
      if (decision === "skip") return false;
      return true;
    }).map((p) => {
      const decision = duplicateDecisions[p.id];
      return {
        ...p,
        overwriteExistingId: decision === "replace" ? p.duplicateProductId ?? null : null
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
    setSelected(/* @__PURE__ */ new Set());
    setEditingId(null);
    setDuplicateDecisions({});
    setResults(null);
  };
  const selectable = items.filter((i) => i.status !== "invalid");
  const readyCount = items.filter((i) => i.status === "ready").length;
  const reviewCount = items.filter((i) => i.status === "review_required").length;
  const invalidCount = items.filter((i) => i.status === "invalid").length;
  const editingProduct = items.find((p) => p.id === editingId) ?? null;
  if (phase === "idle") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UploadArea, { onFile: handleFile }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        { label: "PDF", icon: "📄" },
        { label: "DOCX", icon: "📝" },
        { label: "XLSX / CSV", icon: "📊" },
        { label: "JPG / PNG", icon: "🖼️" }
      ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: t.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium mt-1", children: t.label })
      ] }, t.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl bg-muted/50 border border-border p-4 text-xs text-muted-foreground space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Expected table structure:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Column 1: Product name + image  |  Column 2: Buying price  |  Column 3: Selling price  |  Column 4: Available sizes" })
      ] })
    ] });
  }
  if (phase === "processing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full border-4 border-brand border-t-transparent animate-spin mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-semibold text-lg", children: "Processing file…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 truncate", children: fileName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Extracting product data — this may take a moment" })
    ] });
  }
  if (phase === "done" && results) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-14 w-14 text-emerald-500 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mt-5", children: "Import completed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-border overflow-hidden text-sm", children: [
        { label: "Successfully imported", value: results.imported, color: "text-emerald-600" },
        { label: "Needs review (drafted)", value: results.needsReview, color: "text-amber-600" },
        { label: "Skipped", value: results.skipped, color: "text-muted-foreground" },
        { label: "Failed", value: results.failed, color: "text-red-500" }
      ].map(({ label, value, color }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between px-5 py-3 border-b border-border last:border-b-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${color}`, children: value })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onDone,
            className: "px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition",
            children: "View product list"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: reset,
            className: "px-6 h-11 rounded-full border border-border font-semibold hover:bg-muted transition",
            children: "Import another file"
          }
        )
      ] })
    ] });
  }
  if (phase === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full border-4 border-brand border-t-transparent animate-spin mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-semibold text-lg", children: "Importing products…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Saving ",
        selected.size,
        " product",
        selected.size !== 1 ? "s" : "",
        " to the database"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: "Import preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate max-w-xs", children: fileName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:ml-auto flex flex-wrap gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700", children: [
          readyCount,
          " ready"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full bg-amber-50 text-amber-700", children: [
          reviewCount,
          " review"
        ] }),
        invalidCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full bg-red-50 text-red-600", children: [
          invalidCount,
          " invalid"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full bg-muted text-muted-foreground", children: [
          selected.size,
          " selected"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: selected.size === selectable.length && selectable.length > 0,
            onChange: toggleAll,
            className: "h-4 w-4 rounded border-border accent-brand"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-left font-medium", children: "Image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Product name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Buying price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Selling price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Available sizes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left font-medium", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-5 py-12 text-center text-muted-foreground", children: "No products extracted from this file" }) }),
        items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductRow,
          {
            product: p,
            selected: selected.has(p.id),
            duplicateDecision: duplicateDecisions[p.id],
            onToggle: () => toggleOne(p.id),
            onEdit: () => setEditingId(p.id),
            onDelete: () => deleteItem(p.id),
            onImageReplace: (url, name) => handleImageReplace(p.id, url, name),
            onImageRemove: () => handleImageRemove(p.id),
            onDuplicateDecide: (d) => handleDuplicateDecide(p.id, d)
          },
          p.id
        ))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleImport,
          disabled: selected.size === 0,
          className: "px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand-deep disabled:opacity-50 transition flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " Import ",
            selected.size,
            " selected product",
            selected.size !== 1 ? "s" : ""
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: reset,
          className: "px-6 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition",
          children: "Cancel import"
        }
      )
    ] }),
    editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditProductModal,
      {
        product: editingProduct,
        onSave: (updated) => {
          updateItem(updated);
          setEditingId(null);
        },
        onClose: () => setEditingId(null)
      }
    )
  ] });
}
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand/10 text-brand",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-sky-50 text-sky-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600"
};
const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const inputCls = "w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand";
function FormField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
function StatusBadge({
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }),
    status
  ] });
}
function AdminLayout({
  activeSection,
  setActiveSection,
  children
}) {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useUser();
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const NAV = [{
    id: "dashboard",
    label: t("admin.dashboard"),
    Icon: LayoutDashboard
  }, {
    id: "analytics",
    label: "Analytics",
    Icon: ChartNoAxesColumn
  }, {
    id: "orders",
    label: t("common.orders"),
    Icon: ShoppingCart
  }, {
    id: "customers",
    label: t("common.customers"),
    Icon: Users
  }, {
    id: "products",
    label: t("admin.productList"),
    Icon: List
  }, {
    id: "add-product",
    label: t("admin.addProduct"),
    Icon: Plus
  }, {
    id: "import-products",
    label: "Import Products",
    Icon: FileUp
  }];
  const selectSection = (id) => {
    setActiveSection(id);
    setMobileOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-muted/30 overflow-hidden", children: [
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `
          fixed inset-y-0 left-0 z-50 bg-[#1A2B4C] text-white flex flex-col transition-all duration-300
          lg:relative lg:translate-x-0 lg:shrink-0
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[72px]" : "w-[240px]"}
        `, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 h-16 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 h-8 w-8 rounded-lg bg-brand inline-flex items-center justify-center font-black text-white text-base select-none", children: "A" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg", children: [
          "AIT ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand", children: "SHOP" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(false), className: "ml-auto p-1 rounded hover:bg-white/10 lg:hidden", "aria-label": "Close menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(true), className: "ml-auto p-1 rounded hover:bg-white/10 hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) }),
        collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed(false), className: "p-1 rounded hover:bg-white/10 ml-auto hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 -rotate-90" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-4", children: [
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-2 text-[10px] uppercase tracking-widest text-white/40", children: t("common.admin") }),
        NAV.map((item) => {
          const active = item.id === activeSection;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => selectSection(item.id), className: `w-full flex items-center gap-3 px-5 py-3 text-sm transition ${active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.Icon, { className: "h-4 w-4 shrink-0" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
          ] }, item.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl hover:bg-white/5 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-brand/80 grid place-items-center text-xs font-bold shrink-0", children: user?.firstName?.[0] ?? "A" }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium truncate", children: user?.fullName ?? t("common.admin") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/50 truncate", children: user?.primaryEmailAddress?.emailAddress ?? "" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 bg-background border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(true), className: "lg:hidden p-2 rounded-lg hover:bg-muted transition", "aria-label": "Open menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base sm:text-xl capitalize truncate", children: activeSection.replace("-", " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden md:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: t("admin.searchPlaceholder"), className: "w-48 lg:w-64 h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative p-2 rounded-full hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-brand/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-brand" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto p-4 sm:p-6", children })
    ] })
  ] });
}
function DashboardSection() {
  const {
    t
  } = useTranslation();
  const {
    data: stats
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats()
  });
  const {
    data: orders = []
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders()
  });
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const WEEK_DATA = [52, 40, 38, 28, 41, 55, 49, 42, 36, 28, 34, 25];
  const maxV = Math.max(...WEEK_DATA);
  const H = 160;
  const W = 100;
  const step = W / (WEEK_DATA.length - 1);
  const linePath = WEEK_DATA.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - v / maxV * H}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: [{
      label: t("common.customers"),
      value: String(new Set(orders.map((o) => o.userId)).size || 0),
      color: "bg-blue-500"
    }, {
      label: t("common.products"),
      value: String(stats?.totalProducts ?? "..."),
      color: "bg-teal-500"
    }, {
      label: "In Stock",
      value: String(stats?.inStock ?? "..."),
      color: "bg-emerald-500"
    }, {
      label: "Out of Stock",
      value: String(stats?.outOfStock ?? "..."),
      color: "bg-orange-500"
    }, {
      label: "Revenue",
      value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
      color: "bg-sky-500"
    }].map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: it.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display mt-1", children: it.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 rounded-full mt-3 ${it.color}` })
    ] }, it.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4", children: [{
        label: "Total Revenue",
        value: `₮${totalRevenue.toLocaleString("mn-MN")}`,
        sub: "All time",
        up: true
      }, {
        label: t("common.orders"),
        value: String(orders.length),
        sub: "All time",
        up: true
      }, {
        label: "Pending / Cancelled",
        value: `${pendingCount} / ${cancelledCount}`,
        sub: "Need attention",
        up: false
      }].map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: card.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display mt-3", children: card.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium flex items-center gap-0.5 mt-1 ${card.up ? "text-brand" : "text-amber-500"}`, children: [
          card.up ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3 w-3" }),
          card.sub
        ] })
      ] }, card.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-2", children: t("admin.weeklyTrend") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "w-full h-32 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "adminGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#0EA5E9" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaPath, fill: "url(#adminGrad)", opacity: 0.4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: linePath, fill: "none", stroke: "#0EA5E9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.recentOrders") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("admin.orderId") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.date") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.status") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.amount") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: orders.slice(0, 5).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noOrders") }) }) : orders.slice(0, 5).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 font-medium", children: [
            "#",
            String(o.id).padStart(5, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.userEmail ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            o.totalAmount.toLocaleString("mn-MN")
          ] })
        ] }, o.id)) })
      ] }) })
    ] })
  ] });
}
function AnalyticsSection() {
  const qc = useQueryClient();
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ["sales-stats"],
    queryFn: () => getSalesStats()
  });
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const [resetting, setResetting] = reactExports.useState(false);
  const fmt = (n) => `₮${n.toLocaleString("mn-MN")}`;
  const pct = (current, prev) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round((current - prev) / prev * 100);
  };
  const handleExport = async () => {
    const csv = await exportAnalyticsCsv();
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ait-shop-analytics-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleReset = async () => {
    setResetting(true);
    try {
      await deleteAllOrders();
      qc.invalidateQueries({
        queryKey: ["sales-stats"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
      toast.success("All order data has been reset.");
      setConfirmReset(false);
    } catch {
      toast.error("Reset failed.");
    } finally {
      setResetting(false);
    }
  };
  const daily = stats?.dailyRevenue ?? [];
  const maxRev = Math.max(...daily.map((d) => d.revenue), 1);
  const H = 120;
  const W = 100;
  const step = daily.length > 1 ? W / (daily.length - 1) : W;
  const linePath = daily.map((d, i) => `${i === 0 ? "M" : "L"} ${i * step} ${H - d.revenue / maxRev * H}`).join(" ");
  const areaPath = daily.length > 0 ? `${linePath} L ${(daily.length - 1) * step} ${H} L 0 ${H} Z` : "";
  const periods = [{
    label: "Today",
    data: stats?.today
  }, {
    label: "This Week",
    data: stats?.thisWeek,
    compare: stats?.lastWeek
  }, {
    label: "Last Week",
    data: stats?.lastWeek
  }, {
    label: "This Month",
    data: stats?.thisMonth,
    compare: stats?.lastMonth
  }, {
    label: "Last Month",
    data: stats?.lastMonth
  }, {
    label: "All Time",
    data: stats?.allTime
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Sales Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Revenue and order breakdown by period" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExport, className: "inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Export CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConfirmReset(true), className: "inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
          " Reset Stats"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-4 animate-pulse h-24" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: periods.map(({
      label,
      data,
      compare
    }) => {
      const change = compare !== void 0 ? pct(data?.revenue ?? 0, compare.revenue) : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display mt-1 truncate", children: fmt(data?.revenue ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            data?.orders ?? 0,
            " orders"
          ] }),
          change !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? "text-emerald-600" : "text-red-500"}`, children: [
            change >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
            Math.abs(change),
            "% vs prior"
          ] })
        ] })
      ] }, label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-1", children: "Daily Revenue — Last 30 Days" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Excludes cancelled orders" }),
      daily.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "w-full h-40", preserveAspectRatio: "none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "analyticsGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#0EA5E9", stopOpacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0EA5E9", stopOpacity: "0" })
        ] }) }),
        areaPath && /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: areaPath, fill: "url(#analyticsGrad)" }),
        linePath && /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: linePath, fill: "none", stroke: "#0EA5E9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center text-muted-foreground text-sm", children: "No data yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: daily[0]?.date ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: daily[daily.length - 1]?.date ?? "" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: "Top Products by Revenue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "All time, excluding cancelled orders" })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 animate-pulse space-y-3", children: Array.from({
        length: 5
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted rounded-lg" }, i)) }) : !stats?.topProducts?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-5 text-sm text-muted-foreground", children: "No sales data yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: "Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: "Units Sold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: "Revenue" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stats.topProducts.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground font-medium", children: idx + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right text-muted-foreground", children: p.quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right font-display", children: fmt(p.revenue) })
        ] }, p.name)) })
      ] }) })
    ] }),
    confirmReset && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg text-red-600", children: "Reset All Order Data?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
        "This will permanently delete ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "all orders and order items" }),
        " from the database. This action cannot be undone."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmReset(false), className: "flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleReset, disabled: resetting, className: "flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50", children: resetting ? "Deleting…" : "Yes, Reset" })
      ] })
    ] }) })
  ] });
}
function OrdersSection() {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders()
  });
  const handleStatus = async (id, status) => {
    await updateOrderStatus({
      data: {
        id,
        status
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-orders"]
    });
    toast.success(t("admin.updated"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.allOrders") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        orders.length,
        " ",
        t("admin.totalLabel")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("admin.orderId") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.date") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.payment") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.status") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.update") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("common.loading") }) }),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-red-500", children: error instanceof Error ? error.message : "Failed to load orders" }) }),
        !isLoading && !isError && orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noOrders") }) }),
        orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 font-medium", children: [
            "#",
            String(o.id).padStart(5, "0")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.userName ?? t("admin.guest") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: o.userEmail })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground capitalize", children: o.paymentMethod ?? "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            o.totalAmount.toLocaleString("mn-MN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: o.status, onChange: (e) => handleStatus(o.id, e.target.value), className: "text-xs h-8 px-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-brand", children: ORDER_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) }) })
        ] }, o.id))
      ] })
    ] }) })
  ] });
}
function CustomersSection() {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const {
    data: customers = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => getAllUsers()
  });
  const [toggling, setToggling] = reactExports.useState(null);
  const handleToggleAdmin = async (userId, currentlyAdmin) => {
    setToggling(userId);
    try {
      await setUserAdmin({
        data: {
          userId,
          isAdmin: !currentlyAdmin
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-customers"]
      });
      toast.success(currentlyAdmin ? "Admin access removed." : "Admin access granted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setToggling(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("common.customers") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        customers.length,
        " ",
        t("admin.totalLabel")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.customers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.joined") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.orders") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-medium", children: t("common.spent") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.role") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: "Access" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("common.loading") }) }),
        !isLoading && customers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.noCustomers") }) }),
        customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-brand/20 grid place-items-center text-xs font-bold text-brand shrink-0", children: (c.displayName ?? c.email)[0].toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.displayName ?? "—" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: c.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: c.orderCount ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-display", children: [
            "₮",
            Number(c.totalSpent ?? 0).toLocaleString("mn-MN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${c.isAdmin ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`, children: c.isAdmin ? t("common.admin") : t("common.customers") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleAdmin(c.id, !!c.isAdmin), disabled: toggling === c.id, className: `text-xs h-7 px-3 rounded-full font-medium border transition disabled:opacity-50 ${c.isAdmin ? "border-red-200 text-red-600 hover:bg-red-50" : "border-brand/30 text-brand hover:bg-brand/5"}`, children: toggling === c.id ? "…" : c.isAdmin ? "Remove admin" : "Make admin" }) })
        ] }, c.id))
      ] })
    ] }) })
  ] });
}
const EMPTY_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  stock: "10",
  category: "Sneakers",
  badge: "",
  description: "",
  imageUrls: [],
  colors: "#3B82F6, #111827, #FFFFFF",
  sizes: "38, 39, 40, 41, 42, 43, 44, 45",
  rating: "4.5",
  featured: true
};
function parseFormToData(form) {
  return {
    name: form.name.trim(),
    price: parseFloat(form.price),
    oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : void 0,
    stock: parseInt(form.stock) || 0,
    category: form.category || void 0,
    badge: form.badge.trim() || void 0,
    description: form.description.trim() || void 0,
    imageUrls: form.imageUrls.length > 0 ? form.imageUrls : void 0,
    colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
    sizes: form.sizes.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n)),
    rating: parseFloat(form.rating) || 4,
    featured: form.featured
  };
}
function productToForm(p) {
  let imageUrls = [];
  if (p.imageUrls) {
    try {
      const parsed = JSON.parse(p.imageUrls);
      imageUrls = parsed.filter((u) => u.startsWith("http"));
    } catch {
    }
  }
  if (imageUrls.length === 0 && p.imageUrl && p.imageUrl.startsWith("http")) {
    imageUrls = [p.imageUrl];
  }
  return {
    name: String(p.name ?? ""),
    price: String(p.price ?? ""),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    stock: String(p.stock ?? "0"),
    category: String(p.category ?? "Sneakers"),
    badge: String(p.badge ?? ""),
    description: String(p.description ?? ""),
    imageUrls,
    colors: p.colors ? JSON.parse(p.colors).join(", ") : "",
    sizes: p.sizes ? JSON.parse(p.sizes).join(", ") : "",
    rating: String(p.rating ?? "4.5"),
    featured: p.featured !== false && p.featured !== 0
  };
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}
function ProductForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saving
}) {
  const {
    t
  } = useTranslation();
  const [form, setForm] = reactExports.useState(initial);
  const [uploading, setUploading] = reactExports.useState(false);
  const discountPercent = (() => {
    const price = parseFloat(form.price);
    const oldPrice = parseFloat(form.oldPrice);
    if (!oldPrice || !price || oldPrice <= price) return null;
    return Math.round((oldPrice - price) / oldPrice * 100);
  })();
  reactExports.useEffect(() => {
    setForm((f) => {
      const isAutoBadge = f.badge === "" || /^-\d+%$/.test(f.badge);
      if (!isAutoBadge) return f;
      const next = discountPercent !== null ? `-${discountPercent}%` : "";
      return f.badge === next ? f : {
        ...f,
        badge: next
      };
    });
  }, [discountPercent]);
  const set = (key) => (e) => setForm((f) => ({
    ...f,
    [key]: e.target.value
  }));
  const uploadFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fileBase64 = await fileToBase64(file);
        const {
          url
        } = await uploadProductImage({
          data: {
            fileName: file.name || `paste-${Date.now()}.png`,
            fileBase64,
            contentType: file.type
          }
        });
        return url;
      }));
      setForm((f) => ({
        ...f,
        imageUrls: [...f.imageUrls, ...urls]
      }));
      toast.success(t("admin.imageUploaded"));
    } catch {
      toast.error(t("admin.imageUploadFailed"));
    } finally {
      setUploading(false);
    }
  };
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    await uploadFiles(files);
    e.target.value = "";
  };
  reactExports.useEffect(() => {
    const handlePaste = (e) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageFiles = items.filter((item) => item.type.startsWith("image/")).map((item) => item.getAsFile()).filter((f) => f !== null);
      if (imageFiles.length) uploadFiles(imageFiles);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);
  const removeImage = (index) => setForm((f) => ({
    ...f,
    imageUrls: f.imageUrls.filter((_, i) => i !== index)
  }));
  const moveImage = (from, to) => setForm((f) => {
    const imgs = [...f.imageUrls];
    const [item] = imgs.splice(from, 1);
    imgs.splice(to, 0, item);
    return {
      ...f,
      imageUrls: imgs
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.productName"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.name, onChange: set("name"), placeholder: "AIT Shop Glide 1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.category"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: inputCls, value: form.category, onChange: set("category"), children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("common.price")} (₮) *`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", step: "100", value: form.price, onChange: set("price"), placeholder: "302600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormField, { label: `${t("common.oldPrice")} (₮)`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", step: "100", value: form.oldPrice, onChange: set("oldPrice"), placeholder: t("common.optional") }),
        discountPercent !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs font-semibold text-brand", children: [
          "-",
          discountPercent,
          "% off"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.stock"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", value: form.stock, onChange: set("stock") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.badge"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.badge, onChange: set("badge"), placeholder: t("common.optional") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("common.rating")} (0-5)`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, type: "number", min: "0", max: "5", step: "0.1", value: form.rating, onChange: set("rating") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "sr-only", checked: form.featured, onChange: (e) => setForm((f) => ({
          ...f,
          featured: e.target.checked
        })) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-brand" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0"}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
        "Show on homepage",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(only products with clean, no-background images)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: `${t("admin.images")} *`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      form.imageUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: form.imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: `Image ${i + 1}`, className: `h-20 w-20 rounded-xl object-cover border-2 transition ${i === 0 ? "border-brand" : "border-border"}` }),
        i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-brand text-white text-[9px] font-bold grid place-items-center shadow", children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1", children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => moveImage(i, i - 1), className: "text-white text-[10px] font-semibold hover:text-brand-foreground", children: [
            "← ",
            t("admin.moveFirst")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(i), className: "h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, url + i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border text-sm transition ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
          uploading ? t("admin.uploading") : t("admin.addImages"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, className: "sr-only", onChange: handleImageUpload, disabled: uploading })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "or",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[11px]", children: "Ctrl+V" }),
          " ",
          "to paste"
        ] }),
        form.imageUrls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-red-500 font-medium", children: t("admin.noImages") })
      ] }),
      form.imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("admin.firstImageIsCover") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.colorsHint"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.colors, onChange: set("colors") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("admin.sizesHint"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: form.sizes, onChange: set("sizes") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: t("common.description"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: `${inputCls} h-24 resize-none py-2.5`, value: form.description, onChange: set("description"), placeholder: t("admin.descPlaceholder") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(form), disabled: saving || uploading || !form.name || !form.price || form.imageUrls.length === 0, className: "px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand-deep disabled:opacity-50 flex items-center gap-2", children: saving ? t("admin.saving") : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
        " ",
        t("admin.saveProduct")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "px-6 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted", children: t("common.cancel") })
    ] })
  ] });
}
function AddProductSection({
  onDone
}) {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const [saving, setSaving] = reactExports.useState(false);
  const handleSave = async (form) => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      await createProduct({
        data: parseFormToData(form)
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-stats"]
      });
      toast.success(t("admin.created"));
      onDone();
    } catch {
      toast.error(t("admin.failedCreate"));
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mb-6", children: t("admin.addNew") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, { onSave: handleSave, onCancel: onDone, saving })
  ] });
}
function ProductsSection({
  onAddNew,
  onImport
}) {
  const {
    t
  } = useTranslation();
  const qc = useQueryClient();
  const {
    data: prods = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getAdminProducts()
  });
  const [editId, setEditId] = reactExports.useState(null);
  const [editSaving, setEditSaving] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const filtered = prods.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.category ?? "").toLowerCase().includes(search.toLowerCase()));
  const handleDelete = async (id, name) => {
    if (!confirm(t("admin.deleteConfirm", {
      name
    }))) return;
    await deleteProduct({
      data: {
        id
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-stats"]
    });
    toast.success(t("admin.deleted"));
  };
  const handleDeleteAll = async () => {
    if (!confirm(`Delete all ${prods.length} products? This cannot be undone.`)) return;
    await deleteAllProducts();
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-stats"]
    });
    toast.success("All products deleted.");
  };
  const handleEditSave = async (form) => {
    if (!editId) return;
    setEditSaving(true);
    try {
      await updateProduct({
        data: {
          id: editId,
          ...parseFormToData(form)
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      setEditId(null);
      toast.success(t("admin.updated"));
    } catch {
      toast.error(t("admin.failedUpdate"));
    } finally {
      setEditSaving(false);
    }
  };
  const editingProduct = editId ? prods.find((p) => p.id === editId) : null;
  if (editId && editingProduct) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl mb-6", children: [
        "Edit — ",
        editingProduct.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, { initial: productToForm(editingProduct), onSave: handleEditSave, onCancel: () => setEditId(null), saving: editSaving })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t("admin.productList") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          prods.length,
          " ",
          t("common.products")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:ml-auto flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: t("admin.searchPlaceholder"), value: search, onChange: (e) => setSearch(e.target.value), className: "h-9 pl-8 pr-3 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand w-44" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onImport, className: "h-9 px-4 rounded-full border border-border text-sm font-medium flex items-center gap-1.5 hover:bg-muted transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { className: "h-3.5 w-3.5" }),
          " Import file"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onAddNew, className: "h-9 px-4 rounded-full bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-deep flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " ",
          t("admin.addProduct")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDeleteAll, disabled: prods.length === 0, className: "h-9 px-4 rounded-full border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
          " Delete All"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.product") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.category") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.price") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: "Buying price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.stock") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.rating") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left font-medium", children: t("common.actions") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-5 py-8 text-center text-muted-foreground", children: t("admin.loadingProducts") }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-5 py-8 text-center text-muted-foreground", children: search ? t("admin.noMatch") : t("admin.noProducts") }) }),
        filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0", children: p.imageUrl && !/^[1-6]$/.test(p.imageUrl.trim()) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.imageUrl, alt: p.name, className: "h-full w-full object-contain p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate max-w-[180px]", children: p.name }),
              p.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium", children: p.badge })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: p.category ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display", children: [
              "₮",
              Number(p.price).toLocaleString("mn-MN")
            ] }),
            p.oldPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs text-muted-foreground line-through", children: [
              "₮",
              Number(p.oldPrice).toLocaleString("mn-MN")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground text-sm", children: p.buyingPrice != null ? `₮${Number(p.buyingPrice).toLocaleString("mn-MN")}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-emerald-600"}`, children: p.stock }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: (() => {
            const s = p.status;
            if (s === "draft") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium", children: "Draft" });
            return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium", children: "Published" });
          })() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-muted-foreground", children: [
            "⭐ ",
            p.rating?.toFixed(1) ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditId(p.id), className: "p-1.5 rounded-lg hover:bg-brand/10 text-brand", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id, p.name), className: "p-1.5 rounded-lg hover:bg-red-50 text-red-500", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }) })
        ] }, p.id))
      ] })
    ] }) })
  ] });
}
function AdminPage() {
  const {
    t
  } = useTranslation();
  const {
    isSignedIn,
    isLoaded
  } = useUser();
  const [activeSection, setActiveSection] = reactExports.useState("dashboard");
  const {
    data: access,
    isLoading: accessLoading
  } = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => checkAdminAccess(),
    enabled: isLoaded && isSignedIn
  });
  if (!isLoaded || isSignedIn && accessLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" }) });
  }
  if (!isSignedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-brand mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-2", children: t("admin.accessRequired") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: t("admin.signInPrompt") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/login", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
        " ",
        t("common.signIn")
      ] })
    ] }) });
  }
  if (!access?.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 text-red-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-2", children: t("admin.accessRequired") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "This account does not have admin access." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "inline-flex items-center gap-2 px-6 h-11 rounded-full border border-border font-semibold hover:bg-muted transition", children: t("common.goHome") })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { activeSection, setActiveSection, children: [
    activeSection === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSection, {}),
    activeSection === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsSection, {}),
    activeSection === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersSection, {}),
    activeSection === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersSection, {}),
    activeSection === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsSection, { onAddNew: () => setActiveSection("add-product"), onImport: () => setActiveSection("import-products") }),
    activeSection === "add-product" && /* @__PURE__ */ jsxRuntimeExports.jsx(AddProductSection, { onDone: () => setActiveSection("products") }),
    activeSection === "import-products" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mb-6", children: "Import Products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImportProducts, { onDone: () => setActiveSection("products") })
    ] })
  ] });
}
export {
  AdminPage as component
};
