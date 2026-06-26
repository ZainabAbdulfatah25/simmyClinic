import React, { useState, useEffect } from 'react';
import doctorFatimaImg from './assets/doctor_fatima.jpg';
import doctorAdamImg from './assets/doctor_adam.jpg';
import doctorTijjaniImg from './assets/doctor_tijjani.jpg';
import doctorBamalliImg from './assets/doctor_bamalli.jpg';
import heroPng from './assets/hero.png';
import logoSvg from './assets/logo.svg';

// --- Seed Data ---
const ALL_SERVICES = [
  "Online Consultation",
  "Mobile Laboratory",
  "Pharmacy Delivery",
  "Home Services",
  "Physical Consultation"
];

const getSpecialtyTitle = (specialty) => {
  if (!specialty) return '';
  const mapping = {
    'Gynaecology': 'Gynaecologist',
    'Pediatrics': 'Pediatrician',
    'General Medicine': 'General Practitioner',
    'Laboratory': 'Laboratory Specialist',
    'Pharmacy': 'Pharmacist',
    'Dentistry': 'Dentist',
    'Optometry': 'Optometrist',
    'Cardiology': 'Cardiologist',
    'Dermatology': 'Dermatologist',
    'Psychology': 'Psychologist',
    'Public Health': 'Public Health Physician'
  };
  return mapping[specialty] || specialty;
};

const INITIAL_DOCTORS = [
  { 
    id: 1, 
    name: "Dr. Fatima Yahaya Maiauduga", 
    specialty: "Gynaecology", 
    schedule: "Mon - Wed (9am - 2pm)", 
    experience: "8 Years", 
    regNo: "MDCN/8431", 
    image: doctorFatimaImg, 
    email: "fatima@simmycare.com", 
    password: "password123",
    phone: "08034567890",
    bio: "Senior consultant gynaecologist specializing in maternal care, obstetrics, and female reproductive wellness.",
    clinicRoom: "Room 102, West Wing",
    license: "",
    consultationRate: "₦10,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"]
  },
  { 
    id: 2, 
    name: "Dr. Adam Zamzam", 
    specialty: "General Medicine", 
    schedule: "Mon - Fri (8am - 4pm)", 
    experience: "10 Years", 
    regNo: "MDCN/7123", 
    image: doctorAdamImg, 
    email: "adam@simmycare.com", 
    password: "password123",
    phone: "08051234567",
    bio: "General practitioner committed to family medicine, chronic disease management, and preventative patient education.",
    clinicRoom: "Room 205, Main Block",
    license: "",
    consultationRate: "₦5,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Mobile Laboratory"]
  },
  {
    id: 3,
    name: "Dr. Mato Saddiqa Tijjani",
    specialty: "Public Health",
    schedule: "Mon - Fri (9am - 4pm)",
    experience: "4 Years",
    regNo: "MDCN/6203",
    image: doctorTijjaniImg,
    email: "matosaddiqa@gmail.com",
    password: "password123",
    phone: "+234 909 677 6797",
    bio: "Medical Doctor and Public Health Practitioner with more than 4 years of progressive clinical experience in tertiary and specialist hospitals, skilled in patient-centered care, emergency medicine, maternal and child health, and preventive healthcare.",
    clinicRoom: "Room 110, Public Health Wing",
    license: "",
    consultationRate: "₦10,000 - ₦20,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"]
  },
  {
    id: 4,
    name: "Dr. Abubakar Muhammad Bamalli",
    specialty: "General Medicine",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "9 Years",
    regNo: "MDCN/5890",
    image: doctorBamalliImg,
    email: "abubakarbalili79@gmail.com",
    password: "password123",
    phone: "+234 813 870 5738",
    bio: "Experienced Medical Doctor with 9 years of clinical practice, providing comprehensive general medical consultations across physical and telemedicine platforms.",
    clinicRoom: "Room 207, Main Block",
    license: "",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"]
  }
];

const INITIAL_APPOINTMENTS = [];

