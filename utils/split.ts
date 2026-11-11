import { toCentavos, fromCentavos } from './money'

export interface SplitShare {
  userId: string
  shareAmount: number
}

/**
 * Splits an amount equally among selected members.
 * Leftover centavos go to the payer (if payer is among the split members),
 * or to the first member in the list.
 * Sum of shares is guaranteed to exactly equal totalAmount.
 */
export function calculateEqualSplit(
  totalAmount: number | string,
  memberIds: string[],
  payerId?: string
): SplitShare[] {
  if (!memberIds.length) return []

  const totalCentavos = toCentavos(totalAmount)
  const n = memberIds.length
  const baseCentavos = Math.floor(totalCentavos / n)
  const remainderCentavos = totalCentavos - baseCentavos * n

  // Leftover centavos go to the payer if they are in the split;
  // otherwise to the first member in the split list
  const remainderRecipientId = payerId && memberIds.includes(payerId)
    ? payerId
    : memberIds[0]

  return memberIds.map((userId) => {
    const isRecipient = userId === remainderRecipientId
    const centavos = baseCentavos + (isRecipient ? remainderCentavos : 0)
    return {
      userId,
      shareAmount: fromCentavos(centavos),
    }
  })
}

/**
 * Validates that an array of shares exactly sums to the total amount.
 */
export function validateSplitSum(
  totalAmount: number | string,
  shares: { shareAmount: number | string }[]
): boolean {
  const totalCentavos = toCentavos(totalAmount)
  const sharesCentavos = shares.reduce((acc, s) => acc + toCentavos(s.shareAmount), 0)
  return totalCentavos === sharesCentavos
}

