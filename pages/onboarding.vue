<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { createHousehold } = useHousehold()
const toast = useToast()

const householdName = ref('')
const currency = ref('PHP')
const loading = ref(false)
const errorMessage = ref('')

const currencies = [
  { label: 'PHP (₱) - Philippine Peso', value: 'PHP' },
  { label: 'USD ($) - US Dollar', value: 'USD' },
  { label: 'EUR (€) - Euro', value: 'EUR' },
  { label: 'SGD ($) - Singapore Dollar', value: 'SGD' },
  { label: 'JPY (¥) - Japanese Yen', value: 'JPY' },
]

const handleCreate = async () => {
  if (!householdName.value.trim()) {
    errorMessage.value = 'Please provide a household name.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await createHousehold(householdName.value.trim(), currency.value)
    toast.add({
      title: 'Household created!',
      description: 'Your household is ready.',
      color: 'green',
    })
    await navigateTo('/')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create household'
    errorMessage.value = msg
    toast.add({
      title: 'Error',
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
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-primary-500 mx-auto mb-2" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Create Your Household</h1>
          <p class="text-xs text-gray-500 mt-1">Start tracking shared expenses with your housemates</p>
        </div>
      </template>

      <form @submit.prevent="handleCreate" class="space-y-4">
        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          :title="errorMessage"
          class="mb-2"
        />

        <UFormGroup label="Household Name" required help="e.g. Pinecrest Condo #302 or The Loft">
          <UInput
            v-model="householdName"
            type="text"
            placeholder="e.g. Greenwoods Manor #4"
            icon="i-heroicons-home"
            autofocus
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Currency" required>
          <USelect
            v-model="currency"
            :options="currencies"
            option-attribute="label"
            value-attribute="value"
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
          Create Household
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
          to="/join"
          variant="outline"
          color="gray"
          block
          size="lg"
          icon="i-heroicons-key"
        >
          Join with Invite Code
        </UButton>
      </form>
    </UCard>
  </div>
</template>