const INITIAL_INQUIRIES = [];

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
    const validViews = [
      'home', 'doctors', 'booking', 'contact', 'portal-login', 'dashboard',
      'service-online-consultation', 'service-mobile-lab', 'service-pharmacy-delivery', 'service-home-services', 'service-physical-consult',
      'specialty-general-medicine', 'specialty-pediatrics', 'specialty-gynaecology', 'specialty-psychology', 'specialty-dentistry'
    ];
    return validViews.includes(hash) ? hash : 'home';
  });

  // Map seed doctor IDs to their bundled image imports so they survive localStorage serialization
  const BUNDLED_IMAGES = { 1: doctorFatimaImg, 2: doctorAdamImg, 3: doctorTijjaniImg, 4: doctorBamalliImg };

  const [doctors, setDoctors] = useState(() => {
    const data = localStorage.getItem("simmy_doctors");
    if (data) {
      const parsed = JSON.parse(data);
      // Re-apply bundled images for seed doctors unless they have a user-uploaded base64 image
      return parsed.map(doc => {
        const seedDoc = INITIAL_DOCTORS.find(sd => sd.id === doc.id);
        const updatedDoc = {
          ...doc,
          consultationRate: doc.consultationRate !== undefined ? doc.consultationRate : (seedDoc ? seedDoc.consultationRate : ''),
          consultationDuration: doc.consultationDuration !== undefined ? doc.consultationDuration : (seedDoc ? seedDoc.consultationDuration : '30 mins'),
          services: doc.services !== undefined ? doc.services : (seedDoc ? seedDoc.services : [])
        };
        if (BUNDLED_IMAGES[doc.id] && (!doc.image || !doc.image.startsWith('data:'))) {
          updatedDoc.image = BUNDLED_IMAGES[doc.id];
        }
        return updatedDoc;
      });
    }
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

  // --- Cart & Checkout States for Service Pages ---
  const [labCart, setLabCart] = useState([]);
  const [pharmacyCart, setPharmacyCart] = useState([]);
  const [labCheckout, setLabCheckout] = useState({ name: '', email: '', phone: '', date: '', address: '', notes: '' });
  const [pharmacyCheckout, setPharmacyCheckout] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [homeServiceCheckout, setHomeServiceCheckout] = useState({ name: '', email: '', phone: '', date: '', address: '', notes: '', package: 'Elderly Care & Companion Visit' });

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
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const stored = localStorage.getItem("simmy_admin_credentials");
    return stored ? JSON.parse(stored) : { username: 'admin', password: 'admin' };
  });
  const [adminSelfData, setAdminSelfData] = useState({ username: '', password: '' });
  const [isEditingAdminSelf, setIsEditingAdminSelf] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({ 
    name: '', 
    specialty: 'Pediatrics', 
    schedule: '', 
    experience: '', 
    regNo: '', 
    email: '', 
    password: '', 
    image: '',
    phone: '',
    bio: '',
    clinicRoom: '',
    license: '',
    consultationRate: '',
    consultationDuration: '',
    services: []
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [doctorNavView, setDoctorNavView] = useState('backlog'); // 'backlog' | 'profile'
  const [isEditingDocSelf, setIsEditingDocSelf] = useState(false);
  const [docSelfData, setDocSelfData] = useState({ 
    name: '', 
    specialty: 'Pediatrics', 
    schedule: '', 
    experience: '', 
    regNo: '', 
    email: '', 
    password: '', 
    image: '',
    phone: '',
    bio: '',
    clinicRoom: '',
    license: '',
    consultationRate: '',
    consultationDuration: '',
    services: []
  });
  const [previewBookingDoc, setPreviewBookingDoc] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [newPatientData, setNewPatientData] = useState({ name: '', email: '', phone: '', password: '' });
  
  // Patient Profile & Navigation States
  const [patientNavView, setPatientNavView] = useState('bookings'); // 'bookings' | 'profile'
  const [isEditingPatSelf, setIsEditingPatSelf] = useState(false);
  const [patSelfData, setPatSelfData] = useState({ name: '', email: '', phone: '', password: '' });

  const [adminSelectedApt, setAdminSelectedApt] = useState(null);
  const [adminSelectedInquiry, setAdminSelectedInquiry] = useState(null);
  const [adminSelectedDoctor, setAdminSelectedDoctor] = useState(null);
  const [activeConsultationApt, setActiveConsultationApt] = useState(null); // For doctor prescription modal
  const [consultationNotes, setConsultationNotes] = useState({ notes: '', prescription: '' });
  const [editingApt, setEditingApt] = useState(null);
  const [editAptData, setEditAptData] = useState({ doctorId: '', doctorName: '', date: '', time: '', symptoms: '', status: '' });
  const [showPasswords, setShowPasswords] = useState({ patient: false, doctor: false, admin: false, doctorForm: false, patientForm: false, adminForm: false });
  const [docNotesState, setDocNotesState] = useState({});
  const [modalEditingFields, setModalEditingFields] = useState({});
  const [modalTempValues, setModalTempValues] = useState({});
  const [followUpApt, setFollowUpApt] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: '', time: '10:00 AM', reason: '2-Week Observation Follow-up' });
  const [whatsappPopupOpen, setWhatsappPopupOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("simmy_admin_credentials", JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  // Migrate older appointments containing non-existent doctors to current active doctors
  useEffect(() => {
    let changed = false;
    const validDoctorNames = doctors.map(d => d.name);
    const updatedApts = appointments.map(apt => {
      if (!validDoctorNames.includes(apt.doctor)) {
        changed = true;
        return { ...apt, doctor: doctors[0]?.name || apt.doctor };
      }
      return apt;
    });
    if (changed) {
      setAppointments(updatedApts);
    }
  }, []);

  // Sync Auth State
  useEffect(() => {
    sessionStorage.setItem("simmy_auth_role", authRole || '');
    sessionStorage.setItem("simmy_auth_patient", loggedInPatient ? JSON.stringify(loggedInPatient) : '');
    sessionStorage.setItem("simmy_auth_doctor", loggedInDoctor ? JSON.stringify(loggedInDoctor) : '');
  }, [authRole, loggedInPatient, loggedInDoctor]);

  // Keep loggedInDoctor synchronized with doctors registry updates
  useEffect(() => {
    if (loggedInDoctor) {
      const currentDoc = doctors.find(d => d.id === loggedInDoctor.id);
      if (currentDoc && JSON.stringify(currentDoc) !== JSON.stringify(loggedInDoctor)) {
        setLoggedInDoctor(currentDoc);
      }
    }
  }, [doctors, loggedInDoctor]);

  // Keep loggedInPatient synchronized with patients registry updates
  useEffect(() => {
    if (loggedInPatient) {
      const currentPat = patients.find(p => p.email.toLowerCase() === loggedInPatient.email.toLowerCase());
      if (currentPat && JSON.stringify(currentPat) !== JSON.stringify(loggedInPatient)) {
        setLoggedInPatient(currentPat);
      }
    }
  }, [patients, loggedInPatient]);

  // Router Hash Changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const storedRole = sessionStorage.getItem("simmy_auth_role");
        if (hash === 'dashboard' && !storedRole) {
          setCurrentView('portal-login');
        } else {
          setCurrentView(hash);
        }
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // Trigger initial check
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authRole]);

  const [viewHistory, setViewHistory] = useState(['home']);

  const navigateTo = (view) => {
    setViewHistory(prev => {
      if (prev[prev.length - 1] === view) return prev;
      return [...prev, view];
    });
    const storedRole = sessionStorage.getItem("simmy_auth_role") || authRole;
    if (view === 'dashboard' && !storedRole) {
      window.location.hash = 'portal-login';
      setCurrentView('portal-login');
    } else {
      window.location.hash = view;
      setCurrentView(view);
    }
  };

  const navigateBack = () => {
    setViewHistory(prev => {
      if (prev.length <= 1) {
        window.location.hash = 'home';
        setCurrentView('home');
        return ['home'];
      }
      const newHist = prev.slice(0, -1);
      const prevView = newHist[newHist.length - 1];
      window.location.hash = prevView;
      setCurrentView(prevView);
      return newHist;
    });
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
      sessionStorage.setItem("simmy_auth_role", "patient");
      sessionStorage.setItem("simmy_auth_patient", JSON.stringify(newPatient));
      setPatientLoginForm({ email: '', name: '', phone: '', password: '' });
      setIsPatientRegistering(false);
      setLoginError('');
      navigateTo('dashboard');
    } else {
      const existing = patients.find(p => p.email.toLowerCase() === email);
      if (existing && existing.password === password) {
        setAuthRole('patient');
        setLoggedInPatient(existing);
        sessionStorage.setItem("simmy_auth_role", "patient");
        sessionStorage.setItem("simmy_auth_patient", JSON.stringify(existing));
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
      sessionStorage.setItem("simmy_auth_role", "doctor");
      sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(doc));
      setDoctorLoginForm({ email: '', password: '' });
      setLoginError('');
      navigateTo('dashboard');
    } else {
      setLoginError('Invalid doctor email address or password.');
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    const enteredUser = adminLoginForm.username.trim();
    const enteredPass = adminLoginForm.password.trim();
    const isMainMatch = enteredUser === adminCredentials.username && enteredPass === adminCredentials.password;
    const isFallbackMatch = enteredUser === 'admin' && enteredPass === 'admin';

    if (isMainMatch || isFallbackMatch) {
      setAuthRole('admin');
      sessionStorage.setItem("simmy_auth_role", "admin");
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
    sessionStorage.removeItem("simmy_auth_role");
    sessionStorage.removeItem("simmy_auth_patient");
    sessionStorage.removeItem("simmy_auth_doctor");
    navigateTo('home');
  };

  const startEditApt = (apt) => {
    const docObj = doctors.find(d => d.name === apt.doctor || `Dr. ${d.name}` === apt.doctor);
    setEditingApt(apt);
    setEditAptData({
      doctorId: docObj ? docObj.id : '',
      doctorName: apt.doctor,
      date: apt.date,
      time: apt.time,
      symptoms: apt.symptoms,
      status: apt.status
    });
  };

  const handleSaveEditApt = (e) => {
    e.preventDefault();
    if (!editingApt) return;

    let docName = editAptData.doctorName;
    if (editAptData.doctorId) {
      const docObj = doctors.find(d => d.id === parseInt(editAptData.doctorId));
      if (docObj) {
        // Avoid double "Dr." prefix since names already include it
        docName = docObj.name.startsWith('Dr. ') ? docObj.name : `Dr. ${docObj.name}`;
      }
    }

    const updatedApts = appointments.map(apt => {
      if (apt.id === editingApt.id) {
        return {
          ...apt,
          doctor: docName,
          date: editAptData.date,
          time: editAptData.time,
          symptoms: editAptData.symptoms,
          status: editAptData.status
        };
      }
      return apt;
    });

    setAppointments(updatedApts);
    setEditingApt(null);
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

  const handleRejectAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Rejected' } : apt
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

  const handleAutoRouteSpecialist = (id) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;

    const currentDoc = doctors.find(d => d.name === apt.doctor || d.id === parseInt(apt.doctorId));
    const targetSpecialty = currentDoc ? currentDoc.specialty : null;

    const candidateDoctors = doctors.filter(d => d.active !== false && (!targetSpecialty || d.specialty === targetSpecialty));
    const finalCandidates = candidateDoctors.length > 0 
      ? candidateDoctors 
      : doctors.filter(d => d.active !== false);

    if (finalCandidates.length === 0) {
      alert("No active doctors are currently available in the directory.");
      return;
    }

    const doctorWorkloads = finalCandidates.map(doc => {
      const activeCount = appointments.filter(a => 
        (a.doctor === doc.name || parseInt(a.doctorId) === doc.id) && 
        (a.status === 'Pending' || a.status === 'Approved')
      ).length;
      return { doc, activeCount };
    });

    doctorWorkloads.sort((a, b) => a.activeCount - b.activeCount);
    const mostAvailable = doctorWorkloads[0];

    setAppointments(appointments.map(a => 
      a.id === id 
        ? { 
            ...a, 
            doctorId: mostAvailable.doc.id, 
            doctor: mostAvailable.doc.name 
          } 
        : a
    ));

    alert(`Patient successfully routed to Dr. ${mostAvailable.doc.name} (${mostAvailable.doc.specialty}) who has the lowest active workload (${mostAvailable.activeCount} active bookings).`);
  };

  const handleToggleDoctorActive = (docId) => {
    setDoctors(doctors.map(d => 
      d.id === docId ? { ...d, active: d.active === false ? true : false } : d
    ));
  };

  const handleSaveAdminSelf = (e) => {
    e.preventDefault();
    if (!adminSelfData.username.trim() || !adminSelfData.password.trim()) {
      alert("Username and password cannot be empty!");
      return;
    }
    const updated = {
      username: adminSelfData.username.trim(),
      password: adminSelfData.password.trim()
    };
    setAdminCredentials(updated);
    setIsEditingAdminSelf(false);
    alert("Admin login credentials updated successfully!");
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (editingDoctorId) {
      const oldDoc = doctors.find(d => d.id === editingDoctorId);
      const oldName = oldDoc ? oldDoc.name : '';
      const newName = newDoctorData.name.startsWith("Dr. ") ? newDoctorData.name : `Dr. ${newDoctorData.name}`;

      setDoctors(doctors.map(d => {
        if (d.id === editingDoctorId) {
          return {
            ...d,
            name: newName,
            specialty: newDoctorData.specialty,
            schedule: newDoctorData.schedule,
            experience: newDoctorData.experience,
            regNo: newDoctorData.regNo,
            email: newDoctorData.email,
            password: newDoctorData.password,
            image: newDoctorData.image,
            phone: newDoctorData.phone,
            bio: newDoctorData.bio,
            clinicRoom: newDoctorData.clinicRoom,
            license: newDoctorData.license,
            consultationRate: newDoctorData.consultationRate,
            consultationDuration: newDoctorData.consultationDuration,
            services: newDoctorData.services
          };
        }
        return d;
      }));

      if (oldName && oldName.toLowerCase() !== newName.toLowerCase()) {
        setAppointments(appointments.map(apt => {
          if (apt.doctor.toLowerCase() === oldName.toLowerCase()) {
            return { ...apt, doctor: newName };
          }
          return apt;
        }));
      }

      setEditingDoctorId(null);
      setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', consultationDuration: '', services: [] });
      alert("Doctor profile updated successfully!");
    } else {
      const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
      const newDoc = {
        id: newId,
        name: newDoctorData.name.startsWith("Dr. ") ? newDoctorData.name : `Dr. ${newDoctorData.name}`,
        specialty: newDoctorData.specialty,
        schedule: newDoctorData.schedule || "Mon - Fri (9am - 5pm)",
        experience: newDoctorData.experience || "5 Years",
        regNo: newDoctorData.regNo || "MDCN/" + Math.floor(1000 + Math.random() * 9000),
        email: newDoctorData.email || `doc${newId}@simmycare.com`,
        password: newDoctorData.password || "password123",
        image: newDoctorData.image || '',
        phone: newDoctorData.phone || '',
        bio: newDoctorData.bio || '',
        clinicRoom: newDoctorData.clinicRoom || '',
        license: newDoctorData.license || '',
        consultationRate: newDoctorData.consultationRate || '',
        consultationDuration: newDoctorData.consultationDuration || '30 mins',
        services: newDoctorData.services || []
      };
      setDoctors([...doctors, newDoc]);
      setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', consultationDuration: '', services: [] });
      alert("Doctor profile added successfully!");
    }
  };

  const startEditDoctor = (doc) => {
    setEditingDoctorId(doc.id);
    const cleanName = doc.name.startsWith("Dr. ") ? doc.name.substring(4) : doc.name;
    setNewDoctorData({
      name: cleanName,
      specialty: doc.specialty,
      schedule: doc.schedule,
      experience: doc.experience,
      regNo: doc.regNo,
      email: doc.email || '',
      password: doc.password || '',
      image: doc.image || '',
      phone: doc.phone || '',
      bio: doc.bio || '',
      clinicRoom: doc.clinicRoom || '',
      license: doc.license || '',
      consultationRate: doc.consultationRate || '',
      consultationDuration: doc.consultationDuration || '',
      services: doc.services || []
    });
  };

  const handleDeleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor profile?")) {
      setDoctors(doctors.filter(d => d.id !== id));
      if (editingDoctorId === id) {
        setEditingDoctorId(null);
        setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', consultationDuration: '', services: [] });
      }
    }
  };

  const handleSaveDocSelf = (e) => {
      e.preventDefault();
      const oldName = loggedInDoctor.name;
      const newName = docSelfData.name.startsWith("Dr. ") ? docSelfData.name : `Dr. ${docSelfData.name}`;
  
      const updatedDoc = {
        ...loggedInDoctor,
        name: newName,
        specialty: docSelfData.specialty,
        schedule: docSelfData.schedule,
        experience: docSelfData.experience,
        regNo: docSelfData.regNo,
        email: docSelfData.email,
        password: docSelfData.password,
        image: docSelfData.image,
        phone: docSelfData.phone,
        bio: docSelfData.bio,
        clinicRoom: docSelfData.clinicRoom,
        license: docSelfData.license,
        consultationRate: docSelfData.consultationRate,
        consultationDuration: docSelfData.consultationDuration,
        services: docSelfData.services
      };
  
      setDoctors(doctors.map(d => d.id === loggedInDoctor.id ? updatedDoc : d));
  
      if (oldName.toLowerCase() !== newName.toLowerCase()) {
        setAppointments(appointments.map(apt => {
          if (apt.doctor.toLowerCase() === oldName.toLowerCase()) {
            return { ...apt, doctor: newName };
          }
          return apt;
        }));
      }
  
      setLoggedInDoctor(updatedDoc);
      setIsEditingDocSelf(false);
      alert("Your profile has been updated successfully!");
  };

  const handleSavePatSelf = (e) => {
    e.preventDefault();
    const oldEmail = loggedInPatient.email;
    const newEmail = patSelfData.email.toLowerCase();
    const newName = patSelfData.name;
    const newPhone = patSelfData.phone;

    const emailExists = patients.some(p => p.email.toLowerCase() === newEmail && p.email.toLowerCase() !== oldEmail.toLowerCase());
    if (emailExists) {
      alert("This email address is already registered by another patient.");
      return;
    }

    const updatedPat = {
      ...loggedInPatient,
      name: newName,
      email: newEmail,
      phone: newPhone,
      password: patSelfData.password
    };
    
    setPatients(patients.map(p => p.email.toLowerCase() === oldEmail.toLowerCase() ? updatedPat : p));
    
    setAppointments(appointments.map(apt => {
      if (apt.email.toLowerCase() === oldEmail.toLowerCase()) {
        return {
          ...apt,
          email: newEmail,
          patientName: newName,
          phone: newPhone
        };
      }
      return apt;
    }));

    setLoggedInPatient(updatedPat);
    setIsEditingPatSelf(false);
    alert("Your profile has been updated successfully!");
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (editingPatientId) {
      const oldEmail = editingPatientId;
      const newEmail = newPatientData.email.toLowerCase();
      const newName = newPatientData.name;
      const newPhone = newPatientData.phone;

      setPatients(patients.map(p => {
        if (p.email === editingPatientId) {
          return {
            ...p,
            name: newName,
            email: newEmail,
            phone: newPhone,
            password: newPatientData.password
          };
        }
        return p;
      }));

      setAppointments(appointments.map(apt => {
        if (apt.email.toLowerCase() === oldEmail.toLowerCase()) {
          return {
            ...apt,
            email: newEmail,
            patientName: newName,
            phone: newPhone
          };
        }
        return apt;
      }));

      setEditingPatientId(null);
      setNewPatientData({ name: '', email: '', phone: '', password: '' });
      alert("Patient profile updated successfully!");
    } else {
      if (patients.some(p => p.email === newPatientData.email)) {
        alert("A patient with this email already exists!");
        return;
      }
      const newPatient = {
        name: newPatientData.name,
        email: newPatientData.email,
        phone: newPatientData.phone,
        password: newPatientData.password
      };
      setPatients([...patients, newPatient]);
      setNewPatientData({ name: '', email: '', phone: '', password: '' });
      alert("Patient profile added successfully!");
    }
  };

  const startEditPatient = (p) => {
    setEditingPatientId(p.email);
    setNewPatientData({
      name: p.name,
      email: p.email,
      phone: p.phone,
      password: p.password
    });
  };

  const handleDeletePatient = (email) => {
    if (window.confirm("Are you sure you want to remove this patient profile?")) {
      setPatients(patients.filter(p => p.email !== email));
      if (editingPatientId === email) {
        setEditingPatientId(null);
        setNewPatientData({ name: '', email: '', phone: '', password: '' });
      }
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

  const handleDocNoteChange = (aptId, field, value) => {
    setDocNotesState(prev => ({
      ...prev,
      [aptId]: {
        ...prev[aptId] || { notes: '', prescription: '' },
        [field]: value
      }
    }));
  };

  const handleSubmitDocNotes = (aptId) => {
    const currentApt = appointments.find(a => a.id === aptId);
    const notesVal = docNotesState[aptId]?.notes !== undefined ? docNotesState[aptId].notes : (currentApt?.notes || '');
    const rxVal = docNotesState[aptId]?.prescription !== undefined ? docNotesState[aptId].prescription : (currentApt?.prescription || '');
    const labTestsVal = docNotesState[aptId]?.labTests !== undefined ? docNotesState[aptId].labTests : (currentApt?.labTests || '');
    const scansVal = docNotesState[aptId]?.scans !== undefined ? docNotesState[aptId].scans : (currentApt?.scans || '');
    const pharmacyOrderVal = docNotesState[aptId]?.pharmacyOrder !== undefined ? docNotesState[aptId].pharmacyOrder : (currentApt?.pharmacyOrder || '');
    const officeReferralVal = docNotesState[aptId]?.officeReferral !== undefined ? docNotesState[aptId].officeReferral : (currentApt?.officeReferral || '');
    const statusVal = docNotesState[aptId]?.status !== undefined ? docNotesState[aptId].status : 'Completed';
    
    setAppointments(appointments.map(apt => 
      apt.id === aptId 
        ? { 
            ...apt, 
            notes: notesVal, 
            prescription: rxVal,
            labTests: labTestsVal,
            scans: scansVal,
            pharmacyOrder: pharmacyOrderVal,
            officeReferral: officeReferralVal,
            status: statusVal
          } 
        : apt
    ));
    alert("Consultation record and status updated successfully!");
  };

  const handleModalFieldEdit = (field, value) => {
    setModalTempValues(prev => ({ ...prev, [field]: value }));
  };

  const handleModalFieldSave = (aptId, field) => {
    const newValue = modalTempValues[field] !== undefined ? modalTempValues[field] : '';
    setAppointments(appointments.map(apt => 
      apt.id === aptId ? { ...apt, [field]: newValue } : apt
    ));
    setAdminSelectedApt(prev => ({ ...prev, [field]: newValue }));
    setModalEditingFields(prev => ({ ...prev, [field]: false }));
  };

  const handleModalFieldDelete = (aptId, field) => {
    if (window.confirm(`Are you sure you want to delete the ${field} details?`)) {
      setAppointments(appointments.map(apt => 
        apt.id === aptId ? { ...apt, [field]: '' } : apt
      ));
      setAdminSelectedApt(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateFollowUp = (e) => {
    e.preventDefault();
    if (!followUpApt) return;

    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: followUpApt.patientName,
      phone: followUpApt.phone,
      email: followUpApt.email,
      doctor: followUpApt.doctor,
      date: followUpData.date,
      time: followUpData.time,
      symptoms: followUpData.reason,
      status: 'Approved',
      notes: '',
      prescription: ''
    };

    setAppointments([newApt, ...appointments]);
    setFollowUpApt(null);
    alert(`Follow-up appointment successfully scheduled for ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`);
  };

  // --- Filtering ---
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                          (doc.services && doc.services.some(srv => srv.toLowerCase().includes(doctorSearch.toLowerCase())));
    const matchesFilter = doctorFilter === 'all' || doc.specialty === doctorFilter;
    return matchesSearch && matchesFilter && doc.active !== false;
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
              <img className="logo-img" src={logoSvg} alt="SimmyCare Logo" />
            </div>
            <span className="logo-text">Simmy<span>Care</span></span>
          </a>

          <nav aria-label="Main Navigation">
            {currentView !== 'dashboard' && (
              <ul className="nav-links">
                <li><a href="#home" className={currentView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
                <li><a href="#doctors" className={currentView === 'doctors' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Doctors</a></li>
                <li><a href="#booking" className={currentView === 'booking' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>Booking</a></li>
                <li><a href="#contact" className={currentView === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
              </ul>
            )}
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
                  Your Health, <br />
                  <span>Our Priority</span>
                </h1>
                <p className="hero-subtitle">
                  Simmycare is an online consultation clinic where you can contact <em>any category</em> of medical professional online <em>without any stress</em>. We also have physical doctors active in Abuja, Kaduna, Kano, Bauchi, and Gombe.
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
                  <img className="hero-main-img" src={heroPng} alt="SimmyCare Family Clinic Center" />
                  
                  {/* Floating badges */}
                  <div className="floating-badge badge-top-right glassmorphic">
                    <div className="badge-icon"><i className="fa-solid fa-bolt"></i></div>
                    <div className="badge-texts">
                      <strong>Instant</strong>
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

            {/* Medical Professional Categories + Benefits Sidebar (Flyer Style) */}
            <div className="med-categories-section">
              <div className="med-categories-tag">
                <i className="fa-solid fa-stethoscope"></i> Consult With Any Medical Professional
              </div>
              
              <div className="med-categories-content">
                <div className="med-categories-grid">
                  <div className="med-cat-card" onClick={() => navigateTo('specialty-general-medicine')}>
                    <div className="med-cat-icon"><i className="fa-solid fa-user-doctor"></i></div>
                    <span>General Physician</span>
                  </div>
                  <div className="med-cat-card" onClick={() => navigateTo('specialty-pediatrics')}>
                    <div className="med-cat-icon"><i className="fa-solid fa-baby"></i></div>
                    <span>Pediatrician</span>
                  </div>
                  <div className="med-cat-card" onClick={() => navigateTo('specialty-gynaecology')}>
                    <div className="med-cat-icon"><i className="fa-solid fa-person-pregnant"></i></div>
                    <span>Gynecologist</span>
                  </div>
                  <div className="med-cat-card" onClick={() => navigateTo('specialty-psychology')}>
                    <div className="med-cat-icon"><i className="fa-solid fa-brain"></i></div>
                    <span>Psychologist</span>
                  </div>
                  <div className="med-cat-card" onClick={() => navigateTo('specialty-dentistry')}>
                    <div className="med-cat-icon"><i className="fa-solid fa-tooth"></i></div>
                    <span>Dentist</span>
                  </div>
                  <div className="med-cat-card more-card" onClick={() => { setDoctorFilter('all'); navigateTo('doctors'); }}>
                    <div className="med-cat-icon"><i className="fa-solid fa-arrow-right"></i></div>
                    <span>View More</span>
                  </div>
                </div>

                {/* Benefits Sidebar */}
                <div className="benefits-sidebar">
                  <div className="benefit-item">
                    <div className="benefit-icon"><i className="fa-solid fa-comments"></i></div>
                    <div className="benefit-text">
                      <strong>Consult Anytime, Anywhere</strong>
                      <span>24/7 access to medical professionals</span>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon"><i className="fa-solid fa-shield-halved"></i></div>
                    <div className="benefit-text">
                      <strong>Safe, Secure & Confidential</strong>
                      <span>Your data is fully protected</span>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon"><i className="fa-regular fa-clock"></i></div>
                    <div className="benefit-text">
                      <strong>Saves Time & Stress</strong>
                      <span>No queues, no waiting rooms</span>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon"><i className="fa-solid fa-hand-holding-medical"></i></div>
                    <div className="benefit-text">
                      <strong>Professional Care You Can Trust</strong>
                      <span>MDCN verified practitioners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Group CTA + Daily Health Tips (Flyer Bottom Grid) */}
            <div className="bottom-cta-grid">
              {/* WhatsApp Group Card */}
              <div className="whatsapp-group-card">
                <div className="whatsapp-group-header">
                  <i className="fa-brands fa-whatsapp"></i>
                  <h3>Join Our WhatsApp Group</h3>
                </div>
                <p><strong>Be part of our community!</strong></p>
                <p>Get health updates, ask questions, share experiences and stay connected.</p>
                <div className="whatsapp-group-features">
                  <span><i className="fa-solid fa-check"></i> Health updates & alerts</span>
                  <span><i className="fa-solid fa-check"></i> Ask medical questions</span>
                  <span><i className="fa-solid fa-check"></i> Community support</span>
                </div>
                <a 
                  href="https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK" 
                  className="btn-whatsapp-group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp"></i> Join Group
                </a>
              </div>

              {/* Daily Health Tips Card */}
              <div className="health-tips-card">
                <div className="health-tips-header">
                  <h3>Daily Health Tips</h3>
                  <p>We share daily health tips to help you live a healthier, happier life.</p>
                </div>
                <div className="health-tips-list">
                  <div className="health-tip-item"><i className="fa-solid fa-circle-check"></i> Nutrition Tips</div>
                  <div className="health-tip-item"><i className="fa-solid fa-circle-check"></i> Exercise Tips</div>
                  <div className="health-tip-item"><i className="fa-solid fa-circle-check"></i> Mental Health</div>
                  <div className="health-tip-item"><i className="fa-solid fa-circle-check"></i> Disease Prevention</div>
                  <div className="health-tip-item"><i className="fa-solid fa-circle-check"></i> Healthy Lifestyle</div>
                </div>
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
                  <a href="#service-online-consultation" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('service-online-consultation'); }}>
                    Book Appointment <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-vials"></i></div>
                  <h3>Mobile Laboratory</h3>
                  <p>Professional clinical diagnostics and lab sample collections carried out directly in your home.</p>
                  <a href="#service-mobile-lab" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('service-mobile-lab'); }}>
                    Request Lab Test <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-prescription-bottle-medical"></i></div>
                  <h3>Pharmacy Delivery</h3>
                  <p>Order your prescribed medications online and get swift, reliable home delivery right to your door.</p>
                  <a href="#service-pharmacy-delivery" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('service-pharmacy-delivery'); }}>
                    Order Medicine <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-house-chimney-medical"></i></div>
                  <h3>Home Services</h3>
                  <p>Get personalized home care, nursing attention, and regular medical checkups at home.</p>
                  <a href="#service-home-services" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('service-home-services'); }}>
                    Request Visit <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
                <div className="service-card glassmorphic">
                  <div className="service-icon"><i className="fa-solid fa-clinic-medical"></i></div>
                  <h3>Physical Consultation</h3>
                  <p>Book physical appointments with our medical team at a doctor's clinic/home contact in active cities.</p>
                  <a href="#service-physical-consult" className="service-link" onClick={(e) => { e.preventDefault(); navigateTo('service-physical-consult'); }}>
                    Find Clinic <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: ONLINE CONSULTATION --- */}
        {currentView === 'service-online-consultation' && (
          <section id="service-online-consultation-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="service-hero-header glassmorphic">
              <div className="service-hero-icon">
                <i className="fa-solid fa-laptop-medical"></i>
              </div>
              <div className="service-hero-info">
                <h1>Online Consultation</h1>
                <p>Consult with MDCN-verified medical professionals from the comfort of your home.</p>
              </div>
            </div>

            <div className="service-detail-layout">
              <div className="service-description-panel">
                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-video"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Video & Audio Consultations</h3>
                    <p>Experience real-time, face-to-face virtual visits with doctors using our high-definition calling integration.</p>
                  </div>
                </div>

                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-file-medical"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Digital Prescriptions (Rx)</h3>
                    <p>Get instant verified electronic prescriptions sent directly to your account or pharmacy of choice.</p>
                  </div>
                </div>

                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Confidential & Secure</h3>
                    <p>Your diagnosis history and private conversations are protected with enterprise-grade encryption standards.</p>
                  </div>
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic">
                <h3>Available Online Specialists</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Select an active medical professional below to initiate booking your online session:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {doctors.filter(d => d.active !== false).map((doc, idx) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.4)' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-indigo)' }}>{doc.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase' }}>{getSpecialtyTitle(doc.specialty)}</span>
                      </div>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                        setPreviewBookingDoc(doc);
                      }}>Book Session</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: MOBILE LABORATORY --- */}
        {currentView === 'service-mobile-lab' && (
          <section id="service-mobile-lab-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="service-hero-header glassmorphic">
              <div className="service-hero-icon">
                <i className="fa-solid fa-vials"></i>
              </div>
              <div className="service-hero-info">
                <h1>Mobile Laboratory Services</h1>
                <p>Professional sample collection and clinical diagnostic test services carried out at your home.</p>
              </div>
            </div>

            <div className="service-detail-layout">
              <div className="service-description-panel">
                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-house-user"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Home Sample Collection</h3>
                    <p>Our certified lab technicians will visit your home or office to collect blood, urine, or swab samples, saving you a trip to the hospital.</p>
                  </div>
                </div>

                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-paste"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Accurate & Timely Results</h3>
                    <p>Samples are processed in our state-of-the-art diagnostic facility. Digital lab reports are sent via email/SMS within 24-48 hours.</p>
                  </div>
                </div>

                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper">
                    <i className="fa-solid fa-kit-medical"></i>
                  </div>
                  <div className="feature-texts">
                    <h3>Certified Pathologists</h3>
                    <p>All laboratory tests are interpreted and verified by registered clinical pathologists (MDCN accredited).</p>
                  </div>
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic">
                <h3>Select Diagnostic Tests</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Choose one or more lab tests to schedule for home collection:
                </p>

                <div className="lab-tests-list">
                  {[
                    { id: 'fbc', name: 'Full Blood Count (FBC)', price: 8000, desc: 'General screening for anemia, infections & immunity.' },
                    { id: 'mal', name: 'Malaria & Typhoid Panel', price: 5000, desc: 'Rapid diagnostic screening for common fevers.' },
                    { id: 'lip', name: 'Lipid Profile (Cholesterol)', price: 12000, desc: 'Measures HDL, LDL, and cardiovascular markers.' },
                    { id: 'kft', name: 'Kidney Function Test (KFT)', price: 15000, desc: 'Evaluates urea, creatinine, and electrolytes.' },
                    { id: 'lft', name: 'Liver Function Test (LFT)', price: 15000, desc: 'Assesses liver proteins and enzyme health.' },
                    { id: 'uri', name: 'Urine Analysis', price: 3000, desc: 'Screening for UTIs, glucose levels & kidney status.' },
                    { id: 'glu', name: 'Blood Sugar Profile', price: 4000, desc: 'Fasting and post-meal glucose checks.' }
                  ].map(test => {
                    const isSelected = labCart.includes(test.name);
                    return (
                      <div
                        key={test.id}
                        className={`lab-test-item glassmorphic ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (isSelected) {
                            setLabCart(labCart.filter(item => item !== test.name));
                          } else {
                            setLabCart([...labCart, test.name]);
                          }
                        }}
                      >
                        <div className="lab-test-info">
                          <h4>{test.name}</h4>
                          <p>{test.desc}</p>
                        </div>
                        <div className="lab-test-price-action">
                          <span className="lab-test-price">₦{test.price.toLocaleString()}</span>
                          <div className="checkbox-circle">
                            {isSelected && <i className="fa-solid fa-check"></i>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {labCart.length > 0 && (
                  <div className="lab-cart-summary glassmorphic">
                    <div className="cart-row">
                      <span>Selected Tests ({labCart.length}):</span>
                      <strong>
                        ₦{labCart.reduce((sum, name) => {
                          const testPrices = {
                            'Full Blood Count (FBC)': 8000,
                            'Malaria & Typhoid Panel': 5000,
                            'Lipid Profile (Cholesterol)': 12000,
                            'Kidney Function Test (KFT)': 15000,
                            'Liver Function Test (LFT)': 15000,
                            'Urine Analysis': 3000,
                            'Blood Sugar Profile': 4000
                          };
                          return sum + (testPrices[name] || 0);
                        }, 0).toLocaleString()}
                      </strong>
                    </div>
                    <div className="cart-row">
                      <span>Home Collection Fee:</span>
                      <strong>₦3,000</strong>
                    </div>
                    <div className="cart-row total-row">
                      <span>Grand Total:</span>
                      <strong>
                        ₦{(labCart.reduce((sum, name) => {
                          const testPrices = {
                            'Full Blood Count (FBC)': 8000,
                            'Malaria & Typhoid Panel': 5000,
                            'Lipid Profile (Cholesterol)': 12000,
                            'Kidney Function Test (KFT)': 15000,
                            'Liver Function Test (LFT)': 15000,
                            'Urine Analysis': 3000,
                            'Blood Sugar Profile': 4000
                          };
                          return sum + (testPrices[name] || 0);
                        }, 0) + 3000).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                )}

                <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-indigo)', fontSize: '1rem' }}>Collection & Patient Information</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (labCart.length === 0) {
                    alert("Please select at least one lab test before booking!");
                    return;
                  }
                  const ticketId = `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
                  const newApt = {
                    id: ticketId,
                    patientName: labCheckout.name,
                    phone: labCheckout.phone,
                    email: labCheckout.email.toLowerCase(),
                    doctor: "Mobile Lab Unit",
                    date: labCheckout.date,
                    time: "08:00 AM",
                    symptoms: `Mobile Lab Booking: ${labCart.join(', ')}. Home collection address: ${labCheckout.address}. Patient Instructions: ${labCheckout.notes || 'None'}`,
                    status: 'Pending'
                  };
                  setAppointments([newApt, ...appointments]);
                  setLabCart([]);
                  setLabCheckout({ name: '', email: '', phone: '', date: '', address: '', notes: '' });
                  setSuccessModal({
                    title: "Lab Request Submitted Successfully",
                    message: "A lab technician has been scheduled for your home collection on the specified date. We will contact you shortly to confirm the exact time window.",
                    ticket: ticketId
                  });
                }}>
                  <div className="form-group">
                    <label>Patient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zainab Abdulfatah"
                      value={labCheckout.name}
                      onChange={(e) => setLabCheckout({ ...labCheckout, name: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="08012345678"
                        value={labCheckout.phone}
                        onChange={(e) => setLabCheckout({ ...labCheckout, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="patient@example.com"
                        value={labCheckout.email}
                        onChange={(e) => setLabCheckout({ ...labCheckout, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Date for Collection</label>
                    <input
                      type="date"
                      required
                      value={labCheckout.date}
                      onChange={(e) => setLabCheckout({ ...labCheckout, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Home Address for Sample Collection</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 4, Close B, Wuse II, Abuja"
                      value={labCheckout.address}
                      onChange={(e) => setLabCheckout({ ...labCheckout, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Special Instructions (e.g. fasting status, allergies)</label>
                    <textarea
                      rows="3"
                      placeholder="Type details here..."
                      value={labCheckout.notes}
                      onChange={(e) => setLabCheckout({ ...labCheckout, notes: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Confirm Lab Booking (Pay on Collection)</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: PHARMACY DELIVERY --- */}
        {currentView === 'service-pharmacy-delivery' && (
          <section id="service-pharmacy-delivery-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="service-hero-header glassmorphic">
              <div className="service-hero-icon">
                <i className="fa-solid fa-prescription-bottle-medical"></i>
              </div>
              <div className="service-hero-info">
                <h1>Pharmacy & Medicine Delivery</h1>
                <p>Order prescription and over-the-counter medications online with direct home dispatch.</p>
              </div>
            </div>

            <div className="service-detail-layout">
              <div className="pharmacy-container">
                <div className="service-feature-card glassmorphic" style={{ padding: '1.25rem' }}>
                  <div className="feature-icon-wrapper"><i className="fa-solid fa-truck-fast"></i></div>
                  <div className="feature-texts">
                    <h3>Same-Day Dispatch</h3>
                    <p>Get medications delivered within 4-6 hours in active cities. Securely packed and climate-controlled.</p>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-indigo)', fontSize: '1.4rem' }}>Online Medicine Catalog</h3>
                <div className="pharmacy-grid">
                  {[
                    { id: 'pm1', name: 'Paracetamol 500mg', price: 1200, category: 'Pain & Fever', desc: 'Over-the-counter pack of 20 tablets. For fever, headaches, and general body aches.' },
                    { id: 'pm2', name: 'Ibuprofen 400mg', price: 1500, category: 'Pain & Fever', desc: 'Pack of 10 tablets. Strong anti-inflammatory and pain relief medication.' },
                    { id: 'pm3', name: 'Coartem 80/480', price: 3000, category: 'Antimalarial', desc: 'Complete course pack of Artemether/Lumefantrine for acute malaria.' },
                    { id: 'pm4', name: 'Vitamin C + Zinc (1000mg)', price: 3500, category: 'Vitamins', desc: '30 effervescent tablets. Promotes immune response and recovery.' },
                    { id: 'pm5', name: 'Daily Multivitamins Complex', price: 5000, category: 'Vitamins', desc: '60 capsules. Complete blend of key vitamins and daily minerals.' },
                    { id: 'pm6', name: 'Metformin 500mg (Glucophage)', price: 4000, category: 'Prescription', desc: '50 tablets. Chronic care medication for type-2 diabetes control. Rx required.' },
                    { id: 'pm7', name: 'Amlodipine 5mg', price: 4500, category: 'Prescription', desc: '30 tablets. Daily cardiovascular blood pressure management. Rx required.' }
                  ].map(prod => {
                    return (
                      <div key={prod.id} className="pharmacy-product-card glassmorphic">
                        <span className="product-tag">{prod.category}</span>
                        <h4>{prod.name}</h4>
                        <p>{prod.desc}</p>
                        <div className="product-footer">
                          <span className="product-price">₦{prod.price.toLocaleString()}</span>
                          <button className="btn-add-cart" onClick={() => {
                            const existing = pharmacyCart.find(item => item.id === prod.id);
                            if (existing) {
                              setPharmacyCart(pharmacyCart.map(item => item.id === prod.id ? { ...item, qty: item.qty + 1 } : item));
                            } else {
                              setPharmacyCart([...pharmacyCart, { id: prod.id, name: prod.name, price: prod.price, qty: 1 }]);
                            }
                          }} title="Add to Order Cart">
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pharmacy-cart-panel glassmorphic">
                <h3>Your Medication Cart</h3>
                {pharmacyCart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
                    <i className="fa-solid fa-basket-shopping" style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'block', color: 'rgba(24,43,73,0.15)' }}></i>
                    Cart is empty. Add products from the catalog.
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {pharmacyCart.map(item => (
                        <div key={item.id} className="cart-item-row">
                          <div style={{ flex: 1 }}>
                            <div className="cart-item-name">{item.name}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>₦{item.price.toLocaleString()} each</span>
                          </div>
                          <div className="cart-item-controls">
                            <button className="btn-qty" onClick={() => {
                              if (item.qty === 1) {
                                setPharmacyCart(pharmacyCart.filter(cartItem => cartItem.id !== item.id));
                              } else {
                                setPharmacyCart(pharmacyCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem));
                              }
                            }}>-</button>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.qty}</span>
                            <button className="btn-qty" onClick={() => {
                              setPharmacyCart(pharmacyCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem));
                            }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="lab-cart-summary glassmorphic" style={{ marginTop: '0', background: 'rgba(255,255,255,0.45)' }}>
                      <div className="cart-row">
                        <span>Items Subtotal:</span>
                        <strong>₦{pharmacyCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</strong>
                      </div>
                      <div className="cart-row">
                        <span>Flat Delivery Fee:</span>
                        <strong>₦1,500</strong>
                      </div>
                      <div className="cart-row total-row">
                        <span>Grand Total:</span>
                        <strong>₦{(pharmacyCart.reduce((sum, item) => sum + (item.price * item.qty), 0) + 1500).toLocaleString()}</strong>
                      </div>
                    </div>

                    <h4 style={{ marginTop: '1rem', color: 'var(--color-indigo)', fontSize: '0.95rem' }}>Shipping & Checkout Info</h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
                      const itemsString = pharmacyCart.map(i => `${i.name} (x${i.qty})`).join(', ');
                      const totalCost = pharmacyCart.reduce((sum, i) => sum + (i.price * i.qty), 0) + 1500;
                      
                      const newInquiry = {
                        id: orderId,
                        name: pharmacyCheckout.name,
                        email: pharmacyCheckout.email,
                        message: `Pharmacy Purchase Order: [${itemsString}]. Shipping Address: [${pharmacyCheckout.address}]. Rx Notes: [${pharmacyCheckout.notes || 'None'}]. Total Cost: ₦${totalCost.toLocaleString()}`,
                        date: new Date().toISOString().split('T')[0]
                      };
                      setInquiries([newInquiry, ...inquiries]);
                      setPharmacyCart([]);
                      setPharmacyCheckout({ name: '', email: '', phone: '', address: '', notes: '' });
                      setSuccessModal({
                        title: "Medication Order Placed",
                        message: "Your medication delivery order has been received. Our pharmacist will review it and dispatch your courier. You will pay cash/card on delivery.",
                        ticket: orderId
                      });
                    }}>
                      <div className="form-group">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Zainab Abdulfatah"
                          value={pharmacyCheckout.name}
                          onChange={(e) => setPharmacyCheckout({ ...pharmacyCheckout, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 08012345678"
                          value={pharmacyCheckout.phone}
                          onChange={(e) => setPharmacyCheckout({ ...pharmacyCheckout, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="patient@example.com"
                          value={pharmacyCheckout.email}
                          onChange={(e) => setPharmacyCheckout({ ...pharmacyCheckout, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Delivery Shipping Address</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. House 4, Close B, Wuse II, Abuja"
                          value={pharmacyCheckout.address}
                          onChange={(e) => setPharmacyCheckout({ ...pharmacyCheckout, address: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Prescription Notes / Doctor Ref (If any)</label>
                        <textarea
                          rows="2"
                          placeholder="For prescription meds, type dosage notes here..."
                          value={pharmacyCheckout.notes}
                          onChange={(e) => setPharmacyCheckout({ ...pharmacyCheckout, notes: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block">Submit Order Request</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: HOME SERVICES --- */}
        {currentView === 'service-home-services' && (
          <section id="service-home-services-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="service-hero-header glassmorphic">
              <div className="service-hero-icon">
                <i className="fa-solid fa-house-chimney-medical"></i>
              </div>
              <div className="service-hero-info">
                <h1>Home Care & Nursing Services</h1>
                <p>Personalized in-home clinical care, nursing visits, and recovery physiotherapy sessions.</p>
              </div>
            </div>

            <div className="service-detail-layout">
              <div className="service-description-panel">
                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper"><i className="fa-solid fa-user-nurse"></i></div>
                  <div className="feature-texts">
                    <h3>Experienced Clinical Nurses</h3>
                    <p>Our certified home care nurses are trained in patient hygiene, wound dressing, vital signs monitoring, and medication administration.</p>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-indigo)', fontSize: '1.4rem', marginTop: '1rem' }}>In-Home Care Packages</h3>
                <div className="home-packages-grid">
                  {[
                    { name: 'Elderly Care & Companion Visit', price: 25000, desc: 'Includes vitals monitoring, daily hygiene assistance, medication administration, and mental companionship.' },
                    { name: 'Post-natal Care (Mother & Baby)', price: 30000, desc: 'Neonatal checks, umbilical cord care, nursing support, and maternal postpartum recovery monitoring.' },
                    { name: 'Nurse Home Visit (Injection/Dressing)', price: 15000, desc: 'Quick 1-hour professional clinical visit for injections, IV drip setups, or sterile wound dressings.' },
                    { name: 'Physiotherapy Home Session', price: 25000, desc: 'Personalized physical rehabilitation exercises for post-stroke, orthopedic recovery, or chronic pain.' }
                  ].map(pkg => (
                    <div key={pkg.name} className="package-card glassmorphic">
                      <div className="package-header">
                        <h4>{pkg.name}</h4>
                        <span className="package-price">₦{pkg.price.toLocaleString()}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', flex: 1 }}>{pkg.desc}</p>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        setHomeServiceCheckout({ ...homeServiceCheckout, package: pkg.name });
                        document.getElementById('home-service-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}>Select Package</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic" id="home-service-form">
                <h3>Schedule a Home Visit</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Fill in your details below to request a clinical home care visitation slot:
                </p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const ticketId = `HMS-${Math.floor(1000 + Math.random() * 9000)}`;
                  const newApt = {
                    id: ticketId,
                    patientName: homeServiceCheckout.name,
                    phone: homeServiceCheckout.phone,
                    email: homeServiceCheckout.email.toLowerCase(),
                    doctor: "Home Care Unit",
                    date: homeServiceCheckout.date,
                    time: "10:00 AM",
                    symptoms: `Home Care Service Request: [${homeServiceCheckout.package}]. Home address: [${homeServiceCheckout.address}]. Special client request: [${homeServiceCheckout.notes || 'None'}]`,
                    status: 'Pending'
                  };
                  setAppointments([newApt, ...appointments]);
                  setHomeServiceCheckout({ name: '', email: '', phone: '', date: '', address: '', notes: '', package: 'Elderly Care & Companion Visit' });
                  setSuccessModal({
                    title: "Home Service Booking Received",
                    message: "Your home service care request has been received. Our clinical supervisor will contact you to assign the nurse or therapist and verify your schedule.",
                    ticket: ticketId
                  });
                }}>
                  <div className="form-group">
                    <label>Select Package</label>
                    <select
                      value={homeServiceCheckout.package}
                      onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, package: e.target.value })}
                    >
                      <option value="Elderly Care & Companion Visit">Elderly Care & Companion Visit (₦25,000)</option>
                      <option value="Post-natal Care (Mother & Baby)">Post-natal Care (Mother & Baby) (₦30,000)</option>
                      <option value="Nurse Home Visit (Injection/Dressing)">Nurse Home Visit (₦15,000)</option>
                      <option value="Physiotherapy Home Session">Physiotherapy Home Session (₦25,000)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Patient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zainab Abdulfatah"
                      value={homeServiceCheckout.name}
                      onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, name: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="08012345678"
                        value={homeServiceCheckout.phone}
                        onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="patient@example.com"
                        value={homeServiceCheckout.email}
                        onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Visit Date</label>
                    <input
                      type="date"
                      required
                      value={homeServiceCheckout.date}
                      onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Home Address for Visitation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 4, Close B, Wuse II, Abuja"
                      value={homeServiceCheckout.address}
                      onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Special Instructions (e.g. symptoms, specific medical history)</label>
                    <textarea
                      rows="3"
                      placeholder="Type details here..."
                      value={homeServiceCheckout.notes}
                      onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, notes: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Confirm Home Care Booking</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: PHYSICAL CONSULTATION --- */}
        {currentView === 'service-physical-consult' && (
          <section id="service-physical-consult-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="service-hero-header glassmorphic">
              <div className="service-hero-icon">
                <i className="fa-solid fa-clinic-medical"></i>
              </div>
              <div className="service-hero-info">
                <h1>Physical Doctor Consultation</h1>
                <p>Book walk-in or scheduled doctor appointments at our physical branches.</p>
              </div>
            </div>

            <div className="service-detail-layout">
              <div className="service-description-panel">
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-indigo)', fontSize: '1.4rem' }}>Our Active Clinical Branches</h3>
                <div className="clinic-locations-grid">
                  {[
                    { city: 'Abuja (HQ)', address: 'Suite 12, Garki Mall, Garki, Abuja', phone: '+234 901 432 4442' },
                    { city: 'Kaduna', address: '4, Constitution Road, Kaduna', phone: '+234 802 112 3344' },
                    { city: 'Kano', address: '45, Zoo Road, Kano', phone: '+234 803 556 6778' },
                    { city: 'Bauchi', address: '12, Yakubun Bauchi Road, Bauchi', phone: '+234 805 776 6554' },
                    { city: 'Gombe', address: '18, Biu Road, Gombe', phone: '+234 809 988 7766' }
                  ].map(clinic => (
                    <div key={clinic.city} className="clinic-card glassmorphic">
                      <h4>{clinic.city} Branch</h4>
                      <p><i className="fa-solid fa-map-location-dot"></i> {clinic.address}</p>
                      <p><i className="fa-solid fa-phone"></i> {clinic.phone}</p>
                    </div>
                  ))}
                </div>

                <div className="service-feature-card glassmorphic">
                  <div className="feature-icon-wrapper"><i className="fa-solid fa-clock-rotate-left"></i></div>
                  <div className="feature-texts">
                    <h3>Flexible Scheduling</h3>
                    <p>Consultations are open Monday through Saturday with dedicated morning and evening slots for busy professionals.</p>
                  </div>
                </div>
              </div>

              <div className="booking-form-wrapper glassmorphic">
                <h3>Book Physical Doctor Slot</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Select an MDCN-certified specialist to schedule your face-to-face clinical checkup:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {doctors.filter(d => d.active !== false).map((doc, idx) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.4)' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-indigo)' }}>{doc.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Location: {doc.clinicRoom || 'Main Clinic Unit'}</span>
                      </div>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                        setPreviewBookingDoc(doc);
                      }}>Book Slot</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- VIEW: SPECIALIZATION PAGES --- */}
        {['specialty-general-medicine', 'specialty-pediatrics', 'specialty-gynaecology', 'specialty-psychology', 'specialty-dentistry'].map(specRoute => {
          const specMap = {
            'specialty-general-medicine': {
              title: 'General Medicine & Family Health',
              desc: 'Comprehensive everyday healthcare diagnostic services, chronic condition management, general physical screening, and preventative wellness therapy guidance.',
              specialtyName: 'General Medicine',
              icon: 'fa-user-doctor',
              highlights: ['Primary Care', 'Chronic Management', 'Annual Checkups', 'Vitals Screening']
            },
            'specialty-pediatrics': {
              title: 'Pediatrics & Infant Care',
              desc: 'Dedicated clinical care focusing on infants, growing children, and adolescent wellness. Includes childhood immunizations, development tracking, and neonatal checkups.',
              specialtyName: 'Pediatrics',
              icon: 'fa-baby',
              highlights: ['Infant Immunization', 'Development Tracking', 'Neonatal Support', 'Child Nutrition']
            },
            'specialty-gynaecology': {
              title: 'Gynaecology & Obstetric Care',
              desc: 'Comprehensive women reproductive health services. MDCN specialist consultation for maternal wellness, prenatal monitoring, obstetric scans, and clinical reproductive guides.',
              specialtyName: 'Gynaecology',
              icon: 'fa-person-pregnant',
              highlights: ['Maternal Care', 'Prenatal Checks', 'Family Planning', 'Reproductive Health']
            },
            'specialty-psychology': {
              title: 'Mental Health & Clinical Psychology',
              desc: 'Compassionate, confidential professional counseling and cognitive therapy. Support for stress management, anxiety, family counseling, and emotional balance.',
              specialtyName: 'Psychology',
              icon: 'fa-brain',
              highlights: ['Cognitive Therapy', 'Anxiety Support', 'Stress Management', 'Family Counselling']
            },
            'specialty-dentistry': {
              title: 'Dental Clinic & Oral Wellness',
              desc: 'Restorative, aesthetic, and surgical dental health services. Cavity checks, deep cleansing, composite alignments, and smile whitening under certified practitioners.',
              specialtyName: 'Dentistry',
              icon: 'fa-tooth',
              highlights: ['Dental Cleansing', 'Cavity Fillings', 'Cosmetic Braces', 'Oral Surgery']
            }
          };

          const specInfo = specMap[specRoute];
          if (!specInfo) return null;

          return currentView === specRoute && (
            <section key={specRoute} id={`${specRoute}-view`} className="view-section animate-fade">
              <button className="back-nav-btn" onClick={navigateBack}>
                <i className="fa-solid fa-arrow-left"></i> Back to Previous
              </button>
              <div className="service-hero-header glassmorphic">
                <div className="service-hero-icon">
                  <i className={`fa-solid ${specInfo.icon}`}></i>
                </div>
                <div className="service-hero-info">
                  <h1>{specInfo.title}</h1>
                  <p>Expert medical support tailored specifically to your needs.</p>
                </div>
              </div>

              <div className="specialty-page-grid">
                <div>
                  <div className="specialty-about-box glassmorphic">
                    <h3>About the Specialization</h3>
                    <p>{specInfo.desc}</p>
                    <div className="specialty-highlights">
                      {specInfo.highlights.map(hl => (
                        <div key={hl} className="highlight-item">
                          <i className="fa-solid fa-circle-check"></i> {hl}
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-indigo)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                    Available {specInfo.specialtyName} Specialists
                  </h3>
                  <div className="doctors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {doctors.filter(d => d.specialty === specInfo.specialtyName).map((doc, idx) => {
                      const grad = getAvatarGradient(idx);
                      return (
                        <div className="doctor-card glassmorphic" key={doc.id}>
                          <div className="doctor-image-container">
                            {doc.image ? (
                              <img className="doctor-avatar-img" src={doc.image} alt={doc.name} />
                            ) : (
                              <svg className="doctor-avatar-svg" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <linearGradient id={`docGradSpecialty-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: grad.from, stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: grad.to, stopOpacity: 1 }} />
                                  </linearGradient>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#docGradSpecialty-${idx})`} />
                                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Lora', serif" fontSize="28" fontWeight="600" fill="#FAF6EE">
                                  {doc.name.split(" ").map(n => n.charAt(0)).slice(1).join("").toUpperCase()}
                                </text>
                              </svg>
                            )}
                            <div className="doctor-badge">{doc.experience}</div>
                          </div>
                          
                          <div className="doctor-info">
                            <h3>{doc.name}</h3>
                            <div className="doctor-specialty">{getSpecialtyTitle(doc.specialty)}</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.25rem 0' }}>{doc.bio}</p>
                            <div className="doctor-details" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem' }}><i className="fa-regular fa-clock"></i> {doc.schedule}</span>
                            </div>
                            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => {
                              setPreviewBookingDoc(doc);
                            }}>
                              Book Slot
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="booking-form-wrapper glassmorphic">
                  <h3>Department Inquiry</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                    Have questions about treatments or schedules in this department? Send a direct message:
                  </p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target;
                    const name = target.elements.namedItem('inqName').value;
                    const email = target.elements.namedItem('inqEmail').value;
                    const msg = target.elements.namedItem('inqMsg').value;
                    
                    const newInquiry = {
                      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
                      name,
                      email,
                      message: `Specialty Inquiry (${specInfo.specialtyName}): ${msg}`,
                      date: new Date().toISOString().split('T')[0]
                    };
                    setInquiries([newInquiry, ...inquiries]);
                    target.reset();
                    alert("Your inquiry has been sent to our department head. We will get back to you shortly!");
                  }}>
                    <div className="form-group">
                      <label htmlFor="inqName">Your Name</label>
                      <input type="text" id="inqName" required placeholder="e.g. John Doe" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inqEmail">Email Address</label>
                      <input type="email" id="inqEmail" required placeholder="patient@example.com" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inqMsg">Your Inquiry</label>
                      <textarea id="inqMsg" rows="4" required placeholder="Type your question here..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Send Inquiry</button>
                  </form>
                </div>
              </div>
            </section>
          );
        })}

        {/* --- VIEW: DOCTORS --- */}
        {currentView === 'doctors' && (
          <section id="doctors-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack} style={{ marginBottom: '1.5rem' }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
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
                {['all', 'Pediatrics', 'General Medicine', 'Gynaecology', 'Public Health', 'Laboratory', 'Pharmacy'].map(spec => (
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
                        <div className="doctor-specialty">{getSpecialtyTitle(doc.specialty)}</div>
                        <div className="doctor-details">
                          <span><i className="fa-regular fa-clock"></i> {doc.schedule}</span>
                          {doc.consultationRate && (
                            <span><i className="fa-solid fa-money-bill-wave"></i> Consultation Rate: <strong>{doc.consultationRate}</strong></span>
                          )}
                          {doc.services && doc.services.length > 0 && (
                            <div className="doctor-services-list" style={{ marginTop: '0.5rem' }}>
                              <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Offered Services:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {doc.services.map(srv => (
                                  <span key={srv} style={{ fontSize: '0.7rem', background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                          setPreviewBookingDoc(doc);
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
            <button className="back-nav-btn" onClick={navigateBack} style={{ marginBottom: '1.5rem' }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
            <div className="booking-layout">
              <div className="booking-info-panel">
                <h2>Schedule a Virtual Consultation Slot</h2>
                <p>Fill out the form below to request a virtual consultation slot. Once submitted, our administrative team will review and confirm your slot.</p>
                
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
                        {doctors.filter(d => d.active !== false).map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({getSpecialtyTitle(d.specialty)})</option>
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
            <button className="back-nav-btn" onClick={navigateBack} style={{ marginBottom: '1.5rem' }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
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
            <button className="back-nav-btn" onClick={navigateBack} style={{ marginBottom: '1.5rem', alignSelf: 'flex-start' }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>
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
                    {loginTab === 'patient' && (isPatientRegistering ? "Create your patient account" : "Sign in to access your portal")}
                    {loginTab === 'doctor' && "Sign in with your doctor account email and password"}
                    {loginTab === 'admin' && "Sign in to access administrator panel"}
                  </p>
                </div>

                {loginError && <div className="error-message">{loginError}</div>}

                {/* Patient Login Form */}
                {loginTab === 'patient' && (
                  <form onSubmit={handlePatientLoginSubmit}>
                    <div className="form-group">
                      <label>Email Address</label>
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
                      <div className="password-input-wrapper">
                        <input 
                          type={showPasswords.patient ? 'text' : 'password'} 
                          required 
                          placeholder="••••••••"
                          value={patientLoginForm.password}
                          onChange={(e) => setPatientLoginForm({ ...patientLoginForm, password: e.target.value })}
                        />
                        <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, patient: !p.patient }))} tabIndex={-1}>
                          <i className={`fa-solid ${showPasswords.patient ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
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
                        : "Demo Account: zainab@example.com / password123"}
                    </p>
                    <button type="submit" className="btn btn-primary btn-block">
                      {isPatientRegistering ? "Register" : "Login"}
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
                      <label>Password</label>
                      <div className="password-input-wrapper">
                        <input 
                          type={showPasswords.doctor ? 'text' : 'password'} 
                          required 
                          placeholder="••••••••"
                          value={doctorLoginForm.password}
                          onChange={(e) => setDoctorLoginForm({ ...doctorLoginForm, password: e.target.value })}
                        />
                        <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, doctor: !p.doctor }))} tabIndex={-1}>
                          <i className={`fa-solid ${showPasswords.doctor ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                      Demo Account: fatima@simmycare.com / password123
                    </p>
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
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
                      <div className="password-input-wrapper">
                        <input 
                          type={showPasswords.admin ? 'text' : 'password'} 
                          required 
                          placeholder="•••••"
                          value={adminLoginForm.password}
                          onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                        />
                        <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, admin: !p.admin }))} tabIndex={-1}>
                          <i className={`fa-solid ${showPasswords.admin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
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
            
            {/* Guard: redirect to login if no role */}
            {!authRole && (() => { navigateTo('portal-login'); return null; })()}

            {/* 1. PATIENT DASHBOARD */}
            {authRole === 'patient' && loggedInPatient && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
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

                <div className="dashboard-layout">
                  {/* Sidebar Navigation */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button 
                      className={`sidebar-nav-btn ${patientNavView === 'bookings' ? 'active' : ''}`}
                      onClick={() => setPatientNavView('bookings')}
                    >
                      <i className="fa-solid fa-calendar-check"></i> Bookings & Request
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${patientNavView === 'profile' ? 'active' : ''}`}
                      onClick={() => {
                        setPatientNavView('profile');
                        setPatSelfData({
                          name: loggedInPatient.name,
                          email: loggedInPatient.email,
                          phone: loggedInPatient.phone || '',
                          password: loggedInPatient.password
                        });
                        setIsEditingPatSelf(false);
                      }}
                    >
                      <i className="fa-solid fa-user-pen"></i> My Profile Settings
                    </button>
                  </div>

                  {/* Console Workspace */}
                  <div className="dashboard-workspace glassmorphic" style={{ background: 'none', border: 'none', padding: 0, boxShadow: 'none' }}>
                    {patientNavView === 'bookings' && (
                      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.8fr 1.2fr', padding: 0, gap: '1.5rem', background: 'none', border: 'none', boxShadow: 'none' }}>
                        {/* Left Column: My Bookings */}
                        <div className="dashboard-workspace glassmorphic" style={{ margin: 0 }}>
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
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {myPatientAppointments.map(apt => (
                                    <tr key={apt.id}>
                                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{apt.id}</td>
                                      <td>{apt.doctor}</td>
                                      <td>{apt.date} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({apt.time})</span></td>
                                      <td>
                                        <span className={`status-badge status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>
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
                                      <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                          <button className="action-btn" style={{ color: 'var(--color-indigo)' }} onClick={() => setAdminSelectedApt(apt)} title="View Full Details">
                                            <i className="fa-solid fa-eye"></i> View
                                          </button>
                                          {apt.status === 'Pending' && (
                                            <>
                                              <button className="action-btn" style={{ color: 'var(--color-accent)' }} onClick={() => startEditApt(apt)} title="Modify Booking Details">
                                                <i className="fa-solid fa-pen-to-square"></i> Edit
                                              </button>
                                              <button className="action-btn" style={{ color: '#EF4444' }} onClick={() => handleCancelAppointment(apt.id)} title="Cancel Booking">
                                                <i className="fa-solid fa-xmark"></i> Cancel
                                              </button>
                                            </>
                                          )}
                                        </div>
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
                        <div className="booking-form-wrapper glassmorphic" style={{ margin: 0 }}>
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
                                {doctors.filter(d => d.active !== false).map(d => (
                                  <option key={d.id} value={d.id}>{d.name} ({getSpecialtyTitle(d.specialty)})</option>
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
                    )}

                    {patientNavView === 'profile' && (
                      <div className="dashboard-workspace glassmorphic" style={{ margin: 0, padding: '1.5rem' }}>
                        {!isEditingPatSelf ? (
                          <div className="doctor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(28,43,73,0.05)', borderRadius: '12px' }}>
                              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: '#fff', fontWeight: 'bold' }}>
                                {loggedInPatient.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{loggedInPatient.name}</h3>
                                <div style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1rem', marginTop: '0.25rem' }}>Patient Account</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Active Member since 2026</div>
                              </div>
                            </div>

                            <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Full Name</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInPatient.name || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Contact Phone</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInPatient.phone || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Registered Email</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInPatient.email || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Account Password</strong>
                                <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span>{showPasswords.patient ? loggedInPatient.password : '••••••••'}</span>
                                  <button onClick={() => setShowPasswords(p => ({ ...p, patient: !p.patient }))} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <i className={`fa-solid ${showPasswords.patient ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </span>
                              </div>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                              <button className="btn btn-primary" onClick={() => {
                                setPatSelfData({
                                  name: loggedInPatient.name,
                                  email: loggedInPatient.email,
                                  phone: loggedInPatient.phone || '',
                                  password: loggedInPatient.password
                                });
                                setIsEditingPatSelf(true);
                              }}>
                                <i className="fa-solid fa-user-pen" style={{ marginRight: '0.5rem' }}></i>Edit Profile settings
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSavePatSelf} className="add-doctor-form glassmorphic" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Modify Account Settings</h4>
                            
                            <div className="form-row">
                              <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={patSelfData.name}
                                  onChange={(e) => setPatSelfData({ ...patSelfData, name: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Contact Phone Number</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 08012345678"
                                  value={patSelfData.phone}
                                  onChange={(e) => setPatSelfData({ ...patSelfData, phone: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                  type="email" 
                                  required 
                                  value={patSelfData.email}
                                  onChange={(e) => setPatSelfData({ ...patSelfData, email: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Account Password</label>
                                <div className="password-input-wrapper">
                                  <input 
                                    type={showPasswords.patientForm ? 'text' : 'password'} 
                                    required 
                                    value={patSelfData.password}
                                    onChange={(e) => setPatSelfData({ ...patSelfData, password: e.target.value })}
                                  />
                                  <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, patientForm: !p.patientForm }))} tabIndex={-1}>
                                    <i className={`fa-solid ${showPasswords.patientForm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                              <button type="submit" className="btn btn-primary">Save Changes</button>
                              <button type="button" className="btn btn-outline" onClick={() => setIsEditingPatSelf(false)}>Cancel</button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DOCTOR DASHBOARD */}
            {authRole === 'doctor' && loggedInDoctor && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {loggedInDoctor.image ? (
                      <img src={loggedInDoctor.image} alt={loggedInDoctor.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #182B49, #2C5D88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#fff', fontWeight: 'bold' }}>
                        {loggedInDoctor.name.charAt(loggedInDoctor.name.indexOf(' ') + 1) || loggedInDoctor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2>{loggedInDoctor.name}</h2>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Clinical Focus: {loggedInDoctor.specialty} | MDCN ID: {loggedInDoctor.regNo}</p>
                    </div>
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

                <div className="dashboard-layout">
                  {/* Sidebar Navigation */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button 
                      className={`sidebar-nav-btn ${doctorNavView === 'backlog' ? 'active' : ''}`}
                      onClick={() => setDoctorNavView('backlog')}
                    >
                      <i className="fa-solid fa-list-check"></i> Consultation Backlog
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${doctorNavView === 'profile' ? 'active' : ''}`}
                      onClick={() => {
                        setDoctorNavView('profile');
                        const cleanName = loggedInDoctor.name.startsWith("Dr. ") ? loggedInDoctor.name.substring(4) : loggedInDoctor.name;
                        setDocSelfData({
                          name: cleanName,
                          specialty: loggedInDoctor.specialty,
                          schedule: loggedInDoctor.schedule || '',
                          experience: loggedInDoctor.experience || '',
                          regNo: loggedInDoctor.regNo || '',
                          email: loggedInDoctor.email || '',
                          password: loggedInDoctor.password || '',
                          image: loggedInDoctor.image || '',
                          phone: loggedInDoctor.phone || '',
                          bio: loggedInDoctor.bio || '',
                          clinicRoom: loggedInDoctor.clinicRoom || '',
                          license: loggedInDoctor.license || '',
                          consultationRate: loggedInDoctor.consultationRate || '',
                          services: loggedInDoctor.services || []
                        });
                        setIsEditingDocSelf(false);
                      }}
                    >
                      <i className="fa-solid fa-user-doctor"></i> My Profile Settings
                    </button>
                  </div>

                  {/* Console Workspace */}
                  <div className="dashboard-workspace glassmorphic">
                    {doctorNavView === 'backlog' && (
                      <div>
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
                                  <React.Fragment key={apt.id}>
                                    <tr style={{ background: apt.status === 'Approved' ? 'rgba(34,197,94,0.02)' : apt.status === 'Rejected' ? 'rgba(239,68,68,0.01)' : 'transparent' }}>
                                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{apt.id}</td>
                                      <td>
                                        <strong>{apt.patientName}</strong>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.phone}</div>
                                      </td>
                                      <td>{apt.date} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({apt.time})</span></td>
                                      <td style={{ maxWidth: '240px', wordBreak: 'break-word' }}>{apt.symptoms}</td>
                                      <td>
                                        <span className={`status-badge status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                          {apt.status}
                                        </span>
                                      </td>
                                      <td>
                                        {apt.status === 'Approved' ? (
                                          apt.notes || apt.prescription ? (
                                            <div className="patient-prescription-box" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.5rem', borderRadius: '6px' }}>
                                              {apt.notes && <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Notes:</strong> {apt.notes}</p>}
                                              {apt.prescription && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}><strong>Rx:</strong> <span className="rx-label" style={{ background: 'var(--color-accent)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{apt.prescription}</span></p>}
                                            </div>
                                          ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Pending medical note. Fill form below...</span>
                                          )
                                        ) : apt.status === 'Rejected' ? (
                                          <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '500' }}>Slot Rejected (Unavailable)</span>
                                        ) : (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Awaiting availability check...</span>
                                        )}
                                      </td>
                                      <td>
                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                          <button className="action-btn" style={{ color: 'var(--color-indigo)', padding: '0.2rem 0.4rem' }} onClick={() => setAdminSelectedApt(apt)} title="View Full Ticket Details">
                                            <i className="fa-solid fa-eye"></i> View
                                          </button>
                                          
                                          {apt.status === 'Pending' && (
                                            <>
                                              <button 
                                                className="btn btn-success btn-sm" 
                                                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                onClick={() => handleApproveAppointment(apt.id)}
                                              >
                                                <i className="fa-solid fa-circle-check"></i> Approve
                                              </button>
                                              <button 
                                                className="btn btn-danger btn-sm" 
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                onClick={() => handleRejectAppointment(apt.id)}
                                              >
                                                <i className="fa-solid fa-circle-xmark"></i> Reject
                                              </button>
                                            </>
                                          )}

                                          <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => startEditApt(apt)} title="Reschedule Ticket">
                                            <i className="fa-solid fa-pen-to-square"></i> Reschedule
                                          </button>

                                          {apt.status === 'Approved' && (
                                            <button 
                                              className="btn btn-secondary btn-sm" 
                                              style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} 
                                              onClick={() => {
                                                setFollowUpApt(apt);
                                                const twoWeeksLater = new Date();
                                                twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
                                                const dateStr = twoWeeksLater.toISOString().split('T')[0];
                                                setFollowUpData({
                                                  date: dateStr,
                                                  time: '10:00 AM',
                                                  reason: '2-Week Observation Follow-up'
                                                });
                                              }}
                                              title="Schedule Return Appointment"
                                            >
                                              <i className="fa-solid fa-clock-rotate-left"></i> Book Follow-up
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>

                                    {apt.status === 'Approved' && (
                                      <tr className="doctor-note-subrow">
                                        <td colSpan={7} style={{ background: 'rgba(28,43,73,0.01)', padding: '0.75rem 1rem 1.25rem 1rem', borderTop: 'none', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                          <div className="doctor-note-editor-card glassmorphic" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', borderLeft: '4px solid var(--color-primary)', padding: '1rem', borderRadius: '8px', background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)' }}>
                                            <div>
                                              <label style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                                <i className="fa-solid fa-notes-medical"></i> Clinical Consultation Notes (Plain Text)
                                              </label>
                                              <textarea 
                                                rows={3}
                                                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
                                                placeholder="Write patient clinical findings and consultation details..."
                                                value={docNotesState[apt.id]?.notes !== undefined ? docNotesState[apt.id].notes : (apt.notes || '')}
                                                onChange={(e) => handleDocNoteChange(apt.id, 'notes', e.target.value)}
                                              />
                                            </div>
                                            <div>
                                              <label style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-accent)', display: 'block', marginBottom: '0.5rem' }}>
                                                <i className="fa-solid fa-prescription"></i> Rx Prescription Details (Edit before submitting)
                                              </label>
                                              <textarea 
                                                rows={3}
                                                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
                                                placeholder="List prescribed medicines, dosage instruction (e.g. Tab Paracetamol 500mg, 1x3 for 3 days)..."
                                                value={docNotesState[apt.id]?.prescription !== undefined ? docNotesState[apt.id].prescription : (apt.prescription || '')}
                                                onChange={(e) => handleDocNoteChange(apt.id, 'prescription', e.target.value)}
                                              />
                                            </div>
                                            
                                            {/* Department Referrals & Pushing */}
                                            <div style={{ gridColumn: 'span 2', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                                              <label style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                                <i className="fa-solid fa-network-wired"></i> Push Patient Referrals to Medical Departments (Optional)
                                              </label>
                                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                    <i className="fa-solid fa-flask"></i> Laboratory Tests Referral
                                                  </span>
                                                  <input 
                                                    type="text"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.85rem', marginTop: '0.25rem' }}
                                                    placeholder="e.g. Malaria smear, FBC..."
                                                    value={docNotesState[apt.id]?.labTests !== undefined ? docNotesState[apt.id].labTests : (apt.labTests || '')}
                                                    onChange={(e) => handleDocNoteChange(apt.id, 'labTests', e.target.value)}
                                                  />
                                                </div>
                                                <div>
                                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                    <i className="fa-solid fa-x-ray"></i> Scan / Imaging Referral
                                                  </span>
                                                  <input 
                                                    type="text"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.85rem', marginTop: '0.25rem' }}
                                                    placeholder="e.g. Pelvic ultrasound, Chest X-ray..."
                                                    value={docNotesState[apt.id]?.scans !== undefined ? docNotesState[apt.id].scans : (apt.scans || '')}
                                                    onChange={(e) => handleDocNoteChange(apt.id, 'scans', e.target.value)}
                                                  />
                                                </div>
                                                <div>
                                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                    <i className="fa-solid fa-hospital-user"></i> Clinical Office Referral
                                                  </span>
                                                  <input 
                                                    type="text"
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.85rem', marginTop: '0.25rem' }}
                                                    placeholder="e.g. Return in 2 weeks..."
                                                    value={docNotesState[apt.id]?.officeReferral !== undefined ? docNotesState[apt.id].officeReferral : (apt.officeReferral || '')}
                                                    onChange={(e) => handleDocNoteChange(apt.id, 'officeReferral', e.target.value)}
                                                  />
                                                </div>
                                                <div>
                                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                    <i className="fa-solid fa-square-check"></i> Consultation Status
                                                  </span>
                                                  <select
                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.85rem', marginTop: '0.25rem', height: '37px', backgroundColor: '#fff', color: 'var(--color-text)' }}
                                                    value={docNotesState[apt.id]?.status !== undefined ? docNotesState[apt.id].status : (apt.status || 'Approved')}
                                                    onChange={(e) => handleDocNoteChange(apt.id, 'status', e.target.value)}
                                                  >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Awaiting Lab">Awaiting Lab Results</option>
                                                    <option value="Awaiting Scan">Awaiting Scan Results</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Rejected">Rejected</option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>

                                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                <i className="fa-solid fa-circle-info"></i> Submit compiles notes into the patient's official portal record.
                                              </span>
                                              <button 
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ padding: '0.45rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
                                                onClick={() => handleSubmitDocNotes(apt.id)}
                                              >
                                                <i className="fa-solid fa-cloud-arrow-up"></i> Submit Consultation Record
                                              </button>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
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
                    )}

                    {doctorNavView === 'profile' && (
                      <div>
                        {!isEditingDocSelf ? (
                          <div className="doctor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(28,43,73,0.05)', borderRadius: '12px' }}>
                              {loggedInDoctor.image ? (
                                <img src={loggedInDoctor.image} alt={loggedInDoctor.name} style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)' }} />
                              ) : (
                                <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #182B49, #2C5D88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
                                  {loggedInDoctor.name.charAt(loggedInDoctor.name.indexOf(' ') + 1) || loggedInDoctor.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{loggedInDoctor.name}</h3>
                                <div style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1rem', marginTop: '0.25rem' }}>{loggedInDoctor.specialty} Department</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{loggedInDoctor.experience} of Clinical Experience</div>
                              </div>
                            </div>

                            <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>MDCN Registration Number</strong>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{loggedInDoctor.regNo || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Weekly Schedule</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInDoctor.schedule || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Clinic Room / Office</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInDoctor.clinicRoom || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Contact Phone</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInDoctor.phone || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Portal Login Email</strong>
                                <span style={{ fontSize: '1rem' }}>{loggedInDoctor.email || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Account Password</strong>
                                <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span>{showPasswords.doctor ? loggedInDoctor.password : '••••••••'}</span>
                                  <button onClick={() => setShowPasswords(p => ({ ...p, doctor: !p.doctor }))} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <i className={`fa-solid ${showPasswords.doctor ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Consultation Rate</strong>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{loggedInDoctor.consultationRate || 'N/A'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Consultation Duration</strong>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{loggedInDoctor.consultationDuration || '30 mins'}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: 'span 2' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Offered Services / Features</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                                  {loggedInDoctor.services && loggedInDoctor.services.length > 0 ? (
                                    loggedInDoctor.services.map(srv => (
                                      <span key={srv} style={{ fontSize: '0.8rem', background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '600' }}>
                                        {srv}
                                      </span>
                                    ))
                                  ) : (
                                    <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No services specified.</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {loggedInDoctor.bio && (
                              <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(28,43,73,0.04)', borderRadius: '8px' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Professional Biography Summary</strong>
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>"{loggedInDoctor.bio}"</p>
                              </div>
                            )}

                            {loggedInDoctor.license && (
                              <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(28,43,73,0.04)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Medical License / Professional Credentials</strong>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Official credentials verify board registration and clinical practice rights.</span>
                                </div>
                                <a href={loggedInDoctor.license} download={`license_${loggedInDoctor.name.replace(/\s+/g, '_')}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <i className="fa-solid fa-download"></i> Download License File
                                </a>
                              </div>
                            )}

                            <div style={{ marginTop: '1.5rem' }}>
                              <button className="btn btn-primary" onClick={() => {
                                const cleanName = loggedInDoctor.name.startsWith("Dr. ") ? loggedInDoctor.name.substring(4) : loggedInDoctor.name;
                                setDocSelfData({
                                  name: cleanName,
                                  specialty: loggedInDoctor.specialty,
                                  schedule: loggedInDoctor.schedule || '',
                                  experience: loggedInDoctor.experience || '',
                                  regNo: loggedInDoctor.regNo || '',
                                  email: loggedInDoctor.email || '',
                                  password: loggedInDoctor.password || '',
                                  image: loggedInDoctor.image || '',
                                  phone: loggedInDoctor.phone || '',
                                  bio: loggedInDoctor.bio || '',
                                  clinicRoom: loggedInDoctor.clinicRoom || '',
                                  license: loggedInDoctor.license || '',
                                  consultationRate: loggedInDoctor.consultationRate || '',
                                  services: loggedInDoctor.services || []
                                });
                                setIsEditingDocSelf(true);
                              }}>
                                <i className="fa-solid fa-pen-to-square" style={{ marginRight: '0.5rem' }}></i>Edit Profile Settings
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSaveDocSelf} className="add-doctor-form glassmorphic" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Modify Professional Profile</h4>
                            
                            <div className="form-row">
                              <div className="form-group">
                                <label>Doctor Name (Exclude "Dr.")</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={docSelfData.name}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, name: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Specialty Department</label>
                                <select 
                                  value={docSelfData.specialty}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, specialty: e.target.value })}
                                >
                                  <option value="Pediatrics">Pediatrics</option>
                                  <option value="General Medicine">General Medicine</option>
                                  <option value="Gynaecology">Gynaecology</option>
                                  <option value="Public Health">Public Health</option>
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
                                  required
                                  value={docSelfData.schedule}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, schedule: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Clinical Experience (Years)</label>
                                <input 
                                  type="text" 
                                  required
                                  value={docSelfData.experience}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, experience: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>MDCN Register Code</label>
                                <input 
                                  type="text" 
                                  required
                                  value={docSelfData.regNo}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, regNo: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                  type="email" 
                                  required 
                                  value={docSelfData.email}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, email: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                  <input 
                                    type={showPasswords.doctorForm ? 'text' : 'password'} 
                                    required 
                                    value={docSelfData.password}
                                    onChange={(e) => setDocSelfData({ ...docSelfData, password: e.target.value })}
                                  />
                                  <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, doctorForm: !p.doctorForm }))} tabIndex={-1}>
                                    <i className={`fa-solid ${showPasswords.doctorForm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Contact Phone Number</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 08034567890"
                                  value={docSelfData.phone || ''}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, phone: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Clinic Room / Location</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Room 102, West Wing"
                                  value={docSelfData.clinicRoom || ''}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, clinicRoom: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Consultation Rate</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. ₦5,000"
                                  value={docSelfData.consultationRate || ''}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, consultationRate: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Consultation Duration</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 30 mins"
                                  value={docSelfData.consultationDuration || ''}
                                  onChange={(e) => setDocSelfData({ ...docSelfData, consultationDuration: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ marginBottom: '0.5rem' }}>Offered Services / Features</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(255,255,255,0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(24, 43, 73, 0.15)' }}>
                                  {ALL_SERVICES.map(srv => (
                                    <label key={srv} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textTransform: 'none', fontSize: '0.85rem', color: 'var(--color-indigo)', cursor: 'pointer', fontWeight: '500' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={(docSelfData.services || []).includes(srv)}
                                        onChange={(e) => {
                                          const currentServices = docSelfData.services || [];
                                          if (e.target.checked) {
                                            setDocSelfData({ ...docSelfData, services: [...currentServices, srv] });
                                          } else {
                                            setDocSelfData({ ...docSelfData, services: currentServices.filter(s => s !== srv) });
                                          }
                                        }}
                                        style={{ width: 'auto', margin: 0 }}
                                      />
                                      {srv}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Professional Biography / Clinical Summary</label>
                              <textarea 
                                rows="3"
                                placeholder="Write a summary of your professional background, clinical interest areas, and care approach..."
                                value={docSelfData.bio || ''}
                                onChange={(e) => setDocSelfData({ ...docSelfData, bio: e.target.value })}
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Profile Image (File Upload)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setDocSelfData({ ...docSelfData, image: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    style={{ flexGrow: 1 }}
                                  />
                                  {docSelfData.image && (
                                    <img 
                                      src={docSelfData.image} 
                                      alt="Preview" 
                                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} 
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Upload Medical License / Credentials</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setDocSelfData({ ...docSelfData, license: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    style={{ flexGrow: 1 }}
                                  />
                                  {docSelfData.license && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>✓ Uploaded</span>
                                      <button 
                                        type="button" 
                                        onClick={() => setDocSelfData({ ...docSelfData, license: '' })} 
                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
                                        title="Remove License"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                              <button type="submit" className="btn btn-primary">Save Changes</button>
                              <button type="button" className="btn btn-outline" onClick={() => setIsEditingDocSelf(false)}>Cancel</button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ADMINISTRATOR DASHBOARD */}
            {authRole === 'admin' && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
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
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{patients.length}</h3>
                    <p>REGISTERED PATIENTS</p>
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
                      className={`sidebar-nav-btn ${adminNavView === 'patients' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('patients')}
                    >
                      <i className="fa-solid fa-users"></i> Patient Profiles
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${adminNavView === 'inquiries' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('inquiries')}
                    >
                      <i className="fa-solid fa-inbox"></i> Patient Inquiries
                    </button>
                    <button 
                      className={`sidebar-nav-btn ${adminNavView === 'profile' ? 'active' : ''}`}
                      onClick={() => {
                        setAdminNavView('profile');
                        setAdminSelfData({
                          username: adminCredentials.username,
                          password: adminCredentials.password
                        });
                        setIsEditingAdminSelf(false);
                      }}
                    >
                      <i className="fa-solid fa-user-gear"></i> Admin Profile
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
                                      <span className={`status-badge status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>
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
                                            <button 
                                              className="action-btn" 
                                              style={{ backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
                                              onClick={() => handleAutoRouteSpecialist(apt.id)} 
                                              title="Auto-Route to Most Available Doctor"
                                            >
                                              <i className="fa-solid fa-route"></i> Route
                                            </button>
                                            <button className="action-btn btn-cancel" onClick={() => handleCancelAppointment(apt.id)} title="Cancel Booking">
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                        <button className="action-btn" style={{ color: 'var(--color-indigo)', marginRight: '0.5rem' }} onClick={() => setAdminSelectedApt(apt)} title="View Details">
                                          <i className="fa-solid fa-eye"></i> View
                                        </button>
                                        <button className="action-btn" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }} onClick={() => startEditApt(apt)} title="Modify Ticket">
                                          <i className="fa-solid fa-pen-to-square"></i> Edit
                                        </button>
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

                    {adminNavView === 'doctors' && (
                      <div>
                        <h3>Manage Doctor Directory</h3>
                        
                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddDoctor}>
                          <h4>{editingDoctorId ? "Edit Specialist Profile" : "Register New Specialist Profile"}</h4>
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
                                <option value="Public Health">Public Health</option>
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

                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input 
                                type="email" 
                                required 
                                placeholder="doctor@simmycare.com"
                                value={newDoctorData.email}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Password</label>
                              <div className="password-input-wrapper">
                                <input 
                                  type={showPasswords.doctorForm ? 'text' : 'password'} 
                                  required 
                                  placeholder="••••••••"
                                  value={newDoctorData.password}
                                  onChange={(e) => setNewDoctorData({ ...newDoctorData, password: e.target.value })}
                                />
                                <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, doctorForm: !p.doctorForm }))} tabIndex={-1}>
                                  <i className={`fa-solid ${showPasswords.doctorForm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Phone Number</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 08034567890"
                                value={newDoctorData.phone || ''}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, phone: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Clinic Room / Location</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Room 102, West Wing"
                                value={newDoctorData.clinicRoom || ''}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, clinicRoom: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Consultation Rate</label>
                              <input 
                                type="text" 
                                placeholder="e.g. ₦5,000"
                                value={newDoctorData.consultationRate || ''}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationRate: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Consultation Duration</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 30 mins"
                                value={newDoctorData.consultationDuration || ''}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationDuration: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                              <label style={{ marginBottom: '0.5rem' }}>Offered Services / Features</label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(255,255,255,0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(24, 43, 73, 0.15)' }}>
                                {ALL_SERVICES.map(srv => (
                                  <label key={srv} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textTransform: 'none', fontSize: '0.85rem', color: 'var(--color-indigo)', cursor: 'pointer', fontWeight: '500' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={(newDoctorData.services || []).includes(srv)}
                                      onChange={(e) => {
                                        const currentServices = newDoctorData.services || [];
                                        if (e.target.checked) {
                                          setNewDoctorData({ ...newDoctorData, services: [...currentServices, srv] });
                                        } else {
                                          setNewDoctorData({ ...newDoctorData, services: currentServices.filter(s => s !== srv) });
                                        }
                                      }}
                                      style={{ width: 'auto', margin: 0 }}
                                    />
                                    {srv}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Professional Biography / Clinical Summary</label>
                            <textarea 
                              rows="3"
                              placeholder="Brief professional background, clinical specialties, and patient care philosophy..."
                              value={newDoctorData.bio || ''}
                              onChange={(e) => setNewDoctorData({ ...newDoctorData, bio: e.target.value })}
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Profile Image (File Upload)</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setNewDoctorData({ ...newDoctorData, image: reader.result });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ flexGrow: 1 }}
                                />
                                {newDoctorData.image && (
                                  <img 
                                    src={newDoctorData.image} 
                                    alt="Preview" 
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} 
                                  />
                                )}
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Medical License / Credentials (PDF or Image)</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input 
                                  type="file" 
                                  accept="image/*,application/pdf"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setNewDoctorData({ ...newDoctorData, license: reader.result });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ flexGrow: 1 }}
                                />
                                {newDoctorData.license && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>✓ Uploaded</span>
                                    <button 
                                      type="button" 
                                      onClick={() => setNewDoctorData({ ...newDoctorData, license: '' })} 
                                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
                                      title="Remove License"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary">{editingDoctorId ? "Update Profile" : "Save Profile to Board"}</button>
                            {editingDoctorId && (
                              <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={() => {
                                  setEditingDoctorId(null);
                                  setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', services: [] });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Doctors ({doctors.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Specialist</th>
                                  <th>Department</th>
                                  <th>Weekly Hours</th>
                                  <th>Credentials Code</th>
                                  <th>Consultation Rate</th>
                                  <th>Offered Services</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {doctors.map(d => (
                                  <tr key={d.id}>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {d.image ? (
                                          <img src={d.image} alt={d.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)', flexShrink: 0 }} />
                                        ) : (
                                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #182B49, #2C5D88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
                                            {d.name.charAt(d.name.indexOf(' ') + 1) || d.name.charAt(0)}
                                          </div>
                                        )}
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <strong style={{ color: 'var(--color-indigo)' }}>{d.name}</strong>
                                            <span className={`status-badge ${d.active === false ? 'status-cancelled' : 'status-approved'}`} style={{ padding: '0.05rem 0.35rem', fontSize: '0.6rem', borderRadius: '4px' }}>
                                              {d.active === false ? 'Inactive' : 'Active'}
                                            </span>
                                          </div>
                                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{d.regNo || 'N/A'}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-accent)' }}>{getSpecialtyTitle(d.specialty)}</span>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.85rem' }}>{d.schedule || 'N/A'}</span>
                                    </td>
                                    <td>
                                      <div style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
                                        <div>Email: <code>{d.email || 'N/A'}</code></div>
                                        <div>Password: <code>{d.password || 'N/A'}</code></div>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{d.consultationRate || 'N/A'}</span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', maxWidth: '200px' }}>
                                        {d.services && d.services.length > 0 ? (
                                          d.services.map(srv => (
                                            <span key={srv} style={{ fontSize: '0.7rem', background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '600' }}>
                                              {srv}
                                            </span>
                                          ))
                                        ) : (
                                          <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>None</span>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button 
                                          className="delete-doctor-btn" 
                                          onClick={() => handleToggleDoctorActive(d.id)} 
                                          title={d.active === false ? "Activate Profile" : "Deactivate Profile"} 
                                          style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            backgroundColor: d.active === false ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                                            color: d.active === false ? '#10B981' : '#EF4444' 
                                          }}
                                        >
                                          <i className={`fa-solid ${d.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                        </button>
                                        <button className="delete-doctor-btn" onClick={() => setAdminSelectedDoctor(d)} title="View Profile" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}>
                                          <i className="fa-solid fa-eye"></i>
                                        </button>
                                        <button className="delete-doctor-btn" onClick={() => startEditDoctor(d)} title="Edit Profile" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}>
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button className="delete-doctor-btn" onClick={() => handleDeleteDoctor(d.id)} title="Delete Profile" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}>
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Patient Profiles (Users) */}
                    {adminNavView === 'patients' && (
                      <div>
                        <h3>Manage Patient Accounts</h3>
                        
                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddPatient}>
                          <h4>{editingPatientId ? "Edit Patient Account" : "Register New Patient Account"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Full Name</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="e.g. Zainab Abdulfatah"
                                value={newPatientData.name}
                                onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Phone Number</label>
                              <input 
                                type="tel" 
                                required 
                                placeholder="e.g. 08012345678"
                                value={newPatientData.phone}
                                onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input 
                                type="email" 
                                required 
                                disabled={editingPatientId !== null}
                                placeholder="patient@example.com"
                                value={newPatientData.email}
                                onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Password</label>
                              <div className="password-input-wrapper">
                                <input 
                                  type={showPasswords.patientForm ? 'text' : 'password'} 
                                  required 
                                  placeholder="••••••••"
                                  value={newPatientData.password}
                                  onChange={(e) => setNewPatientData({ ...newPatientData, password: e.target.value })}
                                />
                                <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, patientForm: !p.patientForm }))} tabIndex={-1}>
                                  <i className={`fa-solid ${showPasswords.patientForm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">{editingPatientId ? "Update Account" : "Save Patient Account"}</button>
                            {editingPatientId && (
                              <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={() => {
                                  setEditingPatientId(null);
                                  setNewPatientData({ name: '', email: '', phone: '', password: '' });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Patients ({patients.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Patient Name</th>
                                  <th>Contact Phone</th>
                                  <th>Email Address</th>
                                  <th>Portal Password</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {patients.map(p => (
                                  <tr key={p.email}>
                                    <td>
                                      <strong>{p.name}</strong>
                                    </td>
                                    <td>{p.phone}</td>
                                    <td><code>{p.email}</code></td>
                                    <td><code>{p.password}</code></td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button className="delete-doctor-btn" onClick={() => startEditPatient(p)} title="Edit Account" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}>
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button className="delete-doctor-btn" onClick={() => handleDeletePatient(p.email)} title="Delete Account" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}>
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Patient Inquiries */}
                    {adminNavView === 'inquiries' && (
                      <div>
                        <h3>Inquiries Inbox</h3>
                        {inquiries.length > 0 ? (
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Ticket ID</th>
                                  <th>Date</th>
                                  <th>Sender</th>
                                  <th>Message</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inquiries.map(inq => (
                                  <tr key={inq.id}>
                                    <td>
                                      <span className="inq-ticket" style={{ marginLeft: 0 }}>{inq.id}</span>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{inq.date}</span>
                                    </td>
                                    <td>
                                      <div style={{ fontSize: '0.85rem' }}>
                                        <strong>{inq.name}</strong>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{inq.email}</div>
                                      </div>
                                    </td>
                                    <td>
                                      <p className="inq-message" style={{ margin: 0, fontSize: '0.85rem', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        "{inq.message}"
                                      </p>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button className="btn btn-primary btn-sm" onClick={() => setAdminSelectedInquiry(inq)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                          <i className="fa-solid fa-eye"></i> View Details
                                        </button>
                                        <button className="inq-btn-delete" onClick={() => handleDeleteInquiry(inq.id)} style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                          <i className="fa-solid fa-trash"></i> Delete
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
                            <p>Inbox is empty. No patient inquiries received.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Workspace: Admin Profile Settings */}
                    {adminNavView === 'profile' && (
                      <div style={{ padding: '1.5rem' }}>
                        {!isEditingAdminSelf ? (
                          <div className="doctor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(28,43,73,0.05)', borderRadius: '12px' }}>
                              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-indigo), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: '#fff', fontWeight: 'bold' }}>
                                A
                              </div>
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Administrator Settings</h3>
                                <div style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1rem', marginTop: '0.25rem' }}>Role: Admin (Global Oversight)</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Full management control over doctors, patients, and bookings.</div>
                              </div>
                            </div>

                            <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Admin Username</strong>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{adminCredentials.username}</span>
                              </div>
                              <div className="profile-detail-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Admin Password</strong>
                                <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span>{showPasswords.admin ? adminCredentials.password : '••••••••'}</span>
                                  <button onClick={() => setShowPasswords(p => ({ ...p, admin: !p.admin }))} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <i className={`fa-solid ${showPasswords.admin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </span>
                              </div>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                              <button className="btn btn-primary" onClick={() => {
                                setAdminSelfData({
                                  username: adminCredentials.username,
                                  password: adminCredentials.password
                                });
                                setIsEditingAdminSelf(true);
                              }}>
                                <i className="fa-solid fa-user-gear" style={{ marginRight: '0.5rem' }}></i>Edit Login Credentials
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSaveAdminSelf} className="add-doctor-form glassmorphic" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Modify Administrator Credentials</h4>
                            
                            <div className="form-row">
                              <div className="form-group">
                                <label>Admin Username</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={adminSelfData.username}
                                  onChange={(e) => setAdminSelfData({ ...adminSelfData, username: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Admin Password</label>
                                <div className="password-input-wrapper">
                                  <input 
                                    type={showPasswords.adminForm ? 'text' : 'password'} 
                                    required 
                                    value={adminSelfData.password}
                                    onChange={(e) => setAdminSelfData({ ...adminSelfData, password: e.target.value })}
                                  />
                                  <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, adminForm: !p.adminForm }))} tabIndex={-1}>
                                    <i className={`fa-solid ${showPasswords.adminForm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                              <button type="submit" className="btn btn-primary">Save Changes</button>
                              <button type="button" className="btn btn-outline" onClick={() => setIsEditingAdminSelf(false)}>Cancel</button>
                            </div>
                          </form>
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

      {/* --- 3. Footer Section (Flyer-Style Compact Bar + Classic Links) --- */}
      <footer className="app-footer glassmorphic">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <div className="logo-img-wrapper">
                <img className="logo-img" src={logoSvg} alt="SimmyCare Logo" />
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

          <div className="footer-hours-col">
            <h4>Operational Hours</h4>
            <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 2:00 PM</p>
            <p>Sunday: Emergency Consultations Only</p>
            <p className="footer-contact-phone"><i className="fa-solid fa-phone"></i> +234 901 432 4442</p>
          </div>
        </div>
      </footer>

      {/* Flyer-Style Compact Footer Bar */}
      <div className="flyer-footer-bar">
        <div className="flyer-footer-container">
          <div className="flyer-footer-item">
            <div className="flyer-footer-icon"><i className="fa-solid fa-heart-pulse"></i></div>
            <div className="flyer-footer-text">
              <strong>Your Health. Our Care.</strong>
              <span>Simmycare - <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Always Here for You.</a></span>
            </div>
          </div>
          <div className="flyer-footer-item center">
            <div className="flyer-footer-icon"><i className="fa-solid fa-globe"></i></div>
            <div className="flyer-footer-text">
              <strong>www.simmycare.com</strong>
            </div>
          </div>
          <div className="flyer-footer-item right">
            <div className="flyer-footer-icon"><i className="fa-solid fa-phone"></i></div>
            <div className="flyer-footer-text">
              <strong>09014324442</strong>
              <span>We are just a message away!</span>
            </div>
          </div>
        </div>
        <div className="flyer-footer-bottom">
          <p>© 2026 SimmyCare Online Clinic. Developed by Nexel Technologies. All rights reserved.</p>
          <p>RC Number: RC 9198656</p>
        </div>
      </div>

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

      {/* --- 6. Admin View Details Modal --- */}
      {adminSelectedApt && (
        <div className="modal-backdrop" onClick={() => setAdminSelectedApt(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '550px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Consultation Ticket: {adminSelectedApt.id}</h3>
              <button onClick={() => setAdminSelectedApt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Patient Information</strong>
                <div style={{ marginTop: '0.25rem' }}>
                  <strong>{adminSelectedApt.patientName}</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Phone: {adminSelectedApt.phone || 'N/A'}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email: {adminSelectedApt.email || 'N/A'}</div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Consultation Schedule</strong>
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  <strong>Specialist:</strong> {adminSelectedApt.doctor}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                  <strong>Scheduled:</strong> {adminSelectedApt.date} ({adminSelectedApt.time})
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Status</strong>
                  {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.status && (
                    <button 
                      onClick={() => {
                        setModalEditingFields(prev => ({ ...prev, status: true }));
                        setModalTempValues(prev => ({ ...prev, status: adminSelectedApt.status }));
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                      title="Change Status"
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Change
                    </button>
                  )}
                </div>
                {modalEditingFields.status ? (
                  <div style={{ marginTop: '0.25rem' }}>
                    <select 
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      value={modalTempValues.status || ''}
                      onChange={(e) => handleModalFieldEdit('status', e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                      <option value="Awaiting Lab">Awaiting Lab Results</option>
                      <option value="Awaiting Scan">Awaiting Scan Results</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'status')}>Save</button>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, status: false }))}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`status-badge status-${adminSelectedApt.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {adminSelectedApt.status}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Reported Symptoms</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', lineHeight: '1.4', fontStyle: 'italic', color: 'var(--color-indigo)' }}>
                  "{adminSelectedApt.symptoms}"
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Clinical Consultation Notes</strong>
                  {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.notes && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => {
                          setModalEditingFields(prev => ({ ...prev, notes: true }));
                          setModalTempValues(prev => ({ ...prev, notes: adminSelectedApt.notes || '' }));
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                        title="Edit Notes"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {adminSelectedApt.notes && (
                        <button 
                          onClick={() => handleModalFieldDelete(adminSelectedApt.id, 'notes')}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem' }}
                          title="Delete Notes"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {modalEditingFields.notes ? (
                  <div style={{ marginTop: '0.25rem' }}>
                    <textarea 
                      rows="3"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '0.9rem' }}
                      value={modalTempValues.notes || ''}
                      onChange={(e) => handleModalFieldEdit('notes', e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'notes')}>Save</button>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, notes: false }))}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', lineHeight: '1.4', backgroundColor: 'rgba(28, 43, 73, 0.05)', padding: '0.75rem', borderRadius: '4px', minHeight: '38px' }}>
                    {adminSelectedApt.notes || <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No clinical notes recorded.</span>}
                  </p>
                )}
              </div>

              {/* Medication/Rx Section with Edit/Delete */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Prescribed Medication (Rx)</strong>
                  {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.prescription && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => {
                          setModalEditingFields(prev => ({ ...prev, prescription: true }));
                          setModalTempValues(prev => ({ ...prev, prescription: adminSelectedApt.prescription || '' }));
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                        title="Edit Rx"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      {adminSelectedApt.prescription && (
                        <button 
                          onClick={() => handleModalFieldDelete(adminSelectedApt.id, 'prescription')}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem' }}
                          title="Delete Rx"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {modalEditingFields.prescription ? (
                  <div style={{ marginTop: '0.25rem' }}>
                    <textarea 
                      rows="2"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '0.9rem' }}
                      value={modalTempValues.prescription || ''}
                      onChange={(e) => handleModalFieldEdit('prescription', e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'prescription')}>Save</button>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, prescription: false }))}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', fontWeight: '500', color: adminSelectedApt.prescription ? '#10B981' : 'var(--color-text-muted)', backgroundColor: adminSelectedApt.prescription ? 'rgba(16, 185, 129, 0.1)' : 'rgba(28, 43, 73, 0.05)', padding: '0.75rem', borderRadius: '4px', minHeight: '38px' }}>
                    {adminSelectedApt.prescription ? (
                      <>
                        <i className="fa-solid fa-prescription-bottle-medical" style={{ marginRight: '0.5rem' }}></i>
                        {adminSelectedApt.prescription}
                      </>
                    ) : (
                      <span style={{ fontStyle: 'italic' }}>No prescription recorded.</span>
                    )}
                  </p>
                )}
              </div>

              {/* Department Referrals & Pushes with Edit/Delete */}
              <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-network-wired"></i> Department Referrals & Pushes
                </strong>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Lab Referral */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>Lab Tests Referral</span>
                      {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.labTests && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => { setModalEditingFields(prev => ({ ...prev, labTests: true })); setModalTempValues(prev => ({ ...prev, labTests: adminSelectedApt.labTests || '' })); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-pen"></i></button>
                          {adminSelectedApt.labTests && <button onClick={() => handleModalFieldDelete(adminSelectedApt.id, 'labTests')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-trash-can"></i></button>}
                        </div>
                      )}
                    </div>
                    {modalEditingFields.labTests ? (
                      <div>
                        <input type="text" style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} value={modalTempValues.labTests || ''} onChange={(e) => handleModalFieldEdit('labTests', e.target.value)} />
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'labTests')}>Save</button>
                          <button className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, labTests: false }))}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: adminSelectedApt.labTests ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: adminSelectedApt.labTests ? 'normal' : 'italic', background: 'rgba(28,43,73,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                        {adminSelectedApt.labTests || "None"}
                      </div>
                    )}
                  </div>

                  {/* Scan Referral */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>Imaging Scans Referral</span>
                      {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.scans && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => { setModalEditingFields(prev => ({ ...prev, scans: true })); setModalTempValues(prev => ({ ...prev, scans: adminSelectedApt.scans || '' })); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-pen"></i></button>
                          {adminSelectedApt.scans && <button onClick={() => handleModalFieldDelete(adminSelectedApt.id, 'scans')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-trash-can"></i></button>}
                        </div>
                      )}
                    </div>
                    {modalEditingFields.scans ? (
                      <div>
                        <input type="text" style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} value={modalTempValues.scans || ''} onChange={(e) => handleModalFieldEdit('scans', e.target.value)} />
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'scans')}>Save</button>
                          <button className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, scans: false }))}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: adminSelectedApt.scans ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: adminSelectedApt.scans ? 'normal' : 'italic', background: 'rgba(28,43,73,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                        {adminSelectedApt.scans || "None"}
                      </div>
                    )}
                  </div>

                  {/* Office Referral */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>Clinical Office / Follow-up</span>
                      {(authRole === 'doctor' || authRole === 'admin') && !modalEditingFields.officeReferral && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => { setModalEditingFields(prev => ({ ...prev, officeReferral: true })); setModalTempValues(prev => ({ ...prev, officeReferral: adminSelectedApt.officeReferral || '' })); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-pen"></i></button>
                          {adminSelectedApt.officeReferral && <button onClick={() => handleModalFieldDelete(adminSelectedApt.id, 'officeReferral')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fa-solid fa-trash-can"></i></button>}
                        </div>
                      )}
                    </div>
                    {modalEditingFields.officeReferral ? (
                      <div>
                        <input type="text" style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} value={modalTempValues.officeReferral || ''} onChange={(e) => handleModalFieldEdit('officeReferral', e.target.value)} />
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleModalFieldSave(adminSelectedApt.id, 'officeReferral')}>Save</button>
                          <button className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }} onClick={() => setModalEditingFields(prev => ({ ...prev, officeReferral: false }))}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: adminSelectedApt.officeReferral ? 'var(--color-text)' : 'var(--color-text-muted)', fontStyle: adminSelectedApt.officeReferral ? 'normal' : 'italic', background: 'rgba(28,43,73,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                        {adminSelectedApt.officeReferral || "None"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setAdminSelectedApt(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 6.5 Admin View Inquiry Details Modal --- */}
      {adminSelectedInquiry && (
        <div className="modal-backdrop" onClick={() => setAdminSelectedInquiry(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Inquiry Ticket: {adminSelectedInquiry.id}</h3>
              <button onClick={() => setAdminSelectedInquiry(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Contact Information</strong>
                <div style={{ marginTop: '0.25rem' }}>
                  <strong>{adminSelectedInquiry.name}</strong>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Email: {adminSelectedInquiry.email}</div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Submission Date</strong>
                <div style={{ fontSize: '0.95rem', marginTop: '0.25rem', color: 'var(--color-text-muted)' }}>
                  {adminSelectedInquiry.date}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Inquiry Message</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', lineHeight: '1.5', padding: '1rem', borderRadius: '6px', backgroundColor: 'rgba(28, 43, 73, 0.05)', whiteSpace: 'pre-wrap' }}>
                  "{adminSelectedInquiry.message}"
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={() => {
                handleDeleteInquiry(adminSelectedInquiry.id);
                setAdminSelectedInquiry(null);
              }} style={{ borderColor: '#EF4444', color: '#EF4444' }}>Delete Inquiry</button>
              <button className="btn btn-primary" onClick={() => setAdminSelectedInquiry(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 6.7 Doctor Profile Details Modal --- */}
      {adminSelectedDoctor && (
        <div className="modal-backdrop" onClick={() => setAdminSelectedDoctor(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Doctor Profile</h3>
              <button onClick={() => setAdminSelectedDoctor(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>

            {/* Doctor Avatar / Image */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(28,43,73,0.05)', borderRadius: '8px' }}>
              {adminSelectedDoctor.image ? (
                <img src={adminSelectedDoctor.image} alt={adminSelectedDoctor.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)' }} />
              ) : (
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #182B49, #2C5D88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
                  {adminSelectedDoctor.name.charAt(adminSelectedDoctor.name.indexOf(' ') + 1) || adminSelectedDoctor.name.charAt(0)}
                </div>
              )}
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{adminSelectedDoctor.name}</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.15rem' }}>{adminSelectedDoctor.specialty}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{adminSelectedDoctor.experience} Experience</div>
              </div>
            </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>MDCN Registration</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{adminSelectedDoctor.regNo || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Clinic Location</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem' }}>{adminSelectedDoctor.clinicRoom || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Phone Number</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem' }}>{adminSelectedDoctor.phone || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Weekly Schedule</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem' }}>{adminSelectedDoctor.schedule || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Consultation Rate</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', fontWeight: 'bold' }}>{adminSelectedDoctor.consultationRate || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Consultation Duration</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', fontWeight: 'bold' }}>{adminSelectedDoctor.consultationDuration || '30 mins'}</div>
                </div>
              </div>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Offered Services / Features</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {adminSelectedDoctor.services && adminSelectedDoctor.services.length > 0 ? (
                    adminSelectedDoctor.services.map(srv => (
                      <span key={srv} style={{ fontSize: '0.75rem', background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                        {srv}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>None</span>
                  )}
                </div>
              </div>
              {adminSelectedDoctor.bio && (
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Professional Biography</strong>
                  <div style={{ fontSize: '0.88rem', marginTop: '0.15rem', lineHeight: '1.4', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>"{adminSelectedDoctor.bio}"</div>
                </div>
              )}
              {adminSelectedDoctor.license && (
                <div style={{ marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Professional Credentials</strong>
                  <a href={adminSelectedDoctor.license} download={`license_${adminSelectedDoctor.name.replace(/\s+/g, '_')}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-download"></i> Download Medical License File
                  </a>
                </div>
              )}
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Portal Login Credentials</strong>
                <div style={{ fontSize: '0.88rem', marginTop: '0.15rem', padding: '0.65rem 0.85rem', background: 'rgba(28,43,73,0.06)', borderRadius: '6px', fontFamily: 'monospace' }}>
                  <div>Email: <strong>{adminSelectedDoctor.email || 'N/A'}</strong></div>
                  <div style={{ marginTop: '0.25rem' }}>Password: <strong>{adminSelectedDoctor.password || 'N/A'}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline btn-sm" onClick={() => { startEditDoctor(adminSelectedDoctor); setAdminNavView('doctors'); setAdminSelectedDoctor(null); }}>
                <i className="fa-solid fa-pen-to-square" style={{ marginRight: '0.35rem' }}></i>Edit Profile
              </button>
              <button className="btn btn-primary" onClick={() => setAdminSelectedDoctor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 6.6 Modify Ticket Modal (All Roles) --- */}
      {editingApt && (
        <div className="modal-backdrop" onClick={() => setEditingApt(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Modify Ticket: {editingApt.id}</h3>
              <button onClick={() => setEditingApt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveEditApt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Assigned Specialist</label>
                <select 
                  value={editAptData.doctorId}
                  onChange={(e) => setEditAptData({ ...editAptData, doctorId: e.target.value })}
                  required
                >
                  <option value="">Select Specialist...</option>
                  {doctors.filter(d => d.active !== false).map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.name} ({getSpecialtyTitle(d.specialty)})</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date</label>
                  <input 
                    type="date" 
                    required
                    value={editAptData.date}
                    onChange={(e) => setEditAptData({ ...editAptData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 10:00 AM"
                    value={editAptData.time}
                    onChange={(e) => setEditAptData({ ...editAptData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reported Symptoms</label>
                <textarea 
                  rows="3" 
                  required
                  placeholder="Describe details of medical symptoms..."
                  value={editAptData.symptoms}
                  onChange={(e) => setEditAptData({ ...editAptData, symptoms: e.target.value })}
                />
              </div>

              {/* Status editing is only visible to Admin role */}
              {authRole === 'admin' ? (
                <div className="form-group">
                  <label>Ticket Status</label>
                  <select 
                    value={editAptData.status}
                    onChange={(e) => setEditAptData({ ...editAptData, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Ticket Status</label>
                  <input 
                    type="text" 
                    disabled 
                    value={editAptData.status} 
                    style={{ backgroundColor: 'rgba(28, 43, 73, 0.05)', color: 'var(--color-text-muted)' }}
                  />
                </div>
              )}

              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save Modifications</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingApt(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 6.7 Book Follow-up Modal (Doctor/Admin Roles) --- */}
      {followUpApt && (
        <div className="modal-backdrop" onClick={() => setFollowUpApt(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Schedule Return / Follow-up Booking</h3>
              <button onClick={() => setFollowUpApt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateFollowUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Patient Name (Locked)</label>
                <input 
                  type="text" 
                  disabled 
                  value={followUpApt.patientName} 
                  style={{ backgroundColor: 'rgba(28, 43, 73, 0.05)', color: 'var(--color-text-muted)' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Return Date</label>
                  <input 
                    type="date" 
                    required
                    value={followUpData.date}
                    onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 10:00 AM"
                    value={followUpData.time}
                    onChange={(e) => setFollowUpData({ ...followUpData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Symptoms / Return Reason Statement</label>
                <textarea 
                  rows="3" 
                  required
                  placeholder="Describe reasons for follow-up/return checkup..."
                  value={followUpData.reason}
                  onChange={(e) => setFollowUpData({ ...followUpData, reason: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--color-accent)', border: 'none' }}>
                  <i className="fa-solid fa-circle-check"></i> Book Return Appointment
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setFollowUpApt(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 7. WhatsApp Floating Widget with Dual Options --- */}
      <div className="whatsapp-float-wrapper">
        <div className={`whatsapp-popup ${whatsappPopupOpen ? 'open' : ''}`}>
          <div className="whatsapp-popup-header">
            <i className="fa-brands fa-whatsapp"></i> SimmyCare WhatsApp
          </div>
          <a 
            href="https://wa.me/2349014324442?text=Hello%20SimmyCare%21%20I%20would%20like%20to%20make%20an%20inquiry%20about%20booking%20a%20consultation." 
            className="whatsapp-popup-option"
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setWhatsappPopupOpen(false)}
          >
            <div className="option-icon dm"><i className="fa-solid fa-message"></i></div>
            <div className="option-info">
              Send Direct Message
              <span>Chat with our team directly</span>
            </div>
          </a>
          <a 
            href="https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK" 
            className="whatsapp-popup-option"
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setWhatsappPopupOpen(false)}
          >
            <div className="option-icon group"><i className="fa-solid fa-users"></i></div>
            <div className="option-info">
              Join WhatsApp Group
              <span>Health community & updates</span>
            </div>
          </a>
        </div>
        <button 
          className="whatsapp-widget" 
          onClick={() => setWhatsappPopupOpen(!whatsappPopupOpen)}
          title="WhatsApp Options"
        >
          <i className={`fa-${whatsappPopupOpen ? 'solid fa-xmark' : 'brands fa-whatsapp'}`}></i>
        </button>
      </div>

      {/* --- Doctor Booking Details Preview Modal --- */}
      {previewBookingDoc && (
        <div className="modal-backdrop" onClick={() => setPreviewBookingDoc(null)}>
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '550px', textAlign: 'left', alignItems: 'stretch' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}>Consultation Rate & Offered Services</h3>
              <button onClick={() => setPreviewBookingDoc(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(28,43,73,0.05)', borderRadius: '12px' }}>
              {previewBookingDoc.image ? (
                <img src={previewBookingDoc.image} alt={previewBookingDoc.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)' }} />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #182B49, #2C5D88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff', fontWeight: 'bold' }}>
                  {previewBookingDoc.name.charAt(previewBookingDoc.name.indexOf(' ') + 1) || previewBookingDoc.name.charAt(0)}
                </div>
              )}
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-indigo)' }}>{previewBookingDoc.name}</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.15rem' }}>{getSpecialtyTitle(previewBookingDoc.specialty)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{previewBookingDoc.experience} Experience</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Consultation Rates & Duration:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-indigo)' }}>General Consultation Rate</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-hover)' }}>{previewBookingDoc.consultationRate || '₦5,000'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-indigo)' }}>Consultation Session Duration</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-hover)' }}>{previewBookingDoc.consultationDuration || '30 mins'}</span>
                  </div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Offered Clinical Services:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {previewBookingDoc.services && previewBookingDoc.services.length > 0 ? (
                    previewBookingDoc.services.map(srv => (
                      <div key={srv} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                        <i className="fa-solid fa-circle-check" style={{ fontSize: '0.8rem' }}></i> {srv}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No specific services assigned.</span>
                  )}
                </div>
              </div>

              {previewBookingDoc.bio && (
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Professional Bio Summary</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4', fontStyle: 'italic' }}>
                    "{previewBookingDoc.bio}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setPreviewBookingDoc(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                setBookingFormData({ 
                  ...bookingFormData, 
                  doctorId: previewBookingDoc.id.toString(),
                  patientName: loggedInPatient ? loggedInPatient.name : '',
                  email: loggedInPatient ? loggedInPatient.email : '',
                  phone: loggedInPatient ? loggedInPatient.phone : '',
                  symptoms: `Consultation request for ${getSpecialtyTitle(previewBookingDoc.specialty)} department.`
                });
                setPreviewBookingDoc(null);
                navigateTo('booking');
              }}>
                Confirm & Proceed to Booking Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 7. Terms & Conditions & Privacy Policy Modal --- */}
      {showTermsModal && (
        <div className="modal-backdrop">
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

              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>- End of Document -</p>
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
