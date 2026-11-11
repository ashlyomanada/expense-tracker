<script setup lang="ts">
import type { EditableItem } from '~/components/ExpenseItemRow.vue'
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const { household, profile, members, categories, fetchHousehold } = useHousehold()
const { saveExpense } = useExpenses()
const toast = useToast()

const storeName = ref('')
const purchaseDate = ref(new Date().toISOString().split('T')[0])
const paidBy = ref('')
const notes = ref('')
const saving = ref(false)

const items = ref<EditableItem[]>([])

onMounted(async () => {
  await fetchHousehold()
  if (profile.value) {
    paidBy.value = profile.value.id
  }
  // Initialize with 1 empty item
  if (items.value.length === 0) {
    addItem()
  }
})

const allMemberIds = computed(() => members.value.map((m) => m.id))

const addItem = () => {
  const defaultCategory = categories.value.find((c) => c.name.toLowerCase() === 'groceries') || categories.value[0]
  items.value.push({
    name: '',
    quantity: 1,
    unit_price: 0,
    category_id: defaultCategory?.id || undefined,
    selected_member_ids: [...allMemberIds.value],
  })
}

// Ensure items have members once loaded
watch(allMemberIds, (ids) => {
  if (ids.length > 0) {
    items.value.forEach((item) => {
      if (item.selected_member_ids.length === 0) {
        item.selected_member_ids = [...ids]
      }
    })
  }
}, { immediate: true })

const removeItem = (index: number) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

// "Apply to all items" shortcut
const applyFirstItemSplitToAll = () => {
  if (items.value.length === 0) return
  const firstItemSelection = [...items.value[0].selected_member_ids]
  items.value.forEach((it) => {
    it.selected_member_ids = [...firstItemSelection]
  })
  toast.add({
    title: 'Applied',
    description: `Applied item #1 split to all ${items.value.length} items.`,
    color: 'primary',
  })
}

const selectAllMembersForAllItems = () => {
  items.value.forEach((it) => {
    it.selected_member_ids = [...allMemberIds.value]
  })
  toast.add({
    title: 'Reset to All',
    description: 'All members selected for all items.',
    color: 'primary',
  })
}

const grandTotal = computed(() => {
  return items.value.reduce((sum, it) => {
    const qty = Number(it.quantity) || 1
    const price = Number(it.unit_price) || 0
    return sum + (qty * price)
  }, 0)
})

const handleSave = async () => {
  if (!storeName.value.trim()) {
    toast.add({ title: 'Validation', description: 'Store name is required.', color: 'red' })
    return
  }

  if (!paidBy.value) {
    toast.add({ title: 'Validation', description: 'Please select who paid.', color: 'red' })
    return
  }

  // Validate items
  for (let i = 0; i < items.value.length; i++) {
    const it = items.value[i]
    if (!it.name.trim()) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} needs a name.`, color: 'red' })
      return
    }
    if (it.unit_price <= 0) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} (${it.name}) must have a price > 0.`, color: 'red' })
      return
    }
    if (it.selected_member_ids.length === 0) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} (${it.name}) has no members selected.`, color: 'red' })
      return
    }
  }

  saving.value = true
  try {
    const payloadExpense = {
      household_id: household.value!.id,
      store_name: storeName.value.trim(),
      purchase_date: purchaseDate.value,
      paid_by: paidBy.value,
      notes: notes.value.trim() || null,
    }

    const payloadItems = items.value.map((it) => {
      const qty = Number(it.quantity) || 1
      const unit = Number(it.unit_price) || 0
      const total = Math.round(qty * unit * 100) / 100
      return {
        name: it.name.trim(),
        quantity: qty,
        unit_price: unit,
        total_price: total,
        category_id: it.category_id || null,
        selected_member_ids: it.selected_member_ids,
      }
    })

    const newExpenseId = await saveExpense(payloadExpense, payloadItems)

    toast.add({
      title: 'Expense Saved',
      description: `Added ${storeName.value} with ${items.value.length} items.`,
      color: 'green',
    })

    await navigateTo(`/expenses/${newExpenseId}`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save expense'
    toast.add({
      title: 'Error saving expense',
      description: msg,
      color: 'red',
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto pb-12">
    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton
          to="/expenses"
          variant="ghost"
          color="gray"
          icon="i-heroicons-arrow-left"
          size="sm"
        />
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h1>
      </div>
      <div class="font-mono font-bold text-lg text-primary-600 dark:text-primary-400">
        {{ formatMoney(grandTotal, household?.currency) }}
      </div>
    </div>

    <!-- Expense Details Form -->
    <UCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormGroup label="Store / Merchant" required>
          <UInput
            v-model="storeName"
            placeholder="e.g. SM Supermarket, Puregold"
            icon="i-heroicons-building-storefront"
            autofocus
            :disabled="saving"
          />
        </UFormGroup>

        <UFormGroup label="Purchase Date" required>
          <UInput
            v-model="purchaseDate"
            type="date"
            icon="i-heroicons-calendar"
            :disabled="saving"
          />
        </UFormGroup>

        <UFormGroup label="Paid By" required>
          <USelect
            v-model="paidBy"
            :options="members"
            option-attribute="display_name"
            value-attribute="id"
            icon="i-heroicons-credit-card"
            :disabled="saving"
          />
        </UFormGroup>

        <UFormGroup label="Notes (optional)">
          <UInput
            v-model="notes"
            placeholder="e.g. Weekend grocery run"
            icon="i-heroicons-pencil-square"
            :disabled="saving"
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Expense Items Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Items ({{ items.length }})</span>
        </h2>

        <!-- Split Shortcuts -->
        <div class="flex items-center gap-1.5">
          <UButton
            v-if="items.length > 1"
            type="button"
            variant="soft"
            color="gray"
            size="2xs"
            icon="i-heroicons-arrows-pointing-out"
            @click="applyFirstItemSplitToAll"
          >
            Apply Item 1 Split to All
          </UButton>
          <UButton
            type="button"
            variant="soft"
            color="gray"
            size="2xs"
            icon="i-heroicons-users"
            @click="selectAllMembersForAllItems"
          >
            Select All
          </UButton>
        </div>
      </div>

      <!-- Item Rows -->
      <div class="space-y-3">
        <ExpenseItemRow
          v-for="(item, idx) in items"
          :key="idx"
          :item="item"
          :index="idx"
          :members="members"
          :categories="categories"
          :payer-id="paidBy"
          :currency="household?.currency"
          :can-remove="items.length > 1"
          @remove="removeItem(idx)"
        />
      </div>

      <!-- Add Item Button -->
      <UButton
        type="button"
        variant="outline"
        color="primary"
        block
        icon="i-heroicons-plus"
        size="md"
        class="mt-2 border-dashed"
        @click="addItem"
      >
        Add Another Item
      </UButton>
    </div>

    <!-- Bottom Action Bar / Summary -->
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <p class="text-xs text-gray-500">Grand Total</p>
        <p class="text-xl font-bold font-mono text-gray-900 dark:text-white">
          {{ formatMoney(grandTotal, household?.currency) }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          to="/expenses"
          variant="ghost"
          color="gray"
          :disabled="saving"
        >
          Cancel
        </UButton>
        <UButton
          type="button"
          color="primary"
          icon="i-heroicons-check"
          :loading="saving"
          :disabled="saving"
          size="md"
          @click="handleSave"
        >
          Save Expense
        </UButton>
      </div>
    </div>
  </div>
</template>
