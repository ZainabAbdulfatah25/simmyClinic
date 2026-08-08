# SimmyCare Online Clinic — Credentials & Access Registry

This document provides a comprehensive summary of all user accounts, roles, access credentials, and database integration details for the **SimmyCare Online Clinic** platform connected to your Supabase backend.

---

## 1. System Credentials & Access Directory

> [!IMPORTANT]
> The default password for **all accounts** is: `password123`  
> *(The legacy admin username portal login also accepts `admin` / `admin`)*.

### 📋 Full User Roster

| Role / Designation | Full Name | Login Email / Identifier | Default Password | Specialization / Scope |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | Admin Director | `admin@simmycare.com`<br>*(Username: `admin`)* | `password123`<br>*(or `admin`)* | Full administrative controls, clinic management, appointments, and staff oversight. |
| **Chief Executive Officer (CEO)** | Mohammed Sa'ima Jibril | `mohammedrealsaemaj@gmail.com` | `password123` | Executive Management, ENT Care & Public Health. |
| **Diagnostic Specialist Doctor** | Dr. Wasila Goranduma | `wasilagoranduma@gmail.com` | `password123` | Public Health & Clinical Laboratory Diagnostics. |
| **Consultant Doctor** | Dr. Adam Zamzam | `adam@simmycare.com` | `password123` | General Medicine, Family Practice, and Chronic Disease. |
| **Senior Consultant Doctor** | Dr. Abubakar Muhammad Bamalli | `abubakarbalili79@gmail.com` | `password123` | Obstetrics & Gynaecology and General Medicine. |
| **Clinical Specialist** | Fatima Yahaya Maiauduga | `fatima@simmycare.com` | `password123` | Obstetrics & Gynaecology, Maternal Health, and Reproductive Wellness. |
| **Public Health Specialist** | Mato Saddiqa Tijjani | `matosaddiqa@gmail.com` | `password123` | Public Health & Community Healthcare. |
| **Senior Specialist** | Hadiza Garba Ammani | `kadykubra@gmail.com` | `password123` | Psychology & Mental Health Services. |
| **Community Health Officer** | Asma'u Zubairu | `ridwanasmau901@gmail.com` | `password123` | Community Health & Disease Prevention. |
| **Pharmacist** | Pharm. Bello Ibrahim | `pharmacist@simmycare.com` | `password123` | Central Pharmacy Inventory, Prescriptions, and Checkout. |
| **Lab Technologist** | MLS Wasila Goranduma | `lab@simmycare.com` | `password123` | Diagnostics Queue, Specimen Intake, and Lab File Uploads. |
| **Logistics / Courier** | Chinedu Okeke | `logistics@simmycare.com` | `password123` | Rider Console, Delivery Assignments, and Path Telemetry. |
| **Patient** | Zainab Abdulfatah | `zainab@example.com` | `password123` | Booking Consultations, Pharmacy Orders, and Diagnostic Reports. |

---

## 2. Supabase Backend Connection Details

- **Project URL:** `https://rxdhlvfmoffsgyaqcji.supabase.co`
- **Storage Bucket:** `avatars` (Public Access Enabled for photo and document uploads)
- **Local Config File:** `.env`

---

## 3. Database Initialization Files

1. **`supabase_schema.sql`**: Database structure, RLS security policies, Auth triggers, and `avatars` storage setup.
2. **`supabase_seed.sql`**: Pre-loaded script for inserting all 13 user accounts and default drug stock.

---

## 4. How to Sign In & Test

1. Launch local dev server: `npm run dev`
2. Open browser to `http://localhost:5173/#portal-login`
3. Select your desired role tab (**Patient**, **Doctor**, **Admin**, **Pharmacy**, **Lab**, or **Logistics**).
4. Enter the email address and password from the table above.
