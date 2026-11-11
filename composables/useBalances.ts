import type { Database } from '~/types/database.types'

export interface MemberBalance {
  user_id: string
  display_name: string
  expenses_paid: number
  bills_paid: number
  settlements_sent: number
  total_paid: number
  expense_shares: number
  bill_shares: number
  settlements_received: number
  total_owed: number
  net_balance: number
}

export interface PairwiseDebt {
  debtor_id: string
  debtor_name: string
  creditor_id: string
  creditor_name: string
  amount: number
}

export interface SettlementRecord {
  id: string
  household_id: string
  from_user: string
  to_user: string
  amount: number
  settled_at: string
  note: string | null
  created_at: string
  from_profile?: { display_name: string } | null
  to_profile?: { display_name: string } | null
}

export const useBalances = () => {
  const supabase = useSupabaseClient<Database>()
  const { household } = useHousehold()

  const balances = useState<MemberBalance[]>('member_balances_list', () => [])
  const debts = useState<PairwiseDebt[]>('pairwise_debts_list', () => [])
  const settlements = useState<SettlementRecord[]>('settlements_list', () => [])
  const loading = useState<boolean>('balances_loading', () => false)

  const fetchBalances = async (): Promise<MemberBalance[]> => {
    if (!household.value) return []
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('member_balances', {
        p_household_id: household.value.id,
      })

      if (error) throw error
      balances.value = (data || []).map((b) => ({
        user_id: b.user_id,
        display_name: b.display_name,
        expenses_paid: Number(b.expenses_paid),
        bills_paid: Number(b.bills_paid),
        settlements_sent: Number(b.settlements_sent),
        total_paid: Number(b.total_paid),
        expense_shares: Number(b.expense_shares),
        bill_shares: Number(b.bill_shares),
        settlements_received: Number(b.settlements_received),
        total_owed: Number(b.total_owed),
        net_balance: Number(b.net_balance),
      }))
      return balances.value
    } catch (err) {
      console.error('Error in fetchBalances:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchDebts = async (): Promise<PairwiseDebt[]> => {
    if (!household.value) return []
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('pairwise_debts', {
        p_household_id: household.value.id,
      })

      if (error) throw error
      debts.value = (data || []).map((d) => ({
        debtor_id: d.debtor_id,
        debtor_name: d.debtor_name,
        creditor_id: d.creditor_id,
        creditor_name: d.creditor_name,
        amount: Number(d.amount),
      }))
      return debts.value
    } catch (err) {
      console.error('Error in fetchDebts:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchSettlements = async (): Promise<SettlementRecord[]> => {
    if (!household.value) return []
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select(`
          id,
          household_id,
          from_user,
          to_user,
          amount,
          settled_at,
          note,
          created_at,
          from_profile:profiles!settlements_from_user_fkey (display_name),
          to_profile:profiles!settlements_to_user_fkey (display_name)
        `)
        .eq('household_id', household.value.id)
        .order('settled_at', { ascending: false })

      if (error) throw error

      settlements.value = (data || []).map((s) => ({
        id: s.id,
        household_id: s.household_id,
        from_user: s.from_user,
        to_user: s.to_user,
        amount: Number(s.amount),
        settled_at: s.settled_at,
        note: s.note,
        created_at: s.created_at,
        from_profile: Array.isArray(s.from_profile) ? s.from_profile[0] : s.from_profile,
        to_profile: Array.isArray(s.to_profile) ? s.to_profile[0] : s.to_profile,
      }))
      return settlements.value
    } catch (err) {
      console.error('Error in fetchSettlements:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const recordSettlement = async (
    fromUser: string,
    toUser: string,
    amount: number,
    note?: string
  ): Promise<string> => {
    if (!household.value) throw new Error('No household loaded')
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('settlements')
        .insert({
          household_id: household.value.id,
          from_user: fromUser,
          to_user: toUser,
          amount,
          settled_at: new Date().toISOString(),
          note: note ? note.trim() : null,
        })
        .select('id')
        .single()

      if (error) throw error
      await Promise.all([fetchBalances(), fetchDebts(), fetchSettlements()])
      return data.id
    } finally {
      loading.value = false
    }
  }

  const deleteSettlement = async (id: string): Promise<void> => {
    loading.value = true
    try {
      const { error } = await supabase.from('settlements').delete().eq('id', id)
      if (error) throw error
      settlements.value = settlements.value.filter((s) => s.id !== id)
      await Promise.all([fetchBalances(), fetchDebts()])
    } finally {
      loading.value = false
    }
  }

  return {
    balances,
    debts,
    settlements,
    loading,
    fetchBalances,
    fetchDebts,
    fetchSettlements,
    recordSettlement,
    deleteSettlement,
  }
}

