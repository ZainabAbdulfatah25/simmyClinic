-- ==========================================
-- SimmyClinic Supabase Backend Schema
-- PostgreSQL Database Initialization
-- ==========================================

-- 1. Clean up existing tables and types for clean re-runs
DROP TABLE IF EXISTS public.clinic_drugs CASCADE;
DROP TABLE IF EXISTS public.lab_requests CASCADE;
DROP TABLE IF EXISTS public.pharmacy_orders CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 2. Custom Types & Enums
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'pharmacist', 'lab', 'logistics', 'admin');

-- 2. Profiles Table (Holds all user details linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  
  -- Doctor Profile Fields
  specialty TEXT,
  schedule TEXT,
  experience TEXT,
  reg_no TEXT,
  clinic_room TEXT,
  consultation_rate TEXT,
  consultation_duration TEXT DEFAULT '30 mins',
  services TEXT[],
  level TEXT,
  image TEXT,
  
  -- Pharmacy / Lab Fields
  facility_name TEXT,
  license_no TEXT,
  
  -- Logistics Rider Fields
  vehicle_type TEXT,
  dispatch_area TEXT,
  
  -- Global Staff States
  verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  
  -- Consent & Legal Compliance
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Appointments Table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  symptoms TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Cancelled', 'Completed')),
  prescription TEXT,
  prescription_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security on Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Pharmacy Orders Table
CREATE TABLE public.pharmacy_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  rx_notes TEXT,
  total_cost NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Awaiting Dispatch' CHECK (status IN ('Awaiting Dispatch', 'Out for Delivery', 'Delivered', 'Cancelled')),
  assigned_rider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security on Pharmacy Orders
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;

-- 5. Lab Requests Table
CREATE TABLE public.lab_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  test_details TEXT NOT NULL,
  address TEXT NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Sample Collected', 'Processing', 'Completed', 'Cancelled')),
  assigned_rider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lab_technician_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  result_text TEXT,
  result_file_url TEXT,
  date DATE,
  time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security on Lab Requests
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;

-- 6. Clinic Drugs/Inventory Table
CREATE TABLE public.clinic_drugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row-Level Security on Clinic Drugs
ALTER TABLE public.clinic_drugs ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- A. Profiles Policies
CREATE POLICY "Allow public SELECT for doctor profiles" 
  ON public.profiles FOR SELECT 
  USING (role = 'doctor' OR id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow users to UPDATE their own profiles" 
  ON public.profiles FOR UPDATE 
  USING (id = auth.uid());

-- B. Appointments Policies
CREATE POLICY "Allow users to view their own associated appointments" 
  ON public.appointments FOR SELECT 
  USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow users to create appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (patient_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow patients (to cancel) or doctors/admins to update appointments" 
  ON public.appointments FOR UPDATE 
  USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- C. Pharmacy Orders Policies
CREATE POLICY "Allow access to pharmacy orders" 
  ON public.pharmacy_orders FOR SELECT 
  USING (patient_id = auth.uid() OR assigned_rider_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist')
  ));

CREATE POLICY "Allow patients/admins to create pharmacy orders" 
  ON public.pharmacy_orders FOR INSERT 
  WITH CHECK (patient_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow updates to pharmacy orders" 
  ON public.pharmacy_orders FOR UPDATE 
  USING (patient_id = auth.uid() OR assigned_rider_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist')
  ));

-- D. Lab Requests Policies
CREATE POLICY "Allow access to lab requests" 
  ON public.lab_requests FOR SELECT 
  USING (patient_id = auth.uid() OR assigned_rider_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'lab')
  ));

CREATE POLICY "Allow patients/doctors/admins to create lab requests" 
  ON public.lab_requests FOR INSERT 
  WITH CHECK (patient_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor')
  ));

CREATE POLICY "Allow updates to lab requests" 
  ON public.lab_requests FOR UPDATE 
  USING (patient_id = auth.uid() OR assigned_rider_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'lab')
  ));

-- E. Clinic Drugs Policies
CREATE POLICY "Allow everyone to read drugs inventory" 
  ON public.clinic_drugs FOR SELECT 
  USING (true);

CREATE POLICY "Allow only admins/pharmacists to manage drugs" 
  ON public.clinic_drugs FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist')
  ));


-- ==========================================
-- TRIGGER ACTIONS FOR AUTH REGISTRATION
-- ==========================================

-- Function to handle new user registration from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    phone, 
    role,
    specialty,
    reg_no,
    facility_name,
    license_no,
    vehicle_type,
    dispatch_area,
    level,
    verified,
    terms_accepted,
    terms_accepted_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Valued Patient'),
    new.raw_user_meta_data->>'phone',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role),
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'reg_no',
    new.raw_user_meta_data->>'facility_name',
    new.raw_user_meta_data->>'license_no',
    new.raw_user_meta_data->>'vehicle_type',
    new.raw_user_meta_data->>'dispatch_area',
    new.raw_user_meta_data->>'level',
    -- Patients and Admins are auto-verified; staff needs admin activation
    CASE 
      WHEN COALESCE(new.raw_user_meta_data->>'role', 'patient') IN ('patient', 'admin') THEN true 
      ELSE false 
    END,
    COALESCE((new.raw_user_meta_data->>'terms_accepted')::boolean, false),
    CASE 
      WHEN (new.raw_user_meta_data->>'terms_accepted')::boolean = true THEN NOW() 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution definition
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- 8. SUPABASE STORAGE BUCKETS SETUP
-- ==========================================
-- Create 'avatars' storage bucket for doctor photos & profile attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  10485760, 
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Row-Level Security Policies for 'avatars' bucket
CREATE POLICY "Allow public SELECT on avatars bucket" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow public INSERT into avatars bucket" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public UPDATE on avatars bucket" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow public DELETE on avatars bucket" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'avatars');

