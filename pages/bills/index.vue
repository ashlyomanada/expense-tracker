<script setup lang="ts">
import type { BillDetail } from '~/composables/useBills'
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const { household, members, categories, profile, fetchHousehold } = useHousehold()
const {
  bills,
  loading,
  fetchBills,
  saveBill,
  deleteBill,
  copyLastMonthBills,
  markBillPaid,
  unmarkBillPaid,
} = useBills()
const toast = useToast()

const currentMonthString = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const selectedMonth = ref(currentMonthString())
const copyingBills = ref(false)

// Modals
const showFormModal = ref(false)
const isEditing = ref(false)
const savingBill = ref(false)

// Form fields
const billId = ref<string | undefined>(undefined)
const billName = ref('')
const billCategory = ref<string | undefined>(undefined)
const billAmount = ref<number>(0)
const billDueDate = ref('')
const billIsRecurring = ref(true)

// Mark Paid Modal
const showMarkPaidModal = ref(false)
const activeBill = ref<BillDetail | null>(null)
const paidBy = ref('')
const paidDate = ref(new Date().toISOString().split('T')[0])
const markingPaid = ref(false)

// Delete Confirm Modal
const showDeleteConfirm = ref(false)
const billToDelete = ref<BillDetail | null>(null)
const deleting = ref(false)

const loadData = async () => {
  await fetchHousehold()
  await fetchBills(selectedMonth.value)
}

onMounted(() => {
  loadData()
})

watch(selectedMonth, () => {
  fetchBills(selectedMonth.value)
})

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

const totalBillsAmount = computed(() => {
  return bills.value.reduce((sum, b) => sum + b.amount, 0)
})

const totalPaidAmount = computed(() => {
  return bills.value.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0)
})

const totalUnpaidAmount = computed(() => {
  return bills.value.filter((b) => b.status === 'unpaid').reduce((sum, b) => sum + b.amount, 0)
})

const openAddModal = () => {
  isEditing.value = false
  billId.value = undefined
  billName.value = ''
  billCategory.value = categories.value.find((c) => c.name.toLowerCase() === 'utilities')?.id || categories.value[0]?.id
  billAmount.value = 0
  billDueDate.value = `${selectedMonth.value}-15`
  billIsRecurring.value = true
  showFormModal.value = true
}

const openEditModal = (b: BillDetail) => {
  isEditing.value = true
  billId.value = b.id
  billName.value = b.name
  billCategory.value = b.category_id || undefined
  billAmount.value = b.amount
  billDueDate.value = b.due_date
  billIsRecurring.value = b.is_recurring
  showFormModal.value = true
}

const handleSaveBill = async () => {
  if (!billName.value.trim()) {
    toast.add({ title: 'Validation', description: 'Bill name is required.', color: 'red' })
    return
  }

  if (billAmount.value <= 0) {
    toast.add({ title: 'Validation', description: 'Bill amount must be greater than zero.', color: 'red' })
    return
  }

  if (!billDueDate.value) {
    toast.add({ title: 'Validation', description: 'Due date is required.', color: 'red' })
    return
  }

  savingBill.value = true
  try {
    await saveBill({
      id: billId.value,
      household_id: household.value!.id,
      name: billName.value.trim(),
      category_id: billCategory.value || null,
      amount: Number(billAmount.value),
      due_date: billDueDate.value,
      billing_month: `${selectedMonth.value}-01`,
      is_recurring: billIsRecurring.value,
    })

    toast.add({
      title: isEditing.value ? 'Bill Updated' : 'Bill Added',
      description: `${billName.value} saved and split equally among all members.`,
      color: 'green',
    })

    showFormModal.value = false
    await fetchBills(selectedMonth.value)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save bill'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    savingBill.value = false
  }
}

