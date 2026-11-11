<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()
const { fetchProfile } = useHousehold()
const toast = useToast()

const displayName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (!displayName.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = 'Please fill out all fields.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value.trim(),
      password: password.value,
      options: {
        data: {
          display_name: displayName.value.trim(),
        },
      },
    })

    if (error) throw error

    toast.add({
      title: 'Account created!',
      description: 'Welcome to HouseSplit.',
      color: 'green',
    })

    await fetchProfile()
    await navigateTo('/onboarding')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    errorMessage.value = message
    toast.add({
      title: 'Registration failed',
      description: message,
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col justify-center max-w-sm mx-auto py-8">
    <UCard class="shadow-sm border border-gray-200 dark:border-gray-800">
      <template #header>
        <div class="text-center">
          <UIcon name="i-heroicons-user-plus" class="w-10 h-10 text-primary-500 mx-auto mb-2" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
          <p class="text-xs text-gray-500 mt-1">Join or start your household split</p>
        </div>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          :title="errorMessage"
          class="mb-2"
        />

        <UFormGroup label="Your Name (Display Name)" required>
          <UInput
            v-model="displayName"
            type="text"
            placeholder="e.g. Alex"
            icon="i-heroicons-user"
            autofocus
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Email address" required>
          <UInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Password" required help="At least 6 characters">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
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
          Create Account
        </UButton>

        <div class="text-center text-xs text-gray-500 pt-2">
          Already have an account?
          <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Sign In
          </NuxtLink>
        </div>
      </form>
    </UCard>
  </div>
</template>
