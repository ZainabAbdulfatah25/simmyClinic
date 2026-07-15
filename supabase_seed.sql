-- ==========================================
-- SimmyClinic Supabase Seed Data
-- Run this in the Supabase SQL Editor to populate test users
-- Password for all test users is: password123
-- ==========================================

-- 1. Ensure pgcrypto extension is active
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Insert into auth.users (this triggers public.profiles auto-creation)
DO $$
DECLARE
  -- Static UUIDs to prevent duplicates on repeated runs
  id_patient    UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  id_doctor     UUID := 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e';
  id_pharmacist UUID := 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f';
  id_lab        UUID := 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a';
  id_logistics  UUID := 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b';
  id_admin      UUID := 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c';
  
  -- Encrypt 'password123' using bcrypt (Blowfish)
  hashed_pw     TEXT := crypt('password123', gen_salt('bf', 10));
BEGIN

  -- A. Patient User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_patient, 
    'zainab@example.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Zainab Abdulfatah","role":"patient","phone":"08012345678"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- B. Doctor User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_doctor, 
    'fatima@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Fatima Yahaya Maiauduga","role":"doctor","phone":"08034567890"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- C. Pharmacist User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_pharmacist, 
    'pharmacist@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Pharm. Bello Ibrahim","role":"pharmacist","phone":"08012345678"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- D. Lab Tech User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_lab, 
    'lab@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"MLS Wasila Goranduma","role":"lab","phone":"08023456789"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- E. Logistics Rider User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_logistics, 
    'logistics@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Chinedu Okeke","role":"logistics","phone":"08034567890"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- F. Admin User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    id_admin, 
    'admin@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Admin Director","role":"admin","phone":"08000000000"}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

END $$;


-- 3. Update public.profiles table with role-specific details
-- (The trigger above auto-creates the profiles, we just populate the extra details)

-- Doctor Details
UPDATE public.profiles 
SET 
  specialty = 'Gynaecology',
  schedule = 'Mon - Wed (9am - 2pm)',
  experience = '8 Years',
  reg_no = 'MDCN/8431',
  clinic_room = 'Room 102, West Wing',
  consultation_rate = '₦10,000',
  consultation_duration = '30 mins',
  services = ARRAY['Online Consultation', 'Physical Consultation'],
  level = 'Senior Consultant',
  verified = true,
  terms_accepted = true,
  terms_accepted_at = NOW()
WHERE email = 'fatima@simmycare.com';

-- Pharmacist Details
UPDATE public.profiles 
SET 
  facility_name = 'SimmyCare Central Pharmacy',
  license_no = 'PCN/P/9482',
  verified = true,
  terms_accepted = true,
  terms_accepted_at = NOW()
WHERE email = 'pharmacist@simmycare.com';

-- Lab Tech Details
UPDATE public.profiles 
SET 
  facility_name = 'SimmyCare Diagnostics',
  license_no = 'MLSCN/L/3821',
  verified = true,
  terms_accepted = true,
  terms_accepted_at = NOW()
WHERE email = 'lab@simmycare.com';

-- Logistics Details
UPDATE public.profiles 
SET 
  vehicle_type = 'Motorbike',
  dispatch_area = 'Abuja Central',
  verified = true,
  terms_accepted = true,
  terms_accepted_at = NOW()
WHERE email = 'logistics@simmycare.com';

-- Set Patient and Admin to verified and terms accepted
UPDATE public.profiles 
SET 
  verified = true,
  terms_accepted = true,
  terms_accepted_at = NOW()
WHERE email IN ('zainab@example.com', 'admin@simmycare.com');
