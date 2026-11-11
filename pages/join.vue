<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { joinHousehold } = useHousehold()
const toast = useToast()

const inviteCode = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleJoin = async () => {
  const code = inviteCode.value.trim().toUpperCase()
  if (!code) {
    errorMessage.value = 'Please enter an invite code.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await joinHousehold(code)
    toast.add({
      title: 'Joined household!',
      description: 'You are now a member.',
      color: 'green',
    })
    await navigateTo('/')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid invite code'
    errorMessage.value = msg
    toast.add({
      title: 'Failed to join',
      description: msg,
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col justify-center max-w-md mx-auto py-8">
    <UCard class="shadow-sm border border-gray-200 dark:border-gray-800">
      <template #header>
        <div class="text-center">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-primary-500 mx-auto mb-2" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Join a Household</h1>
          <p class="text-xs text-gray-500 mt-1">Enter the 6-character code shared by your housemate</p>
        </div>
      </template>

      <form @submit.prevent="handleJoin" class="space-y-4">
        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          :title="errorMessage"
          class="mb-2"
        />

        <UFormGroup label="Invite Code" required help="Ask your household owner for their invite code">
          <UInput
            v-model="inviteCode"
            type="text"
            placeholder="e.g. SPLIT5"
            icon="i-heroicons-ticket"
            class="uppercase tracking-widest text-center font-mono text-lg"
            autofocus
            maxlength="10"
            :disabled="loading"
          />
        </UFormGroup>

        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading"
          :disabled="loading"
          size="lg"
        >
          Join Household
        </UButton>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white dark:bg-gray-900 px-2 text-gray-400">or</span>
          </div>
        </div>

        <UButton
          to="/onboarding"
          variant="outline"
          color="gray"
          block
          size="lg"
          icon="i-heroicons-plus-circle"
        >
          Create New Household
        </UButton>
      </form>
    </UCard>
  </div>
</template>
