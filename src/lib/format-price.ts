export function formatPrice(price: number, _language?: string): string {
  const tugrikPrice = Math.round(price);
  return `₮${tugrikPrice.toLocaleString("mn-MN")}`;
}
