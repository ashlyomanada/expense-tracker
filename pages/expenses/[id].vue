<script setup lang="ts">
import type { EditableItem } from '~/components/ExpenseItemRow.vue'
import type { ExpenseDetail } from '~/composables/useExpenses'
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const expenseId = route.params.id as string

const { household, members, categories, fetchHousehold } = useHousehold()
const { fetchExpense, saveExpense, deleteExpense } = useExpenses()
const toast = useToast()

const expense = ref<ExpenseDetail | null>(null)
const loading = ref(true)
const isEditing = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const saving = ref(false)

// Edit state
const editStoreName = ref('')
const editPurchaseDate = ref('')
const editPaidBy = ref('')
const editNotes = ref('')
const editItems = ref<EditableItem[]>([])

const loadData = async () => {
  loading.value = true
  await fetchHousehold()
  const data = await fetchExpense(expenseId)
  expense.value = data
  if (data) {
    initEditForm(data)
  }
  loading.value = false
}

const initEditForm = (data: ExpenseDetail) => {
  editStoreName.value = data.store_name
  editPurchaseDate.value = data.purchase_date
  editPaidBy.value = data.paid_by
  editNotes.value = data.notes || ''
  editItems.value = data.items.map((it) => ({
    id: it.id,
    name: it.name,
    quantity: it.quantity,
    unit_price: it.unit_price,
    category_id: it.category_id || undefined,
    selected_member_ids: [...it.selected_member_ids],
  }))
}

onMounted(() => {
  loadData()
})

const addEditItem = () => {
  const allIds = members.value.map((m) => m.id)
  const defaultCategory = categories.value[0]
  editItems.value.push({
    name: '',
    quantity: 1,
    unit_price: 0,
    category_id: defaultCategory?.id || undefined,
    selected_member_ids: [...allIds],
  })
}

const removeEditItem = (index: number) => {
  if (editItems.value.length > 1) {
    editItems.value.splice(index, 1)
  }
}

const editGrandTotal = computed(() => {
  return editItems.value.reduce((sum, it) => {
    const qty = Number(it.quantity) || 1
    const price = Number(it.unit_price) || 0
    return sum + (qty * price)
  }, 0)
})

