/**
 * SimmyCare Clinic Web Application Core Engine
 * Client-side State, Routing, and Dynamic Component Rendering
 */

// --- 1. Initial State Seeding ---
const INITIAL_DOCTORS = [
  { id: 1, name: "Dr. Amina Yusuf", specialty: "Pediatrics", schedule: "Mon - Wed (9am - 2pm)", experience: "8 Years", regNo: "MDCN/8431" },
  { id: 2, name: "Dr. Chioma Nwachukwu", specialty: "Cardiology", schedule: "Tue - Thu (12pm - 5pm)", experience: "12 Years", regNo: "MDCN/9102" },
  { id: 3, name: "Dr. Babajide Alao", specialty: "General Medicine", schedule: "Mon - Fri (8am - 4pm)", experience: "6 Years", regNo: "MDCN/6712" },
  { id: 4, name: "Dr. Favour Obi", specialty: "Gynaecology", schedule: "Wed - Fri (10am - 3pm)", experience: "10 Years", regNo: "MDCN/7291" }
];

const INITIAL_APPOINTMENTS = [
  { id: "APT-1048", patientName: "Zainab Abdulfatah", phone: "08012345678", email: "zainab@example.com", doctor: "Dr. Amina Yusuf", date: "2026-06-25", time: "10:00 AM", symptoms: "Routine checkup for child vaccines.", status: "Approved" },
  { id: "APT-1092", patientName: "David Okon", phone: "09087654321", email: "david.okon@gmail.com", doctor: "Dr. Babajide Alao", date: "2026-06-24", time: "02:30 PM", symptoms: "Experiencing persistent headaches and mild fever.", status: "Pending" },
  { id: "APT-1102", patientName: "Sarah Ahmed", phone: "07033445566", email: "sarah.a@yahoo.com", doctor: "Dr. Favour Obi", date: "2026-06-26", time: "11:30 AM", symptoms: "Inquiry about prenatal consultations.", status: "Cancelled" }
];

const INITIAL_INQUIRIES = [
  { id: "INQ-8902", name: "John Doe", email: "john.doe@gmail.com", message: "Do you support corporate health insurance plans?", date: "2026-06-21" },
  { id: "INQ-8903", name: "Mary Williams", email: "mary.w@yahoo.com", message: "Hi, do you offer home sample collections for lab work?", date: "2026-06-22" }
];

// Helper to load or initialize database
function getStorage(key, fallback) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// State object
const state = {
  doctors: getStorage("simmy_doctors", INITIAL_DOCTORS),
  appointments: getStorage("simmy_appointments", INITIAL_APPOINTMENTS),
  inquiries: getStorage("simmy_inquiries", INITIAL_INQUIRIES),
  currentView: "home",
  activeSpecialtyFilter: "all",
  adminNavView: "appointments",
  isAdminAuthenticated: sessionStorage.getItem("simmy_admin_auth") === "true"
};

// --- 2. Dynamic Avatar Generation ---
// Generate a premium gradient avatar with doctor initials to match the brand aesthetic
function generateAvatarSvg(name, index) {
  const initials = name.split(" ").map(n => n.charAt(0)).slice(1).join("").toUpperCase(); // Skip "Dr."
  const gradients = [
    { from: "#182B49", to: "#2C5D88" }, // Deep Navy to Steel Blue
    { from: "#2C5D88", to: "#E2ECF5" }, // Steel Blue to Pale Blue
    { from: "#1F4A6F", to: "#182B49" }, // Slate Blue to Deep Navy
    { from: "#2C5D88", to: "#1F4A6F" }  // Steel Blue to Slate Blue
  ];
  const grad = gradients[index % gradients.length];
  
  return `
    <svg class="doctor-avatar-svg" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
      <defs>
        <linearGradient id="doctorGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${grad.from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${grad.to};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#doctorGrad-${index})" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="'Lora', serif" font-size="28" font-weight="600" fill="#FAF6EE">${initials || "DR"}</text>
    </svg>
  `;
}

// --- 3. View Routing System ---
const navLinks = document.querySelectorAll(".nav-link[data-view]");
const views = document.querySelectorAll(".view-section");
const adminBtn = document.getElementById("admin-portal-btn");

