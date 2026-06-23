import React, { useState, useEffect } from 'react';

// --- Seed Data ---
const INITIAL_DOCTORS = [
  { id: 1, name: "Dr. Fatima Yahaya Maiauduga", specialty: "Gynaecology", schedule: "Mon - Wed (9am - 2pm)", experience: "8 Years", regNo: "MDCN/8431", image: "/doctor_fatima.jpg", email: "fatima@simmycare.com", password: "password123" },
  { id: 2, name: "Dr. Chioma Nwachukwu", specialty: "Pediatrics", schedule: "Tue - Thu (12pm - 5pm)", experience: "12 Years", regNo: "MDCN/9102", email: "chioma@simmycare.com", password: "password123" },
  { id: 3, name: "Dr. Adam Zamzam", specialty: "General Medicine", schedule: "Mon - Fri (8am - 4pm)", experience: "10 Years", regNo: "MDCN/7123", image: "/doctor_adam.jpg", email: "adam@simmycare.com", password: "password123" },
  { id: 4, name: "Dr. Favour Obi", specialty: "Pharmacy", schedule: "Wed - Fri (10am - 3pm)", experience: "6 Years", regNo: "MDCN/7291", email: "favour@simmycare.com", password: "password123" }
];

const INITIAL_APPOINTMENTS = [
  { id: "APT-1048", patientName: "Zainab Abdulfatah", phone: "08012345678", email: "zainab@example.com", doctor: "Dr. Amina Yusuf", date: "2026-06-25", time: "10:00 AM", symptoms: "Routine checkup for child vaccines.", status: "Approved", notes: "Vaccinations completed. Child is in good health.", prescription: "Paracetamol Syrup 5ml as needed for fever." },
  { id: "APT-1092", patientName: "David Okon", phone: "09087654321", email: "david.okon@gmail.com", doctor: "Dr. Babajide Alao", date: "2026-06-24", time: "02:30 PM", symptoms: "Experiencing persistent headaches and mild fever.", status: "Pending", notes: "", prescription: "" },
  { id: "APT-1102", patientName: "Sarah Ahmed", phone: "07033445566", email: "sarah@example.com", doctor: "Dr. Favour Obi", date: "2026-06-26", time: "11:30 AM", symptoms: "Inquiry about prenatal consultations.", status: "Cancelled", notes: "", prescription: "" }
];

const INITIAL_INQUIRIES = [
  { id: "INQ-8902", name: "John Doe", email: "john.doe@gmail.com", message: "Do you support corporate health insurance plans?", date: "2026-06-21" },
  { id: "INQ-8903", name: "Mary Williams", email: "mary.w@yahoo.com", message: "Hi, do you offer home sample collections for lab work?", date: "2026-06-22" }
];

// Helper to generate initials avatar gradients
function getAvatarGradient(index) {
  const gradients = [
    { from: "#182B49", to: "#2C5D88" }, // Deep Navy to Steel Blue
    { from: "#2C5D88", to: "#E2ECF5" }, // Steel Blue to Pale Blue
    { from: "#1F4A6F", to: "#182B49" }, // Slate Blue to Deep Navy
    { from: "#2C5D88", to: "#1F4A6F" }  // Steel Blue to Slate Blue
  ];
  return gradients[index % gradients.length];
}

