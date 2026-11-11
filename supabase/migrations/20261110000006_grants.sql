-- ==============================================================================
-- Migration: 20261110000006_grants.sql
-- Description: Grant table and sequence permissions to authenticated and anon roles.
-- Postgres requires table-level grants in addition to Row-Level Security (RLS) policies.
-- ==============================================================================

-- 1. Grant schema usage
grant usage on schema public to anon, authenticated, service_role;

-- 2. Grant table permissions
grant all on all tables in schema public to postgres, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- 3. Grant sequence permissions (for auto-increment / serial if any)
grant usage, select on all sequences in schema public to authenticated, anon, service_role;

-- 4. Grant routine / function execution permissions
grant execute on all functions in schema public to authenticated, anon, service_role;

-- 5. Set default privileges for any newly created tables/sequences/functions in public
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant usage, select on sequences to authenticated, anon;
alter default privileges in schema public grant execute on functions to authenticated, anon;

