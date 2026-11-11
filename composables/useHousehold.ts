import type { Database } from '~/types/database.types'

export interface HouseholdMember {
  id: string
  display_name: string
  created_at: string
}

export interface HouseholdCategory {
  id: string
  name: string
}

export interface Household {
  id: string
  name: string
  invite_code: string
  currency: string
  owner_id: string
}

export const useHousehold = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const profile = useState<{ id: string; display_name: string; household_id: string | null } | null>(
    'current_profile',
    () => null
  )
  const household = useState<Household | null>('current_household', () => null)
  const members = useState<HouseholdMember[]>('household_members', () => [])
  const categories = useState<HouseholdCategory[]>('household_categories', () => [])
  const loading = useState<boolean>('household_loading', () => false)

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      household.value = null
      members.value = []
      categories.value = []
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, household_id')
      .eq('id', user.value.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    if (data) {
      profile.value = data
      return data
    }

    // Auto fallback if trigger was delayed
    const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
      id: user.value.id,
      display_name: String(user.value.user_metadata?.display_name || user.value.email?.split('@')[0] || 'User'),
      household_id: null,
    }
    await supabase.from('profiles').upsert(newProfile)
    profile.value = {
      id: newProfile.id,
      display_name: newProfile.display_name,
      household_id: null,
    }
    return profile.value
  }

  const updateProfileName = async (name: string) => {
    if (!profile.value || !user.value) return
    loading.value = true
    try {
      const trimmed = name.trim()
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: trimmed })
        .eq('id', user.value.id)

      if (error) throw error
      profile.value.display_name = trimmed
      await fetchHousehold()
    } finally {
      loading.value = false
    }
  }

  const fetchHousehold = async () => {
    loading.value = true
    try {
      const p = await fetchProfile()
      if (!p || !p.household_id) {
        household.value = null
        members.value = []
        categories.value = []
        return null
      }

      // Fetch household details
      const { data: hData, error: hError } = await supabase
        .from('households')
        .select('*')
        .eq('id', p.household_id)
        .single()

      if (hError) throw hError
      household.value = hData

      // Fetch members
      const { data: mData, error: mError } = await supabase
        .from('profiles')
        .select('id, display_name, created_at')
        .eq('household_id', p.household_id)
        .order('display_name')

      if (mError) throw mError
      members.value = mData || []

      // Fetch categories
      const { data: cData, error: cError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('household_id', p.household_id)
        .order('name')

      if (cError) throw cError
      categories.value = cData || []

      return household.value
    } catch (err) {
      console.error('Error in fetchHousehold:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createHousehold = async (name: string, currency = 'PHP') => {
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('create_household_with_defaults', {
        p_name: name,
        p_currency: currency,
      })

      if (error) throw error
      await fetchHousehold()
      return data
    } finally {
      loading.value = false
    }
  }

  const joinHousehold = async (inviteCode: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('join_household', {
        p_invite_code: inviteCode,
      })

      if (error) throw error
      await fetchHousehold()
      return data
    } finally {
      loading.value = false
    }
  }

  const renameHousehold = async (newName: string) => {
    if (!household.value) return
    loading.value = true
    try {
      const { error } = await supabase
        .from('households')
        .update({ name: newName.trim() })
        .eq('id', household.value.id)

      if (error) throw error
      household.value.name = newName.trim()
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    household,
    members,
    categories,
    loading,
    fetchProfile,
    fetchHousehold,
    createHousehold,
    joinHousehold,
    renameHousehold,
    updateProfileName,
  }
}
