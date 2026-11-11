-- ==============================================================================
-- Migration: 20261110000002_functions_and_views.sql
-- Description: Financial views, RPC functions, debt simplification, and atomic transactions
-- ==============================================================================

-- 1. Function: member_balances(household_id)
-- Returns the net financial balance of each member in the household.
-- net_balance > 0: member is owed money (creditor)
-- net_balance < 0: member owes money (debtor)
create or replace function public.member_balances(p_household_id uuid)
returns table (
  user_id uuid,
  display_name text,
  expenses_paid numeric(12,2),
  bills_paid numeric(12,2),
  settlements_sent numeric(12,2),
  total_paid numeric(12,2),
  expense_shares numeric(12,2),
  bill_shares numeric(12,2),
  settlements_received numeric(12,2),
  total_owed numeric(12,2),
  net_balance numeric(12,2)
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with members as (
    select p.id as uid, p.display_name as name
    from public.profiles p
    where p.household_id = p_household_id
  ),
  exp_paid as (
    select e.paid_by as uid, coalesce(sum(ei.total_price), 0)::numeric(12,2) as amount
    from public.expenses e
    join public.expense_items ei on ei.expense_id = e.id
    where e.household_id = p_household_id
    group by e.paid_by
  ),
  b_paid as (
    select b.paid_by as uid, coalesce(sum(b.amount), 0)::numeric(12,2) as amount
    from public.bills b
    where b.household_id = p_household_id and b.status = 'paid' and b.paid_by is not null
    group by b.paid_by
  ),
  settle_sent as (
    select s.from_user as uid, coalesce(sum(s.amount), 0)::numeric(12,2) as amount
    from public.settlements s
    where s.household_id = p_household_id
    group by s.from_user
  ),
  exp_share as (
    select its.user_id as uid, coalesce(sum(its.share_amount), 0)::numeric(12,2) as amount
    from public.item_shares its
    join public.expense_items ei on ei.id = its.item_id
    join public.expenses e on e.id = ei.expense_id
    where e.household_id = p_household_id
    group by its.user_id
  ),
  b_share as (
    select bs.user_id as uid, coalesce(sum(bs.share_amount), 0)::numeric(12,2) as amount
    from public.bill_shares bs
    join public.bills b on b.id = bs.bill_id
    where b.household_id = p_household_id and b.status = 'paid'
    group by bs.user_id
  ),
  settle_rec as (
    select s.to_user as uid, coalesce(sum(s.amount), 0)::numeric(12,2) as amount
    from public.settlements s
    where s.household_id = p_household_id
    group by s.to_user
  )
  select
    m.uid as user_id,
    m.name as display_name,
    coalesce(ep.amount, 0.00)::numeric(12,2) as expenses_paid,
    coalesce(bp.amount, 0.00)::numeric(12,2) as bills_paid,
    coalesce(ss.amount, 0.00)::numeric(12,2) as settlements_sent,
    (coalesce(ep.amount, 0.00) + coalesce(bp.amount, 0.00) + coalesce(ss.amount, 0.00))::numeric(12,2) as total_paid,
    coalesce(es.amount, 0.00)::numeric(12,2) as expense_shares,
    coalesce(bs.amount, 0.00)::numeric(12,2) as bill_shares,
    coalesce(sr.amount, 0.00)::numeric(12,2) as settlements_received,
    (coalesce(es.amount, 0.00) + coalesce(bs.amount, 0.00) + coalesce(sr.amount, 0.00))::numeric(12,2) as total_owed,
    ((coalesce(ep.amount, 0.00) + coalesce(bp.amount, 0.00) + coalesce(ss.amount, 0.00)) -
     (coalesce(es.amount, 0.00) + coalesce(bs.amount, 0.00) + coalesce(sr.amount, 0.00)))::numeric(12,2) as net_balance
  from members m
  left join exp_paid ep on ep.uid = m.uid
  left join b_paid bp on bp.uid = m.uid
  left join settle_sent ss on ss.uid = m.uid
  left join exp_share es on es.uid = m.uid
  left join b_share bs on bs.uid = m.uid
  left join settle_rec sr on sr.uid = m.uid
  order by m.name;
end;
$$;


-- 2. Function: pairwise_debts(household_id)
-- Simplified "who owes whom" debt settlement using greedy balance matching
create or replace function public.pairwise_debts(p_household_id uuid)
returns table (
  debtor_id uuid,
  debtor_name text,
  creditor_id uuid,
  creditor_name text,
  amount numeric(12,2)
)
language plpgsql
security definer
set search_path = public
as $$
declare
  debtor_record record;
  creditor_record record;
  settle_amount numeric(12,2);
begin
  create temp table temp_balances on commit drop as
  select
    user_id,
    display_name,
    net_balance
  from public.member_balances(p_household_id);

  loop
    -- Pick member who owes the most (lowest negative balance)
    select tb.user_id, tb.display_name, abs(tb.net_balance) as remaining
    into debtor_record
    from temp_balances tb
    where tb.net_balance < -0.005
    order by tb.net_balance asc
    limit 1;

    -- Pick member who is owed the most (highest positive balance)
    select tb.user_id, tb.display_name, tb.net_balance as remaining
    into creditor_record
    from temp_balances tb
    where tb.net_balance > 0.005
    order by tb.net_balance desc
    limit 1;

    exit when debtor_record is null or creditor_record is null;

    settle_amount := least(debtor_record.remaining, creditor_record.remaining);

    if settle_amount <= 0.005 then
      exit;
    end if;

    debtor_id := debtor_record.user_id;
    debtor_name := debtor_record.display_name;
    creditor_id := creditor_record.user_id;
    creditor_name := creditor_record.display_name;
    amount := settle_amount;
    return next;

    -- Update running balances
    update temp_balances
    set net_balance = net_balance + settle_amount
    where user_id = debtor_record.user_id;

    update temp_balances
    set net_balance = net_balance - settle_amount
    where user_id = creditor_record.user_id;
  end loop;

  return;
end;
$$;


-- 3. Function: monthly_summary(household_id, month)
-- Returns high-level metrics, category totals, and member spending for a given month
create or replace function public.monthly_summary(p_household_id uuid, p_month date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  start_date date := date_trunc('month', p_month)::date;
  end_date date := (date_trunc('month', p_month) + interval '1 month - 1 day')::date;
  total_expenses numeric(12,2) := 0.00;
  total_bills numeric(12,2) := 0.00;
  category_totals jsonb;
  member_totals jsonb;
begin
  -- Total expenses in month
  select coalesce(sum(ei.total_price), 0.00)::numeric(12,2)
  into total_expenses
  from public.expenses e
  join public.expense_items ei on ei.expense_id = e.id
  where e.household_id = p_household_id
    and e.purchase_date >= start_date
    and e.purchase_date <= end_date;

  -- Total bills in month (matching billing_month)
  select coalesce(sum(b.amount), 0.00)::numeric(12,2)
  into total_bills
  from public.bills b
  where b.household_id = p_household_id
    and date_trunc('month', b.billing_month)::date = start_date;

  -- Category breakdown
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'category_name', c_name,
        'amount', cat_total
      ) order by cat_total desc
    ),
    '[]'::jsonb
  )
  into category_totals
  from (
    select
      coalesce(c.name, 'Other') as c_name,
      sum(items_and_bills.amount)::numeric(12,2) as cat_total
    from (
      -- expense items
      select ei.category_id, ei.total_price as amount
      from public.expenses e
      join public.expense_items ei on ei.expense_id = e.id
      where e.household_id = p_household_id
        and e.purchase_date >= start_date
        and e.purchase_date <= end_date

      union all

      -- bills
      select b.category_id, b.amount as amount
      from public.bills b
      where b.household_id = p_household_id
        and date_trunc('month', b.billing_month)::date = start_date
    ) items_and_bills
    left join public.categories c on c.id = items_and_bills.category_id
    group by coalesce(c.name, 'Other')
  ) cat_agg;

  -- Member breakdown for the month
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'user_id', m.id,
        'display_name', m.display_name,
        'paid', coalesce(paid_agg.paid, 0.00)::numeric(12,2),
        'owed', coalesce(share_agg.owed, 0.00)::numeric(12,2),
        'net', (coalesce(paid_agg.paid, 0.00) - coalesce(share_agg.owed, 0.00))::numeric(12,2)
      ) order by m.display_name
    ),
    '[]'::jsonb
  )
  into member_totals
  from public.profiles m
  left join (
    select uid, sum(amt)::numeric(12,2) as paid
    from (
      select e.paid_by as uid, sum(ei.total_price) as amt
      from public.expenses e
      join public.expense_items ei on ei.expense_id = e.id
      where e.household_id = p_household_id
        and e.purchase_date >= start_date and e.purchase_date <= end_date
      group by e.paid_by

      union all

      select b.paid_by as uid, sum(b.amount) as amt
      from public.bills b
      where b.household_id = p_household_id
        and date_trunc('month', b.billing_month)::date = start_date
        and b.status = 'paid' and b.paid_by is not null
      group by b.paid_by
    ) p_sub
    group by uid
  ) paid_agg on paid_agg.uid = m.id
  left join (
    select uid, sum(amt)::numeric(12,2) as owed
    from (
      select its.user_id as uid, sum(its.share_amount) as amt
      from public.item_shares its
      join public.expense_items ei on ei.id = its.item_id
      join public.expenses e on e.id = ei.expense_id
      where e.household_id = p_household_id
        and e.purchase_date >= start_date and e.purchase_date <= end_date
      group by its.user_id

      union all

      select bs.user_id as uid, sum(bs.share_amount) as amt
      from public.bill_shares bs
      join public.bills b on b.id = bs.bill_id
      where b.household_id = p_household_id
        and date_trunc('month', b.billing_month)::date = start_date
        and b.status = 'paid'
      group by bs.user_id
    ) s_sub
    group by uid
  ) share_agg on share_agg.uid = m.id
  where m.household_id = p_household_id;

  return jsonb_build_object(
    'month', start_date,
    'total_expenses', total_expenses,
    'total_bills', total_bills,
    'total_spent', (total_expenses + total_bills)::numeric(12,2),
    'categories', category_totals,
    'members', member_totals
  );
