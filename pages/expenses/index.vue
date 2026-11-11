<script setup lang="ts">
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const { household, fetchHousehold } = useHousehold()
const { expenses, loading, fetchExpenses } = useExpenses()

// Default month is current YYYY-MM
const currentMonthString = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const selectedMonth = ref(currentMonthString())
const searchQuery = ref('')

const loadData = async () => {
  await fetchHousehold()
  await fetchExpenses(selectedMonth.value, searchQuery.value)
}

onMounted(() => {
  loadData()
})

watch(selectedMonth, () => {
  fetchExpenses(selectedMonth.value, searchQuery.value)
})

let searchDebounce: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    fetchExpenses(selectedMonth.value, searchQuery.value)
  }, 300)
}

const monthOptions = computed(() => {
  const list = []
  const now = new Date()
  for (let i = -5; i <= 2; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    list.push({ label, value: val })
  }
  return list
})

const totalMonthSpent = computed(() => {
  return expenses.value.reduce((sum, e) => sum + e.total_amount, 0)
})

// Format date friendly: e.g. "Nov 10, 2026"
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-5 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Total for month:
          <span class="font-bold font-mono text-gray-900 dark:text-white">
            {{ formatMoney(totalMonthSpent, household?.currency) }}
          </span>
        </p>
      </div>

      <UButton
        to="/expenses/new"
        color="primary"
        icon="i-heroicons-plus"
        size="md"
      >
        Add Expense
      </UButton>
    </div>

    <!-- Filters: Month and Search -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <USelect
        v-model="selectedMonth"
        :options="monthOptions"
        option-attribute="label"
        value-attribute="value"
        icon="i-heroicons-calendar"
      />

      <UInput
        v-model="searchQuery"
        placeholder="Search store or item name..."
        icon="i-heroicons-magnifying-glass"
        @input="handleSearch"
      />
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && expenses.length === 0" class="space-y-3">
      <USkeleton class="h-20 w-full rounded-xl" />
      <USkeleton class="h-20 w-full rounded-xl" />
      <USkeleton class="h-20 w-full rounded-xl" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="expenses.length === 0"
      class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8"
    >
      <UIcon name="i-heroicons-receipt-refund" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <h3 class="font-medium text-gray-900 dark:text-white">No expenses found</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
        No recorded expenses for this filter. Tap "Add Expense" to log your groceries or receipts.
      </p>
      <UButton
        to="/expenses/new"
        color="primary"
        variant="soft"
        size="sm"
        class="mt-4"
        icon="i-heroicons-plus"
      >
        Add First Expense
      </UButton>
    </div>

    <!-- Expenses List -->
    <div v-else class="space-y-3">
      <NuxtLink
        v-for="expense in expenses"
        :key="expense.id"
        :to="`/expenses/${expense.id}`"
        class="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-xs"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-base text-gray-900 dark:text-white">{{ expense.store_name }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>{{ formatDate(expense.purchase_date) }}</span>
              <span>•</span>
              <span>Paid by <strong class="text-gray-700 dark:text-gray-300">{{ expense.payer?.display_name || 'Member' }}</strong></span>
            </div>
            <div class="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
              {{ expense.items.length }} {{ expense.items.length === 1 ? 'item' : 'items' }}:
              {{ expense.items.map(i => i.name).join(', ') }}
            </div>
          </div>

          <div class="text-right">
            <div class="font-mono font-bold text-base text-gray-900 dark:text-white">
              {{ formatMoney(expense.total_amount, household?.currency) }}
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 mt-1 inline-block" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
