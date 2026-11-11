import type { Database } from '~/types/database.types'

export interface ExpenseItemShare {
  id: string
  user_id: string
  share_amount: number
  profile?: {
    display_name: string
  }
}

export interface ExpenseItemDetail {
  id?: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  category_id: string | null
  category?: {
    name: string
  } | null
  selected_member_ids: string[]
  shares?: ExpenseItemShare[]
}

export interface ExpenseDetail {
  id: string
  household_id: string
  store_name: string
  purchase_date: string
  paid_by: string
  notes: string | null
  created_at: string
  payer?: {
    id: string
    display_name: string
  } | null
  items: ExpenseItemDetail[]
  total_amount: number
}

export const useExpenses = () => {
  const supabase = useSupabaseClient<Database>()
  const { household } = useHousehold()

  const expenses = useState<ExpenseDetail[]>('expenses_list', () => [])
  const loading = useState<boolean>('expenses_loading', () => false)

  const fetchExpenses = async (month?: string, searchQuery?: string) => {
    if (!household.value) return []
    loading.value = true

    try {
      let query = supabase
        .from('expenses')
        .select(`
          id,
          household_id,
          store_name,
          purchase_date,
          paid_by,
          notes,
          created_at,
          payer:profiles!expenses_paid_by_fkey (id, display_name),
          items:expense_items (
            id,
            name,
            quantity,
            unit_price,
            total_price,
            category_id,
            category:categories (name),
            shares:item_shares (
              id,
              user_id,
              share_amount,
              profile:profiles (display_name)
            )
          )
        `)
        .eq('household_id', household.value.id)
        .order('purchase_date', { ascending: false })

      if (month) {
        // month is YYYY-MM
        const [year, m] = month.split('-').map(Number)
        const startDate = `${year}-${String(m).padStart(2, '0')}-01`
        const lastDay = new Date(year, m, 0).getDate()
        const endDate = `${year}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
        query = query.gte('purchase_date', startDate).lte('purchase_date', endDate)
      }

      const { data, error } = await query

      if (error) throw error

      let list = (data || []).map((exp) => {
        const items: ExpenseItemDetail[] = (exp.items || []).map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
          category_id: it.category_id,
          category: it.category,
          selected_member_ids: (it.shares || []).map((s) => s.user_id),
          shares: it.shares?.map((s) => ({
            id: s.id,
            user_id: s.user_id,
            share_amount: s.share_amount,
            profile: Array.isArray(s.profile) ? s.profile[0] : s.profile,
          })),
        }))

        const total_amount = items.reduce((sum, item) => sum + item.total_price, 0)

        return {
          id: exp.id,
          household_id: exp.household_id,
          store_name: exp.store_name,
          purchase_date: exp.purchase_date,
          paid_by: exp.paid_by,
          notes: exp.notes,
          created_at: exp.created_at,
          payer: Array.isArray(exp.payer) ? exp.payer[0] : exp.payer,
          items,
          total_amount: Math.round(total_amount * 100) / 100,
        }
      })

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        list = list.filter((exp) => {
          const matchStore = exp.store_name.toLowerCase().includes(q)
          const matchItem = exp.items.some((it) => it.name.toLowerCase().includes(q))
          return matchStore || matchItem
        })
      }

      expenses.value = list
      return list
    } catch (err) {
      console.error('Error fetching expenses:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchExpense = async (id: string): Promise<ExpenseDetail | null> => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          id,
          household_id,
          store_name,
          purchase_date,
          paid_by,
          notes,
          created_at,
          payer:profiles!expenses_paid_by_fkey (id, display_name),
          items:expense_items (
            id,
            name,
            quantity,
            unit_price,
            total_price,
            category_id,
            category:categories (name),
            shares:item_shares (
              id,
              user_id,
              share_amount,
              profile:profiles (display_name)
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null

      const items: ExpenseItemDetail[] = (data.items || []).map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.total_price,
        category_id: it.category_id,
        category: it.category,
        selected_member_ids: (it.shares || []).map((s) => s.user_id),
        shares: it.shares?.map((s) => ({
          id: s.id,
          user_id: s.user_id,
          share_amount: s.share_amount,
          profile: Array.isArray(s.profile) ? s.profile[0] : s.profile,
        })),
      }))

      const total_amount = items.reduce((sum, item) => sum + item.total_price, 0)

      return {
        id: data.id,
        household_id: data.household_id,
        store_name: data.store_name,
        purchase_date: data.purchase_date,
        paid_by: data.paid_by,
        notes: data.notes,
        created_at: data.created_at,
        payer: Array.isArray(data.payer) ? data.payer[0] : data.payer,
        items,
        total_amount: Math.round(total_amount * 100) / 100,
      }
    } catch (err) {
      console.error('Error fetching single expense:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const saveExpense = async (
    expenseData: {
      id?: string
      household_id: string
      store_name: string
      purchase_date: string
      paid_by: string
      notes?: string | null
    },
    itemsData: {
      name: string
      quantity: number
      unit_price: number
      total_price: number
      category_id: string | null
      selected_member_ids: string[]
    }[]
  ): Promise<string> => {
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('save_expense_with_items', {
        p_expense: expenseData,
        p_items: itemsData,
      })

      if (error) throw error
      return data as string
    } finally {
      loading.value = false
    }
  }

  const deleteExpense = async (id: string): Promise<void> => {
    loading.value = true
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
      expenses.value = expenses.value.filter((e) => e.id !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    loading,
    fetchExpenses,
    fetchExpense,
    saveExpense,
    deleteExpense,
  }
}
