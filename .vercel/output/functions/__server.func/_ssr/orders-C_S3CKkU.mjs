import { f as createSsrRpc } from "./router-DA4WPAAH.mjs";
import { c as createServerFn } from "./server-CNKxx3CJ.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const getAllOrders = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ddea7dedf7aeb56939525f151d85ba03b2a6b8728289055c4a2a4d194a23165b"));
const getOrdersByEmail = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7e47be6cd2f89737ce0d1a7c8d98374de1d36799dfa994ee5ec0817792106cb1"));
const createOrder = createServerFn({
  method: "POST"
}).validator(objectType({
  email: stringType().email().max(254),
  displayName: stringType().max(200).optional(),
  totalAmount: numberType().positive().max(1e9),
  paymentMethod: enumType(["cash", "bank_transfer", "pickup"]),
  shippingAddress: stringType().max(500).optional(),
  items: arrayType(objectType({
    productId: numberType().nullable().optional(),
    productName: stringType().max(200),
    quantity: numberType().int().positive().max(100),
    unitPrice: numberType().positive().max(1e8)
  })).min(1).max(50)
})).handler(createSsrRpc("00e828a7cbd00d568d07bebe5f5c0e6c24a84ec46880352adb787cb183a1f079"));
const getSalesStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("5162dc70fd7b74aaf9915fdb574f1a7c3532e19076d1519f663c17aa7320a4a3"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("bc938985a892da101dea0cd2ddf1adf5900173531666d110bf37df52938e199e"));
const exportAnalyticsCsv = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6fbcd6d4a4da69acbe8f931e964a09d3fd49e184bf98f98e26f2fc3102938031"));
const deleteAllOrders = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e419d7605752167513f58ba13d3aeea1d6a5c874834f97990d1ba19cb14a3542"));
const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
const updateOrderStatus = createServerFn({
  method: "POST"
}).validator(objectType({
  id: numberType(),
  status: enumType(VALID_STATUSES)
})).handler(createSsrRpc("71ba35fe1e2894bed0322b01cf9bb0c0002c0bcc1b426a2ace29db6fd7299996"));
export {
  getAllOrders as a,
  getSalesStats as b,
  createOrder as c,
  deleteAllOrders as d,
  exportAnalyticsCsv as e,
  getOrdersByEmail as g,
  updateOrderStatus as u
};