export default function App() {
  // --- Persistent State ---
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'doctors', 'booking', 'contact', 'portal-login', 'dashboard'].includes(hash) ? hash : 'home';
  });

  const [doctors, setDoctors] = useState(() => {
    // Force clear stale cache to show updated doctor credentials and images
    localStorage.removeItem("simmy_doctors");
    return INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState(() => {
    const data = localStorage.getItem("simmy_appointments");
    return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
  });

  const [inquiries, setInquiries] = useState(() => {
    const data = localStorage.getItem("simmy_inquiries");
    return data ? JSON.parse(data) : INITIAL_INQUIRIES;
  });

  const [patients, setPatients] = useState(() => {
    const data = localStorage.getItem("simmy_patients");
    return data ? JSON.parse(data) : [
      { email: "zainab@example.com", name: "Zainab Abdulfatah", phone: "08012345678", password: "password123" }
    ];
  });

  // --- Auth Role State ---
  const [authRole, setAuthRole] = useState(() => {
    return sessionStorage.getItem("simmy_auth_role") || null; // 'patient' | 'doctor' | 'admin' | null
  });

  const [loggedInPatient, setLoggedInPatient] = useState(() => {
    const data = sessionStorage.getItem("simmy_auth_patient");
    return data ? JSON.parse(data) : null;
  });

  const [loggedInDoctor, setLoggedInDoctor] = useState(() => {
    const data = sessionStorage.getItem("simmy_auth_doctor");
    return data ? JSON.parse(data) : null;
  });

  // --- UI state ---
  const [loginTab, setLoginTab] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [isPatientRegistering, setIsPatientRegistering] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  
  // Form inputs
  const [patientLoginForm, setPatientLoginForm] = useState({ email: '', name: '', phone: '', password: '' });
  const [doctorLoginForm, setDoctorLoginForm] = useState({ email: '', password: '' });
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [bookingFormData, setBookingFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    doctorId: '',
    date: '',
    time: '10:00 AM',
    symptoms: ''
  });

  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });
  const [successModal, setSuccessModal] = useState(null); // { title: '', message: '', ticket: '' }
  const [showTermsModal, setShowTermsModal] = useState(null); // null | 'view' | 'booking' | 'register'
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [bookingConsent, setBookingConsent] = useState(false);
  const [registerConsent, setRegisterConsent] = useState(false);

  // Reset read state when terms modal is toggled
  useEffect(() => {
    if (showTermsModal) {
      setHasReadTerms(false);
    }
  }, [showTermsModal]);

  const handleTermsScroll = (e) => {
    const target = e.target;
    // Check if scrolled to bottom with 10px tolerance
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      setHasReadTerms(true);
    }
  };

  // Admin and Doctor Workspace States
  const [adminNavView, setAdminNavView] = useState('appointments');
  const [newDoctorData, setNewDoctorData] = useState({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '' });
  const [activeConsultationApt, setActiveConsultationApt] = useState(null); // For doctor prescription modal
  const [consultationNotes, setConsultationNotes] = useState({ notes: '', prescription: '' });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("simmy_doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("simmy_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("simmy_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem("simmy_patients", JSON.stringify(patients));
  }, [patients]);

  // Sync Auth State
  useEffect(() => {
    sessionStorage.setItem("simmy_auth_role", authRole || '');
    sessionStorage.setItem("simmy_auth_patient", loggedInPatient ? JSON.stringify(loggedInPatient) : '');
    sessionStorage.setItem("simmy_auth_doctor", loggedInDoctor ? JSON.stringify(loggedInDoctor) : '');
  }, [authRole, loggedInPatient, loggedInDoctor]);

  // Router Hash Changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'dashboard' && !authRole) {
          setCurrentView('portal-login');
        } else {
          setCurrentView(hash);
        }
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authRole]);

  const navigateTo = (view) => {
    if (view === 'dashboard' && !authRole) {
      window.location.hash = 'portal-login';
      setCurrentView('portal-login');
    } else {
      window.location.hash = view;
      setCurrentView(view);
    }
  };

  // --- Auth Handlers ---
  const handlePatientLoginSubmit = (e) => {
    e.preventDefault();
    const email = patientLoginForm.email.toLowerCase().trim();
    const password = patientLoginForm.password.trim();

    if (isPatientRegistering) {
      const existing = patients.find(p => p.email.toLowerCase() === email);
      if (existing) {
        setLoginError("This email address is already registered.");
        return;
      }
      const newPatient = {
        email,
        name: patientLoginForm.name || "Valued Patient",
        phone: patientLoginForm.phone || "",
        password: password
      };
      setPatients([...patients, newPatient]);
      setAuthRole('patient');
      setLoggedInPatient(newPatient);
      setPatientLoginForm({ email: '', name: '', phone: '', password: '' });
      setIsPatientRegistering(false);
      setLoginError('');
      navigateTo('dashboard');
    } else {
      const existing = patients.find(p => p.email.toLowerCase() === email);
      if (existing && existing.password === password) {
        setAuthRole('patient');
        setLoggedInPatient(existing);
        setPatientLoginForm({ email: '', name: '', phone: '', password: '' });
        setLoginError('');
        navigateTo('dashboard');
      } else {
        setLoginError("Invalid email address or password. Tip: Use zainab@example.com / password123");
      }
    }
  };

  const handleDoctorLoginSubmit = (e) => {
    e.preventDefault();
    const doc = doctors.find(d => d.email && d.email.toLowerCase().trim() === doctorLoginForm.email.toLowerCase().trim());

    if (doc && doc.password && doc.password === doctorLoginForm.password.trim()) {
      setAuthRole('doctor');
      setLoggedInDoctor(doc);
      setDoctorLoginForm({ email: '', password: '' });
      setLoginError('');
      navigateTo('dashboard');
    } else {
      setLoginError('Invalid doctor email address or password.');
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminLoginForm.username === 'admin' && adminLoginForm.password === 'admin') {
      setAuthRole('admin');
      setAdminLoginForm({ username: '', password: '' });
      setLoginError('');
      navigateTo('dashboard');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    setAuthRole(null);
    setLoggedInPatient(null);
    setLoggedInDoctor(null);
    navigateTo('home');
  };

  // --- Booking & Contact Handlers ---
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const selectedDoc = doctors.find(d => d.id === parseInt(bookingFormData.doctorId));
    if (!selectedDoc) {
      alert("Please select a doctor.");
      return;
    }

    const ticketNumber = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      id: ticketNumber,
      patientName: bookingFormData.patientName,
      phone: bookingFormData.phone,
      email: bookingFormData.email.toLowerCase(),
      doctor: selectedDoc.name,
      date: bookingFormData.date,
      time: bookingFormData.time,
      symptoms: bookingFormData.symptoms || "None provided",
      status: "Pending",
      notes: "",
      prescription: ""
    };

    setAppointments([newAppointment, ...appointments]);
    setBookingFormData({
      patientName: '',
      phone: '',
      email: '',
      doctorId: '',
      date: '',
      time: '10:00 AM',
      symptoms: ''
    });

    setSuccessModal({
      title: "Booking Submitted Successfully",
      message: `Your appointment request with ${selectedDoc.name} has been received and is currently under review.`,
      ticket: ticketNumber
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const ticketNumber = "INQ-" + Math.floor(1000 + Math.random() * 9000);
    const newInquiry = {
      id: ticketNumber,
      name: contactFormData.name,
      email: contactFormData.email,
      message: contactFormData.message,
      date: new Date().toISOString().split('T')[0]
    };

    setInquiries([newInquiry, ...inquiries]);
    setContactFormData({ name: '', email: '', message: '' });

    setSuccessModal({
      title: "Inquiry Sent Successfully",
      message: "Thank you for reaching out to SimmyCare. Our clinical administration team will respond to your message shortly.",
      ticket: ticketNumber
    });
  };

  // --- Admin Handlers ---
  const handleApproveAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Approved' } : apt
    ));
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Cancelled' } : apt
    ));
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setAppointments(appointments.filter(apt => apt.id !== id));
    }
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm("Delete this inquiry from the inbox?")) {
      setInquiries(inquiries.filter(inq => inq.id !== id));
    }
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    const newDoc = {
      id: newId,
      name: `Dr. ${newDoctorData.name}`,
      specialty: newDoctorData.specialty,
      schedule: newDoctorData.schedule || "Mon - Fri (9am - 5pm)",
      experience: newDoctorData.experience || "5 Years",
      regNo: newDoctorData.regNo || "MDCN/" + Math.floor(1000 + Math.random() * 9000)
    };

    setDoctors([...doctors, newDoc]);
    setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '' });
    alert("Doctor profile added successfully!");
  };

  const handleDeleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor profile?")) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  // --- Doctor Consultation Notes Handlers ---
  const openConsultationNotesModal = (apt) => {
    setActiveConsultationApt(apt);
    setConsultationNotes({
      notes: apt.notes || '',
      prescription: apt.prescription || ''
    });
  };

  const saveConsultationNotesSubmit = (e) => {
    e.preventDefault();
    setAppointments(appointments.map(apt => 
      apt.id === activeConsultationApt.id 
        ? { ...apt, notes: consultationNotes.notes, prescription: consultationNotes.prescription, status: 'Approved' } 
        : apt
    ));
    setActiveConsultationApt(null);
    alert("Consultation record and prescriptions saved successfully!");
  };

  // --- Filtering ---
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesFilter = doctorFilter === 'all' || doc.specialty === doctorFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter Appointments for the currently logged in patient/doctor
  const myPatientAppointments = appointments.filter(apt => 
    loggedInPatient && apt.email.toLowerCase() === loggedInPatient.email.toLowerCase()
  );

  const myDoctorAppointments = appointments.filter(apt => 
    loggedInDoctor && apt.doctor.toLowerCase() === loggedInDoctor.name.toLowerCase()
  );

  return (
    <div className="app-layout">
      {/* --- 1. Header Navigation --- */}
      <header className="app-header glassmorphic">
        <div className="header-container">
          <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <div className="logo-img-wrapper">
              <img className="logo-img" src="/logo.svg" alt="SimmyCare Logo" />
            </div>
            <span className="logo-text">Simmy<span>Care</span></span>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#home" className={currentView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#doctors" className={currentView === 'doctors' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Doctors</a></li>
              <li><a href="#booking" className={currentView === 'booking' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>Booking</a></li>
              <li><a href="#contact" className={currentView === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            {authRole ? (
              <div className="auth-profile-badge">
                <span className="auth-badge-name">
                  {authRole === 'patient' && `${loggedInPatient.name} (Patient)`}
                  {authRole === 'doctor' && `${loggedInDoctor.name} (Doctor)`}
                  {authRole === 'admin' && 'Admin Console'}
                </span>
                <button className="btn btn-outline btn-sm" onClick={() => navigateTo('dashboard')}>Dashboard</button>
                <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-outline" onClick={() => navigateTo('portal-login')}>Portal Access →</button>
                <button className="btn btn-primary" onClick={() => navigateTo('booking')}>Book Now</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- 2. Main Content Routing --- */}
      <main className="main-content">
        
        {/* --- VIEW: HOME --- */}
        {currentView === 'home' && (
          <section id="home-view" className="view-section animate-fade">
            <div className="hero-container">
              <div className="hero-content">
                <h1 className="hero-title">
                  Your virtual hospital. <br />
                  Consultations <span>simplified</span>
                </h1>
                <p className="hero-subtitle">
                  SimmyCare is an online consultation clinic where you can contact any category of medical professional online without any stress. We also have physical doctors active in Abuja, Kaduna, Kano, Bauchi, and Gombe.
                </p>
                <div className="hero-ctas">
                  <button className="btn btn-primary" onClick={() => navigateTo('booking')}>Book Consultation</button>
                  <button className="btn btn-outline" onClick={() => navigateTo('doctors')}>Meet the Doctors</button>
                </div>
              </div>

              <div className="hero-graphic">
                <svg className="care-loop-bg-svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="100%" stopColor="var(--color-accent-light)" />
                    </linearGradient>
                  </defs>
                  <circle className="loop-line-bg" cx="250" cy="250" r="185" fill="none" stroke="url(#loopGrad)" strokeWidth="1.5" strokeDasharray="6, 6" />
                  <circle className="pulse-node-bg node-1" cx="250" cy="65" r="7" fill="var(--color-accent)" />
                  <circle className="pulse-node-bg node-2" cx="435" cy="250" r="7" fill="var(--color-accent)" />
                  <circle className="pulse-node-bg node-3" cx="250" cy="435" r="7" fill="var(--color-accent)" />
                  <circle className="pulse-node-bg node-4" cx="65" cy="250" r="7" fill="var(--color-accent)" />
                </svg>

                <div className="hero-image-wrapper">
                  <div className="hero-shape-bg"></div>
                  <img className="hero-main-img" src="/hero.svg" alt="SimmyCare Online Medical Consultation" />
                  
                  {/* Floating badges */}
                  <div className="floating-badge badge-top-right glassmorphic">
                    <div className="badge-icon"><i className="fa-solid fa-bolt"></i></div>
                    <div className="badge-texts">
                      <strong>10 Min</strong>
                      <span>Response Time</span>
                    </div>
                  </div>
                  
                  <div className="floating-badge badge-bottom-left glassmorphic">
                    <div className="badge-icon" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <div className="badge-texts">
                      <strong>MDCN Verified</strong>
                      <span>Accredited Doctors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="stats-row glassmorphic">
              <div className="stat-item">
                <h3>99.4%</h3>
                <p>PATIENT SATISFACTION</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>15+</h3>
                <p>ACTIVE DOCTORS</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>10m</h3>
                <p>RESPONSE TIME</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>₦5k+</h3>
                <p>CONSULTATION FEE</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="services-section">
              <div className="section-header">
                <h2>Our Premium Health Services</h2>
                <p>High-end, digital-first healthcare consulting right from your home</p>
              </div>
              <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-laptop-medical"></i></div>
                  <h3>Online Consultation</h3>
                  <p>Contact and consult any category of medical professional online without stress from anywhere.</p>
                  <a href="#booking" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>
                    Book Appointment <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-vials"></i></div>
                  <h3>Mobile Laboratory</h3>
                  <p>Professional clinical diagnostics and lab sample collections carried out directly in your home.</p>
                  <a href="#booking" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>
                    Request Lab Test <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-prescription-bottle-medical"></i></div>
                  <h3>Pharmacy Delivery</h3>
                  <p>Order your prescribed medications online and get swift, reliable home delivery right to your door.</p>
                  <a href="#contact" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>
                    Order Medicine <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-house-chimney-medical"></i></div>
                  <h3>Home Services</h3>
                  <p>Get personalized home care, nursing attention, and regular medical checkups at home.</p>
                  <a href="#contact" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>
                    Request Visit <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-clinic-medical"></i></div>
                  <h3>Physical Consultation</h3>
                  <p>Book physical appointments with our medical team at a doctor's clinic/home contact in active cities.</p>
                  <a href="#doctors" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>
                    Find Clinic <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: DOCTORS --- */}
        {currentView === 'doctors' && (
          <section id="doctors-view" className="view-section animate-fade">
            <div className="section-header">
              <h2>Doctor Directory</h2>
              <p>Search and inspect verified medical professionals active on our digital board.</p>
            </div>

            {/* Filter controls */}
            <div className="filter-bar glassmorphic">
              <div className="search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                  type="text" 
                  placeholder="Search doctor names, clinical focus..." 
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                />
              </div>

              <div className="specialty-filters">
                {['all', 'Pediatrics', 'General Medicine', 'Gynaecology', 'Laboratory', 'Pharmacy'].map(spec => (
                  <button 
                    key={spec}
                    className={`filter-btn ${doctorFilter === spec ? 'active' : ''}`}
                    onClick={() => setDoctorFilter(spec)}
                  >
                    {spec === 'all' ? 'All Focus' : spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor cards list */}
            {filteredDoctors.length > 0 ? (
              <div className="doctors-grid">
                {filteredDoctors.map((doc, idx) => {
                  const grad = getAvatarGradient(idx);
                  return (
                    <div className="doctor-card glassmorphic" key={doc.id}>
                      <div className="doctor-image-container">
                        {doc.image ? (
                          <img className="doctor-avatar-img" src={doc.image} alt={doc.name} />
                        ) : (
                          <svg className="doctor-avatar-svg" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id={`doctorGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: grad.from, stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: grad.to, stopOpacity: 1 }} />
                              </linearGradient>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#doctorGrad-${idx})`} />
                            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Lora', serif" fontSize="28" fontWeight="600" fill="#FAF6EE">
                              {doc.name.split(" ").map(n => n.charAt(0)).slice(1).join("").toUpperCase()}
                            </text>
                          </svg>
                        )}
                        <div className="doctor-badge">{doc.experience}</div>
                      </div>
                      
                      <div className="doctor-info">
                        <h3>{doc.name}</h3>
                        <div className="doctor-specialty">{doc.specialty}</div>
                        <div className="doctor-details">
                          <span><i className="fa-regular fa-clock"></i> {doc.schedule}</span>
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                          setBookingFormData({ 
                            ...bookingFormData, 
                            doctorId: doc.id.toString(),
                            patientName: loggedInPatient ? loggedInPatient.name : '',
                            email: loggedInPatient ? loggedInPatient.email : '',
                            phone: loggedInPatient ? loggedInPatient.phone : ''
                          });
                          navigateTo('booking');
                        }}>
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state glassmorphic">
                <i className="fa-solid fa-user-slash"></i>
                <h3>No medical specialists found</h3>
                <p>Try searching for a different name or specialty category.</p>
              </div>
            )}
          </section>
        )}

        {/* --- VIEW: BOOKING FORM --- */}
        {currentView === 'booking' && (
          <section id="booking-view" className="view-section animate-fade">
            <div className="booking-layout">
              <div className="booking-info-panel">
                <div className="badge-tag">
                  <span className="badge-dot"></span>
                  RESERVATIONS CONSOLE
                </div>
                <h2>Schedule a Virtual Consultation Slot</h2>
                <p>Fill out the credentials. Once requested, a confirmation ticket will be generated. Administrators review requests dynamically.</p>
                
                <div className="info-bullets">
                  <div className="bullet-item">
                    <div className="bullet-icon"><i className="fa-solid fa-circle-check"></i></div>
                    <div>
                      <strong>Verified MDCN Doctors</strong>
                      <p>All clinical responses are reviewed by licensed medical professionals.</p>
                    </div>
                  </div>
                  <div className="bullet-item">
                    <div className="bullet-icon"><i className="fa-solid fa-lock"></i></div>
                    <div>
                      <strong>Private & Encrypted</strong>
                      <p>Patient diagnosis statements and symptoms lists are securely locked.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic">
                <h3>Consultation Booking Form</h3>
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label htmlFor="patientName">Patient Name</label>
                    <input 
                      type="text" 
                      id="patientName" 
                      required 
                      placeholder="e.g. Zainab Abdulfatah"
                      value={bookingFormData.patientName}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, patientName: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        required 
                        placeholder="08012345678"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        required 
                        placeholder="zainab@example.com"
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bookingDoctor">Select Medical Specialist</label>
                      <select 
                        id="bookingDoctor" 
                        required
                        value={bookingFormData.doctorId}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, doctorId: e.target.value })}
                      >
                        <option value="">Choose Specialist...</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bookingDate">Preferred Date</label>
                      <input 
                        type="date" 
                        id="bookingDate" 
                        required
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="symptoms">Brief Description of Symptoms</label>
                    <textarea 
                      id="symptoms" 
                      rows="4" 
                      placeholder="Explain symptoms, diagnostic questions..."
                      value={bookingFormData.symptoms}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, symptoms: e.target.value })}
                    />
                  </div>

                  <div className="form-group consent-checkbox-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                      <input 
                        type="checkbox" 
                        required 
                        checked={bookingConsent}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShowTermsModal('booking');
                          } else {
                            setBookingConsent(false);
                          }
                        }}
                        style={{ width: 'auto', marginTop: '0.2rem' }}
                      />
                      <span>I consent to the <a href="#terms" onClick={(e) => { e.preventDefault(); setShowTermsModal('booking'); }} style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 'bold' }}>Terms & Conditions & Privacy Policy</a> and agree to share my clinical information.</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">Submit Booking Request</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: CONTACT --- */}
        {currentView === 'contact' && (
          <section id="contact-view" className="view-section animate-fade">
            <div className="section-header">
              <h2>Contact Support</h2>
              <p>For administrative inquiries, partnerships, or support, send us a direct message.</p>
            </div>

            <div className="booking-layout">
              <div className="booking-info-panel">
                <h3>SimmyCare HQ</h3>
                <p>Need urgent assistance? Reach out via WhatsApp or call our administrative hotline directly.</p>
                <div className="contact-details-box glassmorphic">
                  <p><strong><i className="fa-solid fa-phone"></i> Call Center:</strong> +234 901 432 4442</p>
                  <p><strong><i className="fa-solid fa-envelope"></i> Email Inquiries:</strong> Simmyclinic@gmail.com</p>
                  <p><strong><i className="fa-solid fa-location-dot"></i> Locations:</strong> Abuja, Kaduna, Kano, Bauchi, Gombe (P.M.B: 3511)</p>
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic">
                <h3>Send an Inquiry</h3>
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="contactName">Name</label>
                    <input 
                      type="text" 
                      id="contactName" 
                      required 
                      placeholder="e.g. John Doe"
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email</label>
                    <input 
                      type="email" 
                      id="contactEmail" 
                      required 
                      placeholder="john.doe@gmail.com"
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactMessage">Message</label>
                    <textarea 
                      id="contactMessage" 
                      rows="5" 
                      required 
                      placeholder="Type your message here..."
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: PORTAL LOGIN (Multi-Role Login) --- */}
        {currentView === 'portal-login' && (
          <section id="portal-login-view" className="view-section animate-fade">
            <div className="login-card-wrapper">
              <div className="login-card glassmorphic">
                
                {/* Role Tabs */}
                <div className="login-tabs">
                  <button className={`login-tab-btn ${loginTab === 'patient' ? 'active' : ''}`} onClick={() => { setLoginTab('patient'); setLoginError(''); }}>Patient</button>
                  <button className={`login-tab-btn ${loginTab === 'doctor' ? 'active' : ''}`} onClick={() => { setLoginTab('doctor'); setLoginError(''); }}>Doctor</button>
                  <button className={`login-tab-btn ${loginTab === 'admin' ? 'active' : ''}`} onClick={() => { setLoginTab('admin'); setLoginError(''); }}>Admin</button>
                </div>

                <div className="login-header">
                  <h2>
                    {loginTab === 'patient' && "Patient Portal"}
                    {loginTab === 'doctor' && "Doctor Board"}
                    {loginTab === 'admin' && "Administrator Access"}
                  </h2>
                  <p>
                    {loginTab === 'patient' && "Sign in with your email to view your consultation tickets"}
                    {loginTab === 'doctor' && "Sign in with your registered profile credentials"}
                    {loginTab === 'admin' && "Enter credentials to access clinic logs"}
                  </p>
                </div>

                {loginError && <div className="error-message">{loginError}</div>}

                {/* Patient Login Form */}
                {loginTab === 'patient' && (
                  <form onSubmit={handlePatientLoginSubmit}>
                    <div className="form-group">
                      <label>{isPatientRegistering ? "Email Address" : "Registered Email Address"}</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="patient@example.com"
                        value={patientLoginForm.email}
                        onChange={(e) => setPatientLoginForm({ ...patientLoginForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={patientLoginForm.password}
                        onChange={(e) => setPatientLoginForm({ ...patientLoginForm, password: e.target.value })}
                      />
                    </div>
                    {isPatientRegistering && (
                      <>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Zainab Abdulfatah"
                            value={patientLoginForm.name}
                            onChange={(e) => setPatientLoginForm({ ...patientLoginForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input 
                            type="tel" 
                            required 
                            placeholder="e.g. 08012345678"
                            value={patientLoginForm.phone}
                            onChange={(e) => setPatientLoginForm({ ...patientLoginForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="form-group consent-checkbox-group" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                            <input 
                              type="checkbox" 
                              required 
                              checked={registerConsent}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setShowTermsModal('register');
                                } else {
                                  setRegisterConsent(false);
                                }
                              }}
                              style={{ width: 'auto', marginTop: '0.2rem' }}
                            />
                            <span>I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); setShowTermsModal('register'); }} style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 'bold' }}>Terms & Conditions & Privacy Policy</a> compliance guidelines.</span>
                          </label>
                        </div>
                      </>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                      {isPatientRegistering 
                        ? "*All fields are required to establish your medical file."
                        : "*Tip: To inspect seeded data, log in using zainab@example.com and password password123."}
                    </p>
                    <button type="submit" className="btn btn-primary btn-block">
                      {isPatientRegistering ? "Create Profile & Access Portal" : "Access My Tickets"}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
                      {isPatientRegistering ? (
                        <span style={{ color: 'var(--color-indigo)' }}>
                          Already have an account?{' '}
                          <button 
                            type="button" 
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent-hover)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                            onClick={() => { setIsPatientRegistering(false); setLoginError(''); }}
                          >
                            Sign In
                          </button>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-indigo)' }}>
                          New to SimmyCare?{' '}
                          <button 
                            type="button" 
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent-hover)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                            onClick={() => { setIsPatientRegistering(true); setLoginError(''); }}
                          >
                            Register Here
                          </button>
                        </span>
                      )}
                    </div>
                  </form>
                )}

                {/* Doctor Login Form */}
                {loginTab === 'doctor' && (
                  <form onSubmit={handleDoctorLoginSubmit}>
                    <div className="form-group">
                      <label>Doctor Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="doctor@simmycare.com"
                        value={doctorLoginForm.email}
                        onChange={(e) => setDoctorLoginForm({ ...doctorLoginForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Access Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={doctorLoginForm.password}
                        onChange={(e) => setDoctorLoginForm({ ...doctorLoginForm, password: e.target.value })}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                      *Tip: Log in with <strong>fatima@simmycare.com</strong> and password <strong>password123</strong>.
                    </p>
                    <button type="submit" className="btn btn-primary btn-block">Verify Doctor Credentials</button>
                  </form>
                )}

                {/* Admin Login Form */}
                {loginTab === 'admin' && (
                  <form onSubmit={handleAdminLoginSubmit}>
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="admin"
                        value={adminLoginForm.username}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="•••••"
                        value={adminLoginForm.password}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Authenticate Admin</button>
                  </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <a href="#home" className="back-home-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>← Back to Homepage</a>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: INTEGRATED ROLE DASHBOARDS --- */}
        {currentView === 'dashboard' && (
          <section id="dashboard-view" className="view-section animate-fade">
            
            {/* 1. PATIENT DASHBOARD */}
            {authRole === 'patient' && loggedInPatient && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <span className="badge-tag"><span className="badge-dot"></span> PATIENT CONSULTATION HUB</span>
                    <h2>Welcome back, {loggedInPatient.name}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Registered Email: {loggedInPatient.email}</p>
                  </div>
                  <div>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="stat-item">
                    <h3>{myPatientAppointments.length}</h3>
                    <p>TOTAL CONSULTATIONS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{myPatientAppointments.filter(a => a.status === 'Approved').length}</h3>
                    <p>APPROVED / COMPLETED</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{myPatientAppointments.filter(a => a.status === 'Pending').length}</h3>
                    <p>PENDING CHECKS</p>
                  </div>
                </div>

                <div className="dashboard-layout" style={{ gridTemplateColumns: '1.8fr 1.2fr' }}>
                  {/* Left Column: My Bookings */}
                  <div className="dashboard-workspace glassmorphic">
                    <h3>My Appointment Tickets</h3>
                    {myPatientAppointments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Ticket ID</th>
                              <th>Doctor</th>
                              <th>Date / Time</th>
                              <th>Status</th>
                              <th>Clinical Feedback / Prescriptions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myPatientAppointments.map(apt => (
                              <tr key={apt.id}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{apt.id}</td>
                                <td>{apt.doctor}</td>
                                <td>{apt.date} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({apt.time})</span></td>
                                <td>
                                  <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                                    {apt.status}
                                  </span>
                                </td>
                                <td>
                                  {apt.status === 'Approved' && (apt.notes || apt.prescription) ? (
                                    <div className="patient-prescription-box">
                                      {apt.notes && <p><strong>Doctor Notes:</strong> {apt.notes}</p>}
                                      {apt.prescription && <p><strong>Rx Prescriptions:</strong> <span className="rx-label">{apt.prescription}</span></p>}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                      {apt.status === 'Pending' ? "Awaiting doctor's review..." : "No clinical feedback file."}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>You haven't scheduled any consultation tickets yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quick Booking */}
                  <div className="booking-form-wrapper glassmorphic">
                    <h4>Request New Consultation</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Schedule another virtual appointment instantly</p>
                    <form onSubmit={handleBookingSubmit}>
                      <input type="hidden" value={loggedInPatient.name} />
                      <input type="hidden" value={loggedInPatient.email} />
                      <input type="hidden" value={loggedInPatient.phone} />
                      
                      <div className="form-group">
                        <label>Select Specialist</label>
                        <select 
                          required
                          value={bookingFormData.doctorId}
                          onChange={(e) => setBookingFormData({ 
                            ...bookingFormData, 
                            doctorId: e.target.value,
                            patientName: loggedInPatient.name,
                            email: loggedInPatient.email,
                            phone: loggedInPatient.phone
                          })}
                        >
                          <option value="">Choose Specialist...</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingFormData.date}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Explain Symptoms</label>
                        <textarea 
                          rows="3" 
                          placeholder="Brief diagnostic explanation..."
                          value={bookingFormData.symptoms}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, symptoms: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary btn-block">Confirm Request Slot</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DOCTOR DASHBOARD */}
            {authRole === 'doctor' && loggedInDoctor && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <span className="badge-tag"><span className="badge-dot"></span> CLINICAL WORKSPACE</span>
                    <h2>{loggedInDoctor.name}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Focus Focus: {loggedInDoctor.specialty} | MDCN ID: {loggedInDoctor.regNo}</p>
                  </div>
                  <div>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                {/* Stats */}
                <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="stat-item">
                    <h3>{myDoctorAppointments.length}</h3>
                    <p>TOTAL ASSIGNED PATIENTS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{myDoctorAppointments.filter(a => a.status === 'Pending').length}</h3>
                    <p>AWAITING REVIEW</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{loggedInDoctor.schedule}</h3>
                    <p>WEEKLY DUTY HOURS</p>
                  </div>
                </div>

                <div className="dashboard-workspace glassmorphic">
                  <h3>My Consultation Backlog ({myDoctorAppointments.length})</h3>
                  {myDoctorAppointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Ticket ID</th>
                            <th>Patient Name</th>
                            <th>Date / Time</th>
                            <th>Symptoms Statement</th>
                            <th>Consultation Status</th>
                            <th>Prescriptions & Feedback</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myDoctorAppointments.map(apt => (
                            <tr key={apt.id}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{apt.id}</td>
                              <td>
                                <strong>{apt.patientName}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.phone}</div>
                              </td>
                              <td>{apt.date} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({apt.time})</span></td>
                              <td style={{ maxWidth: '240px', wordBreak: 'break-word' }}>{apt.symptoms}</td>
                              <td>
                                <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                                  {apt.status}
                                </span>
                              </td>
                              <td>
                                {apt.notes || apt.prescription ? (
                                  <div className="patient-prescription-box">
                                    {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                                    {apt.prescription && <p><strong>Rx:</strong> <span className="rx-label">{apt.prescription}</span></p>}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Pending medical report...</span>
                                )}
                              </td>
                              <td>
                                <button className="btn btn-primary btn-sm" onClick={() => openConsultationNotesModal(apt)}>
                                  <i className="fa-solid fa-file-signature"></i> Add Rx/Notes
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>You have no scheduled virtual patient consultation requests at this time.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. ADMINISTRATOR DASHBOARD */}
            {authRole === 'admin' && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <span className="badge-tag"><span className="badge-dot"></span> OPERATIONS CONSOLE</span>
                    <h2>SimmyCare Control Panel</h2>
                  </div>
                  <div className="dashboard-header-actions">
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                {/* Stats Summary cards */}
                <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                  <div className="stat-item">
                    <h3>{appointments.length}</h3>
                    <p>TOTAL BOOKINGS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{appointments.filter(a => a.status === 'Pending').length}</h3>
                    <p>PENDING APPROVALS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{doctors.length}</h3>
                    <p>ACTIVE DOCTORS</p>
                  </div>
                </div>

                <div className="dashboard-layout">
                  {/* Sidebar Navigation */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button 
                      className={`sidebar-nav-btn ${adminNavView === 'appointments' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('appointments')}
                    >
                      <i className="fa-regular fa-calendar-check"></i> Appointments
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${adminNavView === 'doctors' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('doctors')}
                    >
                      <i className="fa-solid fa-user-doctor"></i> Doctor Profiles
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${adminNavView === 'inquiries' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('inquiries')}
                    >
                      <i className="fa-solid fa-inbox"></i> Patient Inquiries
                    </button>
                  </div>

                  {/* Console Workspace */}
                  <div className="dashboard-workspace glassmorphic">
                    
                    {/* Workspace: Appointments */}
                    {adminNavView === 'appointments' && (
                      <div>
                        <h3>Appointments Registry</h3>
                        {appointments.length > 0 ? (
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Ticket ID</th>
                                  <th>Patient</th>
                                  <th>Specialist</th>
                                  <th>Date</th>
                                  <th>Symptoms</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appointments.map(apt => (
                                  <tr key={apt.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{apt.id}</td>
                                    <td>
                                      <strong>{apt.patientName}</strong>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.phone}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.email}</div>
                                    </td>
                                    <td>{apt.doctor}</td>
                                    <td>{apt.date} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({apt.time})</span></td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={apt.symptoms}>
                                      {apt.symptoms}
                                    </td>
                                    <td>
                                      <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                                        {apt.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="actions-wrapper">
                                        {apt.status === 'Pending' && (
                                          <>
                                            <button className="action-btn btn-approve" onClick={() => handleApproveAppointment(apt.id)} title="Approve Booking">
                                              Approve
                                            </button>
                                            <button className="action-btn btn-cancel" onClick={() => handleCancelAppointment(apt.id)} title="Cancel Booking">
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                        <button className="action-btn" style={{ color: '#EF4444' }} onClick={() => handleDeleteAppointment(apt.id)} title="Delete Record">
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="empty-state">
                            <p>No bookings exist in the records database.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Workspace: Doctors Profiles */}
                    {adminNavView === 'doctors' && (
                      <div>
                        <h3>Manage Doctor Directory</h3>
                        
                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddDoctor}>
                          <h4>Register New Specialist Profile</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Doctor Name (Exclude "Dr.")</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="e.g. Amina Yusuf"
                                value={newDoctorData.name}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Specialty Department</label>
                              <select 
                                value={newDoctorData.specialty}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, specialty: e.target.value })}
                              >
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Gynaecology">Gynaecology</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Pharmacy">Pharmacy</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label>Weekly Schedule Hours</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Mon - Wed (9am - 2pm)"
                                value={newDoctorData.schedule}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, schedule: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Clinical Experience (Years)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 8 Years"
                                value={newDoctorData.experience}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, experience: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>MDCN Register Code</label>
                              <input 
                                type="text" 
                                placeholder="e.g. MDCN/8431"
                                value={newDoctorData.regNo}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, regNo: e.target.value })}
                              />
                            </div>
                          </div>

                          <button type="submit" className="btn btn-primary">Save Profile to Board</button>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Doctors ({doctors.length})</h4>
                          <div className="admin-doctors-list-grid">
                            {doctors.map(d => (
                              <div className="admin-doctor-card glassmorphic" key={d.id}>
                                <div className="admin-doc-info">
                                  <strong>{d.name}</strong>
                                  <span>{d.specialty} — {d.experience}</span>
                                  <small>{d.schedule} | {d.regNo}</small>
                                </div>
                                <button className="delete-doctor-btn" onClick={() => handleDeleteDoctor(d.id)} title="Delete Profile">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Patient Inquiries */}
                    {adminNavView === 'inquiries' && (
                      <div>
                        <h3>Inquiries Inbox</h3>
                        {inquiries.length > 0 ? (
                          <div className="inquiry-cards-list">
                            {inquiries.map(inq => (
                              <div className="inquiry-card-item glassmorphic" key={inq.id}>
                                <div className="inq-header">
                                  <div>
                                    <strong>{inq.name}</strong> ({inq.email})
                                    <span className="inq-ticket">{inq.id}</span>
                                  </div>
                                  <span className="inq-date">{inq.date}</span>
                                </div>
                                <p className="inq-message">"{inq.message}"</p>
                                <div className="inq-actions">
                                  <button className="inq-btn-delete" onClick={() => handleDeleteInquiry(inq.id)}>
                                    <i className="fa-solid fa-trash"></i> Delete Inquiry
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-state">
                            <p>Inbox is empty. No patient inquiries received.</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

          </section>
        )}

      </main>

      {/* --- 3. Footer Section (Glassmorphic & Transparent) --- */}
      <footer className="app-footer glassmorphic">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <div className="logo-img-wrapper">
                <img className="logo-img" src="/logo.svg" alt="SimmyCare Logo" />
              </div>
              <span className="logo-text">Simmy<span>Care</span></span>
            </a>
            <p>SimmyCare is an online clinic offering stress-free medical consultations, mobile laboratory diagnostics, pharmacy deliveries, and home services across Abuja, Kaduna, Kano, Bauchi, and Gombe.</p>
          </div>

          <div className="footer-links-col">
            <h4>Clinic Pages</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home Page</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Doctor Directory</a></li>
              <li><a href="#booking" onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>Book Consultation</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Send Inquiries</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Legal & Compliance</h4>
            <ul>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); setShowTermsModal('view'); }}>Terms & Conditions</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setShowTermsModal('view'); }}>Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-hours-col">
            <h4>Operational Hours</h4>
            <p>Monday – Friday: 8:00 AM – 5:00 PM</p>
            <p>Saturday: 9:00 AM – 2:00 PM</p>
            <p>Sunday: Emergency Consultations Only</p>
            <p className="footer-contact-phone"><i className="fa-solid fa-phone"></i> +234 901 432 4442</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SimmyCare Online Clinic. Developed by Nexel Technologies. All rights reserved.</p>
          <p>RC Number: RC 9198656</p>
        </div>
      </footer>

      {/* --- 4. Success Modal Popup --- */}
      {successModal && (
        <div className="modal-backdrop">
          <div className="modal-content glassmorphic animate-fade">
            <div className="modal-success-icon"><i className="fa-solid fa-circle-check"></i></div>
            <h3>{successModal.title}</h3>
            <p>{successModal.message}</p>
            <div className="modal-ticket-box">
              <span>CONFIRMATION TICKET:</span>
              <strong>{successModal.ticket}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => setSuccessModal(null)}>Dismiss Portal</button>
          </div>
        </div>
      )}

      {/* --- 5. Doctor Rx/Notes Modal --- */}
      {activeConsultationApt && (
        <div className="modal-backdrop">
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }}>
            <h3>Consultation File: {activeConsultationApt.id}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Patient: <strong>{activeConsultationApt.patientName}</strong> <br />
              Symptoms: <em>{activeConsultationApt.symptoms}</em>
            </p>
            
            <form onSubmit={saveConsultationNotesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label>Clinical Consultation Notes</label>
                <textarea 
                  rows="3" 
                  required
                  placeholder="Record patient medical evaluation notes..."
                  value={consultationNotes.notes}
                  onChange={(e) => setConsultationNotes({ ...consultationNotes, notes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Digital Prescription (Rx)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin 500mg - 3 times daily for 7 days"
                  value={consultationNotes.prescription}
                  onChange={(e) => setConsultationNotes({ ...consultationNotes, prescription: e.target.value })}
                />
              </div>

              <div className="form-row">
                <button type="submit" className="btn btn-primary">Save Consultation & Approve</button>
                <button type="button" className="btn btn-outline" onClick={() => setActiveConsultationApt(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 6. WhatsApp Floating Widget --- */}
      <a 
        href="https://wa.me/2349014324442?text=Hello%20SimmyCare%21%20I%20would%20like%20to%20make%20an%20inquiry%20about%20booking%20a%20consultation." 
        className="whatsapp-widget" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      {/* --- 7. Terms & Conditions & Privacy Policy Modal --- */}
      {showTermsModal && (
        <div className="modal-backdrop" style={{ zIndex: 1000 }}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '600px', textAlign: 'left', alignItems: 'stretch', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>Terms of Service & Privacy Policy</h3>
              <button 
                onClick={() => setShowTermsModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div 
              onScroll={handleTermsScroll}
              style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--color-text)', overflowY: 'auto', maxHeight: '320px', paddingRight: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}
            >
              <h4>1. Medical Assessment Consent</h4>
              <p>By submitting an appointment request, you consent to receive remote clinical evaluations, diagnostic advice, and authorized prescriptions from certified professionals associated with SimmyCare.</p>
              
              <h4>2. Patient Data Security</h4>
              <p>We implement role-based access control (RBAC). Only the medical practitioners directly assigned to your consultation and authorised clinic administrators have access to your clinical symptoms and patient files.</p>
              
              <h4>3. Communication & Service Setup</h4>
              <p>Updates, bookings, and remote diagnostic reports will be communicated primarily through email (Simmyclinic@gmail.com) and WhatsApp (+234 901 432 4442).</p>
              
              <h4>4. Physical Branches & Jurisdictions</h4>
              <p>While primary services are digital, physical consultation requests are routed to doctor-contact locations in Abuja, Kaduna, Kano, Bauchi, and Gombe.</p>

              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>— End of Document —</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                disabled={!hasReadTerms}
                onClick={() => {
                  if (showTermsModal === 'booking') {
                    setBookingConsent(true);
                  } else if (showTermsModal === 'register') {
                    setRegisterConsent(true);
                  }
                  setShowTermsModal(null);
                }}
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
