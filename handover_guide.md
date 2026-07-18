# SimmyCare Online Clinic  Developer Handover Guide & Systems Documentation

This document serves as the official developer handover guide and comprehensive technical documentation for the **SimmyCare Online Clinic** platform. It provides an overview of the system architecture, styling conventions, key functional workflows, user credentials, local development commands, and production deployment procedures.

---

## 1. Executive Summary & Scope

SimmyCare is a high-performance, single-page digital healthcare portal designed to streamline patient consultations, clinic scheduling, and diagnostic workflows. The platform operates on a **Standard Package** core (covering public landing pages, doctor directories, booking pipelines, and administrator controls) but incorporates a series of out-of-scope operational dashboards (Doctor, Pharmacy, Laboratory, and Logistics portals) to simulate a complete healthcare facility ecosystem.

> [!NOTE]
> All state management, user authentication, and data operations run client-side. The system utilizes `localStorage` and `sessionStorage` to simulate persistent database behaviors, rendering backend database systems unnecessary for this phase.

---

## 2. Technology Stack & Design System

The application is structured as a client-side Single Page Application (SPA) utilizing:
*   **Framework:** React 18.3.1 (with hooks for state lifecycle management)
*   **Build System:** Vite 5.3.1 (configured with fast-refresh plugins)
*   **Styling:** Vanilla CSS 3 with custom CSS variables (no TailwindCSS dependencies)
*   **Icons:** FontAwesome 6.4.0 (loaded via CDN link in `index.html`)

### 🎨 Design Aesthetic & Styling Tokens
The platform follows the elegant, premium medical aesthetic modeled after **Carevo.com.ng** (featuring a warm cream backdrop, serif typography, and deep navy elements). The styling system is governed by custom variables declared in `src/index.css`:

| CSS Custom Variable | Value / Color | Description |
| :--- | :--- | :--- |
| `--color-bg-cream` | `#FAF6EE` | Base backdrop background. Warm, sanitised, and premium feeling. |
| `--color-indigo` | `#1E1B4B` | Primary navy for brand text, borders, headers, and major buttons. |
| `--color-accent` | `#0D9488` | Teal accent for active navigation, badges, widgets, and status indicators. |
| `--color-emerald` | `#10B981` | Success green for positive statuses, approvals, and verified labels. |
| `--font-headings` | `'Lora', serif` | Authority, trustworthiness, and traditional editorial medical elegance. |
| `--font-sans` | `'Inter', sans-serif` | High readability interface font for clinical data and body texts. |

---

## 3. Application Architecture & File Structure

The project has a lightweight structure for fast local execution:

```text
simmyClinic/
├── index.html            # Main HTML entry point, SEO tags, and root mounting node
├── package.json          # Dependency configurations, version listings, and scripts
├── vite.config.js        # Vite compilation rules and React plugin configurations
├── styles.css            # Old/unused stylesheet (from vanilla JS prototype phase)
├── app.js                # Old/unused javascript file (from vanilla JS prototype phase)
├── push.sh               # Git deployment/commit automation shell script
├── client_need.md        # Client contract requirements and deliverables tracker
├── proposal.md           # Identical commercial details and deliverables list
├── handover_guide.md     # This system documentation
└── src/
    ├── main.jsx          # React app bootstrapper importing App.jsx and index.css
    ├── index.css         # Main stylesheet with layout, orbit animations, and views
    ├── App.jsx           # Core application code (routing, state, and portals)
    └── assets/           # Bundled image files for doctors, hero banner, and logo
```

> [!WARNING]
> The files `app.js` and `styles.css` located in the root directory belong to the early vanilla JavaScript prototype phase. The production React application relies entirely on the code inside the `src/` directory. Do not write new features into the root `app.js` or `styles.css`.

---

## 4. State Management & Schema Versioning

To bypass traditional server latency and simplify testing, the app features an autonomous **Client-Side Storage Engine** that saves state data within the browser.

### Key Data Registries in `localStorage`
1.  `simmy_doctors`: Roster of specialists, clinic schedules, bios, rooms, rates, and approval settings.
2.  `simmy_appointments`: Historical list of booking slots including patient details, status, findings, and prescriptions.
3.  `simmy_inquiries`: Contact inbox submissions including name, message date, and response tokens.
4.  `simmy_patients`: Patient registry for account authentication.
5.  `simmy_pharmacists`: Pharmacy vendor data including licenses.
6.  `simmy_labs`: Diagnostic laboratory specialists.
7.  `simmy_logistics`: Rider profiles and courier assignments.

### 🔄 Schema Versioning & Migrations
Stale browser cache conflicts can cause crashes when adding new fields or modifying existing mock data structures. To prevent this, the app uses a schema key constraint:

```javascript
const DATA_VERSION = "v5_real_staff_only";
```

On component mount, `App.jsx` compares the version string stored in `localStorage` with `DATA_VERSION`. If they do not match, the app automatically wipes the legacy localStorage values and re-seeds the schema using the fresh `INITIAL_DOCTORS` array.

---

## 5. Portal Access & User Credentials

The platform features six distinct roles. Each role has access to specific dashboards with different levels of access.

### 🔑 Credentials Registry

