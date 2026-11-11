/**
 * Utilities for precise financial calculations without floating point errors.
 * All monetary amounts are handled as integer centavos internally.
 */

export function toCentavos(amount: number | string): number {
  if (typeof amount === 'number') {
    return Math.round(amount * 100)
  }
  const clean = amount.trim().replace(/,/g, '')
  const parsed = parseFloat(clean)
  if (isNaN(parsed)) return 0
  return Math.round(parsed * 100)
}

export function fromCentavos(centavos: number): number {
  return Math.round(centavos) / 100
}

export function formatMoney(amount: number | string, currency = 'PHP'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function addMoney(a: number | string, b: number | string): number {
  return fromCentavos(toCentavos(a) + toCentavos(b))
}

export function subtractMoney(a: number | string, b: number | string): number {
  return fromCentavos(toCentavos(a) - toCentavos(b))
}

export function multiplyMoney(amount: number | string, factor: number): number {
  return fromCentavos(Math.round(toCentavos(amount) * factor))
}

