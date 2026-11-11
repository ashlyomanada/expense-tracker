import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { formatMoney } from './money'

export interface ReportData {
  householdName: string
  monthLabel: string
  currency: string
  totalExpenses: number
  totalBills: number
  totalSpent: number
  members: {
    displayName: string
    paid: number
    owed: number
    net: number
  }[]
  categories: {
    categoryName: string
    amount: number
  }[]
  bills: {
    name: string
    amount: number
    status: string
    dueDate: string
    paidBy?: string
  }[]
  expenses: {
    storeName: string
    purchaseDate: string
    totalAmount: number
    paidBy: string
    itemsCount: number
  }[]
  settlementSuggestions: {
    from: string
    to: string
    amount: number
  }[]
}

export function downloadReportPdf(data: ReportData): void {
  // Initialize vfs
  const anyFonts = pdfFonts as unknown as { pdfMake?: { vfs: Record<string, string> }; [key: string]: unknown }
  if (anyFonts && anyFonts.pdfMake?.vfs) {
    pdfMake.vfs = anyFonts.pdfMake.vfs
  } else {
    pdfMake.vfs = pdfFonts as unknown as Record<string, string>
  }

  const curr = data.currency || 'PHP'

  const memberRows: TableCell[][] = data.members.map((m) => [
    { text: m.displayName, bold: true },
    { text: formatMoney(m.paid, curr), alignment: 'right' as const },
    { text: formatMoney(m.owed, curr), alignment: 'right' as const },
    {
      text: `${m.net > 0 ? '+' : ''}${formatMoney(m.net, curr)}`,
      alignment: 'right' as const,
      bold: true,
      color: m.net > 0.005 ? '#16a34a' : m.net < -0.005 ? '#dc2626' : '#4b5563',
    },
  ])

  const categoryRows: TableCell[][] = data.categories.map((c) => [
    { text: c.categoryName },
    { text: formatMoney(c.amount, curr), alignment: 'right' as const, bold: true },
  ])

  const billRows: TableCell[][] = data.bills.length
    ? data.bills.map((b) => [
        { text: b.name },
        { text: formatMoney(b.amount, curr), alignment: 'right' as const },
        { text: b.dueDate },
        {
          text: b.status.toUpperCase(),
          bold: true,
          color: b.status === 'paid' ? '#16a34a' : '#d97706',
        },
        { text: b.paidBy || '—' },
      ])
    : [[
        { text: 'No bills for this month', colSpan: 5, italics: true },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
      ]]

  const expenseRows: TableCell[][] = data.expenses.length
    ? data.expenses.map((e) => [
        { text: e.storeName, bold: true },
        { text: e.purchaseDate },
        { text: e.paidBy },
        { text: String(e.itemsCount), alignment: 'center' as const },
        { text: formatMoney(e.totalAmount, curr), alignment: 'right' as const },
      ])
    : [[
        { text: 'No expenses for this month', colSpan: 5, italics: true },
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' },
      ]]

  const settlementRows: TableCell[][] = data.settlementSuggestions.length
    ? data.settlementSuggestions.map((s) => [
        { text: `${s.from} pays ${s.to}`, bold: true },
        { text: formatMoney(s.amount, curr), alignment: 'right' as const, bold: true, color: '#0284c7' },
      ])
    : [[
        { text: 'No transfers needed. All balances settled!', colSpan: 2, italics: true },
        { text: '' },
      ]]

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [36, 40, 36, 40],
    content: [
      // Header
      {
        text: 'HOUSESPLIT EXPENSE REPORT',
        style: 'docHeader',
      },
      {
        text: `${data.householdName} • ${data.monthLabel}`,
        style: 'docSubheader',
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1.5, lineColor: '#0284c7' }],
        margin: [0, 0, 0, 15],
      },

      // Section 1: Executive Summary
      { text: '1. Monthly Summary', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Total Spent', style: 'tableHeader' },
              { text: 'Expenses', style: 'tableHeader' },
              { text: 'Bills', style: 'tableHeader' },
            ],
            [
              { text: formatMoney(data.totalSpent, curr), style: 'totalValue' },
              { text: formatMoney(data.totalExpenses, curr), style: 'metricValue' },
              { text: formatMoney(data.totalBills, curr), style: 'metricValue' },
            ],
          ] as TableCell[][],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 15],
      },

      // Section 2: Member Balances
      { text: '2. Member Spending & Balances', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 100, 100, 100],
          body: [
            [
              { text: 'Member', style: 'tableHeader' },
              { text: 'Paid', style: 'tableHeader', alignment: 'right' as const },
              { text: 'Share Owed', style: 'tableHeader', alignment: 'right' as const },
              { text: 'Net Balance', style: 'tableHeader', alignment: 'right' as const },
            ] as TableCell[],
            ...memberRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 15],
      },

      // Section 3: Category Breakdown
      { text: '3. Category Breakdown', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 120],
          body: [
            [
              { text: 'Category', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader', alignment: 'right' as const },
            ] as TableCell[],
            ...categoryRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 15],
      },

      // Section 4: Bills
      { text: '4. Monthly Bills', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 80, 80, 70, 90],
          body: [
            [
              { text: 'Bill Name', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader', alignment: 'right' as const },
              { text: 'Due Date', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Paid By', style: 'tableHeader' },
            ] as TableCell[],
            ...billRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 15],
      },

      // Section 5: Itemized Expenses
      { text: '5. Itemized Expenses', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 80, 90, 50, 80],
          body: [
            [
              { text: 'Store / Merchant', style: 'tableHeader' },
              { text: 'Date', style: 'tableHeader' },
              { text: 'Paid By', style: 'tableHeader' },
              { text: 'Items', style: 'tableHeader', alignment: 'center' as const },
              { text: 'Total', style: 'tableHeader', alignment: 'right' as const },
            ] as TableCell[],
            ...expenseRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 15],
      },

      // Section 6: Settlement Suggestions
      { text: '6. Settlement Suggestions (Who Pays Whom)', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 120],
          body: [
            [
              { text: 'Payment Transfer', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader', alignment: 'right' as const },
            ] as TableCell[],
            ...settlementRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10],
      },
    ],
    styles: {
      docHeader: {
        fontSize: 18,
        bold: true,
        color: '#0f172a',
      },
      docSubheader: {
        fontSize: 11,
        color: '#64748b',
        margin: [0, 2, 0, 0],
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: '#1e293b',
        margin: [0, 10, 0, 6],
      },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: '#475569',
        fillColor: '#f8fafc',
      },
      totalValue: {
        fontSize: 14,
        bold: true,
        color: '#0284c7',
        margin: [0, 4, 0, 4],
      },
      metricValue: {
        fontSize: 12,
        bold: true,
        color: '#334155',
        margin: [0, 4, 0, 4],
      },
    },
    defaultStyle: {
      fontSize: 9,
      color: '#1e293b',
      lineHeight: 1.2,
    },
  }

  const filename = `HouseSplit-Report-${data.householdName.replace(/\s+/g, '_')}-${data.monthLabel.replace(/\s+/g, '_')}.pdf`
  pdfMake.createPdf(docDefinition).download(filename)
}
