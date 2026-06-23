# SimmyCare Consultation Website

A premium, highly responsive digital healthcare consultation portal and scheduling system. This application is modeled after the sleek, minimalist, and modern aesthetics of **Carevo.com.ng** (featuring a warm cream background, serif headings, deep navy accents, monospaced numbers, and smooth transitions).

---

## 🚀 Getting Started

Since this is a client-side Single Page Application (SPA) with mock database persistence in `localStorage`, **no installation, backend server, or compilation is required**.

### How to Run:
1. Double-click the `index.html` file in your workspace to open it directly in any modern web browser.
2. Alternatively, if you have a local server extension (like VS Code Live Server), right-click `index.html` and choose **"Open with Live Server"**.

---

## 🔑 Admin Credentials

To access the clinic control panel:
- **Navigation:** Click on the **"Admin Portal →"** button in the header (or go to `#admin-login` / click the login tab).
- **Username:** `admin`
- **Password:** `admin`

*Note: Session state is kept inside `sessionStorage` so you remain logged in during your tab session, and all appointment/inquiry modifications persist inside `localStorage`.*

---

## 🎨 Design System

- **Background:** Cream / Off-white `#FAF6EE` (projects a warm, sanitary, and high-end hospital feeling).
- **Typography:**
  - **Headings:** `'Lora'` (Serif) for authority and medical quality.
  - **Body / Interface:** `'Inter'` (Sans-Serif) for high legibility.
- **Accents:**
  - **Primary Navy:** `#1E1B4B` (deep indigo for text, borders, and dominant controls).
  - **Teal Accent:** `#0D9488` (teal green for status states, highlights, and floating widgets).
- **Graphics:** High-fidelity animated SVG "Care Loop" system graphic mapping patient-to-doctor workflows.
- **Dynamic Avatars:** Doctors do not have generic image placeholders. Instead, the application generates a unique CSS linear gradient and Lora-serif initials based on their name.

---

## 📂 Project Architecture

- **`index.html`**: Semantic page sections structured for Search Engine Optimization (SEO), containing elements for patient flows, inquiry portals, and admin dashboards.
- **`styles.css`**: Styling sheets configuring custom CSS custom properties, micro-animations, media query responsiveness, and tables.
- **`app.js`**: Core engine handling:
  - Client-side routing toggles.
  - Dynamic local database initialization (`localStorage` seeding).
  - Search filter actions for medical specialists.
  - Form validation, scheduling triggers, and ticket generators.
  - Admin controls (appointment verification status, doctor roster, and contact inboxes).
  - Floating WhatsApp integration widget.
