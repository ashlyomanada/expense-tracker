-- ==============================================================================
-- Migration: 20261110000003_seed_data.sql
-- Description: 5 household members, default categories, expenses, bills, and settlements
-- ==============================================================================

do $$
declare
  v_household_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  v_u1 uuid := '22222222-2222-2222-2222-222222222201'::uuid; -- Alice Cruz
  v_u2 uuid := '22222222-2222-2222-2222-222222222202'::uuid; -- Bob Diaz
  v_u3 uuid := '22222222-2222-2222-2222-222222222203'::uuid; -- Charlie Tan
  v_u4 uuid := '22222222-2222-2222-2222-222222222204'::uuid; -- Diana Reyes
  v_u5 uuid := '22222222-2222-2222-2222-222222222205'::uuid; -- Ethan Santos

  v_cat_groceries uuid;
  v_cat_toiletries uuid;
  v_cat_cleaning uuid;
  v_cat_utilities uuid;
  v_cat_rent uuid;
  v_cat_internet uuid;
  v_cat_other uuid;

  v_exp1 uuid;
  v_exp2 uuid;
  v_item_id uuid;

  v_bill1 uuid;
  v_bill2 uuid;
  v_bill3 uuid;
  v_bill4 uuid;

  v_curr_month date := date_trunc('month', current_date)::date;
