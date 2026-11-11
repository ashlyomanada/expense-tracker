<script setup lang="ts">
import type { HouseholdMember } from '~/composables/useHousehold'
import { calculateEqualSplit } from '~/utils/split'
import { formatMoney } from '~/utils/money'

const props = defineProps<{
  members: HouseholdMember[]
  selectedMemberIds: string[]
  itemTotal: number
  payerId?: string
  currency?: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedMemberIds', ids: string[]): void
}>()

const toast = useToast()

const shares = computed(() => {
  return calculateEqualSplit(props.itemTotal, props.selectedMemberIds, props.payerId)
})

const getShareForUser = (userId: string): number | null => {
  const share = shares.value.find((s) => s.userId === userId)
  return share ? share.shareAmount : null
}

const toggleMember = (userId: string) => {
  const isSelected = props.selectedMemberIds.includes(userId)
  if (isSelected) {
    if (props.selectedMemberIds.length <= 1) {
      toast.add({
        title: 'Selection required',
        description: 'At least one member must share this item.',
        color: 'amber',
      })
      return
    }
    emit('update:selectedMemberIds', props.selectedMemberIds.filter((id) => id !== userId))
  } else {
    emit('update:selectedMemberIds', [...props.selectedMemberIds, userId])
  }
}
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
        Split with:
        <span class="text-gray-900 dark:text-gray-200 font-semibold">
          {{ selectedMemberIds.length }} of {{ members.length }} members
        </span>
      </span>
      <span v-if="selectedMemberIds.length > 0 && itemTotal > 0" class="text-xs text-primary-600 dark:text-primary-400 font-medium">
        ~{{ formatMoney(itemTotal / selectedMemberIds.length, currency) }}/person
      </span>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="member in members"
        :key="member.id"
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer"
        :class="selectedMemberIds.includes(member.id)
          ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700 shadow-sm'
          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 opacity-60'"
        @click="toggleMember(member.id)"
      >
        <UIcon
          :name="selectedMemberIds.includes(member.id) ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-plus-circle'"
          class="w-3.5 h-3.5"
        />
        <span>{{ member.display_name }}</span>
        <span
          v-if="selectedMemberIds.includes(member.id) && getShareForUser(member.id) !== null"
          class="font-mono text-[10px] bg-primary-100 dark:bg-primary-900 px-1 py-0.2 rounded"
        >
          {{ formatMoney(getShareForUser(member.id)!, currency) }}
        </span>
      </button>
    </div>
  </div>
</template>
