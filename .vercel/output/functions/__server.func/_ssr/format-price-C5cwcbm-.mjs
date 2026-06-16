function formatPrice(price, _language) {
  const tugrikPrice = Math.round(price);
  return `₮${tugrikPrice.toLocaleString("mn-MN")}`;
}
export {
  formatPrice as f
};