function navigateTo(viewId) {
  // Guard admin-dashboard access
  if (viewId === "admin-dashboard") {
    if (!state.isAdminAuthenticated) {
      window.location.hash = "#admin-login";
      return;
    }
    renderAdminDashboard();
  }

  // Redirect authenticated admin away from login screen
  if (viewId === "admin-login") {
    if (state.isAdminAuthenticated) {
      window.location.hash = "#admin-dashboard";
      return;
    }
  }

  state.currentView = viewId;
  
  // Hide all sections and show active
  views.forEach(view => {
    if (view.id === `${viewId}-view`) {
      view.style.display = "block";
      view.classList.add("animate-fade");
    } else {
      view.style.display = "none";
      view.classList.remove("animate-fade");
    }
  });

  // Update navigation styles
  navLinks.forEach(link => {
    if (link.getAttribute("data-view") === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Update Admin Header Button state
  if (state.isAdminAuthenticated) {
    adminBtn.innerHTML = `Dashboard <span>→</span>`;
    adminBtn.onclick = (e) => {
      e.preventDefault();
      window.location.hash = "#admin-dashboard";
    };
  } else {
    adminBtn.innerHTML = `Admin Portal <span>→</span>`;
    adminBtn.onclick = (e) => {
      e.preventDefault();
      window.location.hash = "#admin-login";
    };
  }

  // Trigger dynamic rendering based on active view
  if (viewId === "doctors") {
    renderDoctorsGrid();
  } else if (viewId === "booking") {
    populateDoctorDropdown();
  } else if (viewId === "home") {
    renderFeaturedDoctors();
  }

  // Auto-scroll to top
  window.scrollTo(0, 0);
}

// Setup Nav Event Listeners
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const viewId = link.getAttribute("data-view");
    window.location.hash = "#" + viewId;
  });
});

// Setup click logic on other buttons
document.querySelectorAll("[data-nav]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "#" + btn.getAttribute("data-nav");
  });
});

// --- 4. Doctor Grid Rendering ---
const filterButtons = document.querySelectorAll(".filter-btn");

