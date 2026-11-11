<script setup lang="ts">
import type { BillDetail } from '~/composables/useBills'
import { formatMoney } from '~/utils/money'

const props = defineProps<{
  bill: BillDetail
  currency?: string
}>()

const emit = defineEmits<{
  (e: 'edit', bill: BillDetail): void
  (e: 'delete', bill: BillDetail): void
  (e: 'mark-paid', bill: BillDetail): void
  (e: 'unmark-paid', bill: BillDetail): void
}>()

const statusBadgeColor = computed(() => {
  switch (props.bill.computed_status) {
    case 'paid':
      return 'green'
    case 'overdue':
      return 'red'
    default:
      return 'amber'
  }
})

const statusLabel = computed(() => {
  switch (props.bill.computed_status) {
    case 'paid':
      return 'Paid'
    case 'overdue':
      return 'Overdue'
    default:
      return 'Unpaid'
  }
})

const formatDueDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
    <!-- Top row: Name, Category, Status badge -->
    <div class="flex items-start justify-between gap-2">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-bold text-base text-gray-900 dark:text-white">{{ bill.name }}</span>
          <UIcon
            v-if="bill.is_recurring"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 text-primary-500"
            title="Recurring monthly bill"
          />
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <UBadge v-if="bill.category" color="gray" variant="subtle" size="xs">
            {{ bill.category.name }}
          </UBadge>
          <span>Due {{ formatDueDate(bill.due_date) }}</span>
        </div>
      </div>

      <div class="text-right">
        <div class="font-mono font-bold text-lg text-gray-900 dark:text-white">
          {{ formatMoney(bill.amount, currency) }}
        </div>
        <UBadge
          :color="statusBadgeColor"
          variant="subtle"
          size="xs"
          class="mt-1"
        >
          {{ statusLabel }}
        </UBadge>
      </div>
    </div>

    <!-- Middle row: Per-person share & Paid info -->
    <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
      <div>
        <span class="text-gray-500">Each owes: </span>
        <strong class="font-mono text-primary-600 dark:text-primary-400">
          {{ formatMoney(bill.per_person_share, currency) }}
        </strong>
        <span class="text-gray-400"> ({{ bill.shares.length }} members)</span>
      </div>

      <div v-if="bill.status === 'paid'" class="text-gray-500 text-[11px]">
        Paid by <strong class="text-gray-800 dark:text-gray-200">{{ bill.payer?.display_name || 'Member' }}</strong>
      </div>
    </div>

    <!-- Action row -->
    <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5">
        <UButton
          v-if="bill.status === 'unpaid'"
          size="xs"
          color="primary"
          variant="soft"
          icon="i-heroicons-check"
          @click="emit('mark-paid', bill)"
        >
          Mark Paid
        </UButton>
        <UButton
          v-else
          size="xs"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-uturn-left"
          @click="emit('unmark-paid', bill)"
        >
          Unmark
        </UButton>
      </div>

      <div class="flex items-center gap-1">
        <UButton
          size="xs"
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil"
          @click="emit('edit', bill)"
        />
        <UButton
          size="xs"
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          @click="emit('delete', bill)"
        />
      </div>
    </div>
  </div>
</template>

