<script setup lang="ts">
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const { household, profile, fetchHousehold } = useHousehold()
const { expenses, fetchExpenses } = useExpenses()
const { bills, fetchBills } = useBills()
const { balances, fetchBalances } = useBalances()

const loading = ref(true)

const currentMonthStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const loadDashboard = async () => {
  loading.value = true
  await fetchHousehold()
  const month = currentMonthStr()
  await Promise.all([
    fetchExpenses(month),
    fetchBills(month),
    fetchBalances(),
  ])
  loading.value = false
}

onMounted(() => {
  loadDashboard()
})

// Calculations for this month
const totalExpensesThisMonth = computed(() => {
  return expenses.value.reduce((sum, e) => sum + e.total_amount, 0)
})

const totalBillsThisMonth = computed(() => {
  return bills.value.reduce((sum, b) => sum + b.amount, 0)
})

const totalSpentThisMonth = computed(() => {
  return Math.round((totalExpensesThisMonth.value + totalBillsThisMonth.value) * 100) / 100
})

// Current user's net balance overall
const myBalance = computed(() => {
  if (!profile.value) return 0
  const myBal = balances.value.find((b) => b.user_id === profile.value!.id)
  return myBal ? myBal.net_balance : 0
})

// Current user's share for this month
const myShareThisMonth = computed(() => {
  if (!profile.value) return 0
  const uid = profile.value.id

  // Sum expense shares for current user this month
  const expShare = expenses.value.reduce((sum, e) => {
    const itemShares = e.items.flatMap((i) => i.shares || [])
    const userShares = itemShares.filter((s) => s.user_id === uid)
    return sum + userShares.reduce((sSum, s) => sSum + s.share_amount, 0)
  }, 0)

  // Sum bill shares for current user this month
  const billShare = bills.value.reduce((sum, b) => {
    const userShare = b.shares.find((s) => s.user_id === uid)
    return sum + (userShare ? userShare.share_amount : 0)
  }, 0)

  return Math.round((expShare + billShare) * 100) / 100
})

// 5 most recent expenses
const recentExpenses = computed(() => {
  return expenses.value.slice(0, 5)
})

// Overdue or upcoming unpaid bills
const urgentBills = computed(() => {
  return bills.value
    .filter((b) => b.status === 'unpaid')
    .slice(0, 4)
})

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto pb-8">
    <!-- Header Greeting -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Hello, {{ profile?.display_name || 'Housemate' }}! 👋
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ household?.name }} • Household overview
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          to="/expenses/new"
          color="primary"
          icon="i-heroicons-plus"
          size="sm"
        >
          Expense
        </UButton>
        <UButton
          to="/bills"
          variant="soft"
          color="primary"
          icon="i-heroicons-calendar-days"
          size="sm"
        >
          Bill
        </UButton>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <USkeleton class="h-28 rounded-xl" />
      <USkeleton class="h-28 rounded-xl" />
      <USkeleton class="h-28 rounded-xl col-span-2 sm:col-span-1" />
    </div>

    <!-- Key Metrics Cards -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <!-- Total Spent This Month -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 font-medium">This Month Spent</p>
          <UIcon name="i-heroicons-chart-pie" class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">
          {{ formatMoney(totalSpentThisMonth, household?.currency) }}
        </p>
        <p class="text-[11px] text-gray-400 mt-1">
          Expenses + Bills
        </p>
      </div>

      <!-- My Share This Month -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 font-medium">My Month Share</p>
          <UIcon name="i-heroicons-user" class="w-4 h-4 text-primary-500" />
        </div>
        <p class="text-xl font-bold font-mono text-primary-600 dark:text-primary-400 mt-1">
          {{ formatMoney(myShareThisMonth, household?.currency) }}
        </p>
        <p class="text-[11px] text-gray-400 mt-1">
          Your portion consumed
        </p>
      </div>

      <!-- Overall Net Balance -->
      <NuxtLink
        to="/balances"
        class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs col-span-2 sm:col-span-1 hover:border-primary-400 transition-colors"
      >
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 font-medium">My Net Balance</p>
          <UIcon name="i-heroicons-scale" class="w-4 h-4 text-gray-400" />
        </div>
        <p
          class="text-xl font-bold font-mono mt-1"
          :class="myBalance > 0.005
            ? 'text-green-600 dark:text-green-400'
            : myBalance < -0.005
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-900 dark:text-white'"
        >
          {{ formatMoney(Math.abs(myBalance), household?.currency) }}
        </p>
        <p class="text-[11px] mt-1 font-medium flex items-center gap-1"
          :class="myBalance > 0.005 ? 'text-green-600' : myBalance < -0.005 ? 'text-red-600' : 'text-gray-400'">
          <span>{{ myBalance > 0.005 ? 'You are owed' : myBalance < -0.005 ? 'You owe housemates' : 'All settled up' }}</span>
          <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
        </p>
      </NuxtLink>
    </div>

    <!-- Upcoming & Overdue Bills Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <UIcon name="i-heroicons-bell-alert" class="w-4 h-4 text-amber-500" />
          <span>Pending Bills</span>
        </h2>
        <NuxtLink to="/bills" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
          View all bills
        </NuxtLink>
      </div>

      <div v-if="urgentBills.length === 0" class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
        <UIcon name="i-heroicons-check-badge" class="w-8 h-8 text-green-500 mx-auto mb-1" />
        <p class="text-xs text-gray-500">All bills for this month are paid!</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="b in urgentBills"
          :key="b.id"
          class="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"
        >
          <div>
            <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ b.name }}</p>
            <p class="text-[11px] text-gray-500">Due {{ formatDate(b.due_date) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-sm text-gray-900 dark:text-white">
              {{ formatMoney(b.amount, household?.currency) }}
            </span>
            <UBadge
              :color="b.computed_status === 'overdue' ? 'red' : 'amber'"
              variant="subtle"
              size="xs"
            >
              {{ b.computed_status === 'overdue' ? 'Overdue' : 'Unpaid' }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Expenses Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <UIcon name="i-heroicons-shopping-bag" class="w-4 h-4 text-primary-500" />
          <span>Recent Expenses</span>
        </h2>
        <NuxtLink to="/expenses" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
          View all
        </NuxtLink>
      </div>

      <div v-if="recentExpenses.length === 0" class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
        <p class="text-xs text-gray-500">No expenses recorded yet.</p>
        <UButton to="/expenses/new" variant="soft" color="primary" size="xs" class="mt-2">
          Add Expense
        </UButton>
      </div>

      <div v-else class="space-y-2">
        <NuxtLink
          v-for="exp in recentExpenses"
          :key="exp.id"
          :to="`/expenses/${exp.id}`"
          class="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between hover:border-primary-400 transition-colors shadow-xs"
        >
          <div>
            <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ exp.store_name }}</p>
            <p class="text-[11px] text-gray-500">
              {{ formatDate(exp.purchase_date) }} • Paid by {{ exp.payer?.display_name }}
            </p>
          </div>
          <div class="text-right">
            <span class="font-mono font-bold text-sm text-gray-900 dark:text-white">
              {{ formatMoney(exp.total_amount, household?.currency) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
