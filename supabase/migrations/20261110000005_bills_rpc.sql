-- ==============================================================================
-- Migration: 20261110000005_bills_rpc.sql
-- Description: Atomic bill creation/update with equal shares, and bill cloning
-- ==============================================================================

-- 1. Save or update bill and generate equal bill shares for all household members
create or replace function public.save_bill(p_bill jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bill_id uuid;
  v_household_id uuid;
  v_name text;
  v_category_id uuid;
  v_amount numeric(12,2);
  v_due_date date;
  v_billing_month date;
  v_is_recurring boolean;
  v_status text;
  v_paid_by uuid;
  v_paid_at timestamptz;
  v_member_count int;
  v_total_cents bigint;
  v_base_cents bigint;
  v_rem_cents bigint;
  v_shares_sum_cents bigint;
  v_uid uuid;
  v_is_remainder_target boolean;
  v_first_uid uuid;
  v_share_cents bigint;
begin
  v_household_id := (p_bill->>'household_id')::uuid;
  v_name := trim(p_bill->>'name');
  v_amount := (p_bill->>'amount')::numeric(12,2);
  v_due_date := (p_bill->>'due_date')::date;
  v_billing_month := date_trunc('month', (p_bill->>'billing_month')::date)::date;
  v_is_recurring := coalesce((p_bill->>'is_recurring')::boolean, false);
  v_status := coalesce(p_bill->>'status', 'unpaid');

  if (p_bill->>'category_id') is not null and (p_bill->>'category_id') != '' then
    v_category_id := (p_bill->>'category_id')::uuid;
  else
    v_category_id := null;
  end if;

  if (p_bill->>'paid_by') is not null and (p_bill->>'paid_by') != '' then
    v_paid_by := (p_bill->>'paid_by')::uuid;
  else
    v_paid_by := null;
  end if;

  if (p_bill->>'paid_at') is not null and (p_bill->>'paid_at') != '' then
    v_paid_at := (p_bill->>'paid_at')::timestamptz;
  else
    v_paid_at := null;
  end if;

  if v_name = '' then
    raise exception 'Bill name is required';
  end if;

  if v_amount <= 0 then
    raise exception 'Bill amount must be greater than zero';
  end if;

  if (p_bill->>'id') is not null and (p_bill->>'id') != '' then
    v_bill_id := (p_bill->>'id')::uuid;
    update public.bills
    set
      name = v_name,
      category_id = v_category_id,
      amount = v_amount,
      due_date = v_due_date,
      billing_month = v_billing_month,
      is_recurring = v_is_recurring,
      status = v_status,
      paid_by = v_paid_by,
      paid_at = case when v_status = 'paid' then coalesce(v_paid_at, now()) else null end
    where id = v_bill_id and household_id = v_household_id;

    delete from public.bill_shares where bill_id = v_bill_id;
  else
    insert into public.bills (
      household_id,
      name,
      category_id,
      amount,
      due_date,
      billing_month,
      status,
      paid_by,
      paid_at,
      is_recurring
    ) values (
      v_household_id,
      v_name,
      v_category_id,
      v_amount,
      v_due_date,
      v_billing_month,
      v_status,
      v_paid_by,
      case when v_status = 'paid' then coalesce(v_paid_at, now()) else null end,
      v_is_recurring
    ) returning id into v_bill_id;
  end if;

  -- Create bill shares equally among all current members of the household
  select count(*), min(id) into v_member_count, v_first_uid
  from public.profiles
  where household_id = v_household_id;

  if v_member_count > 0 then
    v_total_cents := round(v_amount * 100);
    v_base_cents := div(v_total_cents, v_member_count);
    v_rem_cents := mod(v_total_cents, v_member_count);
    v_shares_sum_cents := 0;

    for v_uid in select id from public.profiles where household_id = v_household_id order by display_name
    loop
      if v_paid_by is not null then
        v_is_remainder_target := (v_uid = v_paid_by);
      else
        v_is_remainder_target := (v_uid = v_first_uid);
      end if;

      v_share_cents := v_base_cents + (case when v_is_remainder_target then v_rem_cents else 0 end);
      v_shares_sum_cents := v_shares_sum_cents + v_share_cents;

      insert into public.bill_shares (bill_id, user_id, share_amount)
      values (v_bill_id, v_uid, (v_share_cents / 100.0)::numeric(12,2));
    end loop;
  end if;

  return v_bill_id;
end;
$$;


-- 2. Copy last month's recurring bills into selected target month as unpaid
create or replace function public.copy_last_month_bills(
  p_household_id uuid,
  p_target_month date
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target_start date := date_trunc('month', p_target_month)::date;
  v_prev_start date := (v_target_start - interval '1 month')::date;
  v_cloned_count int := 0;
  v_rec record;
  v_new_bill_id uuid;
  v_due_day int;
  v_new_due_date date;
  v_member_count int;
  v_first_uid uuid;
  v_uid uuid;
  v_total_cents bigint;
  v_base_cents bigint;
  v_rem_cents bigint;
  v_share_cents bigint;
begin
  select count(*), min(id) into v_member_count, v_first_uid
  from public.profiles
  where household_id = p_household_id;

  for v_rec in
    select b.*
    from public.bills b
    where b.household_id = p_household_id
      and date_trunc('month', b.billing_month)::date = v_prev_start
      and b.is_recurring = true
      and not exists (
        select 1 from public.bills b2
        where b2.household_id = p_household_id
          and date_trunc('month', b2.billing_month)::date = v_target_start
          and lower(trim(b2.name)) = lower(trim(b.name))
      )
  loop
    v_due_day := extract(day from v_rec.due_date)::int;
    -- Handle month day clamping (e.g. Feb 30 -> Feb 28)
    begin
      v_new_due_date := (v_target_start + (v_due_day - 1) * interval '1 day')::date;
    exception when others then
      v_new_due_date := (v_target_start + interval '1 month - 1 day')::date;
    end;

    insert into public.bills (
      household_id,
      name,
      category_id,
      amount,
      due_date,
      billing_month,
      status,
      paid_by,
      paid_at,
      is_recurring
    ) values (
      p_household_id,
      v_rec.name,
      v_rec.category_id,
      v_rec.amount,
      v_new_due_date,
      v_target_start,
      'unpaid',
      null,
      null,
      true
    ) returning id into v_new_bill_id;

    -- Create equal bill shares
    if v_member_count > 0 then
      v_total_cents := round(v_rec.amount * 100);
      v_base_cents := div(v_total_cents, v_member_count);
      v_rem_cents := mod(v_total_cents, v_member_count);

      for v_uid in select id from public.profiles where household_id = p_household_id order by display_name
      loop
        v_share_cents := v_base_cents + (case when v_uid = v_first_uid then v_rem_cents else 0 end);
        insert into public.bill_shares (bill_id, user_id, share_amount)
        values (v_new_bill_id, v_uid, (v_share_cents / 100.0)::numeric(12,2));
      end loop;
    end if;

    v_cloned_count := v_cloned_count + 1;
  end loop;

  return v_cloned_count;
end;
$$;
