# HouseSplit — Simple Household Expense Splitter

HouseSplit is a simple, mobile-friendly web application built for households of up to 5 members to manage shared expenses, divide itemized grocery receipts, track recurring monthly bills (rent, utilities, internet), calculate net pairwise debts ("who owes whom"), and export monthly financial PDF reports.

## Tech Stack
- **Nuxt 3** + **Vue 3** + **TypeScript**
- **@nuxtjs/supabase** (Supabase Auth & Postgres Client)
- **Nuxt UI** (Tailwind CSS + Headless UI + Heroicons)
- **Supabase** (Postgres, Row Level Security, Triggers, Views/RPCs)
- **pdfmake** (Client-side monthly PDF report export)

---

## 1. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-supabase-anon-public-key
DEFAULT_CURRENCY=PHP
```

---

## 2. Supabase Database Setup & Migrations
In your Supabase project's **SQL Editor**, run the migration files located in `supabase/migrations/` in sequential order:

1. `20261110000001_initial_schema.sql`
   - Creates tables: `households`, `profiles`, `categories`, `expenses`, `expense_items`, `item_shares`, `bills`, `bill_shares`, `settlements`.
   - Money stored as `numeric(12,2)`.
   - Row-Level Security (RLS) enabled on all 9 tables with `current_household_id()` isolation.
   - User profile auto-creation trigger on auth signup.
2. `20261110000002_functions_and_views.sql`
   - `member_balances(household_id)`: Calculates net balance per member (paid − owed − settlements).
   - `pairwise_debts(household_id)`: Simplified "who owes whom" greedy matching.
   - `monthly_summary(household_id, month)`: Totals by category and member.
   - `save_expense_with_items(...)`: Atomic single-transaction save for expenses, items, and shares with integer-centavo rounding (leftover centavos to payer).
3. `20261110000003_seed_data.sql`
   - Seeds sample household "Greenwoods Manor #4" (invite code `SPLIT5`) with 5 members: Alice, Bob, Charlie, Diana, Ethan.
   - Seeds default categories, sample grocery expenses with split items, recurring utility bills, and a GCash settlement.
4. `20261110000004_household_rpc.sql`
   - `create_household_with_defaults(name, currency)`: Generates invite code and seeds categories.
   - `join_household(invite_code)`: Enforces max 5 members per household.
5. `20261110000005_bills_rpc.sql`
   - `save_bill(...)`: Saves bill and creates equal bill shares for all current members.
   - `copy_last_month_bills(household_id, target_month)`: Clones recurring bills into the selected month as unpaid.
6. `20261110000006_grants.sql`
   - Grants `USAGE` on schema public and table permissions (`SELECT, INSERT, UPDATE, DELETE`) to `authenticated` and `anon` roles.

---

## 3. Running Locally

```bash
# Install dependencies
npm install

# Run typecheck
npm run typecheck

# Start local dev server
npm run dev
```

Visit `http://localhost:3000`.

---

## 4. End-to-End Walkthrough

1. **Sign Up / Login**:
   - Go to `/register` and create an account.
2. **Onboarding / Joining**:
   - If starting fresh: Enter household name and currency at `/onboarding`.
   - If joining an existing household: Enter invite code (e.g. `SPLIT5`) at `/join`.
3. **Log an Expense**:
   - Go to `/expenses/new`. Enter store name (e.g. "SM Supermarket"), purchase date, and paid-by.
   - Add items with quantities and unit prices.
   - Tap member chips on each item to customize who shares that item (equal split live preview, remainder centavos go to payer).
   - Tap "Apply Item 1 Split to All" to quickly copy member selections.
   - Save and view itemized shares on `/expenses/[id]`.
4. **Manage Monthly Bills**:
   - Go to `/bills`. Add rent or power bill.
   - Use "Copy Last Month's Bills" to clone recurring bills into the current month.
   - Mark a bill as paid and specify who paid.
5. **View Balances & Settle Up**:
   - Go to `/balances` to see net balances and pairwise debt suggestions ("Bob owes Alice ₱500").
   - Click "Settle" to record a GCash/bank transfer settlement.
6. **Download Monthly Report**:
   - Go to `/reports`. Review total spent, category breakdown, bill status, itemized expenses, and debt suggestions.
   - Click "Download PDF" to generate and download an A4 formatted report.

---

## 5. Deployment

### Deploy to Netlify
1. Connect Git repository to Netlify.
2. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.output/public`
3. Environment variables: Add `SUPABASE_URL`, `SUPABASE_KEY`, and `DEFAULT_CURRENCY`.

### Deploy to Vercel
1. Import repository in Vercel.
2. Framework Preset: **Nuxt.js**
3. Environment variables: Add `SUPABASE_URL`, `SUPABASE_KEY`, and `DEFAULT_CURRENCY`.
4. Deploy!

