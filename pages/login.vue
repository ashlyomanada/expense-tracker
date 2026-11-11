<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()
const { fetchProfile } = useHousehold()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })

    if (error) throw error

    toast.add({
      title: 'Welcome back!',
      description: 'Signed in successfully.',
      color: 'green',
    })

    const p = await fetchProfile()
    if (p?.household_id) {
      await navigateTo('/')
    } else {
      await navigateTo('/onboarding')
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid login credentials'
    errorMessage.value = message
    toast.add({
      title: 'Login failed',
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
          <UIcon name="i-heroicons-home-modern" class="w-10 h-10 text-primary-500 mx-auto mb-2" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Sign In to HouseSplit</h1>
          <p class="text-xs text-gray-500 mt-1">Manage household expenses and bills together</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="subtle"
          :title="errorMessage"
          class="mb-2"
        />

        <UFormGroup label="Email address" required>
          <UInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            autofocus
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Password" required>
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
          Sign In
        </UButton>

        <div class="text-center text-xs text-gray-500 pt-2">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Register here
          </NuxtLink>
        </div>
      </form>
    </UCard>
  </div>
</template>
