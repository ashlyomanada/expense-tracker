<script setup lang="ts">
import { formatMoney } from '~/utils/money'
import { downloadReportPdf, type ReportData } from '~/utils/pdf'

definePageMeta({
  layout: 'default',
})

const { household, members, fetchHousehold } = useHousehold()
const { expenses, fetchExpenses } = useExpenses()
const { bills, fetchBills } = useBills()
const { debts, fetchDebts } = useBalances()
const toast = useToast()

const currentMonthStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const selectedMonth = ref(currentMonthStr())
const loading = ref(true)
const generatingPdf = ref(false)

const loadReportData = async () => {
  loading.value = true
  await fetchHousehold()
  await Promise.all([
    fetchExpenses(selectedMonth.value),
    fetchBills(selectedMonth.value),
    fetchDebts(),
  ])
  loading.value = false
}

onMounted(() => {
  loadReportData()
})

watch(selectedMonth, () => {
  loadReportData()
})

const monthOptions = computed(() => {
  const list = []
  const now = new Date()
  for (let i = -11; i <= 2; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    list.push({ label, value: val })
  }
  return list
})

const currentMonthLabel = computed(() => {
  const [year, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(year, m - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Section 1: Totals
const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, e) => sum + e.total_amount, 0)
})

const totalBills = computed(() => {
  return bills.value.reduce((sum, b) => sum + b.amount, 0)
})

const totalSpent = computed(() => {
  return Math.round((totalExpenses.value + totalBills.value) * 100) / 100
})

// Section 2: Per member breakdown
const memberBreakdown = computed(() => {
  return members.value.map((m) => {
    // Paid in expenses
    const expPaid = expenses.value
      .filter((e) => e.paid_by === m.id)
      .reduce((sum, e) => sum + e.total_amount, 0)

    // Paid in bills (only if status is paid)
    const billPaid = bills.value
      .filter((b) => b.paid_by === m.id && b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0)

    const totalPaid = Math.round((expPaid + billPaid) * 100) / 100

    // Owed in expenses
    const expOwed = expenses.value.reduce((sum, e) => {
      const allShares = e.items.flatMap((it) => it.shares || [])
      const userShares = allShares.filter((s) => s.user_id === m.id)
      return sum + userShares.reduce((sSum, s) => sSum + s.share_amount, 0)
    }, 0)

    // Owed in paid bills
    const billOwed = bills.value
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => {
        const userShare = b.shares.find((s) => s.user_id === m.id)
        return sum + (userShare ? userShare.share_amount : 0)
      }, 0)

    const totalOwed = Math.round((expOwed + billOwed) * 100) / 100
    const net = Math.round((totalPaid - totalOwed) * 100) / 100

    return {
      id: m.id,
      displayName: m.display_name,
      paid: totalPaid,
      owed: totalOwed,
      net,
    }
  })
})

