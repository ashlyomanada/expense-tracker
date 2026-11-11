-- ==============================================================================
-- Migration: 20261110000001_initial_schema.sql
-- Description: Core tables, helper functions, and Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. Households table
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  currency text not null default 'PHP',
  owner_id uuid not null,
  created_at timestamptz not null default now()
);

-- 2. Profiles table (linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- Index on household_id for fast lookup
create index if not exists idx_profiles_household_id on public.profiles(household_id);

-- 3. Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_household_id on public.categories(household_id);

-- 4. Expenses table
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  store_name text not null,
  purchase_date date not null,
  paid_by uuid not null references public.profiles(id) on delete restrict,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_household_id on public.expenses(household_id);
create index if not exists idx_expenses_purchase_date on public.expenses(purchase_date);

-- 5. Expense items table
create table if not exists public.expense_items (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  name text not null,
  quantity numeric(12,2) not null default 1.00,
  unit_price numeric(12,2) not null default 0.00,
  total_price numeric(12,2) not null default 0.00,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_expense_items_expense_id on public.expense_items(expense_id);

-- 6. Item shares table (one row per member sharing an item)
create table if not exists public.item_shares (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.expense_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  share_amount numeric(12,2) not null default 0.00,
  created_at timestamptz not null default now(),
  constraint uq_item_user unique (item_id, user_id)
);

create index if not exists idx_item_shares_item_id on public.item_shares(item_id);
create index if not exists idx_item_shares_user_id on public.item_shares(user_id);

-- 7. Bills table
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null default 0.00,
  due_date date not null,
  billing_month date not null, -- Normalized to 1st of month (YYYY-MM-01)
  status text not null check (status in ('unpaid', 'paid')) default 'unpaid',
  paid_by uuid references public.profiles(id) on delete set null,
  paid_at timestamptz,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_bills_household_id on public.bills(household_id);
create index if not exists idx_bills_billing_month on public.bills(billing_month);

-- 8. Bill shares table (always split equally among all members)
create table if not exists public.bill_shares (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  share_amount numeric(12,2) not null default 0.00,
  created_at timestamptz not null default now(),
  constraint uq_bill_user unique (bill_id, user_id)
);

create index if not exists idx_bill_shares_bill_id on public.bill_shares(bill_id);
create index if not exists idx_bill_shares_user_id on public.bill_shares(user_id);

-- 9. Settlements table
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  from_user uuid not null references public.profiles(id) on delete restrict,
  to_user uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  settled_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_settlements_household_id on public.settlements(household_id);

-- ==============================================================================
-- Helper Function: current_household_id()
-- ==============================================================================
create or replace function public.current_household_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select household_id from public.profiles where id = auth.uid();
$$;

-- ==============================================================================
-- Trigger: Auto-create profile on signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, household_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- Row-Level Security (RLS)
-- ==============================================================================

-- 1. Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile or household members"
  on public.profiles for select
  using (
    id = auth.uid() or
    (household_id is not null and household_id = public.current_household_id())
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- 2. Households
alter table public.households enable row level security;

create policy "Members can view their household, or query invite code to join"
  on public.households for select
  using (
    id = public.current_household_id() or
    auth.uid() is not null -- allows verifying invite_code when joining
  );

create policy "Authenticated users can create a household"
  on public.households for insert
  with check (auth.uid() = owner_id);

create policy "Household owners or members can update household"
  on public.households for update
  using (id = public.current_household_id());

-- 3. Categories
alter table public.categories enable row level security;

create policy "Household members can view categories"
  on public.categories for select
  using (household_id = public.current_household_id());

create policy "Household members can insert categories"
  on public.categories for insert
  with check (household_id = public.current_household_id());

create policy "Household members can update categories"
  on public.categories for update
  using (household_id = public.current_household_id());

create policy "Household members can delete categories"
  on public.categories for delete
  using (household_id = public.current_household_id());

-- 4. Expenses
alter table public.expenses enable row level security;

create policy "Household members can view expenses"
  on public.expenses for select
  using (household_id = public.current_household_id());

create policy "Household members can insert expenses"
  on public.expenses for insert
  with check (household_id = public.current_household_id());

create policy "Household members can update expenses"
  on public.expenses for update
  using (household_id = public.current_household_id());

create policy "Household members can delete expenses"
  on public.expenses for delete
  using (household_id = public.current_household_id());

-- 5. Expense Items
alter table public.expense_items enable row level security;

create policy "Household members can view expense items"
  on public.expense_items for select
  using (
    expense_id in (
      select id from public.expenses where household_id = public.current_household_id()
    )
  );

create policy "Household members can insert expense items"
  on public.expense_items for insert
  with check (
    expense_id in (
      select id from public.expenses where household_id = public.current_household_id()
    )
  );

create policy "Household members can update expense items"
  on public.expense_items for update
  using (
    expense_id in (
      select id from public.expenses where household_id = public.current_household_id()
    )
  );

create policy "Household members can delete expense items"
  on public.expense_items for delete
  using (
    expense_id in (
      select id from public.expenses where household_id = public.current_household_id()
    )
  );

-- 6. Item Shares
alter table public.item_shares enable row level security;

create policy "Household members can view item shares"
  on public.item_shares for select
  using (
    item_id in (
      select ei.id from public.expense_items ei
      join public.expenses e on e.id = ei.expense_id
      where e.household_id = public.current_household_id()
    )
  );

create policy "Household members can insert item shares"
  on public.item_shares for insert
  with check (
    item_id in (
      select ei.id from public.expense_items ei
      join public.expenses e on e.id = ei.expense_id
      where e.household_id = public.current_household_id()
    )
  );

create policy "Household members can update item shares"
  on public.item_shares for update
  using (
    item_id in (
      select ei.id from public.expense_items ei
      join public.expenses e on e.id = ei.expense_id
      where e.household_id = public.current_household_id()
    )
  );

create policy "Household members can delete item shares"
  on public.item_shares for delete
  using (
    item_id in (
      select ei.id from public.expense_items ei
      join public.expenses e on e.id = ei.expense_id
      where e.household_id = public.current_household_id()
    )
  );

-- 7. Bills
alter table public.bills enable row level security;

create policy "Household members can view bills"
  on public.bills for select
  using (household_id = public.current_household_id());

create policy "Household members can insert bills"
  on public.bills for insert
  with check (household_id = public.current_household_id());

create policy "Household members can update bills"
  on public.bills for update
  using (household_id = public.current_household_id());

create policy "Household members can delete bills"
  on public.bills for delete
  using (household_id = public.current_household_id());

-- 8. Bill Shares
alter table public.bill_shares enable row level security;

create policy "Household members can view bill shares"
  on public.bill_shares for select
  using (
    bill_id in (
      select id from public.bills where household_id = public.current_household_id()
    )
  );

create policy "Household members can insert bill shares"
  on public.bill_shares for insert
  with check (
    bill_id in (
      select id from public.bills where household_id = public.current_household_id()
    )
  );

create policy "Household members can update bill shares"
  on public.bill_shares for update
  using (
    bill_id in (
      select id from public.bills where household_id = public.current_household_id()
    )
  );

create policy "Household members can delete bill shares"
  on public.bill_shares for delete
  using (
    bill_id in (
      select id from public.bills where household_id = public.current_household_id()
    )
  );

-- 9. Settlements
alter table public.settlements enable row level security;

create policy "Household members can view settlements"
  on public.settlements for select
  using (household_id = public.current_household_id());

create policy "Household members can insert settlements"
  on public.settlements for insert
  with check (household_id = public.current_household_id());

create policy "Household members can update settlements"
  on public.settlements for update
  using (household_id = public.current_household_id());

create policy "Household members can delete settlements"
  on public.settlements for delete
  using (household_id = public.current_household_id());

-- ==============================================================================
-- Role Grants (Required by Postgres alongside RLS)
-- ==============================================================================
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated, anon, service_role;
grant execute on all functions in schema public to authenticated, anon, service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant usage, select on sequences to authenticated, anon;
alter default privileges in schema public grant execute on functions to authenticated, anon;


