<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()
const {
  household,
  profile,
  members,
  loading,
  fetchHousehold,
  renameHousehold,
  updateProfileName,
} = useHousehold()
const toast = useToast()

const editingHouseholdName = ref(false)
const newHouseholdName = ref('')
const savingHouseholdName = ref(false)

const editingProfileName = ref(false)
const newProfileName = ref('')
const savingProfileName = ref(false)

const copied = ref(false)

onMounted(async () => {
  await fetchHousehold()
  if (household.value) {
    newHouseholdName.value = household.value.name
  }
  if (profile.value) {
    newProfileName.value = profile.value.display_name
  }
})

watch(household, (h) => {
  if (h && !editingHouseholdName.value) {
    newHouseholdName.value = h.name
  }
})

watch(profile, (p) => {
  if (p && !editingProfileName.value) {
    newProfileName.value = p.display_name
  }
})

const isOwner = computed(() => {
  return household.value && profile.value && household.value.owner_id === profile.value.id
})

const copyInviteCode = async () => {
  if (!household.value?.invite_code) return
  try {
    await navigator.clipboard.writeText(household.value.invite_code)
    copied.value = true
    toast.add({
      title: 'Copied!',
      description: `Invite code ${household.value.invite_code} copied to clipboard.`,
      color: 'green',
    })
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    toast.add({
      title: 'Copy failed',
      description: 'Could not copy to clipboard.',
      color: 'red',
    })
  }
}

const handleSaveHouseholdName = async () => {
  if (!newHouseholdName.value.trim() || !household.value) return
  savingHouseholdName.value = true
  try {
    await renameHousehold(newHouseholdName.value.trim())
    editingHouseholdName.value = false
    toast.add({
      title: 'Updated',
      description: 'Household name updated successfully.',
      color: 'green',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update household name'
    toast.add({
      title: 'Error',
      description: msg,
      color: 'red',
    })
  } finally {
    savingHouseholdName.value = false
  }
}

const handleSaveProfileName = async () => {
  if (!newProfileName.value.trim()) return
  savingProfileName.value = true
  try {
    await updateProfileName(newProfileName.value.trim())
    editingProfileName.value = false
    toast.add({
      title: 'Updated',
      description: 'Your display name has been updated.',
      color: 'green',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update display name'
    toast.add({
      title: 'Error',
      description: msg,
      color: 'red',
    })
  } finally {
    savingProfileName.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  toast.add({
    title: 'Signed out',
    description: 'You have been signed out.',
  })
  await navigateTo('/login')
}
</script>

<template>
  <div class="space-y-6 max-w-xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <UButton
        color="red"
        variant="ghost"
        icon="i-heroicons-arrow-right-on-rectangle"
        size="sm"
        @click="handleLogout"
      >
        Sign Out
      </UButton>
    </div>

    <!-- User Profile Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Your Profile</h2>
          </div>
          <UButton
            v-if="!editingProfileName"
            variant="ghost"
            color="gray"
            size="xs"
            icon="i-heroicons-pencil"
            @click="editingProfileName = true"
          >
            Edit
          </UButton>
        </div>
      </template>

      <div v-if="!editingProfileName" class="flex items-center justify-between py-1">
        <div>
          <p class="text-xs text-gray-500">Display Name</p>
          <p class="font-medium text-base text-gray-900 dark:text-white">{{ profile?.display_name }}</p>
        </div>
        <UBadge color="gray" variant="subtle">Member</UBadge>
      </div>

      <form v-else @submit.prevent="handleSaveProfileName" class="space-y-3">
        <UFormGroup label="Display Name" required>
          <UInput
            v-model="newProfileName"
            type="text"
            autofocus
            :disabled="savingProfileName"
          />
        </UFormGroup>
        <div class="flex gap-2 justify-end">
          <UButton
            type="button"
            variant="ghost"
            color="gray"
            size="sm"
            :disabled="savingProfileName"
            @click="editingProfileName = false"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            size="sm"
            :loading="savingProfileName"
            :disabled="savingProfileName || !newProfileName.trim()"
          >
            Save
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Household Info Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-home" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Household Details</h2>
          </div>
          <UButton
            v-if="isOwner && !editingHouseholdName"
            variant="ghost"
            color="gray"
            size="xs"
            icon="i-heroicons-pencil"
            @click="editingHouseholdName = true"
          >
            Rename
          </UButton>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Household Name -->
        <div v-if="!editingHouseholdName" class="py-1">
          <p class="text-xs text-gray-500">Household Name</p>
          <div class="flex items-center gap-2">
            <p class="font-medium text-base text-gray-900 dark:text-white">{{ household?.name }}</p>
            <UBadge v-if="isOwner" color="primary" variant="subtle" size="xs">Owner</UBadge>
          </div>
        </div>

        <form v-else @submit.prevent="handleSaveHouseholdName" class="space-y-3">
          <UFormGroup label="Household Name" required>
            <UInput
              v-model="newHouseholdName"
              type="text"
              autofocus
              :disabled="savingHouseholdName"
            />
          </UFormGroup>
          <div class="flex gap-2 justify-end">
            <UButton
              type="button"
              variant="ghost"
              color="gray"
              size="sm"
              :disabled="savingHouseholdName"
              @click="editingHouseholdName = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="sm"
              :loading="savingHouseholdName"
              :disabled="savingHouseholdName || !newHouseholdName.trim()"
            >
              Save
            </UButton>
          </div>
        </form>

        <!-- Invite Code Box -->
        <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Invite Code</p>
              <p class="text-2xl font-mono font-bold tracking-widest text-primary-600 dark:text-primary-400 mt-0.5">
                {{ household?.invite_code || '------' }}
              </p>
              <p class="text-xs text-gray-400 mt-1">Share this code with housemates to let them join</p>
            </div>
            <UButton
              color="primary"
              variant="soft"
              :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
              size="md"
              @click="copyInviteCode"
            >
              {{ copied ? 'Copied' : 'Copy' }}
            </UButton>
          </div>
        </div>

        <!-- Currency -->
        <div>
          <p class="text-xs text-gray-500">Default Currency</p>
          <p class="font-medium text-gray-900 dark:text-white mt-0.5">{{ household?.currency || 'PHP' }}</p>
        </div>
      </div>
    </UCard>

    <!-- Members List Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-primary-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Household Members</h2>
          </div>
          <UBadge :color="members.length >= 5 ? 'amber' : 'green'" variant="subtle">
            {{ members.length }} / 5 Members
          </UBadge>
        </div>
      </template>

      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        <li
          v-for="member in members"
          :key="member.id"
          class="py-3 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="member.display_name"
              size="sm"
              class="bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold"
            />
            <div>
              <p class="font-medium text-sm text-gray-900 dark:text-white">
                {{ member.display_name }}
                <span v-if="member.id === profile?.id" class="text-xs text-primary-600 dark:text-primary-400 font-normal">
                  (You)
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UBadge
              v-if="member.id === household?.owner_id"
              color="primary"
              variant="subtle"
              size="xs"
            >
              Owner
            </UBadge>
          </div>
        </li>
      </ul>
    </UCard>
  </div>
</template>
