-- ==============================================================================
-- Migration: 20261110000004_household_rpc.sql
-- Description: RPCs for safe atomic household creation with default categories,
--              and joining by invite code with max member enforcement (5 members)
-- ==============================================================================

-- 1. Helper function to generate random uppercase invite code
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

-- 2. Create household with default categories and assign current user
create or replace function public.create_household_with_defaults(
  p_name text,
  p_currency text default 'PHP'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_invite_code text;
  v_household_id uuid;
  v_exists boolean;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if trim(p_name) = '' then
    raise exception 'Household name cannot be empty';
  end if;

  -- Generate unique invite code
  loop
    v_invite_code := public.generate_invite_code();
    select exists(select 1 from public.households where invite_code = v_invite_code) into v_exists;
    exit when not v_exists;
  end loop;

  -- Insert household
  insert into public.households (name, invite_code, currency, owner_id)
  values (trim(p_name), v_invite_code, coalesce(nullif(trim(p_currency), ''), 'PHP'), v_user_id)
  returning id into v_household_id;

  -- Seed default categories
  insert into public.categories (household_id, name) values
    (v_household_id, 'Groceries'),
    (v_household_id, 'Toiletries'),
    (v_household_id, 'Cleaning'),
    (v_household_id, 'Utilities'),
    (v_household_id, 'Rent'),
    (v_household_id, 'Internet'),
    (v_household_id, 'Other');

  -- Assign user to household
  update public.profiles
  set household_id = v_household_id
  where id = v_user_id;

  return jsonb_build_object(
    'id', v_household_id,
    'name', trim(p_name),
    'invite_code', v_invite_code,
    'currency', coalesce(nullif(trim(p_currency), ''), 'PHP')
  );
end;
$$;


-- 3. Join household by invite code (with 5-member limit check)
create or replace function public.join_household(p_invite_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_household public.households%rowtype;
  v_member_count int;
  c_max_members constant int := 5;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_household
  from public.households
  where upper(trim(invite_code)) = upper(trim(p_invite_code));

  if v_household.id is null then
    raise exception 'Invalid invite code. No household found.';
  end if;

  -- Count existing members
  select count(*) into v_member_count
  from public.profiles
  where household_id = v_household.id;

  -- Check if user is already a member
  if exists (select 1 from public.profiles where id = v_user_id and household_id = v_household.id) then
    return jsonb_build_object(
      'id', v_household.id,
      'name', v_household.name,
      'invite_code', v_household.invite_code,
      'currency', v_household.currency,
      'already_member', true
    );
  end if;

  if v_member_count >= c_max_members then
    raise exception 'Household is full. Maximum % members allowed.', c_max_members;
  end if;

  -- Link profile
  update public.profiles
  set household_id = v_household.id
  where id = v_user_id;

  return jsonb_build_object(
    'id', v_household.id,
    'name', v_household.name,
    'invite_code', v_household.invite_code,
    'currency', v_household.currency,
    'already_member', false
  );
end;
$$;