// Section 3: Category breakdown
const categoryBreakdown = computed(() => {
  const catMap = new Map<string, number>()

  // From expenses
  for (const exp of expenses.value) {
    for (const item of exp.items) {
      const cName = item.category?.name || 'Other'
      catMap.set(cName, (catMap.get(cName) || 0) + item.total_price)
    }
  }

  // From bills
  for (const bill of bills.value) {
    const cName = bill.category?.name || 'Utilities'
    catMap.set(cName, (catMap.get(cName) || 0) + bill.amount)
  }

  return Array.from(catMap.entries())
    .map(([categoryName, amount]) => ({
      categoryName,
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount)
})

// Section 6: Settlement suggestions
const settlementSuggestions = computed(() => {
  return debts.value.map((d) => ({
    from: d.debtor_name,
    to: d.creditor_name,
    amount: d.amount,
  }))
})

const handleDownloadPdf = () => {
  generatingPdf.value = true
  try {
    const data: ReportData = {
      householdName: household.value?.name || 'Household',
      monthLabel: currentMonthLabel.value,
      currency: household.value?.currency || 'PHP',
      totalExpenses: totalExpenses.value,
      totalBills: totalBills.value,
      totalSpent: totalSpent.value,
      members: memberBreakdown.value,
      categories: categoryBreakdown.value,
      bills: bills.value.map((b) => ({
        name: b.name,
        amount: b.amount,
        status: b.status,
        dueDate: b.due_date,
        paidBy: b.payer?.display_name,
      })),
      expenses: expenses.value.map((e) => ({
        storeName: e.store_name,
        purchaseDate: e.purchase_date,
        totalAmount: e.total_amount,
        paidBy: e.payer?.display_name || 'Member',
        itemsCount: e.items.length,
      })),
      settlementSuggestions: settlementSuggestions.value,
    }

    downloadReportPdf(data)
    toast.add({
      title: 'PDF Generated',
      description: 'Your report PDF is downloading.',
      color: 'green',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to generate PDF'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    generatingPdf.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto pb-12">
    <!-- Top Bar -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monthly Report</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ household?.name }} • {{ currentMonthLabel }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="primary"
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          :loading="generatingPdf"
          :disabled="generatingPdf || loading"
          @click="handleDownloadPdf"
        >
          Download PDF
        </UButton>
      </div>
    </div>

    <!-- Month Selector -->
    <div class="w-full sm:w-64">
      <USelect
        v-model="selectedMonth"
        :options="monthOptions"
        option-attribute="label"
        value-attribute="value"
        icon="i-heroicons-calendar"
      />
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-28 w-full rounded-xl" />
      <USkeleton class="h-40 w-full rounded-xl" />
      <USkeleton class="h-40 w-full rounded-xl" />
    </div>

    <div v-else class="space-y-6">
      <!-- 1. Total Spent Summary Cards -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <p class="text-xs text-gray-500 font-medium">Total Spent</p>
          <p class="text-xl font-bold font-mono text-primary-600 dark:text-primary-400 mt-1">
            {{ formatMoney(totalSpent, household?.currency) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <p class="text-xs text-gray-500 font-medium">Expenses</p>
          <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">
            {{ formatMoney(totalExpenses, household?.currency) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <p class="text-xs text-gray-500 font-medium">Monthly Bills</p>
          <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">
            {{ formatMoney(totalBills, household?.currency) }}
          </p>
        </div>
      </div>

      <!-- 2. Per-Member Spending & Share -->
      <UCard>
        <template #header>
          <h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-heroicons-users" class="w-4 h-4 text-primary-500" />
            <span>2. Member Contributions & Net</span>
          </h2>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800 text-gray-400">
                <th class="py-2">Member</th>
                <th class="py-2 text-right">Paid</th>
                <th class="py-2 text-right">Share Owed</th>
                <th class="py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
              <tr v-for="m in memberBreakdown" :key="m.id">
                <td class="py-2.5 font-medium text-gray-900 dark:text-white">{{ m.displayName }}</td>
                <td class="py-2.5 text-right font-mono">{{ formatMoney(m.paid, household?.currency) }}</td>
                <td class="py-2.5 text-right font-mono">{{ formatMoney(m.owed, household?.currency) }}</td>
                <td
                  class="py-2.5 text-right font-mono font-bold"
                  :class="m.net > 0.005 ? 'text-green-600' : m.net < -0.005 ? 'text-red-600' : 'text-gray-400'"
                >
                  {{ m.net > 0.005 ? '+' : '' }}{{ formatMoney(m.net, household?.currency) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

      <!-- 3. Category Breakdown -->
      <UCard>
        <template #header>
          <h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary-500" />
            <span>3. Spending by Category</span>
          </h2>
        </template>

        <div v-if="categoryBreakdown.length === 0" class="text-xs text-gray-500 text-center py-4">
          No recorded spending for this month.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="cat in categoryBreakdown"
            :key="cat.categoryName"
            class="flex items-center justify-between text-xs py-1"
          >
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ cat.categoryName }}</span>
            <span class="font-mono font-bold text-gray-900 dark:text-white">
              {{ formatMoney(cat.amount, household?.currency) }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- 4. Monthly Bills -->
      <UCard>
        <template #header>
          <h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-primary-500" />
            <span>4. Bills ({{ bills.length }})</span>
          </h2>
        </template>

        <div v-if="bills.length === 0" class="text-xs text-gray-500 text-center py-4">
          No bills for this month.
        </div>

        <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="b in bills"
            :key="b.id"
            class="py-2.5 flex items-center justify-between text-xs"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ b.name }}</p>
              <p class="text-[11px] text-gray-400">
                Due {{ b.due_date }} •
                <span :class="b.status === 'paid' ? 'text-green-600 font-semibold' : 'text-amber-600'">
                  {{ b.status.toUpperCase() }}
                </span>
                <span v-if="b.payer"> by {{ b.payer.display_name }}</span>
              </p>
            </div>
            <div class="font-mono font-bold text-gray-900 dark:text-white">
              {{ formatMoney(b.amount, household?.currency) }}
            </div>
          </li>
        </ul>
      </UCard>

      <!-- 5. Itemized Expenses -->
      <UCard>
        <template #header>
          <h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-heroicons-shopping-bag" class="w-4 h-4 text-primary-500" />
            <span>5. Itemized Expenses ({{ expenses.length }})</span>
          </h2>
        </template>

        <div v-if="expenses.length === 0" class="text-xs text-gray-500 text-center py-4">
          No expenses recorded for this month.
        </div>

        <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="e in expenses"
            :key="e.id"
            class="py-2.5 flex items-center justify-between text-xs"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ e.store_name }}</p>
              <p class="text-[11px] text-gray-400">
                {{ e.purchase_date }} • Paid by {{ e.payer?.display_name }} • {{ e.items.length }} items
              </p>
            </div>
            <div class="font-mono font-bold text-gray-900 dark:text-white">
              {{ formatMoney(e.total_amount, household?.currency) }}
            </div>
          </li>
        </ul>
      </UCard>

      <!-- 6. Settlement Suggestions -->
      <UCard>
        <template #header>
          <h2 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <UIcon name="i-heroicons-arrows-right-left" class="w-4 h-4 text-primary-500" />
            <span>6. Settlement Suggestions</span>
          </h2>
        </template>

        <div v-if="settlementSuggestions.length === 0" class="text-xs text-green-600 text-center py-4">
          All household balances are settled! No payments required.
        </div>

        <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="(s, idx) in settlementSuggestions"
            :key="idx"
            class="py-2.5 flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-1.5">
              <strong class="text-gray-900 dark:text-white">{{ s.from }}</strong>
              <span class="text-gray-400">pays</span>
              <strong class="text-gray-900 dark:text-white">{{ s.to }}</strong>
            </div>
            <div class="font-mono font-bold text-primary-600 dark:text-primary-400">
              {{ formatMoney(s.amount, household?.currency) }}
            </div>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>

