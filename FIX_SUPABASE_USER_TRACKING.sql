-- ============================================================
-- SIMMYCLINIC - SUPABASE COMPLETE RLS & INFINITE RECURSION FIX
-- Run this entire script in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Enable UUID Extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Add required columns to public.profiles if missing and remove strict FK constraint
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. DROP ALL POTENTIALLY RECURSIVE & PREVIOUS POLICIES ON PROFILES
DROP POLICY IF EXISTS "Allow public SELECT for doctor profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to UPDATE their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "temp_open_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public SELECT for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public INSERT/UPDATE for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_all_policy" ON public.profiles;

-- Enable RLS and add simple non-recursive policies on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_select_policy"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_public_all_policy"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. DROP RECURSIVE & PREVIOUS POLICIES ON APPOINTMENTS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to view their own associated appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow users to create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow patients (to cancel) or doctors/admins to update appointments" ON public.appointments;
DROP POLICY IF EXISTS "temp_open_appointments" ON public.appointments;
DROP POLICY IF EXISTS "appointments_public_all_policy" ON public.appointments;

CREATE POLICY "appointments_public_all_policy"
  ON public.appointments FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. DROP RECURSIVE & PREVIOUS POLICIES ON PHARMACY_ORDERS
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow access to pharmacy orders" ON public.pharmacy_orders;
DROP POLICY IF EXISTS "Allow patients/admins to create pharmacy orders" ON public.pharmacy_orders;
DROP POLICY IF EXISTS "Allow updates to pharmacy orders" ON public.pharmacy_orders;
DROP POLICY IF EXISTS "temp_open_orders" ON public.pharmacy_orders;
DROP POLICY IF EXISTS "pharmacy_orders_public_all_policy" ON public.pharmacy_orders;

CREATE POLICY "pharmacy_orders_public_all_policy"
  ON public.pharmacy_orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. DROP RECURSIVE & PREVIOUS POLICIES ON LAB_REQUESTS
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow access to lab requests" ON public.lab_requests;
DROP POLICY IF EXISTS "Allow patients/doctors/admins to create lab requests" ON public.lab_requests;
DROP POLICY IF EXISTS "Allow updates to lab requests" ON public.lab_requests;
DROP POLICY IF EXISTS "temp_open_lab_requests" ON public.lab_requests;
DROP POLICY IF EXISTS "lab_requests_public_all_policy" ON public.lab_requests;

CREATE POLICY "lab_requests_public_all_policy"
  ON public.lab_requests FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. DROP RECURSIVE & PREVIOUS POLICIES ON CLINIC_DRUGS
ALTER TABLE public.clinic_drugs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow everyone to read drugs inventory" ON public.clinic_drugs;
DROP POLICY IF EXISTS "Allow only admins/pharmacists to manage drugs" ON public.clinic_drugs;
DROP POLICY IF EXISTS "temp_open_inventory_drugs" ON public.clinic_drugs;
DROP POLICY IF EXISTS "clinic_drugs_public_all_policy" ON public.clinic_drugs;

CREATE POLICY "clinic_drugs_public_all_policy"
  ON public.clinic_drugs FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. COMPATIBILITY POLICIES FOR GENERIC TABLE NAMES (IF USED)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'staff') THEN
    EXECUTE 'ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;';
    EXECUTE 'DROP POLICY IF EXISTS "temp_open_staff" ON public.staff;';
    EXECUTE 'DROP POLICY IF EXISTS "staff_public_all_policy" ON public.staff;';
    EXECUTE 'CREATE POLICY "staff_public_all_policy" ON public.staff FOR ALL USING (true) WITH CHECK (true);';
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    EXECUTE 'ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;';
    EXECUTE 'DROP POLICY IF EXISTS "temp_open_orders" ON public.orders;';
    EXECUTE 'DROP POLICY IF EXISTS "orders_public_all_policy" ON public.orders;';
    EXECUTE 'CREATE POLICY "orders_public_all_policy" ON public.orders FOR ALL USING (true) WITH CHECK (true);';
  END IF;
END $$;