end;
$$;


-- 4. Function: save_expense_with_items(expense_data, items_data)
-- Saves an expense with its items and shares atomically.
-- Enforces:
-- 1. Money arithmetic in integer centavos
-- 2. Sum of item shares == item total_price
-- 3. Leftover centavos go to the payer (or first selected member)
create or replace function public.save_expense_with_items(
  p_expense jsonb,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense_id uuid;
  v_household_id uuid;
  v_paid_by uuid;
  v_item jsonb;
  v_item_id uuid;
  v_item_name text;
  v_qty numeric(12,2);
  v_unit_price numeric(12,2);
  v_total_price numeric(12,2);
  v_cat_id uuid;
  v_member_ids jsonb;
  v_num_members int;
  v_total_cents bigint;
  v_base_cents bigint;
  v_rem_cents bigint;
  v_uid_text text;
  v_uid uuid;
  v_share_cents bigint;
  v_is_remainder_target boolean;
  v_shares_sum_cents bigint;
begin
  v_household_id := (p_expense->>'household_id')::uuid;
  v_paid_by := (p_expense->>'paid_by')::uuid;

  if (p_expense->>'id') is not null and (p_expense->>'id') != '' then
    v_expense_id := (p_expense->>'id')::uuid;
    update public.expenses
    set
      store_name = (p_expense->>'store_name'),
      purchase_date = (p_expense->>'purchase_date')::date,
      paid_by = v_paid_by,
      notes = (p_expense->>'notes')
    where id = v_expense_id and household_id = v_household_id;

    -- Delete old items and shares (cascade deletes shares)
    delete from public.expense_items where expense_id = v_expense_id;
  else
    insert into public.expenses (
      household_id,
      store_name,
      purchase_date,
      paid_by,
      notes,
      created_by
    ) values (
      v_household_id,
      (p_expense->>'store_name'),
      (p_expense->>'purchase_date')::date,
      v_paid_by,
      (p_expense->>'notes'),
      auth.uid()
    ) returning id into v_expense_id;
  end if;

  -- Process items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_name := v_item->>'name';
    v_qty := coalesce((v_item->>'quantity')::numeric(12,2), 1.00);
    v_unit_price := (v_item->>'unit_price')::numeric(12,2);
    v_total_price := coalesce((v_item->>'total_price')::numeric(12,2), (v_qty * v_unit_price)::numeric(12,2));

    if (v_item->>'category_id') is not null and (v_item->>'category_id') != '' then
      v_cat_id := (v_item->>'category_id')::uuid;
    else
      v_cat_id := null;
    end if;

    insert into public.expense_items (
      expense_id,
      name,
      quantity,
      unit_price,
      total_price,
      category_id
    ) values (
      v_expense_id,
      v_item_name,
      v_qty,
      v_unit_price,
      v_total_price,
      v_cat_id
    ) returning id into v_item_id;

    v_member_ids := v_item->'selected_member_ids';
    v_num_members := jsonb_array_length(v_member_ids);

    if v_num_members > 0 then
      v_total_cents := round(v_total_price * 100);
      v_base_cents := div(v_total_cents, v_num_members);
      v_rem_cents := mod(v_total_cents, v_num_members);
      v_shares_sum_cents := 0;

      for v_uid_text in select jsonb_array_elements_text(v_member_ids)
      loop
        v_uid := v_uid_text::uuid;

        -- If payer is in split, remainder centavos go to payer;
        -- otherwise, to first member in the list
        if v_member_ids ? v_paid_by::text then
          v_is_remainder_target := (v_uid = v_paid_by);
        else
          v_is_remainder_target := (v_uid_text = (v_member_ids->>0));
        end if;

        v_share_cents := v_base_cents + (case when v_is_remainder_target then v_rem_cents else 0 end);
        v_shares_sum_cents := v_shares_sum_cents + v_share_cents;

        insert into public.item_shares (
          item_id,
          user_id,
          share_amount
        ) values (
          v_item_id,
          v_uid,
          (v_share_cents / 100.0)::numeric(12,2)
        );
      end loop;

      if v_shares_sum_cents != v_total_cents then
        raise exception 'Shares sum (%) does not match item total (%)', v_shares_sum_cents, v_total_cents;
      end if;
    end if;
  end loop;

  return v_expense_id;
end;
$$;

