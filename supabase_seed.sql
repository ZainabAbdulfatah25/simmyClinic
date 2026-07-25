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
  hashed_pw TEXT := crypt('password123', gen_salt('bf', 10));
BEGIN

  -- A. Patient User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 
    'zainab@example.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Zainab Abdulfatah","role":"patient","phone":"08012345678","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- B. Admin User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 
    'admin@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Admin Director","role":"admin","phone":"08000000000","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- C. Pharmacist User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 
    'pharmacist@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Pharm. Bello Ibrahim","role":"pharmacist","phone":"08012345678","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- D. Lab Tech User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 
    'lab@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"MLS Wasila Goranduma","role":"lab","phone":"08023456789","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- E. Logistics Rider User
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 
    'logistics@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Chinedu Okeke","role":"logistics","phone":"08034567890","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- F. Doctor 1: Dr. Fatima Yahaya Maiauduga
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 
    'fatima@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Fatima Yahaya Maiauduga","role":"doctor","phone":"08034567890","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- G. Doctor 2: Dr. Adam Zamzam
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 
    'adam@simmycare.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Adam Zamzam","role":"doctor","phone":"08051234567","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- H. Doctor 3: Dr. Mato Saddiqa Tijjani
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 
    'matosaddiqa@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Mato Saddiqa Tijjani","role":"doctor","phone":"+234 909 677 6797","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- I. Doctor 4: Dr. Abubakar Muhammad Bamalli
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', 
    'abubakarbalili79@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Abubakar Muhammad Bamalli","role":"doctor","phone":"+234 813 870 5738","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- J. Doctor 5: Dr. Wasila Goranduma
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b6c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e', 
    'wasilagoranduma@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Wasila Goranduma","role":"doctor","phone":"+234 803 133 8534","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- K. Doctor 6: Hadiza Garba Ammani
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e', 
    'kadykubra@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Hadiza Garba Ammani","role":"doctor","phone":"+234 706 665 0730","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- L. Doctor 7: Asma''u Zubairu
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 
    'ridwanasmau901@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Asma''u Zubairu","role":"doctor","phone":"+234 916 652 1888","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- M. Doctor 8: Dr. Mohammed Sa''ima Jibril
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
  VALUES (
    'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e', 
    'mohammedrealsaemaj@gmail.com', 
    hashed_pw, 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Dr. Mohammed Sa''ima Jibril","role":"doctor","phone":"+234 901 432 4442","terms_accepted":true}', 
    'authenticated', 
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

END $$;


-- 3. Update public.profiles table with role-specific details
UPDATE public.profiles SET specialty = 'Gynaecology', schedule = 'Mon - Wed (9am - 2pm)', experience = '8 Years', reg_no = 'MDCN/8431', clinic_room = 'Room 102, West Wing', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation'], level = 'Senior Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'fatima@simmycare.com';
UPDATE public.profiles SET specialty = 'General Medicine', schedule = 'Mon - Fri (8am - 4pm)', experience = '10 Years', reg_no = 'MDCN/7123', clinic_room = 'Room 205, Main Block', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Mobile Laboratory'], level = 'Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'adam@simmycare.com';
UPDATE public.profiles SET specialty = 'Public Health', schedule = 'Mon - Fri (9am - 4pm)', experience = '4 Years', reg_no = 'MDCN/6203', clinic_room = 'Room 110, Public Health Wing', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation'], level = 'Senior Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'matosaddiqa@gmail.com';
UPDATE public.profiles SET specialty = 'General Medicine', schedule = 'Mon - Fri (9am - 5pm)', experience = '9 Years', reg_no = 'MDCN/5890', clinic_room = 'Room 207, Main Block', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation'], level = 'Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'abubakarbalili79@gmail.com';
UPDATE public.profiles SET specialty = 'Laboratory', schedule = 'Mon - Fri (9am - 5pm)', experience = '6 Years', reg_no = 'MLS/REG', clinic_room = 'Room 105, Diagnostic Wing', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Mobile Laboratory'], level = 'Diagnostic Specialist', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'wasilagoranduma@gmail.com';
UPDATE public.profiles SET specialty = 'Psychology', schedule = 'Mon - Fri (9am - 5pm)', experience = '9 Years', reg_no = 'MNCP/9821', clinic_room = 'Room 108, Wellness Wing', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation'], level = 'Senior Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'kadykubra@gmail.com';
UPDATE public.profiles SET specialty = 'Public Health', schedule = 'Mon - Fri (8am - 4pm)', experience = '10 Years', reg_no = 'CHO/7812', clinic_room = 'Room 114, Community Health Unit', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation', 'Home Services'], level = 'Senior Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'ridwanasmau901@gmail.com';
UPDATE public.profiles SET specialty = 'ENT', schedule = 'Mon - Fri (9am - 5pm)', experience = '15 Years', reg_no = 'MDCN/4521', clinic_room = 'Room 201, ENT & Specialist Wing', consultation_rate = '₦3,000', consultation_duration = '30 mins', services = ARRAY['Online Consultation', 'Physical Consultation', 'Home Services'], level = 'Senior Consultant', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'mohammedrealsaemaj@gmail.com';

UPDATE public.profiles SET specialty = 'Pharmacy', facility_name = 'SimmyCare Central Pharmacy', license_no = 'PCN/P/9482', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'pharmacist@simmycare.com';
UPDATE public.profiles SET facility_name = 'SimmyCare Diagnostics', license_no = 'MLSCN/L/3821', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'lab@simmycare.com';
UPDATE public.profiles SET vehicle_type = 'Motorbike', dispatch_area = 'Abuja Central', verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email = 'logistics@simmycare.com';
UPDATE public.profiles SET verified = true, terms_accepted = true, terms_accepted_at = NOW() WHERE email IN ('zainab@example.com', 'admin@simmycare.com');

-- 4. Insert Default Drug Inventory (using simple INSERT with ON CONFLICT DO NOTHING)
INSERT INTO public.clinic_drugs (name, price, category, in_stock) VALUES
  ('Paracetamol Syrup 125mg/5ml', 1200, 'Analgesics', true),
  ('Ibuprofen Tablets 400mg', 1500, 'Analgesics', true),
  ('Amoxicillin Capsules 500mg', 3500, 'Antibiotics', true),
  ('Azithromycin Tablets 500mg', 5000, 'Antibiotics', true),
  ('Ciprofloxacin Tablets 500mg', 4200, 'Antibiotics', true),
  ('Artemether + Lumefantrine (ACT) Antimalarial', 2500, 'Antimalarials', true),
  ('Vitamin C Syrup & B-Complex', 1000, 'Supplements', true),
  ('Multivitamin Capsules (30 Days Pack)', 2800, 'Supplements', true),
  ('Cetirizine Allergy Tablets 10mg', 1800, 'Antihistamines', true),
  ('Cough Expectoral Syrup', 2200, 'Respiratory', true)
ON CONFLICT DO NOTHING;
