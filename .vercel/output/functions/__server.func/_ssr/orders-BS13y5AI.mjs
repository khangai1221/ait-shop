import { c as createSsrRpc } from "./createSsrRpc-IxLg67WK.mjs";
import { b as createServerFn } from "./server-BMY1Y0f7.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const getAllOrders = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ddea7dedf7aeb56939525f151d85ba03b2a6b8728289055c4a2a4d194a23165b"));
const getOrdersByEmail = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7e47be6cd2f89737ce0d1a7c8d98374de1d36799dfa994ee5ec0817792106cb1"));
const createOrder = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  email: stringType().email().max(254),
  displayName: stringType().max(200).optional(),
  totalAmount: numberType().positive().max(1e9),
  paymentMethod: enumType(["qpay", "pickup"]),
  shippingAddress: stringType().max(500).optional(),
  items: arrayType(objectType({
    productId: numberType().nullable().optional(),
    productName: stringType().max(200),
    quantity: numberType().int().positive().max(100),
    unitPrice: numberType().positive().max(1e8)
  })).min(1).max(50)
})).handler(createSsrRpc("00e828a7cbd00d568d07bebe5f5c0e6c24a84ec46880352adb787cb183a1f079"));
const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
const updateOrderStatus = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: numberType(),
  status: enumType(VALID_STATUSES)
})).handler(createSsrRpc("71ba35fe1e2894bed0322b01cf9bb0c0002c0bcc1b426a2ace29db6fd7299996"));
export {
  getAllOrders as a,
  createOrder as c,
  getOrdersByEmail as g,
  updateOrderStatus as u
};
