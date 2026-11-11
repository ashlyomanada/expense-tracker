<script setup lang="ts">
import type { PairwiseDebt } from '~/composables/useBalances'
import { formatMoney } from '~/utils/money'

definePageMeta({
  layout: 'default',
})

const { household, members, profile, fetchHousehold } = useHousehold()
const {
  balances,
  debts,
  settlements,
  loading,
  fetchBalances,
  fetchDebts,
  fetchSettlements,
  recordSettlement,
  deleteSettlement,
} = useBalances()
const toast = useToast()

const showSettleModal = ref(false)
const fromUser = ref('')
const toUser = ref('')
const settleAmount = ref<number>(0)
const settleNote = ref('')
const savingSettlement = ref(false)

const showDeleteConfirm = ref(false)
const settlementToDelete = ref<string | null>(null)
const deleting = ref(false)

const loadData = async () => {
  await fetchHousehold()
  await Promise.all([
    fetchBalances(),
    fetchDebts(),
    fetchSettlements(),
  ])
}

onMounted(() => {
  loadData()
})

const openSettleModal = (debt?: PairwiseDebt) => {
  if (debt) {
    fromUser.value = debt.debtor_id
    toUser.value = debt.creditor_id
    settleAmount.value = debt.amount
    settleNote.value = `Payment to ${debt.creditor_name}`
  } else {
    fromUser.value = profile.value?.id || members.value[0]?.id || ''
    // Default toUser to someone other than fromUser
    const otherMember = members.value.find((m) => m.id !== fromUser.value)
    toUser.value = otherMember?.id || ''
    settleAmount.value = 0
    settleNote.value = ''
  }
  showSettleModal.value = true
}

const handleRecordSettlement = async () => {
  if (!fromUser.value || !toUser.value) {
    toast.add({ title: 'Validation', description: 'Please select both members.', color: 'red' })
    return
  }

  if (fromUser.value === toUser.value) {
    toast.add({ title: 'Validation', description: 'Payer and recipient cannot be the same member.', color: 'red' })
    return
  }

  if (settleAmount.value <= 0) {
    toast.add({ title: 'Validation', description: 'Amount must be greater than zero.', color: 'red' })
    return
  }

  savingSettlement.value = true
  try {
    await recordSettlement(fromUser.value, toUser.value, Number(settleAmount.value), settleNote.value)
    toast.add({
      title: 'Settled Up!',
      description: 'Settlement payment recorded successfully.',
      color: 'green',
    })
    showSettleModal.value = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to record settlement'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    savingSettlement.value = false
  }
}

const confirmDeleteSettlement = (id: string) => {
  settlementToDelete.value = id
  showDeleteConfirm.value = true
}

