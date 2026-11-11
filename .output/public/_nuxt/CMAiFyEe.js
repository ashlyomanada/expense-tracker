import{z as h,g as f,C as y}from"./CUbp_JVc.js";const q=()=>{const c=h(),{household:m}=f(),p=y("expenses_list",()=>[]),o=y("expenses_loading",()=>!1);return{expenses:p,loading:o,fetchExpenses:async(n,a)=>{if(!m.value)return[];o.value=!0;try{let i=c.from("expenses").select(`
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
        `).eq("household_id",m.value.id).order("purchase_date",{ascending:!1});if(n){const[e,d]=n.split("-").map(Number),l=`${e}-${String(d).padStart(2,"0")}-01`,r=new Date(e,d,0).getDate(),s=`${e}-${String(d).padStart(2,"0")}-${String(r).padStart(2,"0")}`;i=i.gte("purchase_date",l).lte("purchase_date",s)}const{data:_,error:u}=await i;if(u)throw u;let t=(_||[]).map(e=>{const d=(e.items||[]).map(r=>({id:r.id,name:r.name,quantity:r.quantity,unit_price:r.unit_price,total_price:r.total_price,category_id:r.category_id,category:r.category,selected_member_ids:(r.shares||[]).map(s=>s.user_id),shares:r.shares?.map(s=>({id:s.id,user_id:s.user_id,share_amount:s.share_amount,profile:Array.isArray(s.profile)?s.profile[0]:s.profile}))})),l=d.reduce((r,s)=>r+s.total_price,0);return{id:e.id,household_id:e.household_id,store_name:e.store_name,purchase_date:e.purchase_date,paid_by:e.paid_by,notes:e.notes,created_at:e.created_at,payer:Array.isArray(e.payer)?e.payer[0]:e.payer,items:d,total_amount:Math.round(l*100)/100}});if(a&&a.trim()){const e=a.trim().toLowerCase();t=t.filter(d=>{const l=d.store_name.toLowerCase().includes(e),r=d.items.some(s=>s.name.toLowerCase().includes(e));return l||r})}return p.value=t,t}catch(i){return console.error("Error fetching expenses:",i),[]}finally{o.value=!1}},fetchExpense:async n=>{o.value=!0;try{const{data:a,error:i}=await c.from("expenses").select(`
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
        `).eq("id",n).single();if(i)throw i;if(!a)return null;const _=(a.items||[]).map(t=>({id:t.id,name:t.name,quantity:t.quantity,unit_price:t.unit_price,total_price:t.total_price,category_id:t.category_id,category:t.category,selected_member_ids:(t.shares||[]).map(e=>e.user_id),shares:t.shares?.map(e=>({id:e.id,user_id:e.user_id,share_amount:e.share_amount,profile:Array.isArray(e.profile)?e.profile[0]:e.profile}))})),u=_.reduce((t,e)=>t+e.total_price,0);return{id:a.id,household_id:a.household_id,store_name:a.store_name,purchase_date:a.purchase_date,paid_by:a.paid_by,notes:a.notes,created_at:a.created_at,payer:Array.isArray(a.payer)?a.payer[0]:a.payer,items:_,total_amount:Math.round(u*100)/100}}catch(a){return console.error("Error fetching single expense:",a),null}finally{o.value=!1}},saveExpense:async(n,a)=>{o.value=!0;try{const{data:i,error:_}=await c.rpc("save_expense_with_items",{p_expense:n,p_items:a});if(_)throw _;return i}finally{o.value=!1}},deleteExpense:async n=>{o.value=!0;try{const{error:a}=await c.from("expenses").delete().eq("id",n);if(a)throw a;p.value=p.value.filter(i=>i.id!==n)}finally{o.value=!1}}}};export{q as u};
