import { c as createSsrRpc } from "./createSsrRpc-IxLg67WK.mjs";
import { b as createServerFn } from "./server-BMY1Y0f7.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const uploadProductImage = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  fileName: stringType().max(255),
  fileBase64: stringType().max(MAX_IMAGE_BYTES * 1.4),
  // base64 inflates size ~33%
  contentType: stringType()
})).handler(createSsrRpc("b1d9b75e0df73aca5226bdf7e0e9f2735cb9c36203f49196e8fd30cd031d6d1b"));
const getProducts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7c9d38576313a90b7aa69ef77dc61feb2559538a137a2c4aac57c9dc5a1ede0d"));
const getProductById = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: numberType()
})).handler(createSsrRpc("bb1060c02eb6108eabbfc1d9a045c9c7a2c3aad585862c64b0d21dbdffc23b36"));
const productSchema = objectType({
  name: stringType().min(1).max(200),
  price: numberType().positive().max(1e8),
  oldPrice: numberType().positive().max(1e8).nullable().optional(),
  stock: numberType().int().min(0).max(999999),
  description: stringType().max(2e3).optional(),
  imageUrl: stringType().max(500).optional(),
  imageUrls: arrayType(stringType().max(500)).max(10).optional(),
  category: stringType().max(100).optional(),
  badge: stringType().max(50).nullable().optional(),
  colors: arrayType(stringType().max(20)).max(10).optional(),
  sizes: arrayType(numberType()).max(20).optional(),
  rating: numberType().min(0).max(5).optional()
});
const createProduct = createServerFn({
  method: "POST"
}).inputValidator(productSchema).handler(createSsrRpc("071d3e76962d8aedf14b7eb3f9f693aab823595f9fa1e3d6ee4d3851fdc03db7"));
const updateProduct = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: numberType()
}).merge(productSchema.partial())).handler(createSsrRpc("e3b5eb71359407d6d88ad1269ba5879332bc9ed446121bbf220a296f86f30b5f"));
const deleteProduct = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: numberType()
})).handler(createSsrRpc("42b7eecb730fa01dbdb05dc58e38f4adf995ebed3b73a53cd065b0569701cc40"));
const importProducts = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  fileBase64: stringType(),
  fileType: enumType(["xlsx", "docx"])
})).handler(createSsrRpc("b601df3d2761c850fda4093e7be776556dcda89731d4460066e94a249117ba8b"));
const getAdminStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("94b289747e1d40ed431132e1c51a9445c5e2c2372884eb0c4fc9cfb590ab00af"));
export {
  uploadProductImage as a,
  getAdminStats as b,
  createProduct as c,
  deleteProduct as d,
  getProductById as e,
  getProducts as g,
  importProducts as i,
  updateProduct as u
};