function renderDoctorsGrid() {
  const grid = document.getElementById("doctors-grid-container");
  if (!grid) return;

  grid.innerHTML = "";

  const query = document.getElementById("doctor-search")?.value.toLowerCase() || "";

  const filtered = state.doctors.filter(doc => {
    const matchesFilter = state.activeSpecialtyFilter === "all" || doc.specialty.toLowerCase() === state.activeSpecialtyFilter.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query) || doc.regNo.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">No doctors found in this category.</div>`;
    return;
  }

  filtered.forEach((doc, idx) => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    
    card.innerHTML = `
      <div class="doctor-avatar-container">
        ${generateAvatarSvg(doc.name, idx)}
        <div class="doctor-badge">${doc.regNo}</div>
      </div>
      <div class="doctor-info">
        <div class="doctor-specialty">${doc.specialty}</div>
        <h3 class="doctor-name">${doc.name}</h3>
        <div class="doctor-meta">
          <div class="doctor-meta-item">
            <span class="doctor-meta-label">Experience:</span>
            <span class="doctor-meta-value">${doc.experience}</span>
          </div>
          <div class="doctor-meta-item">
            <span class="doctor-meta-label">Availability:</span>
            <span class="doctor-meta-value">${doc.schedule}</span>
          </div>
        </div>
      </div>
      <div class="doctor-actions">
        <button class="btn btn-primary" onclick="initiateBooking('${doc.name}')">Book Slot</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Setup specialty filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.activeSpecialtyFilter = btn.getAttribute("data-filter");
    renderDoctorsGrid();
  });
});

// Featured doctors on Home Page
function renderFeaturedDoctors() {
  const container = document.getElementById("featured-doctors-row");
  if (!container) return;

  container.innerHTML = "";
  // Show first 3 doctors
  state.doctors.slice(0, 3).forEach((doc, idx) => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <div class="doctor-avatar-container">
        ${generateAvatarSvg(doc.name, idx)}
        <div class="doctor-badge">${doc.regNo}</div>
      </div>
      <div class="doctor-info">
        <div class="doctor-specialty">${doc.specialty}</div>
        <h3 class="doctor-name">${doc.name}</h3>
        <div class="doctor-meta">
          <div class="doctor-meta-item">
            <span class="doctor-meta-label">Experience:</span>
            <span class="doctor-meta-value">${doc.experience}</span>
          </div>
          <div class="doctor-meta-item">
            <span class="doctor-meta-label">Availability:</span>
            <span class="doctor-meta-value">${doc.schedule}</span>
          </div>
        </div>
      </div>
      <div class="doctor-actions">
        <button class="btn btn-outline" onclick="initiateBooking('${doc.name}')">Book Slot</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Initiate booking directly for a doctor
window.initiateBooking = function(doctorName) {
  window.location.hash = "#booking";
  setTimeout(() => {
    const docDropdown = document.getElementById("booking-doctor");
    if (docDropdown) {
      docDropdown.value = doctorName;
    }
  }, 50);
};

// --- 5. Form Handling (Booking & Inquiries) ---
function populateDoctorDropdown() {
  const select = document.getElementById("booking-doctor");
  if (!select) return;

  // Clear except first default placeholder
  select.innerHTML = '<option value="" disabled selected>Select a medical specialist</option>';
  
  state.doctors.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.name;
    opt.textContent = `${doc.name} (${doc.specialty})`;
    select.appendChild(opt);
  });
}

// Appointment Booking form submission
const bookingForm = document.getElementById("consultation-booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const patientName = document.getElementById("booking-name").value;
    const phone = document.getElementById("booking-phone").value;
    const email = document.getElementById("booking-email").value;
    const doctor = document.getElementById("booking-doctor").value;
    const date = document.getElementById("booking-date").value;
    const time = document.getElementById("booking-time").value;
    const symptoms = document.getElementById("booking-symptoms").value;

    const newAptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApt = {
      id: newAptId,
      patientName,
      phone,
      email,
      doctor,
      date,
      time,
      symptoms,
      status: "Pending"
    };

    // Save to State and Storage
    state.appointments.push(newApt);
    setStorage("simmy_appointments", state.appointments);

    // Render success block
    showBookingSuccess(newApt);
    bookingForm.reset();
  });
}

function showBookingSuccess(apt) {
  const formWrap = document.getElementById("booking-form-wrapper");
  const successCard = document.getElementById("booking-success-wrapper");
  
  if (!formWrap || !successCard) return;

  document.getElementById("success-ticket-id").textContent = apt.id;
  document.getElementById("success-patient").textContent = apt.patientName;
  document.getElementById("success-doctor").textContent = apt.doctor;
  document.getElementById("success-datetime").textContent = `${apt.date} at ${apt.time}`;
  document.getElementById("success-status").textContent = apt.status;

  formWrap.style.display = "none";
  successCard.style.display = "block";
  successCard.classList.add("animate-fade");
}

// Reset Booking form view back to form
window.resetBookingView = function() {
  const formWrap = document.getElementById("booking-form-wrapper");
  const successCard = document.getElementById("booking-success-wrapper");
  
  if (formWrap && successCard) {
    successCard.style.display = "none";
    formWrap.style.display = "block";
  }
};

// Inquiries Contact form submission
const contactForm = document.getElementById("inquiry-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("inquiry-name").value;
    const email = document.getElementById("inquiry-email").value;
    const message = document.getElementById("inquiry-message").value;
    
    const newInq = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      message,
      date: new Date().toISOString().split('T')[0]
    };

    state.inquiries.push(newInq);
    setStorage("simmy_inquiries", state.inquiries);

    // Show inline thank you note
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Inquiry Sent! Thank you.";
    submitBtn.style.backgroundColor = "var(--color-accent)";

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.style.backgroundColor = "";
    }, 3000);
  });
}

// --- 6. WhatsApp Widget Toggle ---
const waWidget = document.getElementById("whatsapp-widget");
const waBubble = document.getElementById("whatsapp-bubble");
const waClose = document.getElementById("whatsapp-close");
const waSend = document.getElementById("whatsapp-send");

if (waBubble && waWidget) {
  waBubble.addEventListener("click", () => {
    waWidget.classList.toggle("open");
  });
}

if (waClose && waWidget) {
  waClose.addEventListener("click", () => {
    waWidget.classList.remove("open");
  });
}

if (waSend) {
  waSend.addEventListener("click", () => {
    const text = encodeURIComponent("Hello SimmyCare! I would like to make an inquiry about booking a consultation.");
    window.open(`https://wa.me/2348000000000?text=${text}`, "_blank");
    waWidget.classList.remove("open");
  });
}

