import { f as useSupabaseClient, b as useHousehold, h as useState } from "../server.mjs";
const useBills = () => {
  const supabase = useSupabaseClient();
  const { household } = useHousehold();
  const bills = useState("bills_list", () => []);
  const loading = useState("bills_loading", () => false);
  const fetchBills = async (month) => {
    if (!household.value) return [];
    loading.value = true;
    try {
      const [year, m] = month.split("-").map(Number);
      const startDate = `${year}-${String(m).padStart(2, "0")}-01`;
      const { data, error } = await supabase.from("bills").select(`
          id,
          household_id,
          name,
          category_id,
          category:categories (name),
          amount,
          due_date,
          billing_month,
          status,
          paid_by,
          paid_at,
          payer:profiles!bills_paid_by_fkey (id, display_name),
          is_recurring,
          created_at,
          shares:bill_shares (
            id,
            user_id,
            share_amount,
            profile:profiles (display_name)
          )
        `).eq("household_id", household.value.id).eq("billing_month", startDate).order("due_date", { ascending: true });
      if (error) throw error;
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const list = (data || []).map((b) => {
        let computed_status = "unpaid";
        if (b.status === "paid") {
          computed_status = "paid";
        } else if (b.due_date < todayStr) {
          computed_status = "overdue";
        } else {
          computed_status = "unpaid";
        }
        const shares = (b.shares || []).map((s) => ({
          id: s.id,
          user_id: s.user_id,
          share_amount: s.share_amount,
          profile: Array.isArray(s.profile) ? s.profile[0] : s.profile
        }));
        const shareCount = shares.length || 1;
        const per_person_share = Math.round(b.amount / shareCount * 100) / 100;
        return {
          id: b.id,
          household_id: b.household_id,
          name: b.name,
          category_id: b.category_id,
          category: Array.isArray(b.category) ? b.category[0] : b.category,
          amount: b.amount,
          due_date: b.due_date,
          billing_month: b.billing_month,
          status: b.status,
          paid_by: b.paid_by,
          paid_at: b.paid_at,
          payer: Array.isArray(b.payer) ? b.payer[0] : b.payer,
          is_recurring: b.is_recurring,
          created_at: b.created_at,
          shares,
          computed_status,
          per_person_share
        };
      });
      bills.value = list;
      return list;
    } catch (err) {
      console.error("Error fetching bills:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };
  const saveBill = async (billData) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.rpc("save_bill", {
        p_bill: billData
      });
      if (error) throw error;
      return data;
    } finally {
      loading.value = false;
    }
  };
  const deleteBill = async (id) => {
    loading.value = true;
    try {
      const { error } = await supabase.from("bills").delete().eq("id", id);
      if (error) throw error;
      bills.value = bills.value.filter((b) => b.id !== id);
    } finally {
      loading.value = false;
    }
  };
  const copyLastMonthBills = async (targetMonth) => {
    if (!household.value) return 0;
    loading.value = true;
    try {
      const [year, m] = targetMonth.split("-").map(Number);
      const startDate = `${year}-${String(m).padStart(2, "0")}-01`;
      const { data, error } = await supabase.rpc("copy_last_month_bills", {
        p_household_id: household.value.id,
        p_target_month: startDate
      });
      if (error) throw error;
      await fetchBills(targetMonth);
      return Number(data) || 0;
    } finally {
      loading.value = false;
    }
  };
  const markBillPaid = async (billId, paidBy, paidDate) => {
    loading.value = true;
    try {
      const { error } = await supabase.from("bills").update({
        status: "paid",
        paid_by: paidBy,
        paid_at: paidDate ? new Date(paidDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", billId);
      if (error) throw error;
    } finally {
      loading.value = false;
    }
  };
  const unmarkBillPaid = async (billId) => {
    loading.value = true;
    try {
      const { error } = await supabase.from("bills").update({
        status: "unpaid",
        paid_by: null,
        paid_at: null
      }).eq("id", billId);
      if (error) throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    bills,
    loading,
    fetchBills,
    saveBill,
    deleteBill,
    copyLastMonthBills,
    markBillPaid,
    unmarkBillPaid
  };
};
export {
  useBills as u
};
//# sourceMappingURL=useBills-uyxpq_W9.js.map