const handleCopyLastMonth = async () => {
  copyingBills.value = true
  try {
    const count = await copyLastMonthBills(selectedMonth.value)
    if (count > 0) {
      toast.add({
        title: 'Bills Copied',
        description: `Successfully copied ${count} recurring bills from last month as unpaid.`,
        color: 'green',
      })
    } else {
      toast.add({
        title: 'Nothing to copy',
        description: 'No new recurring bills from last month were found.',
        color: 'primary',
      })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to copy bills'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    copyingBills.value = false
  }
}

const openMarkPaidModal = (b: BillDetail) => {
  activeBill.value = b
  paidBy.value = profile.value?.id || members.value[0]?.id || ''
  paidDate.value = new Date().toISOString().split('T')[0]
  showMarkPaidModal.value = true
}

const handleConfirmMarkPaid = async () => {
  if (!activeBill.value || !paidBy.value) return
  markingPaid.value = true
  try {
    await markBillPaid(activeBill.value.id, paidBy.value, paidDate.value)
    toast.add({
      title: 'Marked as Paid',
      description: `${activeBill.value.name} marked as paid.`,
      color: 'green',
    })
    showMarkPaidModal.value = false
    await fetchBills(selectedMonth.value)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to mark bill as paid'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    markingPaid.value = false
  }
}

const handleUnmarkPaid = async (b: BillDetail) => {
  try {
    await unmarkBillPaid(b.id)
    toast.add({
      title: 'Unmarked',
      description: `${b.name} marked as unpaid.`,
      color: 'primary',
    })
    await fetchBills(selectedMonth.value)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to unmark bill'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  }
}

const openDeleteModal = (b: BillDetail) => {
  billToDelete.value = b
  showDeleteConfirm.value = true
}

const handleConfirmDelete = async () => {
  if (!billToDelete.value) return
  deleting.value = true
  try {
    await deleteBill(billToDelete.value.id)
    toast.add({
      title: 'Deleted',
      description: 'Bill removed.',
      color: 'green',
    })
    showDeleteConfirm.value = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete bill'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-5 max-w-2xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Household Bills</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Rent, utilities, internet & recurring split bills
        </p>
      </div>

      <UButton
        color="primary"
        icon="i-heroicons-plus"
        size="md"
        @click="openAddModal"
      >
        Add Bill
      </UButton>
    </div>

    <!-- Month Selector & Copy Recurring Button -->
    <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="w-full sm:w-64">
        <USelect
          v-model="selectedMonth"
          :options="monthOptions"
          option-attribute="label"
          value-attribute="value"
          icon="i-heroicons-calendar"
        />
      </div>

      <UButton
        variant="soft"
        color="gray"
        icon="i-heroicons-document-duplicate"
        size="sm"
        :loading="copyingBills"
        :disabled="copyingBills"
        @click="handleCopyLastMonth"
      >
        Copy Last Month's Bills
      </UButton>
    </div>

    <!-- Monthly Stats Summary -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
        <p class="text-[11px] text-gray-500 font-medium">Total Bills</p>
        <p class="font-mono font-bold text-base text-gray-900 dark:text-white mt-0.5">
          {{ formatMoney(totalBillsAmount, household?.currency) }}
        </p>
      </div>

      <div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
        <p class="text-[11px] text-green-600 dark:text-green-400 font-medium">Paid</p>
        <p class="font-mono font-bold text-base text-green-600 dark:text-green-400 mt-0.5">
          {{ formatMoney(totalPaidAmount, household?.currency) }}
        </p>
      </div>

      <div class="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
        <p class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Unpaid</p>
        <p class="font-mono font-bold text-base text-amber-600 dark:text-amber-400 mt-0.5">
          {{ formatMoney(totalUnpaidAmount, household?.currency) }}
        </p>
      </div>
    </div>

    <!-- Bills List -->
    <div v-if="loading && bills.length === 0" class="space-y-3">
      <USkeleton class="h-28 w-full rounded-xl" />
      <USkeleton class="h-28 w-full rounded-xl" />
    </div>

    <div
      v-else-if="bills.length === 0"
      class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8"
    >
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <h3 class="font-medium text-gray-900 dark:text-white">No bills for this month</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
        Add rent, power, or internet bills, or copy recurring bills from last month.
      </p>
      <div class="flex justify-center gap-2 mt-4">
        <UButton
          color="primary"
          size="sm"
          icon="i-heroicons-plus"
          @click="openAddModal"
        >
          Add Bill
        </UButton>
        <UButton
          variant="soft"
          color="gray"
          size="sm"
          icon="i-heroicons-document-duplicate"
          :loading="copyingBills"
          @click="handleCopyLastMonth"
        >
          Copy Last Month
        </UButton>
      </div>
    </div>

    <div v-else class="space-y-3">
      <BillCard
        v-for="bill in bills"
        :key="bill.id"
        :bill="bill"
        :currency="household?.currency"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @mark-paid="openMarkPaidModal"
        @unmark-paid="handleUnmarkPaid"
      />
    </div>

    <!-- Add/Edit Bill Modal -->
    <UModal v-model="showFormModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-500" />
            <h3 class="font-bold text-base">{{ isEditing ? 'Edit Bill' : 'Add Monthly Bill' }}</h3>
          </div>
        </template>

        <form @submit.prevent="handleSaveBill" class="space-y-4">
          <UFormGroup label="Bill Name" required help="e.g. Electricity, Water, Rent">
            <UInput
              v-model="billName"
              placeholder="e.g. Meralco Electricity"
              autofocus
              :disabled="savingBill"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Category">
              <USelect
                v-model="billCategory"
                :options="categories"
                option-attribute="name"
                value-attribute="id"
                placeholder="Select category"
                :disabled="savingBill"
              />
            </UFormGroup>

            <UFormGroup label="Total Amount" required>
              <UInput
                v-model.number="billAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                :disabled="savingBill"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Due Date" required>
            <UInput
              v-model="billDueDate"
              type="date"
              :disabled="savingBill"
            />
          </UFormGroup>

          <UFormGroup>
            <UCheckbox
              v-model="billIsRecurring"
              label="Recurring monthly bill"
              help="Allows cloning this bill into future months with one click"
              :disabled="savingBill"
            />
          </UFormGroup>

          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500">
            <p class="font-medium text-gray-700 dark:text-gray-300 mb-0.5">Split rule:</p>
            Always split equally among all current household members ({{ members.length }} members).
            <span v-if="billAmount > 0" class="block font-semibold text-primary-600 dark:text-primary-400 mt-1 font-mono">
              ~{{ formatMoney(billAmount / (members.length || 1), household?.currency) }} per person
            </span>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              type="button"
              variant="ghost"
              color="gray"
              :disabled="savingBill"
              @click="showFormModal = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="savingBill"
              :disabled="savingBill"
            >
              {{ isEditing ? 'Save Changes' : 'Create Bill' }}
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Mark Paid Modal -->
    <UModal v-model="showMarkPaidModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
            <h3 class="font-bold text-base">Record Bill Payment</h3>
          </div>
        </template>

        <form @submit.prevent="handleConfirmMarkPaid" class="space-y-4">
          <div>
            <p class="text-xs text-gray-500">Bill</p>
            <p class="font-bold text-base text-gray-900 dark:text-white">{{ activeBill?.name }}</p>
            <p class="font-mono text-sm text-primary-600 dark:text-primary-400 mt-0.5">
              {{ formatMoney(activeBill?.amount || 0, household?.currency) }}
            </p>
          </div>

          <UFormGroup label="Who paid this bill?" required>
            <USelect
              v-model="paidBy"
              :options="members"
              option-attribute="display_name"
              value-attribute="id"
              :disabled="markingPaid"
            />
          </UFormGroup>

          <UFormGroup label="Date Paid" required>
            <UInput
              v-model="paidDate"
              type="date"
              :disabled="markingPaid"
            />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              type="button"
              variant="ghost"
              color="gray"
              :disabled="markingPaid"
              @click="showMarkPaidModal = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="markingPaid"
              :disabled="markingPaid || !paidBy"
            >
              Confirm Paid
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Delete Confirm Modal -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            <h3 class="font-bold">Delete Bill</h3>
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>{{ billToDelete?.name }}</strong>?
          All shares for this bill will be removed.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              color="gray"
              :disabled="deleting"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              icon="i-heroicons-trash"
              :loading="deleting"
              :disabled="deleting"
              @click="handleConfirmDelete"
            >
              Delete Bill
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

