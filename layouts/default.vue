<script setup lang="ts">
const route = useRoute()
const { household, profile, loading } = useHousehold()
const user = useSupabaseUser()

const navItems = [
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'Expenses', to: '/expenses', icon: 'i-heroicons-shopping-bag' },
  { label: 'Bills', to: '/bills', icon: 'i-heroicons-calendar-days' },
  { label: 'Balances', to: '/balances', icon: 'i-heroicons-scale' },
  { label: 'Reports', to: '/reports', icon: 'i-heroicons-document-chart-bar' },
  { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' },
]

// Determine if we should show navigation (only when user has a household and is logged in)
const showNav = computed(() => !!user.value && !!profile.value?.household_id)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
    <!-- Top Header -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-home-modern" class="w-6 h-6" />
            <span>HouseSplit</span>
          </NuxtLink>
          <UBadge
            v-if="household"
            color="primary"
            variant="subtle"
            size="sm"
            class="hidden xs:inline-flex"
          >
            {{ household.name }}
          </UBadge>
        </div>

        <!-- Desktop Navigation Links -->
        <nav v-if="showNav" class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
            :class="route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Right User Pill -->
        <div class="flex items-center gap-2">
          <span v-if="profile?.display_name" class="text-xs text-gray-500 hidden sm:inline">
            {{ profile.display_name }}
          </span>
          <NuxtLink v-if="showNav" to="/settings" class="flex items-center">
            <UAvatar
              :alt="profile?.display_name || 'U'"
              size="xs"
              class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20"
            />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6" :class="showNav ? 'pb-24 md:pb-8' : ''">
      <slot />
    </main>

    <!-- Mobile Bottom Tab Bar -->
    <nav
      v-if="showNav"
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 safe-bottom"
    >
      <div class="grid grid-cols-6 h-16">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors"
          :class="route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