| Portal / Dashboard | Email / Username | Password | Role Description |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin` | `admin` | Full control over appointments, doctor roster, and inboxes. |
| **Doctor Fatima** | `fatima@simmycare.com` | `password123` | Senior Gynaecologist workspace. Manage patient consultation records. |
| **Doctor Adam** | `adam@simmycare.com` | `password123` | General Medicine consultant workspace. Manage primary care queue. |
| **Doctor Tijjani** | `matosaddiqa@gmail.com` | `password123` | Public Health Senior Consultant workspace. |
| **Doctor Bamalli** | `abubakarbalili79@gmail.com` | `password123` | General Medicine Consultant workspace. |
| **Doctor Wasila** | `wasilagoranduma@gmail.com` | `password123` | Junior Doctor / Public Health screening specialist. |
| **Pharmacy Portal** | `pharmacist@simmycare.com` | `password123` | Drug stock tracker, prescription intake, and dispatch. |
| **Lab Portal** | `lab@simmycare.com` | `password123` | Diagnostic queue manager, clinical findings uploader. |
| **Logistics Portal** | `logistics@simmycare.com` | `password123` | Rider assignment console, SVG route tracking simulator. |
| **Patient Portal** | `zainab@example.com` | `password123` | Default patient. View bookings, prescriptions, and orders. |

> [!TIP]
> Registration functions are fully operational. Users can create new patient accounts, register new specialist doctor accounts, or onboard new logistics staff directly from the `#portal-login` interface.

---

## 6. Functional Workflows & User Journeys

### 1. Patient Booking & Terms Consent Flow
To prevent accidental bookings, the booking form and register flows require confirmation of agreement to terms of service.
*   **Scroll Safeguard:** The terms model checkbox is disabled by default. The patient must scroll the terms text box to the bottom to enable it.
*   **Automatic Routing:** If a patient attempts to book a doctor who is currently offline, the system prompts them and allows them to proceed or select an alternative specialist.

### 2. Doctor Consultation notepad
The doctor’s dashboard is an administrative hub for recording consultation notes.
*   **Clinical Findings:** Doctors can write summaries of the patient’s symptoms and diagnoses.
*   **Prescriptions:** Doctors can choose drugs from the standard inventory and prescribe them to the patient. This automatically transfers the prescription to the **Pharmacy Portal**.
*   **Diagnostic Recommendation:** Doctors can request laboratory tests (e.g., malaria test, lipid panel). This automatically adds the patient to the **Lab Specialist Portal** queue.

### 3. Pharmacy Intake & Stock Tracker
*   **Prescription Processing:** Pharmacists can view incoming prescriptions sent by doctors, calculate costs, and authorize checkout.
*   **Stock Manager:** Pharmacists can edit the drug stock list, update pricing, and adjust categories (Analgesics, Antibiotics, Antimalarials, etc.).
*   **Availability Toggle:** Pharmacists can toggle their status from "Online" to "Offline." When they go offline, the homepage alert updates to inform users that pharmacy deliveries may be delayed.

### 4. Diagnostic Lab Results
*   **Queue Intake:** Diagnostic test recommendations from doctors appear in the Lab Specialist queue.
*   **Result Uploads:** Lab technicians can record findings, input values, and upload digital report files (saved as simulated base64 URLs). Once approved, the findings populate in the **Patient Dashboard**.

### 5. Logistics Tracking & SVG Simulation
*   **Courier Allocation:** Orders approved by the pharmacy or lab are assigned to available couriers.
*   **SVG Route Map:** The Logistics Portal includes an interactive SVG path map showing courier delivery progress. When simulated, the courier node moves along the coordinate vector path, showing real-time delivery telemetry.

---

## 7. Development & Operations Guide

### 📦 Local Installation
To install project dependencies:
```bash
npm install
```

### 🚀 Running Locally
Start the Vite development server:
```bash
npm run dev
```

### 🛠️ Production Build
To compile static production bundles into the `dist/` directory:
```bash
npm run build
```

### 🔍 Previewing Build
To run a local server mapping the production files:
```bash
npm run preview
```

---

## 8. Deployment Guidelines

### ☁️ Hosting via Netlify / Vercel
Since this is a client-side Single Page Application (SPA), it is compatible with static web hosts like Netlify or Vercel.

#### Redirection Rule Configuration (for SPAs)
When hosting SPAs, reloading any page outside the root `/` will return a 404 error if redirection rules are not set up.
*   **Netlify Setup:** Create a `_redirects` file in the `public/` directory containing:
    ```text
    /*    /index.html   200
    ```
*   **Vercel Setup:** Create a `vercel.json` file in the root directory:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```

---

## 9. Recommendations for Future Iterations

1.  **Refactoring `App.jsx`:** The main file `src/App.jsx` is over 9,000 lines long. It should be refactored into modular components under a `components/` directory (e.g., `Navbar`, `Footer`, `AdminDashboard`, `DoctorDashboard`, `PatientDashboard`, etc.).
2.  **Asset Management:** The application now includes an integrated client-side HTML5 canvas compression utility (`compressImageFile`) that resizes and recompresses uploaded profile images and licenses to under 50-100KB before storing them as base64 in `localStorage`, mitigating the browser's 5MB quota limit. In future iterations (e.g., when transitioning to a real backend), consider migrating this to a dedicated third-party asset store (like Cloudinary, Supabase Storage, or AWS S3).
3.  **Authentication Security:** Change the current authentication flow (which uses client-side comparisons and `sessionStorage` tokens) to a backend session-token or JWT verification system to secure patient clinical records.
