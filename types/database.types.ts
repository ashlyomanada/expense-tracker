export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          invite_code: string
          currency: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          currency?: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          currency?: string
          owner_id?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          household_id: string | null
          display_name: string
          created_at: string
        }
        Insert: {
          id: string
          household_id?: string | null
          display_name: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string | null
          display_name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          household_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          household_id: string
          store_name: string
          purchase_date: string
          paid_by: string
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          store_name: string
          purchase_date: string
          paid_by: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          store_name?: string
          purchase_date?: string
          paid_by?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      expense_items: {
        Row: {
          id: string
          expense_id: string
          name: string
          quantity: number
          unit_price: number
          total_price: number
          category_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          name: string
          quantity?: number
          unit_price: number
          total_price: number
          category_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          category_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_items_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      item_shares: {
        Row: {
          id: string
          item_id: string
          user_id: string
          share_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          share_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          share_amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_shares_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "expense_items"
            referencedColumns: ["id"]
          }
        ]
      }
      bills: {
        Row: {
          id: string
          household_id: string
          name: string
          category_id: string | null
          amount: number
          due_date: string
          billing_month: string
          status: 'unpaid' | 'paid'
          paid_by: string | null
          paid_at: string | null
          is_recurring: boolean
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          category_id?: string | null
          amount: number
          due_date: string
          billing_month: string
          status?: 'unpaid' | 'paid'
          paid_by?: string | null
          paid_at?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          category_id?: string | null
          amount?: number
          due_date?: string
          billing_month?: string
          status?: 'unpaid' | 'paid'
          paid_by?: string | null
          paid_at?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
      bill_shares: {
        Row: {
          id: string
          bill_id: string
          user_id: string
          share_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          bill_id: string
          user_id: string
          share_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          bill_id?: string
          user_id?: string
          share_amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_shares_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          }
        ]
      }
      settlements: {
        Row: {
          id: string
          household_id: string
          from_user: string
          to_user: string
          amount: number
          settled_at: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          from_user: string
          to_user: string
          amount: number
          settled_at?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          from_user?: string
          to_user?: string
          amount?: number
          settled_at?: string
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_household_id: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
      member_balances: {
        Args: { p_household_id: string }
        Returns: {
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
        }[]
      }
      pairwise_debts: {
        Args: { p_household_id: string }
        Returns: {
          debtor_id: string
          debtor_name: string
          creditor_id: string
          creditor_name: string
          amount: number
        }[]
      }
      monthly_summary: {
        Args: { p_household_id: string; p_month: string }
        Returns: Json
      }
      save_expense_with_items: {
        Args: { p_expense: Json; p_items: Json }
        Returns: string
      }
      create_household_with_defaults: {
        Args: { p_name: string; p_currency?: string }
        Returns: Json
      }
      join_household: {
        Args: { p_invite_code: string }
        Returns: Json
      }
      save_bill: {
        Args: { p_bill: Json }
        Returns: string
      }
      copy_last_month_bills: {
        Args: { p_household_id: string; p_target_month: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
