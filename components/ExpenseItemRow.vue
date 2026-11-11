<script setup lang="ts">
import type { HouseholdMember, HouseholdCategory } from '~/composables/useHousehold'
import { formatMoney } from '~/utils/money'

export interface EditableItem {
  id?: string
  name: string
  quantity: number
  unit_price: number
  category_id?: string
  selected_member_ids: string[]
}

const props = defineProps<{
  item: EditableItem
  index: number
  members: HouseholdMember[]
  categories: HouseholdCategory[]
  payerId: string
  currency?: string
  canRemove: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()

const lineTotal = computed(() => {
  const qty = Number(props.item.quantity) || 1
  const price = Number(props.item.unit_price) || 0
  return Math.round(qty * price * 100) / 100
})
</script>

<template>
  <div class="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs">
    <!-- Top row: Item name, Category, and Remove -->
    <div class="flex items-start gap-2">
      <div class="flex-1">
        <UInput
          v-model="item.name"
          placeholder="Item name (e.g. Eggs, Laundry Soap)"
          size="sm"
          icon="i-heroicons-tag"
          required
        />
      </div>

      <div class="w-36">
        <USelect
          v-model="item.category_id"
          :options="categories"
          option-attribute="name"
          value-attribute="id"
          placeholder="Category"
          size="sm"
        />
      </div>

      <UButton
        v-if="canRemove"
        type="button"
        color="red"
        variant="ghost"
        icon="i-heroicons-trash"
        size="xs"
        class="mt-0.5"
        @click="emit('remove')"
      />
    </div>

    <!-- Middle row: Quantity, Unit Price, and Line Total -->
    <div class="grid grid-cols-12 gap-2 items-center">
      <div class="col-span-3">
        <div class="text-[11px] text-gray-500 mb-0.5">Qty</div>
        <UInput
          v-model.number="item.quantity"
          type="number"
          min="1"
          step="1"
          size="sm"
        />
      </div>

      <div class="col-span-5">
        <div class="text-[11px] text-gray-500 mb-0.5">Unit Price</div>
        <UInput
          v-model.number="item.unit_price"
          type="number"
          min="0"
          step="0.01"
          size="sm"
          placeholder="0.00"
        />
      </div>

      <div class="col-span-4 text-right">
        <div class="text-[11px] text-gray-500 mb-0.5">Line Total</div>
        <div class="font-mono font-semibold text-sm text-gray-900 dark:text-white">
          {{ formatMoney(lineTotal, currency) }}
        </div>
      </div>
    </div>

    <!-- Bottom: Member split chips -->
    <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60">
      <MemberChips
        :members="members"
        v-model:selected-member-ids="item.selected_member_ids"
        :item-total="lineTotal"
        :payer-id="payerId"
        :currency="currency"
      />
    </div>
  </div>
</template>
