export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { profile, fetchProfile } = useHousehold()

  const publicRoutes = ['/login', '/register']
  const onboardingRoutes = ['/onboarding', '/join']

  const isPublic = publicRoutes.includes(to.path)
  const isOnboarding = onboardingRoutes.includes(to.path)

  // 1. Unauthenticated users cannot access non-public routes
  if (!user.value) {
    if (!isPublic) {
      return navigateTo('/login')
    }
    return
  }

  // 2. User is authenticated, ensure profile is loaded
  if (!profile.value) {
    await fetchProfile()
  }

  const hasHousehold = !!profile.value?.household_id

  // 3. User is logged in but trying to access login/register
  if (isPublic) {
    return navigateTo(hasHousehold ? '/' : '/onboarding')
  }

  // 4. User has no household yet: can only access onboarding or join
  if (!hasHousehold && !isOnboarding) {
    return navigateTo('/onboarding')
  }

  // 5. User already has household: cannot re-access onboarding or join
  if (hasHousehold && isOnboarding) {
    return navigateTo('/')
  }
})