const handleUpdate = async () => {
  if (!editStoreName.value.trim()) {
    toast.add({ title: 'Validation', description: 'Store name is required.', color: 'red' })
    return
  }

  for (let i = 0; i < editItems.value.length; i++) {
    const it = editItems.value[i]
    if (!it.name.trim()) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} needs a name.`, color: 'red' })
      return
    }
    if (it.unit_price <= 0) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} must have a price > 0.`, color: 'red' })
      return
    }
    if (it.selected_member_ids.length === 0) {
      toast.add({ title: 'Validation', description: `Item #${i + 1} has no members selected.`, color: 'red' })
      return
    }
  }

  saving.value = true
  try {
    const payloadExpense = {
      id: expenseId,
      household_id: household.value!.id,
      store_name: editStoreName.value.trim(),
      purchase_date: editPurchaseDate.value,
      paid_by: editPaidBy.value,
      notes: editNotes.value.trim() || null,
    }

    const payloadItems = editItems.value.map((it) => {
      const qty = Number(it.quantity) || 1
      const unit = Number(it.unit_price) || 0
      return {
        name: it.name.trim(),
        quantity: qty,
        unit_price: unit,
        total_price: Math.round(qty * unit * 100) / 100,
        category_id: it.category_id || null,
        selected_member_ids: it.selected_member_ids,
      }
    })

    await saveExpense(payloadExpense, payloadItems)
    toast.add({
      title: 'Updated',
      description: 'Expense updated and shares recalculated.',
      color: 'green',
    })

    isEditing.value = false
    await loadData()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update expense'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await deleteExpense(expenseId)
    toast.add({
      title: 'Deleted',
      description: 'Expense deleted successfully.',
      color: 'green',
    })
    await navigateTo('/expenses')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete expense'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

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
  <div class="space-y-6 max-w-2xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton
          to="/expenses"
          variant="ghost"
          color="gray"
          icon="i-heroicons-arrow-left"
          size="sm"
        />
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Expense' : (expense?.store_name || 'Expense Details') }}
        </h1>
      </div>

      <div v-if="!loading && expense && !isEditing" class="flex items-center gap-2">
        <UButton
          variant="soft"
          color="gray"
          icon="i-heroicons-pencil"
          size="sm"
          @click="isEditing = true"
        >
          Edit
        </UButton>
        <UButton
          variant="ghost"
          color="red"
          icon="i-heroicons-trash"
          size="sm"
          @click="showDeleteConfirm = true"
        />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-28 w-full rounded-xl" />
      <USkeleton class="h-40 w-full rounded-xl" />
    </div>

    <!-- Error/Not Found -->
    <div v-else-if="!expense" class="text-center py-12">
      <p class="text-gray-500">Expense not found.</p>
      <UButton to="/expenses" variant="soft" color="primary" class="mt-4">Back to Expenses</UButton>
    </div>

    <!-- VIEW MODE -->
    <div v-else-if="!isEditing" class="space-y-5">
      <!-- Main Info Card -->
      <UCard>
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ expense.store_name }}</h2>
            <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>{{ formatDate(expense.purchase_date) }}</span>
              <span>•</span>
              <span>Paid by <strong class="text-gray-800 dark:text-gray-200">{{ expense.payer?.display_name }}</strong></span>
            </div>
            <p v-if="expense.notes" class="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              {{ expense.notes }}
            </p>
          </div>

          <div class="text-right">
            <span class="text-xs text-gray-400">Total</span>
            <div class="font-mono font-bold text-2xl text-primary-600 dark:text-primary-400">
              {{ formatMoney(expense.total_amount, household?.currency) }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Items & Per-Person Shares Breakdown -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Items ({{ expense.items.length }})
        </h3>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in expense.items"
            :key="item.id || idx"
            class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs"
          >
            <!-- Item header -->
            <div class="flex items-start justify-between">
              <div>
                <p class="font-semibold text-base text-gray-900 dark:text-white">{{ item.name }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <UBadge v-if="item.category" color="gray" variant="subtle" size="xs">
                    {{ item.category.name }}
                  </UBadge>
                  <span>{{ item.quantity }} × {{ formatMoney(item.unit_price, household?.currency) }}</span>
                </div>
              </div>

              <div class="font-mono font-bold text-base text-gray-900 dark:text-white">
                {{ formatMoney(item.total_price, household?.currency) }}
              </div>
            </div>

            <!-- Shares list -->
            <div class="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p class="text-[11px] font-medium text-gray-400 mb-1.5">Split shares:</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="share in item.shares"
                  :key="share.id"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <span class="text-gray-700 dark:text-gray-300">{{ share.profile?.display_name || 'Member' }}:</span>
                  <strong class="font-mono text-primary-600 dark:text-primary-400">
                    {{ formatMoney(share.share_amount, household?.currency) }}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODE -->
    <div v-else class="space-y-5">
      <UCard>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormGroup label="Store / Merchant" required>
            <UInput v-model="editStoreName" :disabled="saving" />
          </UFormGroup>

          <UFormGroup label="Purchase Date" required>
            <UInput v-model="editPurchaseDate" type="date" :disabled="saving" />
          </UFormGroup>

          <UFormGroup label="Paid By" required>
            <USelect
              v-model="editPaidBy"
              :options="members"
              option-attribute="display_name"
              value-attribute="id"
              :disabled="saving"
            />
          </UFormGroup>

          <UFormGroup label="Notes (optional)">
            <UInput v-model="editNotes" :disabled="saving" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Edit Items -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Items</h3>

        <div class="space-y-3">
          <ExpenseItemRow
            v-for="(item, idx) in editItems"
            :key="idx"
            :item="item"
            :index="idx"
            :members="members"
            :categories="categories"
            :payer-id="editPaidBy"
            :currency="household?.currency"
            :can-remove="editItems.length > 1"
            @remove="removeEditItem(idx)"
          />
        </div>

        <UButton
          type="button"
          variant="outline"
          color="primary"
          block
          icon="i-heroicons-plus"
          size="md"
          class="border-dashed"
          @click="addEditItem"
        >
          Add Another Item
        </UButton>
      </div>

      <!-- Action buttons -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500">Updated Total</p>
          <p class="text-xl font-bold font-mono text-gray-900 dark:text-white">
            {{ formatMoney(editGrandTotal, household?.currency) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            color="gray"
            :disabled="saving"
            @click="isEditing = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-check"
            :loading="saving"
            :disabled="saving"
            @click="handleUpdate"
          >
            Save Changes
          </UButton>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            <h3 class="font-bold">Delete Expense</h3>
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>{{ expense?.store_name }}</strong>?
          All associated items and shares will be permanently removed.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              color="gray"
              :disabled="isDeleting"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              icon="i-heroicons-trash"
              :loading="isDeleting"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              Delete Expense
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