// --- 7. Admin Authentication ---
const adminLoginForm = document.getElementById("admin-login-form");
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const u = document.getElementById("admin-username").value;
    const p = document.getElementById("admin-password").value;

    if (u === "admin" && p === "admin") {
      state.isAdminAuthenticated = true;
      sessionStorage.setItem("simmy_admin_auth", "true");
      window.location.hash = "#admin-dashboard";
      adminLoginForm.reset();
    } else {
      alert("Invalid credentials. Try username: admin, password: admin");
    }
  });
}

window.logoutAdmin = function() {
  state.isAdminAuthenticated = false;
  sessionStorage.removeItem("simmy_admin_auth");
  
  // Clear dashboard DOM to prevent viewing previously loaded data if element is inspected
  const tbody = document.getElementById("admin-appointments-tbody");
  if (tbody) tbody.innerHTML = "";
  const inquiries = document.getElementById("admin-inquiries-container");
  if (inquiries) inquiries.innerHTML = "";
  const doctors = document.getElementById("admin-doctors-list-container");
  if (doctors) doctors.innerHTML = "";

  window.location.hash = "#home";
};

// --- 8. Admin Dashboard Renders & Actions ---
const adminNavItems = document.querySelectorAll(".admin-nav-item");
const adminSections = document.querySelectorAll(".admin-dashboard-section");