begin
  -- 1. Create or ensure Auth Users exist in auth.users
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values
    (v_u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@housesplit.test', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Alice Cruz"}', now(), now()),
    (v_u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@housesplit.test', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Bob Diaz"}', now(), now()),
    (v_u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'charlie@housesplit.test', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Charlie Tan"}', now(), now()),
    (v_u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'diana@housesplit.test', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Diana Reyes"}', now(), now()),
    (v_u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ethan@housesplit.test', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Ethan Santos"}', now(), now())
  on conflict (id) do nothing;

  -- 2. Create Household
  insert into public.households (id, name, invite_code, currency, owner_id)
  values (v_household_id, 'Greenwoods Manor #4', 'SPLIT5', 'PHP', v_u1)
  on conflict (id) do update set name = excluded.name;

  -- 3. Profiles
  insert into public.profiles (id, household_id, display_name)
  values
    (v_u1, v_household_id, 'Alice Cruz'),
    (v_u2, v_household_id, 'Bob Diaz'),
    (v_u3, v_household_id, 'Charlie Tan'),
    (v_u4, v_household_id, 'Diana Reyes'),
    (v_u5, v_household_id, 'Ethan Santos')
  on conflict (id) do update set
    household_id = excluded.household_id,
    display_name = excluded.display_name;

  -- 4. Categories (Groceries, Toiletries, Cleaning, Utilities, Rent, Internet, Other)
  insert into public.categories (household_id, name) values (v_household_id, 'Groceries') returning id into v_cat_groceries;
  insert into public.categories (household_id, name) values (v_household_id, 'Toiletries') returning id into v_cat_toiletries;
  insert into public.categories (household_id, name) values (v_household_id, 'Cleaning') returning id into v_cat_cleaning;
  insert into public.categories (household_id, name) values (v_household_id, 'Utilities') returning id into v_cat_utilities;
  insert into public.categories (household_id, name) values (v_household_id, 'Rent') returning id into v_cat_rent;
  insert into public.categories (household_id, name) values (v_household_id, 'Internet') returning id into v_cat_internet;
  insert into public.categories (household_id, name) values (v_household_id, 'Other') returning id into v_cat_other;

  -- 5. Expenses
  -- Expense 1: Paid by Alice
  insert into public.expenses (household_id, store_name, purchase_date, paid_by, notes, created_by)
  values (v_household_id, 'SM Supermarket', current_date - 2, v_u1, 'Weekly grocery and cleaning supplies run', v_u1)
  returning id into v_exp1;

  -- Item 1: Rice 25kg (split all 5: 1250 / 5 = 250 each)
  insert into public.expense_items (expense_id, name, quantity, unit_price, total_price, category_id)
  values (v_exp1, 'Rice 25kg Dinorado', 1, 1250.00, 1250.00, v_cat_groceries)
  returning id into v_item_id;

  insert into public.item_shares (item_id, user_id, share_amount) values
    (v_item_id, v_u1, 250.00),
    (v_item_id, v_u2, 250.00),
    (v_item_id, v_u3, 250.00),
    (v_item_id, v_u4, 250.00),
    (v_item_id, v_u5, 250.00);

  -- Item 2: Detergent & Bleach (split all 5: 360 / 5 = 72 each)
  insert into public.expense_items (expense_id, name, quantity, unit_price, total_price, category_id)
  values (v_exp1, 'Laundry Detergent & Bleach', 2, 180.00, 360.00, v_cat_cleaning)
  returning id into v_item_id;

  insert into public.item_shares (item_id, user_id, share_amount) values
    (v_item_id, v_u1, 72.00),
    (v_item_id, v_u2, 72.00),
    (v_item_id, v_u3, 72.00),
    (v_item_id, v_u4, 72.00),
    (v_item_id, v_u5, 72.00);

  -- Item 3: Coffee Beans 1kg (split Alice, Bob, Charlie: 450 / 3 = 150 each)
  insert into public.expense_items (expense_id, name, quantity, unit_price, total_price, category_id)
  values (v_exp1, 'Sagada Dark Roast Beans 1kg', 1, 450.00, 450.00, v_cat_groceries)
  returning id into v_item_id;

  insert into public.item_shares (item_id, user_id, share_amount) values
    (v_item_id, v_u1, 150.00),
    (v_item_id, v_u2, 150.00),
    (v_item_id, v_u3, 150.00);

  -- Expense 2: Paid by Bob
  insert into public.expenses (household_id, store_name, purchase_date, paid_by, notes, created_by)
  values (v_household_id, 'Mercury Drug', current_date - 1, v_u2, 'Bathroom supplies and medicine cabinet', v_u2)
  returning id into v_exp2;

  -- Item 1: Shampoo & Body Wash (split all 5: 435 / 5 = 87 each)
  insert into public.expense_items (expense_id, name, quantity, unit_price, total_price, category_id)
  values (v_exp2, 'Family Shampoo & Body Wash', 3, 145.00, 435.00, v_cat_toiletries)
  returning id into v_item_id;

  insert into public.item_shares (item_id, user_id, share_amount) values
    (v_item_id, v_u1, 87.00),
    (v_item_id, v_u2, 87.00),
    (v_item_id, v_u3, 87.00),
    (v_item_id, v_u4, 87.00),
    (v_item_id, v_u5, 87.00);

  -- 6. Bills
  -- Bill 1: Apartment Rent (25,000 paid by Alice)
  insert into public.bills (household_id, name, category_id, amount, due_date, billing_month, status, paid_by, paid_at, is_recurring)
  values (v_household_id, 'Apartment Rent', v_cat_rent, 25000.00, v_curr_month + 4, v_curr_month, 'paid', v_u1, now() - interval '3 days', true)
  returning id into v_bill1;

  insert into public.bill_shares (bill_id, user_id, share_amount) values
    (v_bill1, v_u1, 5000.00),
    (v_bill1, v_u2, 5000.00),
    (v_bill1, v_u3, 5000.00),
    (v_bill1, v_u4, 5000.00),
    (v_bill1, v_u5, 5000.00);

  -- Bill 2: Meralco Electricity (4,850 paid by Diana)
  insert into public.bills (household_id, name, category_id, amount, due_date, billing_month, status, paid_by, paid_at, is_recurring)
  values (v_household_id, 'Meralco Electricity', v_cat_utilities, 4850.00, v_curr_month + 14, v_curr_month, 'paid', v_u4, now() - interval '1 day', true)
  returning id into v_bill2;

  insert into public.bill_shares (bill_id, user_id, share_amount) values
    (v_bill2, v_u1, 970.00),
    (v_bill2, v_u2, 970.00),
    (v_bill2, v_u3, 970.00),
    (v_bill2, v_u4, 970.00),
    (v_bill2, v_u5, 970.00);

  -- Bill 3: PLDT Fiber Internet (1,899 unpaid)
  -- 1899 / 5 = 379.80 each
  insert into public.bills (household_id, name, category_id, amount, due_date, billing_month, status, is_recurring)
  values (v_household_id, 'PLDT Home Fiber 200Mbps', v_cat_internet, 1899.00, v_curr_month + 19, v_curr_month, 'unpaid', true)
  returning id into v_bill3;

  insert into public.bill_shares (bill_id, user_id, share_amount) values
    (v_bill3, v_u1, 379.80),
    (v_bill3, v_u2, 379.80),
    (v_bill3, v_u3, 379.80),
    (v_bill3, v_u4, 379.80),
    (v_bill3, v_u5, 379.80);

  -- Bill 4: Maynilad Water (820 unpaid)
  -- 820 / 5 = 164.00 each
  insert into public.bills (household_id, name, category_id, amount, due_date, billing_month, status, is_recurring)
  values (v_household_id, 'Maynilad Water', v_cat_utilities, 820.00, v_curr_month + 21, v_curr_month, 'unpaid', true)
  returning id into v_bill4;

  insert into public.bill_shares (bill_id, user_id, share_amount) values
    (v_bill4, v_u1, 164.00),
    (v_bill4, v_u2, 164.00),
    (v_bill4, v_u3, 164.00),
    (v_bill4, v_u4, 164.00),
    (v_bill4, v_u5, 164.00);

  -- 7. Settlement: Bob paid Alice 2,000 via GCash
  insert into public.settlements (household_id, from_user, to_user, amount, settled_at, note)
  values (v_household_id, v_u2, v_u1, 2000.00, now() - interval '12 hours', 'Partial rent settlement via GCash');

end $$;

