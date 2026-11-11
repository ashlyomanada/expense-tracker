function toCentavos(amount) {
  if (typeof amount === "number") {
    return Math.round(amount * 100);
  }
  const clean = amount.trim().replace(/,/g, "");
  const parsed = parseFloat(clean);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}
function fromCentavos(centavos) {
  return Math.round(centavos) / 100;
}
function formatMoney(amount, currency = "PHP") {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}
export {
  fromCentavos as a,
  formatMoney as f,
  toCentavos as t
};
//# sourceMappingURL=money-z3Rw8dBE.js.map