adminNavItems.forEach(item => {
  item.addEventListener("click", () => {
    adminNavItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    
    state.adminNavView = item.getAttribute("data-tab");
    
    adminSections.forEach(sec => {
      if (sec.id === `admin-${state.adminNavView}-section`) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  });
});

function renderAdminDashboard() {
  // Update KPI counters
  document.getElementById("kpi-total-bookings").textContent = state.appointments.length;
  document.getElementById("kpi-pending-bookings").textContent = state.appointments.filter(a => a.status === "Pending").length;
  document.getElementById("kpi-active-doctors").textContent = state.doctors.length;

  // Render Table content based on active tab
  renderAdminAppointmentsTable();
  renderAdminInquiries();
  renderAdminDoctorsManager();
}

function renderAdminAppointmentsTable() {
  const tbody = document.getElementById("admin-appointments-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (state.appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No appointments scheduled yet.</td></tr>`;
    return;
  }

  // Render in reverse chronological order
  [...state.appointments].reverse().forEach(apt => {
    const tr = document.createElement("tr");
    
    let statusClass = "pending";
    if (apt.status === "Approved") statusClass = "approved";
    if (apt.status === "Cancelled") statusClass = "cancelled";

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 600;">${apt.id}</td>
      <td>
        <div style="font-weight: 500;">${apt.patientName}</div>
        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${apt.phone} | ${apt.email}</div>
      </td>
      <td>${apt.doctor}</td>
      <td>${apt.date} <span style="font-size: 0.8rem; color: var(--color-text-muted);">${apt.time}</span></td>
      <td style="font-size: 0.8rem; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${apt.symptoms || "None"}">${apt.symptoms || "—"}</td>
      <td><span class="status-badge ${statusClass}">${apt.status}</span></td>
      <td>
        <div class="action-btn-group">
          ${apt.status === "Pending" ? `
            <button class="action-btn btn-approve" onclick="updateAppointmentStatus('${apt.id}', 'Approved')">Approve</button>
            <button class="action-btn btn-cancel" onclick="updateAppointmentStatus('${apt.id}', 'Cancelled')">Cancel</button>
          ` : `
            <button class="action-btn" onclick="deleteAppointment('${apt.id}')">Delete</button>
          `}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.updateAppointmentStatus = function(aptId, newStatus) {
  state.appointments = state.appointments.map(apt => {
    if (apt.id === aptId) {
      return { ...apt, status: newStatus };
    }
    return apt;
  });
  setStorage("simmy_appointments", state.appointments);
  renderAdminDashboard();
};

window.deleteAppointment = function(aptId) {
  if (confirm(`Are you sure you want to delete appointment record ${aptId}?`)) {
    state.appointments = state.appointments.filter(apt => apt.id !== aptId);
    setStorage("simmy_appointments", state.appointments);
    renderAdminDashboard();
  }
};

function renderAdminInquiries() {
  const container = document.getElementById("admin-inquiries-container");
  if (!container) return;

  container.innerHTML = "";

  if (state.inquiries.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No inquiries received.</div>`;
    return;
  }

  [...state.inquiries].reverse().forEach(inq => {
    const card = document.createElement("div");
    card.className = "kpi-card";
    card.style.padding = "1.25rem";
    card.style.marginBottom = "1rem";
    card.style.display = "block";
    card.style.borderLeft = "4px solid var(--color-indigo)";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
        <span>Sent on ${inq.date}</span>
        <button style="background:none; border:none; color:#EF4444; cursor:pointer;" onclick="deleteInquiry('${inq.id}')">Delete</button>
      </div>
      <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">${inq.name}</h4>
      <div style="font-size: 0.8rem; color: var(--color-accent); margin-bottom: 0.75rem;">${inq.email}</div>
      <p style="font-size: 0.9rem; color: var(--color-text-main); font-style: italic;">"${inq.message}"</p>
    `;
    container.appendChild(card);
  });
}

window.deleteInquiry = function(inqId) {
  if (confirm("Are you sure you want to delete this inquiry?")) {
    state.inquiries = state.inquiries.filter(inq => inq.id !== inqId);
    setStorage("simmy_inquiries", state.inquiries);
    renderAdminDashboard();
  }
};

function renderAdminDoctorsManager() {
  const container = document.getElementById("admin-doctors-list-container");
  if (!container) return;

  container.innerHTML = "";

  state.doctors.forEach((doc, idx) => {
    const card = document.createElement("div");
    card.className = "admin-doctor-card";
    
    card.innerHTML = `
      <button class="delete-doctor-btn" onclick="deleteDoctor(${doc.id})">×</button>
      <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; margin-bottom: 0.5rem;">
        ${generateAvatarSvg(doc.name, idx)}
      </div>
      <h4>${doc.name}</h4>
      <p style="color: var(--color-accent); font-weight: 500; text-transform: uppercase; font-size: 0.75rem;">${doc.specialty}</p>
      <p style="font-size: 0.75rem; color: var(--color-text-muted);">Exp: ${doc.experience}</p>
      <p style="font-size: 0.75rem; color: var(--color-text-muted);">${doc.schedule}</p>
    `;
    container.appendChild(card);
  });
}

// Add doctor handler
const doctorForm = document.getElementById("admin-add-doctor-form");
if (doctorForm) {
  doctorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("doc-name").value;
    const specialty = document.getElementById("doc-specialty").value;
    const experience = document.getElementById("doc-experience").value;
    const schedule = document.getElementById("doc-schedule").value;
    const regNo = document.getElementById("doc-regno").value;

    const newDoc = {
      id: state.doctors.length > 0 ? Math.max(...state.doctors.map(d => d.id)) + 1 : 1,
      name,
      specialty,
      experience,
      schedule,
      regNo
    };

    state.doctors.push(newDoc);
    setStorage("simmy_doctors", state.doctors);
    
    renderAdminDashboard();
    doctorForm.reset();
  });
}

window.deleteDoctor = function(docId) {
  if (confirm("Are you sure you want to remove this doctor profile?")) {
    state.doctors = state.doctors.filter(d => d.id !== docId);
    setStorage("simmy_doctors", state.doctors);
    renderAdminDashboard();
  }
};

// Function to handle routing from URL hash
function handleHashRoute() {
  const hash = window.location.hash.replace("#", "") || "home";
  const validViews = ["home", "doctors", "booking", "contact", "admin-login", "admin-dashboard"];
  if (validViews.includes(hash)) {
    navigateTo(hash);
  } else {
    window.location.hash = "#home";
  }
}

// Listen for hash changes
window.addEventListener("hashchange", handleHashRoute);

// --- 9. Initial Entry Point ---
document.addEventListener("DOMContentLoaded", () => {
  handleHashRoute();
  
  // Render static triggers
  renderFeaturedDoctors();

  // Setup search input filter listener
  const searchInput = document.getElementById("doctor-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderDoctorsGrid();
    });
  }
});