const handleDeleteSettlement = async () => {
  if (!settlementToDelete.value) return
  deleting.value = true
  try {
    await deleteSettlement(settlementToDelete.value)
    toast.add({
      title: 'Deleted',
      description: 'Settlement record removed.',
      color: 'green',
    })
    showDeleteConfirm.value = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete settlement'
    toast.add({ title: 'Error', description: msg, color: 'red' })
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Balances & Debts</h1>
        <p class="text-xs text-gray-500 mt-0.5">Who owes whom across household expenses and bills</p>
      </div>

      <UButton
        color="primary"
        icon="i-heroicons-banknotes"
        size="md"
        @click="openSettleModal()"
      >
        Settle Up
      </UButton>
    </div>

    <!-- Simplified "Who Owes Whom" Section -->
    <div class="space-y-3">
      <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
        <UIcon name="i-heroicons-arrows-right-left" class="w-4 h-4 text-primary-500" />
        <span>Who Owes Whom (Simplified Debts)</span>
      </h2>

      <div v-if="loading && debts.length === 0" class="space-y-2">
        <USkeleton class="h-16 w-full rounded-xl" />
        <USkeleton class="h-16 w-full rounded-xl" />
      </div>

      <div
        v-else-if="debts.length === 0"
        class="p-6 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center"
      >
        <UIcon name="i-heroicons-check-circle" class="w-10 h-10 text-green-500 mx-auto mb-2" />
        <h3 class="font-semibold text-gray-900 dark:text-white text-base">Everyone is settled up!</h3>
        <p class="text-xs text-gray-500 mt-1">There are no outstanding debts between household members.</p>
      </div>

      <div v-else class="space-y-2.5">
        <div
          v-for="(debt, idx) in debts"
          :key="idx"
          class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"
        >
          <div class="flex items-center gap-3">
            <div class="space-y-0.5">
              <div class="flex items-center gap-1.5 text-sm">
                <span class="font-bold text-gray-900 dark:text-white">{{ debt.debtor_name }}</span>
                <span class="text-gray-400">owes</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ debt.creditor_name }}</span>
              </div>
              <p class="text-xs text-gray-400">Direct transfer suggestion</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-base text-primary-600 dark:text-primary-400">
              {{ formatMoney(debt.amount, household?.currency) }}
            </span>
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              icon="i-heroicons-check"
              @click="openSettleModal(debt)"
            >
              Settle
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Member Net Balances Table / Cards -->
    <div class="space-y-3">
      <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
        <UIcon name="i-heroicons-users" class="w-4 h-4 text-primary-500" />
        <span>Net Balances per Member</span>
      </h2>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-xs overflow-hidden">
        <div
          v-for="m in balances"
          :key="m.user_id"
          class="p-3.5 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="m.display_name"
              size="sm"
              class="bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold"
            />
            <div>
              <p class="font-medium text-sm text-gray-900 dark:text-white">
                {{ m.display_name }}
                <span v-if="m.user_id === profile?.id" class="text-xs text-primary-600 font-normal">(You)</span>
              </p>
              <p class="text-[11px] text-gray-400">
                Paid: {{ formatMoney(m.total_paid, household?.currency) }} • Consumed: {{ formatMoney(m.total_owed, household?.currency) }}
              </p>
            </div>
          </div>

          <div class="text-right">
            <p
              class="font-mono font-bold text-sm"
              :class="m.net_balance > 0.005
                ? 'text-green-600 dark:text-green-400'
                : m.net_balance < -0.005
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500'"
            >
              {{ m.net_balance > 0.005 ? '+' : '' }}{{ formatMoney(m.net_balance, household?.currency) }}
            </p>
            <span class="text-[10px] text-gray-400 uppercase font-medium">
              {{ m.net_balance > 0.005 ? 'is owed' : m.net_balance < -0.005 ? 'owes' : 'settled' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Settlement History Section -->
    <div class="space-y-3">
      <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
        <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
        <span>Settlement History</span>
      </h2>

      <div
        v-if="settlements.length === 0"
        class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500"
      >
        No settlements recorded yet.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="s in settlements"
          :key="s.id"
          class="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-xs"
        >
          <div>
            <div class="flex items-center gap-1.5 text-xs text-gray-900 dark:text-white">
              <strong>{{ s.from_profile?.display_name || 'Member' }}</strong>
              <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-400" />
              <strong>{{ s.to_profile?.display_name || 'Member' }}</strong>
            </div>
            <p v-if="s.note" class="text-[11px] text-gray-500 mt-0.5">{{ s.note }}</p>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ formatDate(s.settled_at) }}</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-sm text-green-600 dark:text-green-400">
              {{ formatMoney(s.amount, household?.currency) }}
            </span>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              size="2xs"
              @click="confirmDeleteSettlement(s.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Settle Up Modal -->
    <UModal v-model="showSettleModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-banknotes" class="w-5 h-5" />
            <h3 class="font-bold text-base">Record a Settlement</h3>
          </div>
        </template>

        <form @submit.prevent="handleRecordSettlement" class="space-y-4">
          <UFormGroup label="Payer (Who sent money?)" required>
            <USelect
              v-model="fromUser"
              :options="members"
              option-attribute="display_name"
              value-attribute="id"
              :disabled="savingSettlement"
            />
          </UFormGroup>

          <UFormGroup label="Recipient (Who received money?)" required>
            <USelect
              v-model="toUser"
              :options="members"
              option-attribute="display_name"
              value-attribute="id"
              :disabled="savingSettlement"
            />
          </UFormGroup>

          <UFormGroup label="Amount Paid" required>
            <UInput
              v-model.number="settleAmount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              icon="i-heroicons-currency-dollar"
              :disabled="savingSettlement"
            />
          </UFormGroup>

          <UFormGroup label="Note (optional)">
            <UInput
              v-model="settleNote"
              placeholder="e.g. Paid via GCash / Bank Transfer"
              icon="i-heroicons-pencil-square"
              :disabled="savingSettlement"
            />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              type="button"
              variant="ghost"
              color="gray"
              :disabled="savingSettlement"
              @click="showSettleModal = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="savingSettlement"
              :disabled="savingSettlement || settleAmount <= 0"
            >
              Record Payment
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <!-- Delete Settlement Confirm Modal -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-red-600">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            <h3 class="font-bold">Delete Settlement Record</h3>
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this settlement? The net balances between the two members will be restored.
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
              @click="handleDeleteSettlement"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

