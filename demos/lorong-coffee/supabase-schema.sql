-- ================================================================
-- LORONG COFFEE — Supabase Database Schema v2
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================
-- IMPORTANT: Run these in order. lc_stores and lc_menu must exist first
-- (they should already exist from your original setup).

-- Step 1: Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ================================================================
-- ADMIN ACCOUNTS (custom auth — no Supabase Auth needed for admins)
-- ================================================================
CREATE TABLE IF NOT EXISTS lc_admin_accounts (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('main_admin', 'branch_admin')),
  branch_id   TEXT REFERENCES lc_stores(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  last_login  TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE lc_admin_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_accounts_public" ON lc_admin_accounts;
CREATE POLICY "admin_accounts_public" ON lc_admin_accounts FOR ALL USING (true) WITH CHECK (true);

-- Seed the Main Administrator account
-- Default password: 123123
-- Change this by logging in and using the admin panel, or by updating the hash here.
INSERT INTO lc_admin_accounts (email, password_hash, role, display_name)
VALUES (
  'admin@lorongcoffee.com',
  encode(digest('123123lorong_salt_2024', 'sha256'), 'hex'),
  'main_admin',
  'Main Administrator'
) ON CONFLICT (email) DO NOTHING;


-- ================================================================
-- CUSTOMER PROFILES (linked to Supabase Auth users)
-- ================================================================
CREATE TABLE IF NOT EXISTS lc_customer_profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lc_customer_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customer_profiles_public" ON lc_customer_profiles;
CREATE POLICY "customer_profiles_public" ON lc_customer_profiles FOR ALL USING (true) WITH CHECK (true);


-- ================================================================
-- REWARDS (one record per customer — tracks cup count)
-- ================================================================
CREATE TABLE IF NOT EXISTS lc_rewards (
  customer_id     UUID REFERENCES lc_customer_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  purchase_count  INTEGER DEFAULT 0 CHECK (purchase_count >= 0),
  is_redeemable   BOOLEAN DEFAULT FALSE,
  total_redeemed  INTEGER DEFAULT 0,
  last_redeemed_at TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lc_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rewards_public" ON lc_rewards;
CREATE POLICY "rewards_public" ON lc_rewards FOR ALL USING (true) WITH CHECK (true);


-- ================================================================
-- BRANCH MENU STATUS (per-branch availability overrides)
-- Defaults to 'available' if no record exists for an item+branch pair
-- ================================================================
CREATE TABLE IF NOT EXISTS lc_branch_menu (
  id           BIGSERIAL PRIMARY KEY,
  branch_id    TEXT NOT NULL REFERENCES lc_stores(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL REFERENCES lc_menu(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'available'
               CHECK (status IN ('available', 'sold_out', 'not_carried')),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(branch_id, menu_item_id)
);

ALTER TABLE lc_branch_menu ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "branch_menu_public" ON lc_branch_menu;
CREATE POLICY "branch_menu_public" ON lc_branch_menu FOR ALL USING (true) WITH CHECK (true);


-- ================================================================
-- PURCHASE RECORDS (every purchase + redemption is recorded here)
-- ================================================================
CREATE TABLE IF NOT EXISTS lc_purchase_records (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id   UUID NOT NULL REFERENCES lc_customer_profiles(id) ON DELETE CASCADE,
  branch_id     TEXT NOT NULL REFERENCES lc_stores(id),
  menu_item_id  TEXT NOT NULL REFERENCES lc_menu(id),
  is_redemption BOOLEAN DEFAULT FALSE,
  recorded_by   TEXT REFERENCES lc_admin_accounts(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lc_purchase_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "purchase_records_public" ON lc_purchase_records;
CREATE POLICY "purchase_records_public" ON lc_purchase_records FOR ALL USING (true) WITH CHECK (true);


-- ================================================================
-- DONE
-- After running this, visit /pages/admin/login.html
-- Email: admin@lorongcoffee.com
-- Password: 123123
-- ================================================================
