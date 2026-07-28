-- ============================================================
-- SIMMYCARE CLINIC - SUPABASE DATABASE SCHEMA
-- Run this entire file in Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── APPOINTMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                 TEXT PRIMARY KEY,
  patient_name       TEXT NOT NULL,
  phone              TEXT,
  email              TEXT,
  doctor             TEXT,
  doctor_id          TEXT,
  specialty          TEXT,
  consultation_mode  TEXT DEFAULT 'Virtual Consultation',
  service_type       TEXT DEFAULT 'Virtual Consultation',
  package_title      TEXT,
  price              TEXT,
  date               TEXT,
  time               TEXT,
  symptoms           TEXT,
  home_address       TEXT,
  state_name         TEXT,
  lga                TEXT,
  ward               TEXT,
  status             TEXT DEFAULT 'Pending',
  notes              TEXT DEFAULT '',
  prescription       TEXT DEFAULT '',
  is_nhis            BOOLEAN DEFAULT FALSE,
  nhis_number        TEXT,
  nhis_hmo           TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STAFF ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id              TEXT UNIQUE,
  name                  TEXT NOT NULL,
  email                 TEXT UNIQUE NOT NULL,
  role                  TEXT NOT NULL CHECK (role IN ('doctor','pharmacist','lab','logistics','admin')),
  specialty             TEXT,
  phone                 TEXT,
  bio                   TEXT,
  schedule              TEXT,
  experience            TEXT,
  reg_no                TEXT,
  license               TEXT,
  clinic_room           TEXT,
  consultation_rate     TEXT,
  consultation_duration TEXT,
  image_url             TEXT,
  pharmacy_name         TEXT,
  pharmacy_license      TEXT,
  facility_name         TEXT,
  lab_license           TEXT,
  vehicle_type          TEXT,
  dispatch_area         TEXT,
  verified              BOOLEAN DEFAULT FALSE,
  active                BOOLEAN DEFAULT TRUE,
  supabase_user_id      UUID,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS (Pharmacy + Lab bookings) ────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('pharmacy','lab')),
  patient_name   TEXT NOT NULL,
  phone          TEXT,
  email          TEXT,
  items          JSONB DEFAULT '[]',
  total_cost     NUMERIC DEFAULT 0,
  status         TEXT DEFAULT 'Pending',
  address        TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PHARMACY / DRUG INVENTORY ───────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_drugs (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT,
  price      NUMERIC DEFAULT 0,
  in_stock   BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LAB DIAGNOSTIC KIT INVENTORY ───────────────────────────
CREATE TABLE IF NOT EXISTS inventory_lab (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT,
  description TEXT,
  price      NUMERIC DEFAULT 0,
  in_stock   BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PATIENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT,
  supabase_user_id UUID UNIQUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS) on all tables
-- (Policies will be added in Step 8)
-- ============================================================
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lab   ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TEMPORARY OPEN POLICIES (so the app works while we build)
-- These will be replaced with strict role policies in Step 8
-- ============================================================
DROP POLICY IF EXISTS "temp_open_appointments"    ON appointments;
DROP POLICY IF EXISTS "temp_open_staff"           ON staff;
DROP POLICY IF EXISTS "temp_open_orders"          ON orders;
DROP POLICY IF EXISTS "temp_open_inventory_drugs" ON inventory_drugs;
DROP POLICY IF EXISTS "temp_open_inventory_lab"   ON inventory_lab;
DROP POLICY IF EXISTS "temp_open_patients"        ON patients;

CREATE POLICY "temp_open_appointments"    ON appointments    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_staff"           ON staff           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_orders"          ON orders          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_inventory_drugs" ON inventory_drugs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_inventory_lab"   ON inventory_lab   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_patients"        ON patients        FOR ALL USING (true) WITH CHECK (true);
