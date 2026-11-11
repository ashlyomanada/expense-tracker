import{z as w,g as S,C as f}from"./CUbp_JVc.js";const P=()=>{const l=w(),{household:u}=S(),d=f("bills_list",()=>[]),t=f("bills_loading",()=>!1),p=async r=>{if(!u.value)return[];t.value=!0;try{const[e,i]=r.split("-").map(Number),s=`${e}-${String(i).padStart(2,"0")}-01`,{data:_,error:n}=await l.from("bills").select(`
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
        `).eq("household_id",u.value.id).eq("billing_month",s).order("due_date",{ascending:!0});if(n)throw n;const m=new Date().toISOString().split("T")[0],y=(_||[]).map(a=>{let c="unpaid";a.status==="paid"?c="paid":a.due_date<m?c="overdue":c="unpaid";const h=(a.shares||[]).map(o=>({id:o.id,user_id:o.user_id,share_amount:o.share_amount,profile:Array.isArray(o.profile)?o.profile[0]:o.profile})),g=h.length||1,v=Math.round(a.amount/g*100)/100;return{id:a.id,household_id:a.household_id,name:a.name,category_id:a.category_id,category:Array.isArray(a.category)?a.category[0]:a.category,amount:a.amount,due_date:a.due_date,billing_month:a.billing_month,status:a.status,paid_by:a.paid_by,paid_at:a.paid_at,payer:Array.isArray(a.payer)?a.payer[0]:a.payer,is_recurring:a.is_recurring,created_at:a.created_at,shares:h,computed_status:c,per_person_share:v}});return d.value=y,y}catch(e){return console.error("Error fetching bills:",e),[]}finally{t.value=!1}};return{bills:d,loading:t,fetchBills:p,saveBill:async r=>{t.value=!0;try{const{data:e,error:i}=await l.rpc("save_bill",{p_bill:r});if(i)throw i;return e}finally{t.value=!1}},deleteBill:async r=>{t.value=!0;try{const{error:e}=await l.from("bills").delete().eq("id",r);if(e)throw e;d.value=d.value.filter(i=>i.id!==r)}finally{t.value=!1}},copyLastMonthBills:async r=>{if(!u.value)return 0;t.value=!0;try{const[e,i]=r.split("-").map(Number),s=`${e}-${String(i).padStart(2,"0")}-01`,{data:_,error:n}=await l.rpc("copy_last_month_bills",{p_household_id:u.value.id,p_target_month:s});if(n)throw n;return await p(r),Number(_)||0}finally{t.value=!1}},markBillPaid:async(r,e,i)=>{t.value=!0;try{const{error:s}=await l.from("bills").update({status:"paid",paid_by:e,paid_at:i?new Date(i).toISOString():new Date().toISOString()}).eq("id",r);if(s)throw s}finally{t.value=!1}},unmarkBillPaid:async r=>{t.value=!0;try{const{error:e}=await l.from("bills").update({status:"unpaid",paid_by:null,paid_at:null}).eq("id",r);if(e)throw e}finally{t.value=!1}}}};export{P as u};
