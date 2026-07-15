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

const CLINIC_DRUG_STOCK = [
  { id: 'dg-1', name: 'Paracetamol Syrup 125mg/5ml', price: 1200, category: 'Analgesics' },
  { id: 'dg-2', name: 'Ibuprofen Tablets 400mg', price: 1500, category: 'Analgesics' },
  { id: 'dg-3', name: 'Amoxicillin Capsules 500mg', price: 3500, category: 'Antibiotics' },
  { id: 'dg-4', name: 'Azithromycin Tablets 500mg', price: 5000, category: 'Antibiotics' },
  { id: 'dg-5', name: 'Ciprofloxacin Tablets 500mg', price: 4200, category: 'Antibiotics' },
  { id: 'dg-6', name: 'Artemether + Lumefantrine (ACT) Antimalarial', price: 2500, category: 'Antimalarials' },
  { id: 'dg-7', name: 'Vitamin C Syrup & B-Complex', price: 1000, category: 'Supplements' },
  { id: 'dg-8', name: 'Multivitamin Capsules (30 Days Pack)', price: 2800, category: 'Supplements' },
  { id: 'dg-9', name: 'Cetirizine Allergy Tablets 10mg', price: 1800, category: 'Antihistamines' },
  { id: 'dg-10', name: 'Cough Expectoral Syrup', price: 2200, category: 'Respiratory' }
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
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Senior Consultant"
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
    services: ["Online Consultation", "Mobile Laboratory"],
    verified: true,
    level: "Consultant"
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
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Senior Consultant"
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
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Consultant"
  },
  {
    id: 5,
    name: "Dr. Wasila Goranduma",
    specialty: "Public Health",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "6 Years",
    regNo: "MLS/REG",
    image: "",
    email: "wasilagoranduma@gmail.com",
    password: "password123",
    phone: "+234 803 133 8534",
    bio: "Registered Medical Laboratory Scientist with 6 years of progressive experience in clinical laboratory diagnostics, public health screening, and quality assurance. Happy to collaborate and give maximum support any time.",
    clinicRoom: "",
    license: "",
    consultationRate: "Free",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Junior Doctor"
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: "LAB-3829",
    patientName: "Chinedu Eze",
    phone: "08098765432",
    email: "chinedueze@example.com",
    symptoms: "Lab Request: Full Blood Count, Fasting Blood Sugar. Address: [12 Garki Road, Area 11, Abuja]. Special Instructions: [Fasting from 8pm previous night].",
    status: "Sample Collected",
    assignedRider: "Chinedu Okeke",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    doctorName: "Dr. Fatima Ibrahim"
  },
  {
    id: "LAB-7712",
    patientName: "Hadiza Musa",
    phone: "08044433322",
    email: "hadiza@example.com",
    symptoms: "Lab Request: Malaria Smear, Widal Typhoid Test. Address: [Suite B12, Banex Plaza, Wuse II, Abuja]. Special Instructions: [Urgent testing required].",
    status: "Pending",
    assignedRider: "",
    date: new Date().toISOString().split('T')[0],
    time: "02:00 PM",
    doctorName: "Dr. Fatima Ibrahim"
  }
];

const INITIAL_INQUIRIES = [
  {
    id: "ORD-8291",
    name: "Zainab Abdulfatah",
    email: "zainab@example.com",
    phone: "08012345678",
    message: "Pharmacy Purchase Order: [Insulin Pen (x2), Metformin 500mg (x1)]. Shipping Address: [Plot 824, Wuse II, Abuja]. Rx Notes: [Keep refrigerated]. Total Cost: ₦18,500",
    date: new Date().toISOString().split('T')[0],
    status: "Out for Delivery",
    assignedRider: "Chinedu Okeke"
  },
  {
    id: "ORD-4921",
    name: "Emeka Okafor",
    email: "emeka@example.com",
    phone: "08055566677",
    message: "Pharmacy Purchase Order: [Amoxicillin 500mg (x2), Vitamin C 1000mg (x3)]. Shipping Address: [Aso Drive, Maitama, Abuja]. Rx Notes: [None]. Total Cost: ₦12,200",
    date: new Date().toISOString().split('T')[0],
    status: "Awaiting Dispatch",
    assignedRider: ""
  }
];

// Client-side image compression helper to prevent localStorage quota exhaustion (5MB limit)
const compressImageFile = (file, maxDimension = 500, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
};

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

  // Data version - increment to force localStorage refresh and remove stale/dummy data
  const DATA_VERSION = "v6_active_logistics_routes";

  const [doctors, setDoctors] = useState(() => {
    const storedVersion = localStorage.getItem("simmy_data_version");
    // If version mismatch, wipe old data and use fresh seed data
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem("simmy_doctors");
      localStorage.removeItem("simmy_appointments");
      localStorage.removeItem("simmy_inquiries");
      localStorage.setItem("simmy_data_version", DATA_VERSION);
      return INITIAL_DOCTORS;
    }
    const data = localStorage.getItem("simmy_doctors");
    if (data) {
      const parsed = JSON.parse(data);
      const seedIds = INITIAL_DOCTORS.map(sd => sd.id);
      // Only keep doctors that exist in INITIAL_DOCTORS (removes any stale dummy entries)
      const validDoctors = parsed.filter(doc => seedIds.includes(doc.id));
      // Re-apply bundled images for seed doctors unless they have a user-uploaded base64 image
      const merged = validDoctors.map(doc => {
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
      // Append any new seed doctors not yet in cached data
      const cachedIds = validDoctors.map(d => d.id);
      const newSeedDoctors = INITIAL_DOCTORS.filter(sd => !cachedIds.includes(sd.id));
      return [...merged, ...newSeedDoctors];
    }
    return INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState(() => {
    const storedVersion = localStorage.getItem("simmy_data_version");
    if (storedVersion !== DATA_VERSION) {
      return INITIAL_APPOINTMENTS;
    }
    const data = localStorage.getItem("simmy_appointments");
    return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
  });

  const [inquiries, setInquiries] = useState(() => {
    const storedVersion = localStorage.getItem("simmy_data_version");
    if (storedVersion !== DATA_VERSION) {
      return INITIAL_INQUIRIES;
    }
    const data = localStorage.getItem("simmy_inquiries");
    return data ? JSON.parse(data) : INITIAL_INQUIRIES;
  });

  const [patients, setPatients] = useState(() => {
    const data = localStorage.getItem("simmy_patients");
    return data ? JSON.parse(data) : [
      { email: "zainab@example.com", name: "Zainab Abdulfatah", phone: "08012345678", password: "password123" }
    ];
  });

  const [pharmacists, setPharmacists] = useState(() => {
    const data = localStorage.getItem("simmy_pharmacists");
    return data ? JSON.parse(data) : [
      { name: "Pharm. Bello Ibrahim", email: "pharmacist@simmycare.com", password: "password123", phone: "08012345678", pharmacyName: "SimmyCare Central Pharmacy", pharmacyLicense: "PCN/P/9482" }
    ];
  });

  const [labs, setLabs] = useState(() => {
    const data = localStorage.getItem("simmy_labs");
    return data ? JSON.parse(data) : [
      { name: "MLS Wasila Goranduma", email: "lab@simmycare.com", password: "password123", phone: "08023456789", facilityName: "SimmyCare Diagnostics", labLicense: "MLSCN/L/3821" }
    ];
  });

  const [logistics, setLogistics] = useState(() => {
    const data = localStorage.getItem("simmy_logistics");
    return data ? JSON.parse(data) : [
      { name: "Chinedu Okeke", email: "logistics@simmycare.com", password: "password123", phone: "08034567890", vehicleType: "Motorbike", dispatchArea: "Abuja Central" }
    ];
  });

  const [registerRole, setRegisterRole] = useState('patient');

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

  const myDoctorAppointments = loggedInDoctor
    ? appointments.filter(apt => apt.doctorId === loggedInDoctor.id || apt.doctor === loggedInDoctor.name)
    : [];

  // --- UI state ---
  const [loginTab, setLoginTab] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [isPatientRegistering, setIsPatientRegistering] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const [patientLoginForm, setPatientLoginForm] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    specialty: 'General Medicine',
    regNo: '',
    pharmacyName: '',
    pharmacyLicense: '',
    facilityName: '',
    labLicense: '',
    vehicleType: 'Motorbike',
    dispatchArea: '',
    level: 'Junior Doctor'
  });
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
    services: [],
    level: 'Junior Doctor',
    verified: false
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
    services: [],
    level: 'Junior Doctor',
    verified: false
  });
  const [previewBookingDoc, setPreviewBookingDoc] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [newPatientData, setNewPatientData] = useState({ name: '', email: '', phone: '', password: '' });

  // Patient Profile & Navigation States
  const [patientNavView, setPatientNavView] = useState('bookings'); // 'bookings' | 'profile' | 'orders' | 'labs'
  const [isEditingPatSelf, setIsEditingPatSelf] = useState(false);
  const [patSelfData, setPatSelfData] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedPharmacyOrder, setSelectedPharmacyOrder] = useState(null);
  const [selectedLabRequest, setSelectedLabRequest] = useState(null);
  const [activeTrackingId, setActiveTrackingId] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(25);

  const [adminSelectedApt, setAdminSelectedApt] = useState(null);
  const [adminSelectedInquiry, setAdminSelectedInquiry] = useState(null);
  const [adminSelectedDoctor, setAdminSelectedDoctor] = useState(null);
  const [activeConsultationApt, setActiveConsultationApt] = useState(null); // For doctor prescription modal
  const [consultationNotes, setConsultationNotes] = useState({ notes: '', prescription: '' });
  const [editingApt, setEditingApt] = useState(null);
  const [editAptData, setEditAptData] = useState({ doctorId: '', doctorName: '', date: '', time: '', symptoms: '', status: '' });
  const [showPasswords, setShowPasswords] = useState({ patient: false, doctor: false, admin: false, pharmacist: false, lab: false, logistics: false, doctorForm: false, patientForm: false, adminForm: false });
  const [docNotesState, setDocNotesState] = useState({});
  const [modalEditingFields, setModalEditingFields] = useState({});
  const [modalTempValues, setModalTempValues] = useState({});
  const [followUpApt, setFollowUpApt] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: '', time: '10:00 AM', reason: '2-Week Observation Follow-up' });
  const [whatsappPopupOpen, setWhatsappPopupOpen] = useState(false);

  // New role authentication & UI states
  const [loggedInPharmacist, setLoggedInPharmacist] = useState(() => {
    const data = sessionStorage.getItem("simmy_auth_pharmacist");
    return data ? JSON.parse(data) : null;
  });
  const [loggedInLab, setLoggedInLab] = useState(() => {
    const data = sessionStorage.getItem("simmy_auth_lab");
    return data ? JSON.parse(data) : null;
  });
  const [loggedInLogistics, setLoggedInLogistics] = useState(() => {
    const data = sessionStorage.getItem("simmy_auth_logistics");
    return data ? JSON.parse(data) : null;
  });

  const [pharmacistNavView, setPharmacistNavView] = useState('orders');
  const [labNavView, setLabNavView] = useState('requests');
  const [logisticsNavView, setLogisticsNavView] = useState('deliveries');

  const [pharmacistLoginForm, setPharmacistLoginForm] = useState({ email: '', password: '' });
  const [labLoginForm, setLabLoginForm] = useState({ email: '', password: '' });
  const [logisticsLoginForm, setLogisticsLoginForm] = useState({ email: '', password: '' });

  const [pharmacistSelectedOrder, setPharmacistSelectedOrder] = useState(null);
  const [pharmacistSelectedPrescription, setPharmacistSelectedPrescription] = useState(null);
  const [prescOrderForm, setPrescOrderForm] = useState({ address: '', notes: '', cost: '0' });
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  // Route Map Tracking & Simulation States
  const [mapTrackedTripId, setMapTrackedTripId] = useState(null);
  const [mapSimulationProgress, setMapSimulationProgress] = useState(0);
  const [isMapSimulating, setIsMapSimulating] = useState(false);

  // Staff Availability States
  const [isPharmacistAvailable, setIsPharmacistAvailable] = useState(true);
  const [isLabTechAvailable, setIsLabTechAvailable] = useState(true);
  const [isLogisticsAvailable, setIsLogisticsAvailable] = useState(true);

  // Search state for availability
  const [availabilitySearchQuery, setAvailabilitySearchQuery] = useState('');

  // Lab upload states
  const [labUploadedFile, setLabUploadedFile] = useState(null);
  const [labUploadedFileName, setLabUploadedFileName] = useState('');

  const [labSelectedRequest, setLabSelectedRequest] = useState(null);
  const [labResultsText, setLabResultsText] = useState('');
  const [logisticsSelectedShipment, setLogisticsSelectedShipment] = useState(null);
  const [logisticsSelectedRider, setLogisticsSelectedRider] = useState(null);
  const [deliveryIssueText, setDeliveryIssueText] = useState('');
  const [riderStatusFilter, setRiderStatusFilter] = useState('All');
  const [onboardRiderForm, setOnboardRiderForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleType: 'Motorbike',
    dispatchArea: ''
  });

  // Live Route Map Simulation progress timer
  useEffect(() => {
    let interval = null;
    if (isMapSimulating) {
      interval = setInterval(() => {
        setMapSimulationProgress(prev => {
          if (prev >= 100) {
            setIsMapSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isMapSimulating]);

  // Simulated Real-Time Logistics Tracking progress
  useEffect(() => {
    let interval;
    if (activeTrackingId) {
      interval = setInterval(() => {
        setSimulatedProgress(p => {
          if (p >= 95) {
            return 15;
          }
          return p + 5;
        });
      }, 1800);
    } else {
      setSimulatedProgress(25);
    }
    return () => clearInterval(interval);
  }, [activeTrackingId]);

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
    localStorage.setItem("simmy_pharmacists", JSON.stringify(pharmacists));
  }, [pharmacists]);

  useEffect(() => {
    localStorage.setItem("simmy_labs", JSON.stringify(labs));
  }, [labs]);

  useEffect(() => {
    localStorage.setItem("simmy_logistics", JSON.stringify(logistics));
  }, [logistics]);

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
    sessionStorage.setItem("simmy_auth_pharmacist", loggedInPharmacist ? JSON.stringify(loggedInPharmacist) : '');
    sessionStorage.setItem("simmy_auth_lab", loggedInLab ? JSON.stringify(loggedInLab) : '');
    sessionStorage.setItem("simmy_auth_logistics", loggedInLogistics ? JSON.stringify(loggedInLogistics) : '');
  }, [authRole, loggedInPatient, loggedInDoctor, loggedInPharmacist, loggedInLab, loggedInLogistics]);

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
  const handleUnifiedLoginSubmit = (e) => {
    e.preventDefault();
    const email = patientLoginForm.email.toLowerCase().trim();
    const password = patientLoginForm.password.trim();

    const clearForm = () => {
      setPatientLoginForm({
        email: '',
        name: '',
        phone: '',
        password: '',
        specialty: 'General Medicine',
        regNo: '',
        pharmacyName: '',
        pharmacyLicense: '',
        facilityName: '',
        labLicense: '',
        vehicleType: 'Motorbike',
        dispatchArea: '',
        level: 'Junior Doctor'
      });
      setLoginError('');
    };

    if (isPatientRegistering) {
      const allEmails = [
        ...patients.map(p => p.email.toLowerCase()),
        ...doctors.map(d => d.email.toLowerCase()),
        ...pharmacists.map(p => p.email.toLowerCase()),
        ...labs.map(l => l.email.toLowerCase()),
        ...logistics.map(l => l.email.toLowerCase())
      ];
      if (allEmails.includes(email)) {
        setLoginError("This email address is already registered.");
        return;
      }

      if (registerRole === 'patient') {
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
      } else if (registerRole === 'doctor') {
        const newDoc = {
          id: doctors.length + 1,
          email,
          name: patientLoginForm.name.startsWith("Dr. ") ? patientLoginForm.name : `Dr. ${patientLoginForm.name}`,
          phone: patientLoginForm.phone || "",
          password: password,
          specialty: patientLoginForm.specialty || "General Medicine",
          regNo: patientLoginForm.regNo || `MDCN/${Math.floor(1000 + Math.random() * 9000)}`,
          schedule: "Mon - Fri (9am - 4pm)",
          experience: "1 Year",
          bio: "Registered Medical Professional Committed to Excellence",
          clinicRoom: `Room ${Math.floor(100 + Math.random() * 200)}, Main Block`,
          license: "",
          consultationRate: "₦5,000",
          consultationDuration: "30 mins",
          services: ["Online Consultation"],
          verified: false,
          active: false,
          level: patientLoginForm.level || "Junior Doctor"
        };
        setDoctors([...doctors, newDoc]);
        setAuthRole('doctor');
        setLoggedInDoctor(newDoc);
        sessionStorage.setItem("simmy_auth_role", "doctor");
        sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(newDoc));
      } else if (registerRole === 'pharmacist') {
        const newPharm = {
          email,
          name: patientLoginForm.name || "Pharm. Specialist",
          phone: patientLoginForm.phone || "",
          password: password,
          pharmacyName: patientLoginForm.pharmacyName || "SimmyCare Pharmacy Partner",
          pharmacyLicense: patientLoginForm.pharmacyLicense || `PCN/P/${Math.floor(1000 + Math.random() * 9000)}`
        };
        setPharmacists([...pharmacists, newPharm]);
        setAuthRole('pharmacist');
        setLoggedInPharmacist(newPharm);
        sessionStorage.setItem("simmy_auth_role", "pharmacist");
        sessionStorage.setItem("simmy_auth_pharmacist", JSON.stringify(newPharm));
      } else if (registerRole === 'lab') {
        const newLab = {
          email,
          name: patientLoginForm.name || "MLS Specialist",
          phone: patientLoginForm.phone || "",
          password: password,
          facilityName: patientLoginForm.facilityName || "SimmyCare Diagnostic Lab",
          labLicense: patientLoginForm.labLicense || `MLSCN/L/${Math.floor(1000 + Math.random() * 9000)}`
        };
        setLabs([...labs, newLab]);
        setAuthRole('lab');
        setLoggedInLab(newLab);
        sessionStorage.setItem("simmy_auth_role", "lab");
        sessionStorage.setItem("simmy_auth_lab", JSON.stringify(newLab));
      } else if (registerRole === 'logistics') {
        const newLog = {
          email,
          name: patientLoginForm.name || "Logistics Dispatcher",
          phone: patientLoginForm.phone || "",
          password: password,
          vehicleType: patientLoginForm.vehicleType || "Motorbike",
          dispatchArea: patientLoginForm.dispatchArea || "Lagos Metro"
        };
        setLogistics([...logistics, newLog]);
        setAuthRole('logistics');
        setLoggedInLogistics(newLog);
        sessionStorage.setItem("simmy_auth_role", "logistics");
        sessionStorage.setItem("simmy_auth_logistics", JSON.stringify(newLog));
      }

      clearForm();
      setIsPatientRegistering(false);
      navigateTo('dashboard');
    } else {
      // 1. Check Admin
      const isMainMatch = email === adminCredentials.username && password === adminCredentials.password;
      const isFallbackMatch = email === 'admin' && password === 'admin';
      const isAltMatch = email === 'admin@simmycare.com' && password === 'password123';
      if (isMainMatch || isFallbackMatch || isAltMatch) {
        setAuthRole('admin');
        sessionStorage.setItem("simmy_auth_role", "admin");
        clearForm();
        navigateTo('dashboard');
        return;
      }

      // 2. Check Pharmacist
      const pharm = pharmacists.find(p => p.email.toLowerCase().trim() === email);
      if (pharm && pharm.password === password) {
        setAuthRole('pharmacist');
        setLoggedInPharmacist(pharm);
        sessionStorage.setItem("simmy_auth_role", "pharmacist");
        sessionStorage.setItem("simmy_auth_pharmacist", JSON.stringify(pharm));
        clearForm();
        navigateTo('dashboard');
        return;
      }

      // 3. Check Lab Tech
      const labUser = labs.find(l => l.email.toLowerCase().trim() === email);
      if (labUser && labUser.password === password) {
        setAuthRole('lab');
        setLoggedInLab(labUser);
        sessionStorage.setItem("simmy_auth_role", "lab");
        sessionStorage.setItem("simmy_auth_lab", JSON.stringify(labUser));
        clearForm();
        navigateTo('dashboard');
        return;
      }

      // 4. Check Logistics
      const logUser = logistics.find(l => l.email.toLowerCase().trim() === email);
      if (logUser && logUser.password === password) {
        setAuthRole('logistics');
        setLoggedInLogistics(logUser);
        sessionStorage.setItem("simmy_auth_role", "logistics");
        sessionStorage.setItem("simmy_auth_logistics", JSON.stringify(logUser));
        clearForm();
        navigateTo('dashboard');
        return;
      }

      // 5. Check Doctor
      const doc = doctors.find(d => d.email && d.email.toLowerCase().trim() === email);
      if (doc && doc.password && doc.password === password) {
        setAuthRole('doctor');
        setLoggedInDoctor(doc);
        sessionStorage.setItem("simmy_auth_role", "doctor");
        sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(doc));
        clearForm();
        navigateTo('dashboard');
        return;
      }

      // 6. Check Patient
      const existing = patients.find(p => p.email.toLowerCase() === email);
      if (existing && existing.password === password) {
        setAuthRole('patient');
        setLoggedInPatient(existing);
        sessionStorage.setItem("simmy_auth_role", "patient");
        sessionStorage.setItem("simmy_auth_patient", JSON.stringify(existing));
        clearForm();
        navigateTo('dashboard');
      } else {
        setLoginError("Invalid email address or password. Tip: use a registered patient or staff email address.");
      }
    }
  };

  const handleCreatePrescOrder = (e) => {
    e.preventDefault();
    if (!pharmacistSelectedPrescription) return;
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const drugsList = selectedDrugs.length > 0
      ? selectedDrugs.map(d => `${d.name} (₦${d.price.toLocaleString()})`).join(', ')
      : 'None';
    const newOrder = {
      id: orderId,
      name: pharmacistSelectedPrescription.patientName,
      email: pharmacistSelectedPrescription.patientEmail || `${pharmacistSelectedPrescription.patientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: pharmacistSelectedPrescription.phone || '08000000000',
      date: new Date().toLocaleDateString('en-CA'),
      message: `Pharmacy Purchase Order: [Dispensing Doctor Rx: ${pharmacistSelectedPrescription.prescription}]. Selected Stock Drugs: [${drugsList}]. Shipping Address: [${prescOrderForm.address}]. Rx Notes: [${prescOrderForm.notes}]. Total Cost: ₦${prescOrderForm.cost}`,
      status: 'Awaiting Dispatch',
      read: false
    };
    setInquiries([newOrder, ...inquiries]);
    setPharmacistSelectedPrescription(null);
    setSelectedDrugs([]);
  };

  const handleSaveLabResults = (e) => {
    e.preventDefault();
    if (!labSelectedRequest) return;
    const updated = appointments.map(apt => {
      if (apt.id === labSelectedRequest.id) {
        return {
          ...apt,
          status: 'Completed',
          prescription: labResultsText,
          notes: `Diagnostic Report: ${labResultsText}`
        };
      }
      return apt;
    });
    setAppointments(updated);
    setLabSelectedRequest(null);
  };

  const handleSaveDeliveryIssue = (e) => {
    e.preventDefault();
    if (!logisticsSelectedShipment) return;
    const updated = inquiries.map(inq => {
      if (inq.id === logisticsSelectedShipment.id) {
        return {
          ...inq,
          status: 'Delivery Issue Logged',
          message: `${inq.message} | Logistics Alert: ${deliveryIssueText}`
        };
      }
      return inq;
    });
    setInquiries(updated);
    setLogisticsSelectedShipment(null);
  };

  const handleLogout = () => {
    setAuthRole(null);
    setLoggedInPatient(null);
    setLoggedInDoctor(null);
    setLoggedInPharmacist(null);
    setLoggedInLab(null);
    setLoggedInLogistics(null);
    sessionStorage.removeItem("simmy_auth_role");
    sessionStorage.removeItem("simmy_auth_patient");
    sessionStorage.removeItem("simmy_auth_doctor");
    sessionStorage.removeItem("simmy_auth_pharmacist");
    sessionStorage.removeItem("simmy_auth_lab");
    sessionStorage.removeItem("simmy_auth_logistics");
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
    let selectedDoc = doctors.find(d => d.id === parseInt(bookingFormData.doctorId));
    if (!selectedDoc) {
      alert("Please select a doctor.");
      return;
    }

    let routed = false;
    let originalDocName = selectedDoc.name;

    // Check if selected doctor is unavailable or not verified
    if (selectedDoc.active === false || selectedDoc.verified === false) {
      // Find active, verified candidates in same specialty
      const candidates = doctors.filter(d => d.specialty === selectedDoc.specialty && d.active !== false && d.verified !== false && d.id !== selectedDoc.id);
      if (candidates.length > 0) {
        // Choose candidate with lowest active workload
        const candidateWorkloads = candidates.map(doc => {
          const activeCount = appointments.filter(a =>
            (a.doctor === doc.name || parseInt(a.doctorId) === doc.id) &&
            (a.status === 'Pending' || a.status === 'Approved')
          ).length;
          return { doc, activeCount };
        });
        candidateWorkloads.sort((a, b) => a.activeCount - b.activeCount);
        selectedDoc = candidateWorkloads[0].doc;
        routed = true;
      } else {
        // Fallback to ANY active, verified doctor
        const generalCandidates = doctors.filter(d => d.active !== false && d.verified !== false && d.id !== selectedDoc.id);
        if (generalCandidates.length > 0) {
          const candidateWorkloads = generalCandidates.map(doc => {
            const activeCount = appointments.filter(a =>
              (a.doctor === doc.name || parseInt(a.doctorId) === doc.id) &&
              (a.status === 'Pending' || a.status === 'Approved')
            ).length;
            return { doc, activeCount };
          });
          candidateWorkloads.sort((a, b) => a.activeCount - b.activeCount);
          selectedDoc = candidateWorkloads[0].doc;
          routed = true;
        } else {
          alert("We are sorry, but all specialists in this department are currently offline or pending verification. Please try again later.");
          return;
        }
      }
    }

    const ticketNumber = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      id: ticketNumber,
      patientName: bookingFormData.patientName,
      phone: bookingFormData.phone,
      email: bookingFormData.email.toLowerCase(),
      doctor: selectedDoc.name,
      doctorId: selectedDoc.id.toString(),
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
      title: routed ? "Appointment Auto-Routed" : "Booking Submitted Successfully",
      message: routed
        ? `Your requested specialist (${originalDocName}) is currently offline or unverified. Your appointment has been automatically routed to Dr. ${selectedDoc.name} (${getSpecialtyTitle(selectedDoc.specialty)} - ${selectedDoc.level || 'Specialist'}) to ensure you receive immediate clinical care.`
        : `Your appointment request with ${selectedDoc.name} has been received and is currently under review.`,
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
    if (loggedInDoctor && loggedInDoctor.id === docId) {
      setLoggedInDoctor(prev => prev ? { ...prev, active: prev.active === false ? true : false } : null);
    }
  };

  const handleToggleDoctorVerify = (docId) => {
    setDoctors(doctors.map(d =>
      d.id === docId ? { ...d, verified: d.verified === true ? false : true } : d
    ));
    if (loggedInDoctor && loggedInDoctor.id === docId) {
      setLoggedInDoctor(prev => prev ? { ...prev, verified: prev.verified === true ? false : true } : null);
    }
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
    loggedInPatient && apt.email.toLowerCase() === loggedInPatient.email.toLowerCase() && !apt.id.startsWith('LAB-')
  );

  const myPatientLabRequests = appointments.filter(apt =>
    loggedInPatient && apt.email.toLowerCase() === loggedInPatient.email.toLowerCase() && apt.id.startsWith('LAB-')
  );

  const myPatientPharmacyOrders = inquiries.filter(inq =>
    loggedInPatient && inq.email && inq.email.toLowerCase() === loggedInPatient.email.toLowerCase() && inq.id.startsWith('ORD-')
  );

  const parseOrderMessage = (msg) => {
    let items = "Generic Medicines";
    let address = "Contact client";
    let notes = "None";
    let total = "N/A";

    if (msg.includes('Pharmacy Purchase Order: [')) {
      items = msg.split('Pharmacy Purchase Order: [')[1].split(']. Selected Stock Drugs:')[0] || items;
    }
    if (msg.includes('Selected Stock Drugs: [')) {
      const selected = msg.split('Selected Stock Drugs: [')[1].split(']. Shipping Address:')[0];
      if (selected && selected !== 'None') {
        items = `${items} + [Stock: ${selected}]`;
      }
    }
    if (msg.includes('Shipping Address: [')) {
      address = msg.split('Shipping Address: [')[1].split(']. Rx Notes')[0] || address;
    }
    if (msg.includes('Rx Notes: [')) {
      notes = msg.split('Rx Notes: [')[1].split(']. Total Cost')[0] || notes;
    }
    if (msg.includes('Total Cost: ')) {
      total = msg.split('Total Cost: ')[1] || total;
    }
    return { items, address, notes, total };
  };

  const parseLabRequest = (symptoms) => {
    let tests = "Standard Diagnostic Panel";
    let address = "Contact patient";
    let instructions = "None";

    if (symptoms.includes('Mobile Lab Booking: ')) {
      tests = symptoms.split('Mobile Lab Booking: ')[1].split('. Home collection')[0] || tests;
    }
    if (symptoms.includes('Home collection address: ')) {
      address = symptoms.split('Home collection address: ')[1].split('. Patient Instructions')[0] || address;
    }
    if (symptoms.includes('Patient Instructions: ')) {
      instructions = symptoms.split('Patient Instructions: ')[1] || instructions;
    }
    return { tests, address, instructions };
  };

  const getTripCoords = (tripId) => {
    if (!tripId) return { x: 250, y: 150 };
    let hash = 0;
    for (let i = 0; i < tripId.length; i++) {
      hash = tripId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = 80 + Math.abs(hash % 340); // 80 to 420
    const y = 80 + Math.abs((hash >> 2) % 200); // 80 to 280
    return { x, y };
  };

  const getInterpolatedCoords = (progress, dest) => {
    const startX = 250;
    const startY = 150;
    const currentX = startX + (dest.x - startX) * (progress / 100);
    const currentY = startY + (dest.y - startY) * (progress / 100);
    return { x: currentX, y: currentY };
  };

  const renderLiveTrackingMap = (showDropdown = true) => {
    const activeOrder = inquiries.find(inq => inq.id === mapTrackedTripId);
    const activeTrip = appointments.find(apt => apt.id === mapTrackedTripId);

    let clientName = "N/A";
    let phone = "N/A";
    let address = "Central Hub Area";
    let courier = "Unassigned";
    let cargoType = "General Medical Supply";

    if (activeOrder) {
      const parsed = parseOrderMessage(activeOrder.message);
      clientName = activeOrder.name;
      phone = activeOrder.phone;
      address = parsed.address;
      courier = activeOrder.assignedRider || 'Default Courier';
      cargoType = parsed.items;
    } else if (activeTrip) {
      const parsed = parseLabRequest(activeTrip.symptoms);
      clientName = activeTrip.patientName;
      phone = activeTrip.phone;
      address = parsed.address;
      courier = activeTrip.assignedRider || 'Default Courier';
      cargoType = "Diagnostic Lab Specimen (Vials/Swabs)";
    }

    const dest = getTripCoords(mapTrackedTripId);
    const currentCoords = getInterpolatedCoords(mapSimulationProgress, dest);

    return (
      <div style={{ background: '#0b1329', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {showDropdown && (
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECT ACTIVE DISPATCH TO TRACK:</label>
            <select
              value={mapTrackedTripId || ''}
              onChange={(e) => {
                setMapTrackedTripId(e.target.value || null);
                setMapSimulationProgress(0);
                setIsMapSimulating(false);
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="">-- No Active Route Selected --</option>
              {inquiries.filter(inq => inq.id.startsWith('ORD-') && (inq.status === 'Out for Delivery' || inq.status === 'Awaiting Dispatch')).map(d => (
                <option key={d.id} value={d.id}>📦 Pharmacy Order {d.id} ({d.status})</option>
              ))}
              {appointments.filter(apt => apt.id.startsWith('LAB-') && (apt.status === 'Sample Collected' || apt.status === 'Pending')).map(l => (
                <option key={l.id} value={l.id}>🔬 Lab Sample Collection {l.id}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ position: 'relative', minHeight: '220px', background: '#070d1e', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(15,23,42,0.9)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '0.3rem', zIndex: 10 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
            {isMapSimulating ? 'SIMULATION ACTIVE' : 'TELEMETRY IDLE'}
          </div>

          <svg viewBox="0 0 500 300" style={{ width: '100%', height: 'auto', background: '#070d1e' }}>
            <defs>
              <pattern id="mapGridMini" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="500" height="300" fill="url(#mapGridMini)" />

            {/* Roads */}
            <path d="M 50,50 L 450,50 M 50,150 L 450,150 M 50,250 L 450,250 M 150,50 L 150,300 M 350,50 L 350,300 M 50,50 Q 250,180 450,250" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="none" />

            {/* Central Hub */}
            <g transform="translate(250, 150)">
              <circle r="6" fill="#10b981" />
              <circle r="12" fill="#10b981" fillOpacity="0.15" />
              <text x="10" y="3" fill="#10b981" fontSize="8" fontWeight="bold">Central Hub</text>
            </g>

            {/* Riders */}
            {logistics.map((rider, idx) => {
              const coords = [
                { x: 120, y: 80 },
                { x: 380, y: 110 },
                { x: 170, y: 220 },
                { x: 310, y: 260 },
                { x: 220, y: 90 },
              ];
              const pt = coords[idx % coords.length];
              const isRiderOnline = rider.active !== false;
              return (
                <g key={rider.id} transform={`translate(${pt.x}, ${pt.y})`} style={{ cursor: 'pointer' }}>
                  <circle r="5" fill={isRiderOnline ? 'var(--color-accent)' : '#ef4444'} />
                  <circle r="10" fill={isRiderOnline ? 'var(--color-accent)' : '#ef4444'} fillOpacity="0.1" />
                  <text x="8" y="3" fill="rgba(255,255,255,0.7)" fontSize="7">{rider.name}</text>
                </g>
              );
            })}

            {/* Target Route */}
            {mapTrackedTripId && (
              <>
                <line
                  x1="250"
                  y1="150"
                  x2={dest.x}
                  y2={dest.y}
                  stroke="rgba(6, 182, 212, 0.4)"
                  strokeWidth="2.5"
                  strokeDasharray="5,5"
                />

                <g transform={`translate(${dest.x}, ${dest.y})`}>
                  <circle r="7" fill="#ec4899" />
                  <circle r="14" fill="#ec4899" fillOpacity="0.2" className="ping-ring" />
                  <text x="10" y="3" fill="#ec4899" fontSize="8" fontWeight="bold">Client Location</text>
                </g>

                <g transform={`translate(${currentCoords.x}, ${currentCoords.y})`}>
                  <circle r="8" fill="#06b6d4" />
                  <circle r="15" fill="#06b6d4" fillOpacity="0.25" />
                  <text x="-4" y="3" fill="#fff" fontSize="9">📦</text>
                </g>
              </>
            )}
          </svg>
        </div>

        {mapTrackedTripId ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Progress:</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)' }}>{mapSimulationProgress}%</strong>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${mapSimulationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsMapSimulating(!isMapSimulating)}
                style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
              >
                <i className={isMapSimulating ? "fa-solid fa-pause" : "fa-solid fa-play"}></i> {isMapSimulating ? 'Pause' : 'Start Simulation'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => { setMapSimulationProgress(0); setIsMapSimulating(false); }}
                style={{ padding: '0.35rem', fontSize: '0.75rem' }}
              >
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
              <div style={{ marginBottom: '0.25rem' }}><strong>Cargo:</strong> {cargoType}</div>
              <div style={{ marginBottom: '0.25rem' }}><strong>Rider:</strong> {courier}</div>
              <div style={{ marginBottom: '0.25rem' }}><strong>Recipient:</strong> {clientName} ({phone})</div>
              <div><strong>Route destination:</strong> {address}</div>
            </div>

            <button
              type="button"
              className="btn btn-success btn-sm"
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.45rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
              onClick={() => {
                const isOrder = mapTrackedTripId.startsWith('ORD-');
                if (isOrder) {
                  setInquiries(inquiries.map(inq =>
                    inq.id === mapTrackedTripId ? { ...inq, status: 'Delivered' } : inq
                  ));
                } else {
                  setAppointments(appointments.map(apt =>
                    apt.id === mapTrackedTripId ? { ...apt, status: 'Sample Collected' } : apt
                  ));
                }
                setMapSimulationProgress(100);
                setIsMapSimulating(false);
                alert(`Delivery status marked as completed for dispatch task: ${mapTrackedTripId}`);
              }}
            >
              <i className="fa-solid fa-circle-check"></i> Complete Route Delivery
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-map-location-dot" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', opacity: 0.3, display: 'block' }}></i>
            Select an active dispatch task from the list or dropdown to track its routing path live.
          </div>
        )}
      </div>
    );
  };

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
                  {authRole === 'patient' && `${loggedInPatient?.name || 'User'} (Patient)`}
                  {authRole === 'doctor' && `${loggedInDoctor?.name || 'Dr.'} (Doctor)`}
                  {authRole === 'pharmacist' && `${loggedInPharmacist?.name || 'Pharm.'} (Pharmacist)`}
                  {authRole === 'lab' && `${loggedInLab?.name || 'MLS.'} (Lab Specialist)`}
                  {authRole === 'logistics' && `${loggedInLogistics?.name || 'Courier'} (Logistics Lead)`}
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
                  SimmyCare connects you directly with MDCN-certified specialists, general practitioners, and laboratory consultants. Access on-demand virtual sessions or book physical visits and home healthcare across Abuja, Kaduna, Kano, Bauchi, and Gombe.
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
                      <strong>Rapid Care Cycle</strong>
                      <span>Skip wait times with scheduled or direct-dial consultations</span>
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
                  href="https://chat.whatsapp.com/C73ZsPudjxaAYzA20f3yJm?s=sh&p=a&ilr=4"
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
                  <p>Curated clinical insights, wellness guidance, and preventative tips compiled by our medical board.</p>
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
                  <p>Consult MDCN-licensed general doctors and specialized consultants via secure video or voice links.</p>
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

            {/* How It Works - Steps Section */}
            <div className="how-it-works-section">
              <div className="section-header">
                <h2>Your Pathway to Wellness</h2>
                <p>Navigate from initial consultation to diagnostics and prescription delivery in hours, not days.</p>
              </div>
              <div className="steps-grid">
                <div className="step-card glassmorphic">
                  <div className="step-icon"><i className="fa-solid fa-heart-pulse"></i></div>
                  <span className="step-label">STEP 1</span>
                  <h3>Set Up Your Health Record</h3>
                  <p>Register securely and build a comprehensive medical profile for seamless doctor handovers.</p>
                </div>
                <div className="step-card glassmorphic">
                  <div className="step-icon"><i className="fa-solid fa-stethoscope"></i></div>
                  <span className="step-label">STEP 2</span>
                  <h3>Schedule with a Specialist</h3>
                  <p>Match with accredited clinicians based on therapeutic specialty, availability, or location.</p>
                </div>
                <div className="step-card glassmorphic">
                  <div className="step-icon"><i className="fa-solid fa-video"></i></div>
                  <span className="step-label">STEP 3</span>
                  <h3>Receive Integrated Care</h3>
                  <p>Connect securely online, get detailed care plans, digital prescriptions, and logistics tracking.</p>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section">
              <div className="section-header">
                <h2>What our patients say</h2>
                <p>Real stories from Nigerians who trust SimmyCare.</p>
              </div>
              <div className="testimonials-grid">
                <div className="testimonial-card glassmorphic">
                  <div className="testimonial-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-quote">"I consulted a doctor from my home in Kaduna. Got my prescription and medicines delivered same day. Incredible."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #182B49, #2C5D88)' }}>HA</div>
                    <div className="testimonial-author-info">
                      <strong>Halima Abubakar</strong>
                      <span><i className="fa-solid fa-location-dot"></i> Kaduna</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card glassmorphic">
                  <div className="testimonial-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-quote">"As a busy mum, the online consultations save me hours. The doctors are wonderful with my kids."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #2C5D88, #E2ECF5)' }}>AM</div>
                    <div className="testimonial-author-info">
                      <strong>Amina Musa</strong>
                      <span><i className="fa-solid fa-location-dot"></i> Abuja</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card glassmorphic">
                  <div className="testimonial-stars">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-quote">"Living far from specialist hospitals, SimmyCare changed everything. My follow-ups happen from home."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, #1F4A6F, #182B49)' }}>YI</div>
                    <div className="testimonial-author-info">
                      <strong>Yusuf Ibrahim</strong>
                      <span><i className="fa-solid fa-location-dot"></i> Kano</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="cta-banner">
              <h2>Take Control of Your Health Journey</h2>
              <p>Join over 12,000 Nigerians receiving modern, accessible, and certified digital clinical care.</p>
              <button className="btn btn-cta-outline" onClick={() => navigateTo('booking')}>
                Book Your Consultation <i className="fa-solid fa-arrow-right"></i>
              </button>
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
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              {doc.name}
                              {doc.verified !== false && (
                                <i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }} title="Verified Doctor"></i>
                              )}
                            </h3>
                            <div className="doctor-specialty">
                              <span style={{ fontWeight: '600' }}>{doc.level || 'Junior Doctor'}</span> • {getSpecialtyTitle(doc.specialty)}
                            </div>
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
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {doc.name}
                          {doc.verified !== false && (
                            <i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }} title="Verified Doctor"></i>
                          )}
                        </h3>
                        <div className="doctor-specialty">
                          <span style={{ fontWeight: '600' }}>{doc.level || 'Junior Doctor'}</span> • {getSpecialtyTitle(doc.specialty)}
                        </div>
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
            <div className="login-split-container">
              {/* Left Column: Brand & Stats */}
              <div className="login-left-pane">
                <div className="login-left-inner">
                  <div className="login-logo-row">
                    <div className="login-logo-box">
                      <img className="logo-img" src={logoSvg} alt="SimmyCare Logo" />
                    </div>
                    <span className="login-logo-text">SimmyCare</span>
                  </div>
                  <h1 className="login-left-title">Connecting Patients to World-Class Medical Expertise.</h1>
                  <p className="login-left-desc">
                    Schedule certified virtual consultations, order home lab tests, and track your pharmacy prescriptions directly to your door.
                  </p>

                  <div className="login-stats-row">
                    <div className="login-stat-col">
                      <h3>10k+</h3>
                      <p>Patients served</p>
                    </div>
                    <div className="login-stat-col">
                      <h3>10+</h3>
                      <p>Verified doctors</p>
                    </div>
                    <div className="login-stat-col">
                      <h3>6</h3>
                      <p>Pharmacy partners</p>
                    </div>
                  </div>

                  <div className="login-left-footer">
                    <p>&copy; 2026 SimmyCare. All rights reserved.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Login form */}
              <div className="login-right-pane">
                <div className="login-right-inner">
                  <div className="login-header">
                    <h2>{isPatientRegistering ? "Create Account" : "Welcome back"}</h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                      {isPatientRegistering ? `Create your ${registerRole} account` : "Sign in to access your secure dashboard"}
                    </p>
                  </div>

                  {loginError && <div className="error-message">{loginError}</div>}

                  {/* Unified Login Form */}
                  <form onSubmit={handleUnifiedLoginSubmit}>
                    {isPatientRegistering ? (
                      <>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label>Registration Role</label>
                          <div className="input-with-icon">
                            <i className="fa-solid fa-user-tag" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}></i>
                            <select
                              required
                              value={registerRole}
                              onChange={(e) => setRegisterRole(e.target.value)}
                              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(24, 43, 73, 0.12)', background: 'var(--color-bg)', fontSize: '0.88rem' }}
                            >
                              <option value="patient">Patient (Health Consumer)</option>
                              <option value="doctor">Medical Practitioner / Specialist</option>
                              <option value="pharmacist">Pharmacy Facility Partner</option>
                              <option value="lab">Diagnostic Lab Technician</option>
                              <option value="logistics">Courier & Drone Logistics Fleet</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label>Full Name</label>
                          <div className="input-with-icon">
                            <i className="fa-regular fa-user"></i>
                            <input
                              type="text"
                              required
                              placeholder=""
                              value={patientLoginForm.name}
                              onChange={(e) => setPatientLoginForm({ ...patientLoginForm, name: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Phone Number</label>
                          <div className="input-with-icon">
                            <i className="fa-solid fa-phone"></i>
                            <input
                              type="tel"
                              required
                              placeholder=""
                              value={patientLoginForm.phone}
                              onChange={(e) => setPatientLoginForm({ ...patientLoginForm, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Dynamic Role-specific details */}
                        {registerRole === 'doctor' && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }} className="animate-fade">
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Specialty</label>
                                <div className="input-with-icon">
                                  <i className="fa-solid fa-stethoscope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}></i>
                                  <select
                                    required
                                    value={patientLoginForm.specialty}
                                    onChange={(e) => setPatientLoginForm({ ...patientLoginForm, specialty: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(24, 43, 73, 0.12)', background: 'var(--color-bg)', fontSize: '0.88rem' }}
                                  >
                                    <option value="General Medicine">General Medicine</option>
                                    <option value="Gynaecology">Gynaecology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Public Health">Public Health</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>MDCN License Number</label>
                                <div className="input-with-icon">
                                  <i className="fa-solid fa-id-card"></i>
                                  <input
                                    type="text"
                                    required
                                    placeholder=""
                                    value={patientLoginForm.regNo}
                                    onChange={(e) => setPatientLoginForm({ ...patientLoginForm, regNo: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }} className="animate-fade">
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Professional Level / Role</label>
                                <div className="input-with-icon">
                                  <i className="fa-solid fa-award" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}></i>
                                  <select
                                    required
                                    value={patientLoginForm.level || 'Junior Doctor'}
                                    onChange={(e) => setPatientLoginForm({ ...patientLoginForm, level: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(24, 43, 73, 0.12)', background: 'var(--color-bg)', fontSize: '0.88rem' }}
                                  >
                                    <option value="Junior Doctor">Junior Doctor</option>
                                    <option value="General Practitioner">General Practitioner</option>
                                    <option value="Consultant">Consultant / Specialist</option>
                                    <option value="Senior Consultant">Senior Consultant / Specialist</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {registerRole === 'pharmacist' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }} className="animate-fade">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>Pharmacy Name</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-prescription-bottle-medical"></i>
                                <input
                                  type="text"
                                  required
                                  placeholder=""
                                  value={patientLoginForm.pharmacyName}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, pharmacyName: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>PCN License Number</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-id-card"></i>
                                <input
                                  type="text"
                                  required
                                  placeholder=""
                                  value={patientLoginForm.pharmacyLicense}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, pharmacyLicense: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {registerRole === 'lab' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }} className="animate-fade">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>Facility Name</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-house-medical"></i>
                                <input
                                  type="text"
                                  required
                                  placeholder=""
                                  value={patientLoginForm.facilityName}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, facilityName: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>MLSCN License Number</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-id-card"></i>
                                <input
                                  type="text"
                                  required
                                  placeholder=""
                                  value={patientLoginForm.labLicense}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, labLicense: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {registerRole === 'logistics' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }} className="animate-fade">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>Vehicle Type</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-motorcycle" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}></i>
                                <select
                                  required
                                  value={patientLoginForm.vehicleType}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, vehicleType: e.target.value })}
                                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(24, 43, 73, 0.12)', background: 'var(--color-bg)', fontSize: '0.88rem' }}
                                >
                                  <option value="Motorbike">Motorbike</option>
                                  <option value="Bicycle">Bicycle</option>
                                  <option value="Delivery Van">Delivery Van</option>
                                  <option value="Electric Scooter">Electric Scooter</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>Coverage Area</label>
                              <div className="input-with-icon">
                                <i className="fa-solid fa-map-location-dot"></i>
                                <input
                                  type="text"
                                  required
                                  placeholder=""
                                  value={patientLoginForm.dispatchArea}
                                  onChange={(e) => setPatientLoginForm({ ...patientLoginForm, dispatchArea: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Email address</label>
                            <div className="input-with-icon">
                              <i className="fa-regular fa-envelope"></i>
                              <input
                                type="email"
                                required
                                placeholder=""
                                value={patientLoginForm.email}
                                onChange={(e) => setPatientLoginForm({ ...patientLoginForm, email: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Password</label>
                            <div className="input-with-icon">
                              <i className="fa-solid fa-lock"></i>
                              <input
                                type={showPasswords.patient ? 'text' : 'password'}
                                required
                                placeholder=""
                                value={patientLoginForm.password}
                                onChange={(e) => setPatientLoginForm({ ...patientLoginForm, password: e.target.value })}
                              />
                              <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, patient: !p.patient }))} tabIndex={-1}>
                                <i className={`fa-solid ${showPasswords.patient ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Email address</label>
                          <div className="input-with-icon">
                            <i className="fa-regular fa-envelope"></i>
                            <input
                              type="email"
                              required
                              placeholder=""
                              value={patientLoginForm.email}
                              onChange={(e) => setPatientLoginForm({ ...patientLoginForm, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Password</label>
                          <div className="input-with-icon">
                            <i className="fa-solid fa-lock"></i>
                            <input
                              type={showPasswords.patient ? 'text' : 'password'}
                              required
                              placeholder=""
                              value={patientLoginForm.password}
                              onChange={(e) => setPatientLoginForm({ ...patientLoginForm, password: e.target.value })}
                            />
                            <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, patient: !p.patient }))} tabIndex={-1}>
                              <i className={`fa-solid ${showPasswords.patient ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {isPatientRegistering && (
                      <div className="form-group consent-checkbox-group" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
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
                    )}

                    {!isPatientRegistering && (
                      <div className="form-actions-row">
                        <label className="remember-me">
                          <input type="checkbox" /> Remember me
                        </label>
                        <a href="#forgot" className="forgot-password" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                      </div>
                    )}

                    {isPatientRegistering && (
                      <div className="demo-credentials-box" style={{
                        background: 'rgba(24, 43, 73, 0.04)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(24, 43, 73, 0.08)',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '1.25rem',
                        marginBottom: '1.25rem',
                        lineHeight: '1.4'
                      }}>
                        <span>*All fields are required to establish your medical file.</span>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block">
                      {isPatientRegistering ? "Sign Up" : "Sign In"}
                    </button>

                    <div className="signup-toggle">
                      {isPatientRegistering ? (
                        <span>
                          Already have an account?{' '}
                          <button
                            type="button"
                            className="toggle-link-btn"
                            onClick={() => { setIsPatientRegistering(false); setLoginError(''); }}
                          >
                            Sign In
                          </button>
                        </span>
                      ) : (
                        <span>
                          Don't have an account?{' '}
                          <button
                            type="button"
                            className="toggle-link-btn"
                            onClick={() => { setIsPatientRegistering(true); setLoginError(''); }}
                          >
                            Create one
                          </button>
                        </span>
                      )}
                    </div>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <a href="#home" className="back-home-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>← Back to Homepage</a>
                  </div>
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
                    <p>CLINICAL CONSULTATIONS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{myPatientPharmacyOrders.length}</h3>
                    <p>PHARMACY DELIVERIES</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>{myPatientLabRequests.length}</h3>
                    <p>LAB SAMPLE TRIPS</p>
                  </div>
                </div>

                <div className="dashboard-layout">
                  {/* Sidebar Navigation */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button
                      className={`sidebar-nav-btn ${patientNavView === 'bookings' ? 'active' : ''}`}
                      onClick={() => setPatientNavView('bookings')}
                    >
                      <i className="fa-solid fa-calendar-check"></i> Consultation Bookings
                    </button>
                    <button
                      className={`sidebar-nav-btn ${patientNavView === 'orders' ? 'active' : ''}`}
                      onClick={() => {
                        setPatientNavView('orders');
                        setSelectedPharmacyOrder(null);
                        setActiveTrackingId(null);
                      }}
                    >
                      <i className="fa-solid fa-prescription-bottle-medical"></i> Pharmacy Deliveries
                    </button>
                    <button
                      className={`sidebar-nav-btn ${patientNavView === 'labs' ? 'active' : ''}`}
                      onClick={() => {
                        setPatientNavView('labs');
                        setSelectedLabRequest(null);
                        setActiveTrackingId(null);
                      }}
                    >
                      <i className="fa-solid fa-vial"></i> Lab Collection Trips
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

                    <style>{`
                      @keyframes pulse {
                        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                      }
                      @keyframes ping {
                        0% { transform: scale(1); opacity: 1; }
                        70% { transform: scale(1.6); opacity: 0; }
                        100% { transform: scale(1.6); opacity: 0; }
                      }
                      .stage-dot.active {
                        background-color: var(--color-accent) !important;
                        border-color: var(--color-accent) !important;
                        color: #fff !important;
                      }
                      .stage-text.active {
                        color: var(--color-text) !important;
                        font-weight: 600;
                      }
                    `}</style>

                    {patientNavView === 'orders' && (
                      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.2fr 1.8fr', padding: 0, gap: '1.5rem', background: 'none', border: 'none', boxShadow: 'none' }}>
                        {/* Left Column: My Orders List */}
                        <div className="dashboard-workspace glassmorphic" style={{ margin: 0 }}>
                          <h3>My Pharmacy Deliveries</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                            Track your prescription orders and delivery statuses.
                          </p>
                          {myPatientPharmacyOrders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {myPatientPharmacyOrders.map(order => {
                                const { items, total } = parseOrderMessage(order.message);
                                const isSelected = selectedPharmacyOrder && selectedPharmacyOrder.id === order.id;
                                return (
                                  <div
                                    key={order.id}
                                    onClick={() => {
                                      setSelectedPharmacyOrder(order);
                                      if (order.status === 'Out for Delivery') {
                                        setActiveTrackingId(order.id);
                                      } else {
                                        setActiveTrackingId(null);
                                      }
                                    }}
                                    style={{
                                      padding: '1rem',
                                      borderRadius: '8px',
                                      border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                      background: isSelected ? 'rgba(51, 102, 255, 0.04)' : 'rgba(255, 255, 255, 0.4)',
                                      cursor: 'pointer',
                                      transition: 'all var(--transition-fast)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.9rem' }}>{order.id}</span>
                                      <span style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        backgroundColor: order.status === 'Delivered' ? 'rgba(34, 197, 94, 0.15)' : order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                                        color: order.status === 'Delivered' ? '#166534' : order.status === 'Out for Delivery' ? '#1d4ed8' : '#854d0e'
                                      }}>
                                        {order.status || 'Pending Review'}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {items}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.8rem' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>{order.date}</span>
                                      <strong style={{ color: 'var(--color-accent-hover)' }}>{total}</strong>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                              <p>No pharmacy purchase orders found.</p>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Order Details & Live Tracking Map */}
                        <div className="dashboard-workspace glassmorphic" style={{ margin: 0 }}>
                          {selectedPharmacyOrder ? (() => {
                            const { items, address, notes, total } = parseOrderMessage(selectedPharmacyOrder.message);
                            const status = selectedPharmacyOrder.status || 'Pending Review';

                            // Determine stage indices
                            const stages = ['Pending Review', 'Processing & Packaging', 'Awaiting Dispatch', 'Out for Delivery', 'Delivered'];
                            const currentStageIndex = stages.indexOf(status) !== -1 ? stages.indexOf(status) : 0;

                            return (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                                  <h4 style={{ margin: 0 }}>Order Tracking: {selectedPharmacyOrder.id}</h4>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Ordered on {selectedPharmacyOrder.date}</span>
                                </div>

                                {/* Capsule-style Delivery Progress Timeline */}
                                <div style={{ marginBottom: '2rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                                    {/* Connecting Line */}
                                    <div style={{ position: 'absolute', top: '15px', left: '5%', right: '5%', height: '3px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                                    <div style={{ position: 'absolute', top: '15px', left: '5%', width: `${(currentStageIndex / 4) * 90}%`, height: '3px', backgroundColor: 'var(--color-accent)', zIndex: 2, transition: 'all 0.5s ease' }}></div>

                                    {/* Timeline Nodes */}
                                    {[
                                      { label: 'Ordered', icon: 'fa-file-medical' },
                                      { label: 'Preparing', icon: 'fa-box-open' },
                                      { label: 'Ready', icon: 'fa-boxes-packing' },
                                      { label: 'In Transit', icon: 'fa-truck-ramp-box' },
                                      { label: 'Delivered', icon: 'fa-house-circle-check' }
                                    ].map((stage, idx) => {
                                      const isActive = idx <= currentStageIndex;
                                      return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '18%' }}>
                                          <div
                                            style={{
                                              width: '32px',
                                              height: '32px',
                                              borderRadius: '50%',
                                              backgroundColor: isActive ? 'var(--color-accent)' : '#f1f5f9',
                                              border: `2px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                              color: isActive ? '#fff' : 'var(--color-text-muted)',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: '0.85rem',
                                              transition: 'all 0.3s ease',
                                              justifyContent: 'center'
                                            }}
                                            className={isActive ? 'stage-dot active' : 'stage-dot'}
                                          >
                                            <i className={`fa-solid ${stage.icon}`}></i>
                                          </div>
                                          <span
                                            style={{
                                              fontSize: '0.72rem',
                                              color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                                              fontWeight: isActive ? 'bold' : 'normal',
                                              textAlign: 'center',
                                              marginTop: '0.4rem',
                                              whiteSpace: 'nowrap'
                                            }}
                                            className={isActive ? 'stage-text active' : 'stage-text'}
                                          >
                                            {stage.label}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Prescribed Medicines</strong>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block', lineHeight: '1.4' }}>{items}</span>
                                  </div>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Shipping Address</strong>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>{address}</span>
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Doctor Rx Notes</strong>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{notes || 'None'}</span>
                                  </div>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Total Cost Paid</strong>
                                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-success)', display: 'block' }}>{total}</strong>
                                  </div>
                                </div>

                                {/* Logistics Live Tracking Map for In Transit */}
                                {status === 'Out for Delivery' && (
                                  <div>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                                      Live Courier Tracking (Capsule Integration)
                                    </strong>

                                    <div className="tracking-map-container" style={{ background: '#0b1329', borderRadius: '12px', padding: '1rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                                      <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(15, 23, 42, 0.85)', color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 5, display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                                        LIVE GPS ROUTE
                                      </div>
                                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--color-accent)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 5 }}>
                                        ETA: {Math.max(1, Math.round(15 * (1 - simulatedProgress / 100)))} MINS
                                      </div>

                                      <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto', background: '#070d1e', borderRadius: '8px' }}>
                                        {/* Roads Map Background Grid */}
                                        <path d="M 0,100 L 400,100 M 100,0 L 100,200 M 300,0 L 300,200 M 0,50 L 400,50 M 0,150 L 400,150" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
                                        <path d="M 200,0 L 200,200" stroke="rgba(255,255,255,0.04)" strokeWidth="9" fill="none" />

                                        {/* Route path */}
                                        <path id="delivery-route" d="M 100,100 Q 200,40 200,160 T 300,100" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6,4" fill="none" />

                                        {/* Start Hub Pin */}
                                        <circle cx="100" cy="100" r="7" fill="#10b981" />
                                        <circle cx="100" cy="100" r="13" fill="#10b981" fillOpacity="0.15" />
                                        <text x="85" y="85" fill="#10b981" fontSize="8" fontWeight="bold">SimmyCare Hub</text>

                                        {/* Destination Pin */}
                                        <circle cx="300" cy="100" r="7" fill="#ef4444" />
                                        <circle cx="300" cy="100" r="13" fill="#ef4444" fillOpacity="0.15" />
                                        <text x="270" y="85" fill="#ef4444" fontSize="8" fontWeight="bold">Your Home</text>

                                        {/* Moving Courier */}
                                        {(() => {
                                          const t = simulatedProgress / 100;
                                          let courierX = 100;
                                          let courierY = 100;
                                          if (t < 0.5) {
                                            const tSeg = t / 0.5;
                                            courierX = 100 + (200 - 100) * tSeg;
                                            courierY = 100 + (160 - 100) * tSeg;
                                          } else {
                                            const tSeg = (t - 0.5) / 0.5;
                                            courierX = 200 + (300 - 200) * tSeg;
                                            courierY = 160 + (100 - 160) * tSeg;
                                          }
                                          return (
                                            <g transform={`translate(${courierX}, ${courierY})`}>
                                              <circle r="9" fill="var(--color-accent)" />
                                              <circle r="16" fill="var(--color-accent)" fillOpacity="0.3" style={{ animation: 'ping 1.5s infinite' }} />
                                              <text textAnchor="middle" y="3" fill="#fff" fontSize="9">🏍️</text>
                                            </g>
                                          );
                                        })()}
                                      </svg>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                          {(selectedPharmacyOrder.assignedRider || 'Rider').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                            {selectedPharmacyOrder.assignedRider || 'Default Courier'}
                                          </div>
                                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            SimmyCare Dispatcher • Motorbike
                                          </div>
                                        </div>
                                        <a href="tel:08012345678" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                          <i className="fa-solid fa-phone" style={{ fontSize: '0.8rem' }}></i>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {status === 'Delivered' && (
                                  <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.5rem' }}></i>
                                    <div>
                                      <strong style={{ color: '#166534', display: 'block', fontSize: '0.9rem' }}>Delivery Completed Successfully</strong>
                                      <span style={{ fontSize: '0.82rem', color: '#166534' }}>Your items were verified and delivered by {selectedPharmacyOrder.assignedRider || 'Default Courier'}.</span>
                                    </div>
                                  </div>
                                )}

                                {(status === 'Pending Review' || status === 'Processing & Packaging' || status === 'Awaiting Dispatch') && (
                                  <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <i className="fa-solid fa-clock" style={{ color: '#eab308', fontSize: '1.5rem' }}></i>
                                    <div>
                                      <strong style={{ color: '#854d0e', display: 'block', fontSize: '0.9rem' }}>Order Preparation in Progress</strong>
                                      <span style={{ fontSize: '0.82rem', color: '#854d0e' }}>
                                        {status === 'Pending Review' && "Awaiting clinical review from our pharmacologists."}
                                        {status === 'Processing & Packaging' && "We are packaging your drugs inside the sterile clean-room."}
                                        {status === 'Awaiting Dispatch' && "Package sealed. Awaiting courier rider dispatch."}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })() : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--color-text-muted)' }}>
                              <i className="fa-solid fa-truck-drop-off" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.3' }}></i>
                              <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>Select an order from the directory list to track its preparation and courier route in real-time.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {patientNavView === 'labs' && (
                      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.2fr 1.8fr', padding: 0, gap: '1.5rem', background: 'none', border: 'none', boxShadow: 'none' }}>
                        {/* Left Column: My Lab Collections */}
                        <div className="dashboard-workspace glassmorphic" style={{ margin: 0 }}>
                          <h3>Home Lab Collections</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                            View and download results from mobile diagnostics sample collections.
                          </p>
                          {myPatientLabRequests.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {myPatientLabRequests.map(req => {
                                const { tests } = parseLabRequest(req.symptoms);
                                const isSelected = selectedLabRequest && selectedLabRequest.id === req.id;
                                return (
                                  <div
                                    key={req.id}
                                    onClick={() => {
                                      setSelectedLabRequest(req);
                                      if (req.status === 'Sample Collected') {
                                        setActiveTrackingId(req.id);
                                      } else {
                                        setActiveTrackingId(null);
                                      }
                                    }}
                                    style={{
                                      padding: '1rem',
                                      borderRadius: '8px',
                                      border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                      background: isSelected ? 'rgba(51, 102, 255, 0.04)' : 'rgba(255, 255, 255, 0.4)',
                                      cursor: 'pointer',
                                      transition: 'all var(--transition-fast)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.9rem' }}>{req.id}</span>
                                      <span style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        backgroundColor: req.status === 'Completed' || req.status === 'Approved' ? 'rgba(34, 197, 94, 0.15)' : req.status === 'Sample Collected' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                                        color: req.status === 'Completed' || req.status === 'Approved' ? '#166534' : req.status === 'Sample Collected' ? '#1d4ed8' : '#854d0e'
                                      }}>
                                        {req.status === 'Completed' || req.status === 'Approved' ? 'Results Ready' : req.status === 'Sample Collected' ? 'Sample Transit' : 'Pending Collection'}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {tests}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.8rem' }}>
                                      <span style={{ color: 'var(--color-text-muted)' }}>{req.date}</span>
                                      <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Lab Dispatch</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                              <p>No mobile lab requests found.</p>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Lab Tracking / Diagnostic Report */}
                        <div className="dashboard-workspace glassmorphic" style={{ margin: 0 }}>
                          {selectedLabRequest ? (() => {
                            const { tests, address } = parseLabRequest(selectedLabRequest.symptoms);
                            const status = selectedLabRequest.status || 'Pending';
                            const isDone = status === 'Completed' || status === 'Approved';
                            const currentStageIndex = status === 'Completed' || status === 'Approved' ? 2 : status === 'Sample Collected' ? 1 : 0;

                            return (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                                  <h4 style={{ margin: 0 }}>Diagnostic Request: {selectedLabRequest.id}</h4>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Booked for {selectedLabRequest.date}</span>
                                </div>

                                {/* Quest Diagnostics-style Progress Timeline */}
                                <div style={{ marginBottom: '2rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                                    <div style={{ position: 'absolute', top: '15px', left: '15%', right: '15%', height: '3px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
                                    <div style={{ position: 'absolute', top: '15px', left: '15%', width: `${(currentStageIndex / 2) * 70}%`, height: '3px', backgroundColor: 'var(--color-accent)', zIndex: 2, transition: 'all 0.5s ease' }}></div>

                                    {[
                                      { label: 'Collection Scheduled', icon: 'fa-calendar-day' },
                                      { label: 'Sample in Transit', icon: 'fa-vial-circle-check' },
                                      { label: 'Results Ready', icon: 'fa-file-shield' }
                                    ].map((stage, idx) => {
                                      const isActive = idx <= currentStageIndex;
                                      return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '30%' }}>
                                          <div
                                            style={{
                                              width: '32px',
                                              height: '32px',
                                              borderRadius: '50%',
                                              backgroundColor: isActive ? 'var(--color-accent)' : '#f1f5f9',
                                              border: `2px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                              color: isActive ? '#fff' : 'var(--color-text-muted)',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: '0.85rem',
                                              transition: 'all 0.3s ease'
                                            }}
                                            className={isActive ? 'stage-dot active' : 'stage-dot'}
                                          >
                                            <i className={`fa-solid ${stage.icon}`}></i>
                                          </div>
                                          <span
                                            style={{
                                              fontSize: '0.72rem',
                                              color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                                              fontWeight: isActive ? 'bold' : 'normal',
                                              textAlign: 'center',
                                              marginTop: '0.4rem',
                                              whiteSpace: 'nowrap'
                                            }}
                                            className={isActive ? 'stage-text active' : 'stage-text'}
                                          >
                                            {stage.label}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Requested Diagnostics</strong>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block', fontWeight: 'bold' }}>{tests}</span>
                                  </div>
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Collection Address</strong>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{address}</span>
                                  </div>
                                </div>

                                {/* Live Diagnostic Report Preview Card */}
                                {isDone ? (
                                  <div className="diagnostic-report-card" style={{ border: '2px solid var(--color-indigo)', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 12px rgba(24, 43, 73, 0.08)', color: '#1e293b' }}>
                                    <div style={{ background: 'var(--color-indigo)', color: '#fff', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>SimmyCare Labs</span>
                                        <span style={{ fontSize: '0.65rem', opacity: '0.8' }}>MLSCN Licensed Facility #3821</span>
                                      </div>
                                      <span style={{ fontSize: '0.75rem', fontWeight: '600', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>OFFICIAL RECORD</span>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                                        <div><strong>Patient:</strong> {selectedLabRequest.patientName}</div>
                                        <div><strong>Collected Date:</strong> {selectedLabRequest.date}</div>
                                        <div><strong>Physician:</strong> SimmyCare Practitioner</div>
                                        <div><strong>Report ID:</strong> RPT-{selectedLabRequest.id}</div>
                                      </div>

                                      <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.5rem' }}>Analyte Findings</strong>

                                      <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                          <tr style={{ borderBottom: '1px solid #cbd5e1', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                                            <th style={{ padding: '0.25rem 0' }}>TEST NAME</th>
                                            <th style={{ padding: '0.25rem 0' }}>FINDING</th>
                                            <th style={{ padding: '0.25rem 0' }}>REFERENCE RANGE</th>
                                            <th style={{ padding: '0.25rem 0', textAlign: 'right' }}>STATUS</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {tests.toLowerCase().includes('malaria') && (
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                              <td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Malaria Antigen (Pf/Pv)</td>
                                              <td style={{ padding: '0.4rem 0', color: '#d97706', fontWeight: 'bold' }}>Positive (1+)</td>
                                              <td style={{ padding: '0.4rem 0' }}>Negative</td>
                                              <td style={{ padding: '0.4rem 0', textAlign: 'right', color: '#d97706', fontWeight: 'bold' }}>ABNORMAL</td>
                                            </tr>
                                          )}
                                          {tests.toLowerCase().includes('sugar') || tests.toLowerCase().includes('glucose') ? (
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                              <td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Fasting Blood Glucose</td>
                                              <td style={{ padding: '0.4rem 0', color: '#16a34a', fontWeight: 'bold' }}>94 mg/dL</td>
                                              <td style={{ padding: '0.4rem 0' }}>70 - 100 mg/dL</td>
                                              <td style={{ padding: '0.4rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>NORMAL</td>
                                            </tr>
                                          ) : null}
                                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Full Blood Count (WBC)</td>
                                            <td style={{ padding: '0.4rem 0', color: '#16a34a' }}>6.2 x10^9/L</td>
                                            <td style={{ padding: '0.4rem 0' }}>4.0 - 11.0 x10^9/L</td>
                                            <td style={{ padding: '0.4rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>NORMAL</td>
                                          </tr>
                                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.4rem 0', fontWeight: 'bold' }}>Hemoglobin (Hb)</td>
                                            <td style={{ padding: '0.4rem 0', color: '#16a34a' }}>14.1 g/dL</td>
                                            <td style={{ padding: '0.4rem 0' }}>12.0 - 16.0 g/dL</td>
                                            <td style={{ padding: '0.4rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>NORMAL</td>
                                          </tr>
                                        </tbody>
                                      </table>

                                      {(selectedLabRequest.notes || selectedLabRequest.prescription) && (
                                        <div style={{ marginTop: '0.75rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', borderLeft: '3px solid var(--color-indigo)' }}>
                                          <strong>Lab Comments:</strong> {selectedLabRequest.prescription || selectedLabRequest.notes}
                                        </div>
                                      )}

                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.75rem', fontSize: '0.7rem' }}>
                                        <div>
                                          <strong>Verified By:</strong> MLS Wasila Goranduma <br />
                                          <span style={{ color: 'var(--color-text-muted)' }}>Chief Medical Laboratory Scientist</span>
                                        </div>
                                        <button
                                          className="btn btn-primary btn-sm"
                                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                          onClick={() => alert("Report downloaded successfully to medical records file folder!")}
                                        >
                                          <i className="fa-solid fa-download"></i> Download PDF Report
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                                      Logistics Courier & Trip Progress (Zipline Integration)
                                    </strong>

                                    <div className="tracking-map-container" style={{ background: '#0b1329', borderRadius: '12px', padding: '1rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                                      <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(15, 23, 42, 0.85)', color: '#eab308', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 5, display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                                        {status === 'Sample Collected' ? 'RETURNING SAMPLES' : 'TECHNICIAN EN ROUTE'}
                                      </div>
                                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--color-accent)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 5 }}>
                                        ETA: {Math.max(1, Math.round(15 * (1 - simulatedProgress / 100)))} MINS
                                      </div>

                                      <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto', background: '#070d1e', borderRadius: '8px' }}>
                                        <path d="M 0,100 L 400,100 M 100,0 L 100,200 M 300,0 L 300,200 M 0,50 L 400,50 M 0,150 L 400,150" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
                                        <path d="M 200,0 L 200,200" stroke="rgba(255,255,255,0.04)" strokeWidth="9" fill="none" />

                                        {/* Route path */}
                                        <path id="lab-route" d="M 300,100 Q 200,150 200,50 T 100,100" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,4" fill="none" />

                                        {/* Diagnostic Hub Pin */}
                                        <circle cx="100" cy="100" r="7" fill="#10b981" />
                                        <circle cx="100" cy="100" r="13" fill="#10b981" fillOpacity="0.15" />
                                        <text x="85" y="85" fill="#10b981" fontSize="8" fontWeight="bold">Simmy Diagnostics Hub</text>

                                        {/* Patient address Pin */}
                                        <circle cx="300" cy="100" r="7" fill="#ef4444" />
                                        <circle cx="300" cy="100" r="13" fill="#ef4444" fillOpacity="0.15" />
                                        <text x="270" y="85" fill="#ef4444" fontSize="8" fontWeight="bold">Your Home</text>

                                        {/* Moving Courier */}
                                        {(() => {
                                          const t = status === 'Sample Collected' ? (simulatedProgress / 100) : (1 - simulatedProgress / 100);
                                          let courierX = 300;
                                          let courierY = 100;
                                          if (t < 0.5) {
                                            const tSeg = t / 0.5;
                                            courierX = 300 - (300 - 200) * tSeg;
                                            courierY = 100 - (100 - 150) * tSeg;
                                          } else {
                                            const tSeg = (t - 0.5) / 0.5;
                                            courierX = 200 - (200 - 100) * tSeg;
                                            courierY = 150 - (150 - 50) * tSeg;
                                          }
                                          return (
                                            <g transform={`translate(${courierX}, ${courierY})`}>
                                              <circle r="9" fill="#f59e0b" />
                                              <circle r="16" fill="#f59e0b" fillOpacity="0.3" style={{ animation: 'ping 1.5s infinite' }} />
                                              <text textAnchor="middle" y="3" fill="#fff" fontSize="9">🚁</text>
                                            </g>
                                          );
                                        })()}
                                      </svg>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                          {(selectedLabRequest.assignedRider || 'Rider').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                            {selectedLabRequest.assignedRider || 'Default Courier'}
                                          </div>
                                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            Simmy Diagnostics Specialist • Mobile Lab Unit
                                          </div>
                                        </div>
                                        <a href="tel:08012345678" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                          <i className="fa-solid fa-phone" style={{ fontSize: '0.8rem' }}></i>
                                        </a>
                                      </div>
                                    </div>

                                    <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                      <i className="fa-solid fa-truck" style={{ color: '#d97706', fontSize: '1.5rem' }}></i>
                                      <div>
                                        <strong style={{ color: '#b45309', display: 'block', fontSize: '0.9rem' }}>
                                          {status === 'Sample Collected' ? "Sample Collection Complete" : "Technician Dispatched"}
                                        </strong>
                                        <span style={{ fontSize: '0.82rem', color: '#b45309' }}>
                                          {status === 'Sample Collected' ? "The technician is safely returning your diagnostic samples to the central lab for pathology check." : "The technician is carrying a temperature-regulated sterile cold-chain collection kit."}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })() : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--color-text-muted)' }}>
                              <i className="fa-solid fa-vial" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.3' }}></i>
                              <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>Select a laboratory request from the directory list to track technician dispatch and view verified clinical diagnostic results.</p>
                            </div>
                          )}
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
                          services: loggedInDoctor.services || [],
                          level: loggedInDoctor.level || 'Junior Doctor',
                          verified: loggedInDoctor.verified || false
                        });
                        setIsEditingDocSelf(false);
                      }}
                    >
                      <i className="fa-solid fa-user-doctor"></i> My Profile Settings
                    </button>

                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Availability Status</label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: (loggedInDoctor.active !== false && loggedInDoctor.verified !== false) ? '#10B981' : '#9CA3AF', display: 'inline-block' }}></span>
                          <strong>{(loggedInDoctor.active !== false && loggedInDoctor.verified !== false) ? 'Available' : 'Unavailable'}</strong>
                        </span>
                        <button
                          className={`btn ${(loggedInDoctor.active !== false && loggedInDoctor.verified !== false) ? 'btn-danger' : 'btn-success'} btn-xs`}
                          onClick={() => {
                            if (loggedInDoctor.verified === false) {
                              alert("⚠️ Your profile is currently unverified. You cannot set your status to Available until an administrator verifies your MDCN registration code.");
                              return;
                            }
                            const newActiveState = loggedInDoctor.active === false ? true : false;
                            const updatedDoc = { ...loggedInDoctor, active: newActiveState };
                            setDoctors(doctors.map(d => d.id === loggedInDoctor.id ? updatedDoc : d));
                            setLoggedInDoctor(updatedDoc);
                          }}
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          {(loggedInDoctor.active !== false && loggedInDoctor.verified !== false) ? 'Go Offline' : 'Go Online'}
                        </button>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: '1.3' }}>
                        {(loggedInDoctor.active !== false && loggedInDoctor.verified !== false) ? 'You are visible and receiving consultations.' : 'Appointments will auto-route to other available specialists.'}
                      </p>
                    </div>
                  </div>

                  {/* Console Workspace */}
                  <div className="dashboard-workspace glassmorphic">
                    {loggedInDoctor.verified === false && (
                      <div className="alert-message warning-alert glassmorphic animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.75rem', color: '#EF4444' }}>
                          <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                          <h4 style={{ margin: 0, color: '#EF4444', fontSize: '0.95rem', fontWeight: '700' }}>Account Verification Pending</h4>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                            Your MDCN registration credentials and license are currently being audited by our administration team. You will not receive patient bookings or appear in the public directory until verification is complete.
                          </p>
                        </div>
                      </div>
                    )}

                    {loggedInDoctor.verified !== false && loggedInDoctor.active === false && (
                      <div className="alert-message warning-alert glassmorphic animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.5rem', color: '#F59E0B' }}>
                          <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div>
                          <h4 style={{ margin: 0, color: '#F59E0B', fontSize: '0.9rem', fontWeight: '700' }}>You Are Offline</h4>
                          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                            You have set your availability status to Offline. Incoming patients for your specialty will be automatically routed to other available specialists. Click "Go Online" in the sidebar to resume consultations.
                          </p>
                        </div>
                      </div>
                    )}

                    {doctorNavView === 'backlog' && (
                      <div>
                        <h3>My Consultation Backlog ({myDoctorAppointments.length})</h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'start' }}>
                          {/* Left Column: Appointments */}
                          <div style={{ flex: '1 1 650px', minWidth: 0 }}>
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
                                          <td>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{apt.date}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({apt.time})</div>
                                          </td>
                                          <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={apt.symptoms || "None provided"}>
                                            {apt.symptoms || <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>None provided</span>}
                                          </td>
                                          <td>
                                            <span className={`status-badge status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                              {apt.status}
                                            </span>
                                          </td>
                                          <td style={{ maxWidth: '200px' }}>
                                            {apt.notes || apt.prescription ? (
                                              <div style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                                                {apt.notes && <div><strong>Notes:</strong> {apt.notes.substring(0, 45)}{apt.notes.length > 45 ? '...' : ''}</div>}
                                                {apt.prescription && <div><strong>Rx:</strong> {apt.prescription.substring(0, 45)}{apt.prescription.length > 45 ? '...' : ''}</div>}
                                              </div>
                                            ) : (
                                              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Pending medical note. Fill form below...</span>
                                            )}
                                          </td>
                                          <td>
                                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                                              <button
                                                className="action-btn"
                                                style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                onClick={() => setAdminSelectedApt(apt)}
                                                title="View / Edit Medical Record"
                                              >
                                                <i className="fa-solid fa-eye"></i> View
                                              </button>

                                              <button
                                                style={{ background: 'transparent', color: 'var(--color-text)', border: '1px solid rgba(0,0,0,0.15)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                onClick={() => startEditApt(apt)}
                                                title="Reschedule Appointment"
                                              >
                                                <i className="fa-solid fa-pen-to-square"></i> Reschedule
                                              </button>

                                              {apt.status === 'Approved' && (
                                                <button
                                                  style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
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
                                              <div className="doctor-note-editor-card glassmorphic" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', borderLeft: '4px solid var(--color-primary)', padding: '1rem', borderRadius: '8px', background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.02)' }}>
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
                                                  <label style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                                    <i className="fa-solid fa-prescription"></i> Pharmacy Prescription & Drug Instructions
                                                  </label>
                                                  <textarea
                                                    rows={3}
                                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
                                                    placeholder="Write specific items/dosage (e.g. Paracetamol 500mg - 2x daily)..."
                                                    value={docNotesState[apt.id]?.prescription !== undefined ? docNotesState[apt.id].prescription : (apt.prescription || '')}
                                                    onChange={(e) => handleDocNoteChange(apt.id, 'prescription', e.target.value)}
                                                  />
                                                </div>

                                                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'rgba(28,43,73,0.02)', padding: '0.75rem', borderRadius: '6px' }}>
                                                  <div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                                      <i className="fa-solid fa-vials"></i> Prescribe Laboratory Diagnostics
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
                                                      <i className="fa-solid fa-x-ray"></i> Prescribe Imaging Scans
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

                                                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                    <i className="fa-solid fa-circle-info"></i> Submit compiles notes into the official portal record.
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

                          {/* Right Column: Staff Availability */}
                          <div style={{ flex: '1 1 320px', minWidth: '300px' }}>
                            <div className="glassmorphic" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--color-accent)' }}>
                                <i className="fa-solid fa-signal"></i> Staff Availability Tracker
                              </h4>
                              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                Verify pharmacist, laboratory, and rider availability before routing tasks.
                              </p>

                              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}></i>
                                <input
                                  type="text"
                                  placeholder="Search staff, role, status..."
                                  value={availabilitySearchQuery}
                                  onChange={(e) => setAvailabilitySearchQuery(e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.4rem 0.75rem 0.4rem 2rem',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    outline: 'none'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                {(() => {
                                  const query = availabilitySearchQuery.toLowerCase();
                                  const staffList = [
                                    { name: 'Pharmacy Dispense Hub', role: 'Pharmacist', available: isPharmacistAvailable, icon: 'fa-prescription-bottle-medical', email: 'pharmacist@simmycare.com' },
                                    { name: 'Mobile Lab Collection Unit', role: 'Lab Tech', available: isLabTechAvailable, icon: 'fa-vials', email: 'lab@simmycare.com' },
                                    { name: 'Abuja Delivery Hub', role: 'Courier / Rider', available: isLogisticsAvailable, icon: 'fa-motorcycle', email: 'logistics@simmycare.com' },
                                    ...doctors.map(d => ({
                                      name: d.name.startsWith("Dr. ") ? d.name : `Dr. ${d.name}`,
                                      role: d.specialty,
                                      available: d.active !== false,
                                      icon: 'fa-user-doctor',
                                      email: d.email,
                                      phone: d.phone
                                    }))
                                  ];

                                  const filtered = staffList.filter(s =>
                                    s.name.toLowerCase().includes(query) ||
                                    s.role.toLowerCase().includes(query) ||
                                    (s.available ? 'online available' : 'offline unavailable').includes(query)
                                  );

                                  if (filtered.length === 0) {
                                    return <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>No matching staff found</div>;
                                  }

                                  return filtered.map((staff, idx) => (
                                    <div key={idx} style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '0.6rem 0.75rem',
                                      background: 'rgba(255,255,255,0.02)',
                                      borderRadius: '8px',
                                      border: '1px solid rgba(255,255,255,0.04)',
                                      gap: '0.5rem'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                                        <div style={{
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '50%',
                                          background: 'rgba(28, 43, 73, 0.2)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--color-accent)',
                                          flexShrink: 0
                                        }}>
                                          <i className={`fa-solid ${staff.icon}`} style={{ fontSize: '0.85rem' }}></i>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                                            {staff.name}
                                          </div>
                                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.05rem' }}>
                                            <span>{staff.role}</span>
                                            {staff.email && (
                                              <a href={`mailto:${staff.email}`} title={`Email: ${staff.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                <i className="fa-solid fa-envelope" style={{ fontSize: '0.75rem' }}></i>
                                              </a>
                                            )}
                                            {staff.phone && (
                                              <a href={`tel:${staff.phone}`} title={`Call: ${staff.phone}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                <i className="fa-solid fa-phone" style={{ fontSize: '0.75rem' }}></i>
                                              </a>
                                            )}
                                            {staff.phone && (
                                              <a
                                                href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Chat on WhatsApp"
                                                style={{ color: '#10B981', textDecoration: 'none' }}
                                              >
                                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '0.8rem' }}></i>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        background: staff.available ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                        border: `1px solid ${staff.available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        flexShrink: 0
                                      }}>
                                        <span style={{
                                          width: '5px',
                                          height: '5px',
                                          borderRadius: '50%',
                                          background: staff.available ? '#10b981' : '#ef4444',
                                          boxShadow: staff.available ? '0 0 6px #10b981' : 'none'
                                        }}></span>
                                        <span style={{
                                          fontSize: '0.7rem',
                                          fontWeight: 'bold',
                                          color: staff.available ? '#10b981' : '#ef4444',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px'
                                        }}>
                                          {staff.available ? 'Online' : 'Offline'}
                                        </span>
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
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
                              <div className="form-group">
                                <label>Professional Level (Admin Managed)</label>
                                <input
                                  type="text"
                                  disabled
                                  value={docSelfData.level || 'Junior Doctor'}
                                  style={{ background: 'rgba(28,43,73,0.08)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
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
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const compressed = await compressImageFile(file, 400, 0.7);
                                        if (compressed) {
                                          setDocSelfData({ ...docSelfData, image: compressed });
                                        }
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
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const compressed = await compressImageFile(file, 600, 0.75);
                                        if (compressed) {
                                          setDocSelfData({ ...docSelfData, license: compressed });
                                        }
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

            {/* PHARMACIST DASHBOARD */}
            {authRole === 'pharmacist' && loggedInPharmacist && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <h2>Pharmacy Dispense Hub</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-accent)' }}>Logged in as: {loggedInPharmacist.name}</p>
                  </div>
                  <div className="dashboard-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isPharmacistAvailable ? '#10b981' : '#ef4444',
                        display: 'inline-block',
                        boxShadow: isPharmacistAvailable ? '0 0 8px #10b981' : 'none'
                      }}></span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isPharmacistAvailable ? '#10b981' : 'var(--color-text-muted)' }}>
                        {isPharmacistAvailable ? 'Available' : 'Offline'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPharmacistAvailable(!isPharmacistAvailable)}
                        style={{
                          marginLeft: '0.5rem',
                          background: isPharmacistAvailable ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)',
                          color: isPharmacistAvailable ? 'var(--color-text)' : '#000',
                          border: 'none',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {isPharmacistAvailable ? 'Go Offline' : 'Go Online'}
                      </button>
                    </div>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                {/* Pharmacy Stats */}
                {(() => {
                  const orders = inquiries.filter(inq => inq.id.startsWith('ORD-'));
                  const pending = orders.filter(o => !o.status || o.status === 'Pending' || o.status === 'Pending Review');
                  const processing = orders.filter(o => o.status === 'Processing & Packaging');
                  const dispatched = orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Awaiting Dispatch');
                  const rxCount = appointments.filter(apt => apt.prescription && apt.prescription.trim() !== '').length;
                  return (
                    <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                      <div className="stat-item">
                        <h3>{orders.length}</h3>
                        <p>TOTAL ORDERS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{pending.length}</h3>
                        <p>PENDING REVIEW</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{processing.length + dispatched.length}</h3>
                        <p>IN PROGRESS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{rxCount}</h3>
                        <p>DOCTOR RX FILES</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Dashboard layout: Sidebar + Workspace */}
                <div className="dashboard-layout">
                  {/* Left Column: Sidebar Menu */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button
                      className={`sidebar-link ${pharmacistNavView === 'orders' ? 'active' : ''}`}
                      onClick={() => setPharmacistNavView('orders')}
                    >
                      <i className="fa-solid fa-boxes-stacked"></i> Medication Orders
                    </button>
                    <button
                      className={`sidebar-link ${pharmacistNavView === 'prescriptions' ? 'active' : ''}`}
                      onClick={() => setPharmacistNavView('prescriptions')}
                    >
                      <i className="fa-solid fa-file-prescription"></i> Doctor Prescriptions (Rx)
                    </button>
                  </div>

                  {/* Right Column: Workspaces */}
                  <div className="dashboard-workspace glassmorphic">

                    {/* Workspace: Orders */}
                    {pharmacistNavView === 'orders' && (
                      <div>
                        <h3>Medication Delivery Orders</h3>
                        {(() => {
                          const orders = inquiries.filter(inq => inq.id.startsWith('ORD-'));
                          if (orders.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pharmacy purchase orders found.</p>;
                          }
                          return (
                            <div className="table-responsive">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Patient/Customer</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map(order => {
                                    const status = order.status || 'Pending Review';
                                    let badgeColor = '#cbd5e1';
                                    let textColor = '#475569';
                                    if (status === 'Pending Review' || status === 'Pending') {
                                      badgeColor = 'rgba(234, 179, 8, 0.15)'; textColor = '#854d0e';
                                    } else if (status === 'Processing & Packaging') {
                                      badgeColor = 'rgba(59, 130, 246, 0.15)'; textColor = '#1d4ed8';
                                    } else if (status === 'Awaiting Dispatch' || status === 'Out for Delivery') {
                                      badgeColor = 'rgba(147, 51, 234, 0.15)'; textColor = '#6b21a8';
                                    } else if (status === 'Delivered') {
                                      badgeColor = 'rgba(34, 197, 94, 0.15)'; textColor = '#166534';
                                    } else if (status === 'Cancelled') {
                                      badgeColor = 'rgba(239, 68, 68, 0.15)'; textColor = '#991b1b';
                                    }
                                    return (
                                      <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.date}</td>
                                        <td>
                                          <strong>{order.name}</strong>
                                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.email}</div>
                                        </td>
                                        <td>
                                          <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: badgeColor, color: textColor }}>
                                            {status}
                                          </span>
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => setPharmacistSelectedOrder(order)}>
                                              <i className="fa-solid fa-eye"></i> View & Process
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Workspace: Prescriptions */}
                    {pharmacistNavView === 'prescriptions' && (
                      <div>
                        <h3>Clinical Prescriptions Registry</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                          These are medication instructions generated by doctors during patient consultations. Click "Dispense & Ship" to create an active delivery order.
                        </p>
                        {(() => {
                          const rxApts = appointments.filter(apt => apt.prescription && apt.prescription.trim() !== '');
                          if (rxApts.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No digital prescriptions found in the clinic database.</p>;
                          }
                          return (
                            <div className="table-responsive">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Apt ID</th>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Prescribed Rx</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rxApts.map(apt => (
                                    <tr key={apt.id}>
                                      <td>{apt.id}</td>
                                      <td>{apt.date}</td>
                                      <td>
                                        <strong>{apt.patientName}</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{apt.phone}</div>
                                      </td>
                                      <td>
                                        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {apt.prescription}
                                        </p>
                                      </td>
                                      <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                          <button
                                            className="btn btn-accent btn-sm"
                                            onClick={() => {
                                              setPharmacistSelectedPrescription(apt);
                                              setPrescOrderForm({ address: '', notes: `Dispensing Rx from doctor ${apt.doctor}`, cost: '0' });
                                              setSelectedDrugs([]);
                                            }}
                                          >
                                            <i className="fa-solid fa-truck-ramp-box"></i> Dispense & Ship
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* LAB SPECIALIST DASHBOARD */}
            {authRole === 'lab' && loggedInLab && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <h2>Laboratory Diagnostics Console</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-accent)' }}>Logged in as: {loggedInLab.name}</p>
                  </div>
                  <div className="dashboard-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isLabTechAvailable ? '#10b981' : '#ef4444',
                        display: 'inline-block',
                        boxShadow: isLabTechAvailable ? '0 0 8px #10b981' : 'none'
                      }}></span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isLabTechAvailable ? '#10b981' : 'var(--color-text-muted)' }}>
                        {isLabTechAvailable ? 'Available' : 'Offline'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsLabTechAvailable(!isLabTechAvailable)}
                        style={{
                          marginLeft: '0.5rem',
                          background: isLabTechAvailable ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)',
                          color: isLabTechAvailable ? 'var(--color-text)' : '#000',
                          border: 'none',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {isLabTechAvailable ? 'Go Offline' : 'Go Online'}
                      </button>
                    </div>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                {/* Lab Stats */}
                {(() => {
                  const requests = appointments.filter(apt => apt.id.startsWith('LAB-') || apt.doctor === 'Mobile Lab Unit');
                  const pending = requests.filter(r => r.status === 'Pending');
                  const collected = requests.filter(r => r.status === 'Sample Collected');
                  const completed = requests.filter(r => r.status === 'Completed' || r.status === 'Approved');
                  return (
                    <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                      <div className="stat-item">
                        <h3>{requests.length}</h3>
                        <p>TOTAL LAB BOOKINGS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{pending.length}</h3>
                        <p>PENDING COLLECTION</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{collected.length}</h3>
                        <p>SAMPLES COLLECTED</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{completed.length}</h3>
                        <p>RESULTS READY</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Dashboard layout: Sidebar + Workspace */}
                <div className="dashboard-layout">
                  {/* Left Column: Sidebar Menu */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button
                      className={`sidebar-link ${labNavView === 'requests' ? 'active' : ''}`}
                      onClick={() => setLabNavView('requests')}
                    >
                      <i className="fa-solid fa-microscope"></i> Active Lab Bookings
                    </button>
                    <button
                      className={`sidebar-link ${labNavView === 'history' ? 'active' : ''}`}
                      onClick={() => setLabNavView('history')}
                    >
                      <i className="fa-solid fa-clock-rotate-left"></i> Completed Reports
                    </button>
                  </div>

                  {/* Right Column: Workspaces */}
                  <div className="dashboard-workspace glassmorphic">

                    {/* Workspace: Active Requests */}
                    {labNavView === 'requests' && (
                      <div>
                        <h3>Active Lab Bookings & Tests</h3>
                        {(() => {
                          const requests = appointments.filter(apt => (apt.id.startsWith('LAB-') || apt.doctor === 'Mobile Lab Unit') && apt.status !== 'Completed' && apt.status !== 'Approved');
                          if (requests.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No active laboratory collections/tests pending.</p>;
                          }
                          return (
                            <div className="table-responsive">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Ticket ID</th>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Tests Requested</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {requests.map(req => {
                                    // Parse tests out of symptoms string
                                    const rawSymp = req.symptoms || '';
                                    let tests = rawSymp;
                                    if (rawSymp.includes('Mobile Lab Booking:')) {
                                      const parts = rawSymp.split('Mobile Lab Booking:')[1].split('. Home collection');
                                      tests = parts[0] || rawSymp;
                                    }
                                    return (
                                      <tr key={req.id}>
                                        <td><strong>{req.id}</strong></td>
                                        <td>{req.date}</td>
                                        <td>
                                          <strong>{req.patientName}</strong>
                                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{req.phone}</div>
                                        </td>
                                        <td>
                                          <span style={{ fontSize: '0.85rem' }}>{tests}</span>
                                        </td>
                                        <td>
                                          <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: req.status === 'Sample Collected' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: req.status === 'Sample Collected' ? '#1d4ed8' : '#854d0e' }}>
                                            {req.status}
                                          </span>
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                            {req.status === 'Pending' && (
                                              <button className="btn btn-outline btn-sm" onClick={() => {
                                                const updated = appointments.map(a => a.id === req.id ? { ...a, status: 'Sample Collected' } : a);
                                                setAppointments(updated);
                                              }}>
                                                Collect Sample
                                              </button>
                                            )}
                                            <button className="btn btn-primary btn-sm" onClick={() => {
                                              setLabSelectedRequest(req);
                                              setLabResultsText('');
                                            }}>
                                              <i className="fa-solid fa-file-medical"></i> Enter Results
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Workspace: History */}
                    {labNavView === 'history' && (
                      <div>
                        <h3>Diagnostic Reports Archive</h3>
                        {(() => {
                          const completed = appointments.filter(apt => (apt.id.startsWith('LAB-') || apt.doctor === 'Mobile Lab Unit') && (apt.status === 'Completed' || apt.status === 'Approved'));
                          if (completed.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No completed reports in archive.</p>;
                          }
                          return (
                            <div className="table-responsive">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Ticket ID</th>
                                    <th>Completed Date</th>
                                    <th>Patient</th>
                                    <th>Report Details</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {completed.map(req => (
                                    <tr key={req.id}>
                                      <td><strong>{req.id}</strong></td>
                                      <td>{req.date}</td>
                                      <td><strong>{req.patientName}</strong></td>
                                      <td>
                                        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {req.prescription || req.notes || 'No results text logged'}
                                        </p>
                                      </td>
                                      <td>
                                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#166534' }}>
                                          Results Ready
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* LOGISTICS DASHBOARD */}
            {authRole === 'logistics' && loggedInLogistics && (
              <div>
                <div className="dashboard-header glassmorphic">
                  <div>
                    <h2>Logistics & Dispatch Control</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-accent)' }}>Logged in as: {loggedInLogistics.name}</p>
                  </div>
                  <div className="dashboard-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isLogisticsAvailable ? '#10b981' : '#ef4444',
                        display: 'inline-block',
                        boxShadow: isLogisticsAvailable ? '0 0 8px #10b981' : 'none'
                      }}></span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isLogisticsAvailable ? '#10b981' : 'var(--color-text-muted)' }}>
                        {isLogisticsAvailable ? 'Available' : 'Offline'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsLogisticsAvailable(!isLogisticsAvailable)}
                        style={{
                          marginLeft: '0.5rem',
                          background: isLogisticsAvailable ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)',
                          color: isLogisticsAvailable ? 'var(--color-text)' : '#000',
                          border: 'none',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {isLogisticsAvailable ? 'Go Offline' : 'Go Online'}
                      </button>
                    </div>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>

                {/* Logistics Stats */}
                {(() => {
                  const shipments = inquiries.filter(inq => inq.id.startsWith('ORD-') && (inq.status === 'Awaiting Dispatch' || inq.status === 'Out for Delivery' || inq.status === 'Delivered'));
                  const labTrips = appointments.filter(apt => apt.id.startsWith('LAB-') && (apt.status === 'Pending' || apt.status === 'Sample Collected'));
                  const pendingDisp = shipments.filter(s => s.status === 'Awaiting Dispatch').length;
                  const inTransit = shipments.filter(s => s.status === 'Out for Delivery').length + labTrips.filter(t => t.status === 'Sample Collected').length;
                  const pendingColl = labTrips.filter(t => t.status === 'Pending').length;
                  const completedDeliv = shipments.filter(s => s.status === 'Delivered').length;
                  return (
                    <div className="stats-row glassmorphic" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                      <div className="stat-item">
                        <h3>{pendingDisp + pendingColl}</h3>
                        <p>PENDING TASKS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{inTransit}</h3>
                        <p>IN TRANSIT</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <h3>{completedDeliv}</h3>
                        <p>COMPLETED DELIVERIES</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Dashboard layout: Sidebar + Workspace */}
                <div className="dashboard-layout">
                  {/* Left Column: Sidebar Menu */}
                  <div className="dashboard-sidebar glassmorphic">
                    <button
                      className={`sidebar-link ${logisticsNavView === 'deliveries' ? 'active' : ''}`}
                      onClick={() => { setLogisticsNavView('deliveries'); setLogisticsSelectedRider(null); }}
                    >
                      <i className="fa-solid fa-truck-drop-off"></i> Pharmacy Deliveries
                    </button>
                    <button
                      className={`sidebar-link ${logisticsNavView === 'lab-trips' ? 'active' : ''}`}
                      onClick={() => { setLogisticsNavView('lab-trips'); setLogisticsSelectedRider(null); }}
                    >
                      <i className="fa-solid fa-vial"></i> Lab Collection Trips
                    </button>
                    <button
                      className={`sidebar-link ${logisticsNavView === 'control-room' ? 'active' : ''}`}
                      onClick={() => { setLogisticsNavView('control-room'); setLogisticsSelectedRider(null); }}
                    >
                      <i className="fa-solid fa-earth-africa"></i> Live Dispatch Map
                    </button>
                    <button
                      className={`sidebar-link ${logisticsNavView === 'riders' ? 'active' : ''}`}
                      onClick={() => { setLogisticsNavView('riders'); setLogisticsSelectedRider(null); }}
                    >
                      <i className="fa-solid fa-motorcycle"></i> Rider Directory
                    </button>
                  </div>

                  {/* Right Column: Workspaces */}
                  <div className="dashboard-workspace glassmorphic">

                    {/* Workspace: Deliveries */}
                    {logisticsNavView === 'deliveries' && (
                      <div>
                        <h3>Pharmacy Package Deliveries</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
                          {/* Left Column: Shipment Table */}
                          <div>
                            {(() => {
                              const shipments = inquiries.filter(inq => inq.id.startsWith('ORD-') && (inq.status === 'Awaiting Dispatch' || inq.status === 'Out for Delivery' || inq.status === 'Delivered'));
                              if (shipments.length === 0) {
                                return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pharmacy packages assigned for delivery.</p>;
                              }
                              return (
                                <div className="table-responsive">
                                  <table className="admin-table">
                                    <thead>
                                      <tr>
                                        <th>Order ID</th>
                                        <th>Recipient</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Assigned Rider</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {shipments.map(ship => {
                                        let address = "Contact client";
                                        const msg = ship.message || '';
                                        if (msg.includes('Shipping Address: [')) {
                                          address = msg.split('Shipping Address: [')[1].split(']. Rx Notes')[0] || address;
                                        }
                                        const isTrackingThis = mapTrackedTripId === ship.id;
                                        return (
                                          <tr key={ship.id} style={{ background: isTrackingThis ? 'rgba(6, 182, 212, 0.04)' : 'transparent' }}>
                                            <td><strong>{ship.id}</strong></td>
                                            <td>{ship.name}</td>
                                            <td><span style={{ fontSize: '0.85rem' }}>{address}</span></td>
                                            <td>
                                              <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: ship.status === 'Delivered' ? 'rgba(34, 197, 94, 0.15)' : ship.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: ship.status === 'Delivered' ? '#166534' : ship.status === 'Out for Delivery' ? '#1d4ed8' : '#854d0e' }}>
                                                {ship.status}
                                              </span>
                                            </td>
                                            <td>
                                              {ship.status === 'Delivered' ? (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                  <i className="fa-solid fa-motorcycle" style={{ color: 'var(--color-success)' }}></i> {ship.assignedRider || 'Default Courier'}
                                                </span>
                                              ) : (
                                                <select
                                                  value={ship.assignedRider || ''}
                                                  onChange={(e) => {
                                                    const riderName = e.target.value;
                                                    const updated = inquiries.map(i => i.id === ship.id ? {
                                                      ...i,
                                                      assignedRider: riderName,
                                                      status: riderName ? 'Out for Delivery' : 'Awaiting Dispatch'
                                                    } : i);
                                                    setInquiries(updated);
                                                  }}
                                                  style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid rgba(24, 43, 73, 0.12)',
                                                    fontSize: '0.82rem',
                                                    background: 'var(--color-bg)',
                                                    color: 'var(--color-text)',
                                                    cursor: 'pointer'
                                                  }}
                                                >
                                                  <option value="">-- Unassigned --</option>
                                                  {logistics.map(rider => (
                                                    <option key={rider.email} value={rider.name}>
                                                      {rider.name} ({rider.vehicleType})
                                                    </option>
                                                  ))}
                                                </select>
                                              )}
                                            </td>
                                            <td>
                                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {ship.status !== 'Delivered' && (
                                                  <button
                                                    className="action-btn"
                                                    style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                    onClick={() => {
                                                      setMapTrackedTripId(ship.id);
                                                      setMapSimulationProgress(0);
                                                      setIsMapSimulating(true);
                                                    }}
                                                    title="Track Live on Map"
                                                  >
                                                    <i className="fa-solid fa-map-location-dot"></i> Track
                                                  </button>
                                                )}

                                                {ship.status === 'Out for Delivery' && (
                                                  <button className="btn btn-accent btn-sm" onClick={() => {
                                                    const updated = inquiries.map(i => i.id === ship.id ? { ...i, status: 'Delivered' } : i);
                                                    setInquiries(updated);
                                                  }}>
                                                    Mark Delivered
                                                  </button>
                                                )}
                                                <button className="btn btn-outline btn-sm" onClick={() => setLogisticsSelectedShipment(ship)}>
                                                  <i className="fa-solid fa-eye"></i> Details
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Right Column: Live Dispatch Telemetry map */}
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent)', fontSize: '0.95rem' }}>Live Routing Telemetry</h4>
                            {renderLiveTrackingMap(false)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Lab Trips */}
                    {logisticsNavView === 'lab-trips' && (
                      <div>
                        <h3>Lab Sample Collection Trips</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
                          {/* Left Column: Trips Table */}
                          <div>
                            {(() => {
                              const trips = appointments.filter(apt => apt.id.startsWith('LAB-') && (apt.status === 'Pending' || apt.status === 'Sample Collected'));
                              if (trips.length === 0) {
                                return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No active sample collections pending.</p>;
                              }
                              return (
                                <div className="table-responsive">
                                  <table className="admin-table">
                                    <thead>
                                      <tr>
                                        <th>Ticket ID</th>
                                        <th>Scheduled Date</th>
                                        <th>Patient</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Assigned Rider</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {trips.map(trip => {
                                        let address = "Contact patient";
                                        const rawSymp = trip.symptoms || '';
                                        if (rawSymp.includes('Home collection address: ')) {
                                          address = rawSymp.split('Home collection address: ')[1].split('. Patient Instructions')[0] || address;
                                        }
                                        const isTrackingThis = mapTrackedTripId === trip.id;
                                        return (
                                          <tr key={trip.id} style={{ background: isTrackingThis ? 'rgba(6, 182, 212, 0.04)' : 'transparent' }}>
                                            <td><strong>{trip.id}</strong></td>
                                            <td>{trip.date}</td>
                                            <td>{trip.patientName}</td>
                                            <td><span style={{ fontSize: '0.85rem' }}>{address}</span></td>
                                            <td>
                                              <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: trip.status === 'Sample Collected' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: trip.status === 'Sample Collected' ? '#1d4ed8' : '#854d0e' }}>
                                                {trip.status === 'Pending' ? 'Collection Pending' : 'Sample Collected'}
                                              </span>
                                            </td>
                                            <td>
                                              {trip.status === 'Completed' ? (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                  {trip.assignedRider || 'Default Courier'}
                                                </span>
                                              ) : (
                                                <select
                                                  value={trip.assignedRider || ''}
                                                  onChange={(e) => {
                                                    const riderName = e.target.value;
                                                    const updated = appointments.map(a => a.id === trip.id ? {
                                                      ...a,
                                                      assignedRider: riderName,
                                                      status: riderName ? 'Sample Collected' : 'Pending'
                                                    } : a);
                                                    setAppointments(updated);
                                                  }}
                                                  style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid rgba(24, 43, 73, 0.12)',
                                                    fontSize: '0.82rem',
                                                    background: 'var(--color-bg)',
                                                    color: 'var(--color-text)',
                                                    cursor: 'pointer'
                                                  }}
                                                >
                                                  <option value="">-- Unassigned --</option>
                                                  {logistics.map(rider => (
                                                    <option key={rider.email} value={rider.name}>
                                                      {rider.name} ({rider.vehicleType})
                                                    </option>
                                                  ))}
                                                </select>
                                              )}
                                            </td>
                                            <td>
                                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {trip.status !== 'Completed' && (
                                                  <button
                                                    className="action-btn"
                                                    style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                    onClick={() => {
                                                      setMapTrackedTripId(trip.id);
                                                      setMapSimulationProgress(0);
                                                      setIsMapSimulating(true);
                                                    }}
                                                    title="Track Live on Map"
                                                  >
                                                    <i className="fa-solid fa-map-location-dot"></i> Track
                                                  </button>
                                                )}

                                                {trip.status === 'Sample Collected' && (
                                                  <button className="btn btn-accent btn-sm" onClick={() => {
                                                    const updated = appointments.map(a => a.id === trip.id ? { ...a, status: 'Completed' } : a);
                                                    setAppointments(updated);
                                                  }}>
                                                    Deliver to Lab
                                                  </button>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Right Column: Live Tracking Map */}
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent)', fontSize: '0.95rem' }}>Live Routing Telemetry</h4>
                            {renderLiveTrackingMap(false)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Control Room Map */}
                    {logisticsNavView === 'control-room' && (
                      <div>
                        <h3>Logistics Dispatch Control Room</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                          Real-time geographic status of active courier riders and delivery drone payloads across Abuja metropolitan sectors. Select a task to simulate routing.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '1.5rem' }}>
                          {/* Map container */}
                          <div style={{ background: '#0b1329', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', position: 'relative', minHeight: '400px' }}>
                            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(15,23,42,0.9)', color: '#10b981', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 10 }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                              {isMapSimulating ? 'TELEMETRY SIMULATION ACTIVE' : 'SATELLITE TELEMETRY IDLE'}
                            </div>

                            <svg viewBox="0 0 500 350" style={{ width: '100%', height: 'auto', background: '#070d1e', borderRadius: '8px' }}>
                              {/* Grid Gridlines */}
                              <defs>
                                <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                                </pattern>
                              </defs>
                              <rect width="500" height="350" fill="url(#mapGrid)" />

                              {/* Main Roads network in Abuja */}
                              <path d="M 50,50 L 450,50 M 50,150 L 450,150 M 50,250 L 450,250 M 150,50 L 150,300 M 350,50 L 350,300 M 50,50 Q 250,180 450,250" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                              <path d="M 250,50 L 250,300" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="none" />

                              {/* SimmyCare Central Hub Pin */}
                              <g transform="translate(250, 150)">
                                <circle r="8" fill="#10b981" />
                                <circle r="16" fill="#10b981" fillOpacity="0.15" />
                                <text x="12" y="4" fill="#10b981" fontSize="9" fontWeight="bold">Central Hub</text>
                              </g>

                              {/* Render Rider Pins */}
                              {logistics.map((rider, idx) => {
                                const coords = [
                                  { x: 120, y: 80 },   // Rider 1
                                  { x: 380, y: 110 },  // Rider 2
                                  { x: 170, y: 220 },  // Rider 3
                                  { x: 310, y: 260 },  // Rider 4
                                  { x: 220, y: 90 },   // Rider 5
                                ];
                                const coord = coords[idx % coords.length];

                                const activeOrder = inquiries.find(inq => inq.id.startsWith('ORD-') && inq.status === 'Out for Delivery' && inq.assignedRider === rider.name);
                                const activeTrip = appointments.find(apt => apt.id.startsWith('LAB-') && apt.status === 'Sample Collected' && apt.assignedRider === rider.name);
                                const isBusy = !!(activeOrder || activeTrip);
                                const isSelected = logisticsSelectedRider && logisticsSelectedRider.email === rider.email;

                                return (
                                  <g
                                    key={rider.email}
                                    transform={`translate(${coord.x}, ${coord.y})`}
                                    onClick={() => setLogisticsSelectedRider(rider)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <circle r="7" fill={isSelected ? 'var(--color-accent)' : (isBusy ? '#eab308' : '#3b82f6')} />
                                    <circle r="14" fill={isSelected ? 'var(--color-accent)' : (isBusy ? '#eab308' : '#3b82f6')} fillOpacity="0.2" />
                                    <text x="10" y="-3" fill="#fff" fontSize="8" fontWeight="bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                      {rider.name.split(' ')[0]}
                                    </text>
                                    <text x="10" y="6" fill="#cbd5e1" fontSize="7">
                                      {rider.vehicleType === 'Drone' ? '🛸' : '🏍️'}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Draw Tracked Route line if active shipment is being simulated */}
                              {(() => {
                                if (!mapTrackedTripId) return null;
                                const dest = getTripCoords(mapTrackedTripId);
                                const progressCoords = getInterpolatedCoords(mapSimulationProgress, dest);
                                return (
                                  <g>
                                    {/* Dotted path to client destination */}
                                    <line
                                      x1="250"
                                      y1="150"
                                      x2={dest.x}
                                      y2={dest.y}
                                      stroke="var(--color-accent)"
                                      strokeWidth="2.5"
                                      strokeDasharray="5,5"
                                      opacity="0.8"
                                    />
                                    {/* Destination target */}
                                    <g transform={`translate(${dest.x}, ${dest.y})`}>
                                      <circle r="8" fill="#ef4444" />
                                      <circle r="16" fill="#ef4444" fillOpacity="0.2" />
                                      <text x="12" y="4" fill="#ef4444" fontSize="9" fontWeight="bold">Destination</text>
                                    </g>
                                    {/* Live Moving Pin */}
                                    <g transform={`translate(${progressCoords.x}, ${progressCoords.y})`}>
                                      <circle r="8" fill="var(--color-accent)" />
                                      <circle r="16" fill="var(--color-accent)" fillOpacity="0.4" />
                                      <text x="-15" y="-12" fill="var(--color-accent)" fontSize="8" fontWeight="bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                                        📦 Transit ({mapSimulationProgress}%)
                                      </text>
                                    </g>
                                  </g>
                                );
                              })()}
                            </svg>
                          </div>

                          {/* Detail Panel & Simulation Controller */}
                          <div className="dashboard-workspace glassmorphic" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'flex-start' }}>
                            {/* Route Selector Dropdown */}
                            <div>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Select Live Dispatch to Track</strong>
                              <select
                                value={mapTrackedTripId || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMapTrackedTripId(val);
                                  setMapSimulationProgress(0);
                                  setIsMapSimulating(false);
                                  if (val) {
                                    const matchedOrder = inquiries.find(i => i.id === val);
                                    const matchedTrip = appointments.find(a => a.id === val);
                                    const rName = matchedOrder ? matchedOrder.assignedRider : (matchedTrip ? matchedTrip.assignedRider : null);
                                    if (rName) {
                                      const matchedRider = logistics.find(r => r.name === rName);
                                      if (matchedRider) setLogisticsSelectedRider(matchedRider);
                                    }
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  background: 'rgba(0,0,0,0.3)',
                                  color: '#fff',
                                  fontSize: '0.85rem',
                                  outline: 'none'
                                }}
                              >
                                <option value="">-- No Active Route Selected --</option>
                                {inquiries.filter(inq => inq.id.startsWith('ORD-') && (inq.status === 'Out for Delivery' || inq.status === 'Awaiting Dispatch')).map(d => (
                                  <option key={d.id} value={d.id}>📦 Pharmacy Order {d.id} ({d.status})</option>
                                ))}
                                {appointments.filter(apt => apt.id.startsWith('LAB-') && (apt.status === 'Sample Collected' || apt.status === 'Pending')).map(l => (
                                  <option key={l.id} value={l.id}>🔬 Lab Sample Collection {l.id}</option>
                                ))}
                              </select>
                            </div>

                            {mapTrackedTripId ? (() => {
                              const activeOrder = inquiries.find(inq => inq.id === mapTrackedTripId);
                              const activeTrip = appointments.find(apt => apt.id === mapTrackedTripId);

                              let clientName = "N/A";
                              let phone = "N/A";
                              let address = "Central Hub Area";
                              let courier = "Unassigned";
                              let cargoType = "General Medical Supply";

                              if (activeOrder) {
                                const parsed = parseOrderMessage(activeOrder.message);
                                clientName = activeOrder.name;
                                phone = activeOrder.phone;
                                address = parsed.address;
                                courier = activeOrder.assignedRider || 'Default Courier';
                                cargoType = parsed.items;
                              } else if (activeTrip) {
                                const parsed = parseLabRequest(activeTrip.symptoms);
                                clientName = activeTrip.patientName;
                                phone = activeTrip.phone;
                                address = parsed.address;
                                courier = activeTrip.assignedRider || 'Default Courier';
                                cargoType = "Diagnostic Lab Specimen (Vials/Swabs)";
                              }

                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                      <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>TRACKING SIMULATION</strong>
                                      <span style={{ fontSize: '0.75rem', color: isMapSimulating ? '#10b981' : '#eab308', fontWeight: 'bold' }}>
                                        {isMapSimulating ? '● ON THE ROAD' : '● PAUSED'}
                                      </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-primary"
                                        onClick={() => setIsMapSimulating(true)}
                                        disabled={isMapSimulating || mapSimulationProgress >= 100}
                                        style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem' }}
                                      >
                                        <i className="fa-solid fa-play"></i> Start Track
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-outline"
                                        onClick={() => setIsMapSimulating(false)}
                                        disabled={!isMapSimulating}
                                        style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem' }}
                                      >
                                        <i className="fa-solid fa-pause"></i> Pause
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-xs btn-outline"
                                        onClick={() => {
                                          setIsMapSimulating(false);
                                          setMapSimulationProgress(0);
                                        }}
                                        style={{ padding: '0.3rem', fontSize: '0.75rem' }}
                                      >
                                        <i className="fa-solid fa-rotate-left"></i>
                                      </button>
                                    </div>

                                    {/* Route Progress Bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                      <span>Progress: {mapSimulationProgress}%</span>
                                      <span>ETA: {Math.max(0, Math.ceil((100 - mapSimulationProgress) / 5))} mins</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                      <div style={{ width: `${mapSimulationProgress}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }}></div>
                                    </div>
                                  </div>

                                  {/* Route Checkpoints */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Route Checkpoints</strong>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: mapSimulationProgress >= 0 ? '#fff' : 'var(--color-text-muted)' }}>
                                      <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 0 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                      <span>Departed SimmyCare Central Depot</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: mapSimulationProgress >= 30 ? '#fff' : 'var(--color-text-muted)' }}>
                                      <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 30 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                      <span>Transiting Abuja Ring Expressway</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: mapSimulationProgress >= 70 ? '#fff' : 'var(--color-text-muted)' }}>
                                      <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 70 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                      <span>Entering Destination Area Ward</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: mapSimulationProgress === 100 ? '#fff' : 'var(--color-text-muted)' }}>
                                      <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress === 100 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                      <span>Delivered & Handed Over to Client</span>
                                    </div>
                                  </div>

                                  {/* Trip Telemetry Fields */}
                                  <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div>
                                      <strong style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block' }}>Recipient Client</strong>
                                      <span>{clientName} ({phone})</span>
                                    </div>
                                    <div>
                                      <strong style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block' }}>Destination Address</strong>
                                      <span>{address}</span>
                                    </div>
                                    <div>
                                      <strong style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block' }}>Transit Courier</strong>
                                      <span>{courier}</span>
                                    </div>
                                    <div>
                                      <strong style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block' }}>Payload Cargo</strong>
                                      <span>{cargoType}</span>
                                    </div>
                                  </div>

                                  {/* Manual actions */}
                                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {mapSimulationProgress < 100 ? (
                                      <button
                                        type="button"
                                        className="btn btn-accent btn-sm"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                          if (mapTrackedTripId.startsWith('ORD-')) {
                                            const updated = inquiries.map(i => i.id === mapTrackedTripId ? { ...i, status: 'Delivered' } : i);
                                            setInquiries(updated);
                                          } else {
                                            const updated = appointments.map(a => a.id === mapTrackedTripId ? { ...a, status: 'Completed' } : a);
                                            setAppointments(updated);
                                          }
                                          setMapSimulationProgress(100);
                                          setIsMapSimulating(false);
                                          alert(`Delivery complete! Shipment ${mapTrackedTripId} marked as Delivered.`);
                                        }}
                                      >
                                        <i className="fa-solid fa-clipboard-check"></i> Complete Delivery
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                          setMapTrackedTripId(null);
                                          setMapSimulationProgress(0);
                                        }}
                                      >
                                        Clear Active Track
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })() : (
                              <div>
                                {logisticsSelectedRider ? (() => {
                                  const rider = logisticsSelectedRider;
                                  const activeOrder = inquiries.find(inq => inq.id.startsWith('ORD-') && inq.status === 'Out for Delivery' && inq.assignedRider === rider.name);
                                  const activeTrip = appointments.find(apt => apt.id.startsWith('LAB-') && apt.status === 'Sample Collected' && apt.assignedRider === rider.name);

                                  let cargo = "Idle / No Active Payload";
                                  let route = "At dispatch station";
                                  let statusLabel = "Available";
                                  let statusColor = "#3b82f6";

                                  if (activeOrder) {
                                    const parsed = parseOrderMessage(activeOrder.message);
                                    cargo = `Cardiovascular Drugs (Rx: ${activeOrder.id})`;
                                    route = `Hub ➡️ ${parsed.address}`;
                                    statusLabel = "Delivering Order";
                                    statusColor = "#eab308";
                                  } else if (activeTrip) {
                                    const parsed = parseLabRequest(activeTrip.symptoms);
                                    cargo = `Blood Diagnostics Pathology (Lab: ${activeTrip.id})`;
                                    route = `${parsed.address} ➡️ Lab Hub`;
                                    statusLabel = "Collecting Samples";
                                    statusColor = "#eab308";
                                  }

                                  const hashVal = rider.name.charCodeAt(0) + (rider.name.charCodeAt(1) || 0);
                                  const battery = (hashVal % 30) + 70;

                                  return (
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                          {rider.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{rider.name}</h4>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{rider.phone}</div>
                                        </div>
                                        <span style={{ marginLeft: 'auto', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', backgroundColor: `${statusColor}22`, color: statusColor }}>
                                          {statusLabel}
                                        </span>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                          <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Vehicle & Fleet Type</strong>
                                          <span style={{ fontSize: '0.85rem' }}>{rider.vehicleType} (Sector: {rider.dispatchArea || 'Wuse II Area'})</span>
                                        </div>

                                        <div>
                                          <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Battery / Fuel Status</strong>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                              <div style={{ width: `${battery}%`, height: '100%', background: battery > 80 ? '#16a34a' : '#eab308', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{battery}%</span>
                                          </div>
                                        </div>

                                        <div>
                                          <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Active Payload Cargo</strong>
                                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{cargo}</span>
                                        </div>

                                        <div>
                                          <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Current Route Waypoints</strong>
                                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{route}</span>
                                        </div>
                                      </div>

                                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                                        <a href={`tel:${rider.phone}`} className="btn btn-outline btn-sm" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem' }}>
                                          <i className="fa-solid fa-phone"></i> Call Courier
                                        </a>
                                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => alert("Ping payload command sent to Rider device successfully!")}>
                                          <i className="fa-solid fa-satellite-dish"></i> Ping Rider
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })() : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '250px', color: 'var(--color-text-muted)' }}>
                                    <i className="fa-solid fa-map-location-dot" style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: '0.3' }}></i>
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>Select a courier pin or choose an active dispatch task from the dropdown to track its routing path live.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Workspace: Riders Directory & Onboarding */}
                    {logisticsNavView === 'riders' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h3 style={{ margin: 0 }}>Dispatch Rider Directory</h3>
                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                              Onboard new riders, monitor their active transit tasks, and manage coverage regions.
                            </p>
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const name = prompt("Enter Dispatch Rider's Full Name:");
                              if (!name) return;
                              const email = prompt("Enter Rider's Email Address:");
                              if (!email) return;
                              const phone = prompt("Enter Rider's Phone Number:");
                              if (!phone) return;
                              const vehicleType = prompt("Enter Vehicle Type (Motorbike, Bicycle, Delivery Van, Electric Scooter):", "Motorbike");
                              if (!vehicleType) return;
                              const dispatchArea = prompt("Enter Primary Coverage / Dispatch Area:", "Lagos Central");
                              if (!dispatchArea) return;
                              const password = prompt("Create Rider Account Password:", "password123");
                              if (!password) return;

                              const newRider = {
                                name,
                                email,
                                phone,
                                vehicleType,
                                dispatchArea,
                                password,
                                status: 'Idle'
                              };
                              setLogistics([...logistics, newRider]);
                              alert(`Rider "${name}" successfully onboarded into SimmyCare Logistics network!`);
                            }}
                          >
                            <i className="fa-solid fa-user-plus" style={{ marginRight: '6px' }}></i> Onboard Rider
                          </button>
                        </div>

                        {/* Status Filter Bar */}
                        <div className="filter-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                          {['All', 'Idle', 'Active / In Transit', 'Offline'].map(status => {
                            // Calculate count
                            let count = 0;
                            if (status === 'All') count = logistics.length;
                            else if (status === 'Idle') {
                              // Rider is idle if they have no active deliveries in progress
                              count = logistics.filter(r => {
                                const hasActive = inquiries.some(i => i.assignedRider === r.name && i.status === 'Out for Delivery') ||
                                  appointments.some(a => a.assignedRider === r.name && a.status === 'Sample Collected');
                                return !hasActive;
                              }).length;
                            } else if (status === 'Active / In Transit') {
                              count = logistics.filter(r => {
                                const hasActive = inquiries.some(i => i.assignedRider === r.name && i.status === 'Out for Delivery') ||
                                  appointments.some(a => a.assignedRider === r.name && a.status === 'Sample Collected');
                                return hasActive;
                              }).length;
                            } else if (status === 'Offline') {
                              count = 0; // Simulated offline for demo, or match offline
                            }

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setRiderStatusFilter(status)}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '20px',
                                  border: 'none',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  background: riderStatusFilter === status ? 'var(--color-accent)' : 'rgba(24, 43, 73, 0.05)',
                                  color: riderStatusFilter === status ? '#ffffff' : 'var(--color-text)',
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-fast)'
                                }}
                              >
                                {status} ({count})
                              </button>
                            );
                          })}
                        </div>

                        {/* Riders Table */}
                        {(() => {
                          const filteredRiders = logistics.filter(rider => {
                            const hasActive = inquiries.some(i => i.assignedRider === rider.name && i.status === 'Out for Delivery') ||
                              appointments.some(a => a.assignedRider === rider.name && a.status === 'Sample Collected');
                            if (riderStatusFilter === 'Idle') return !hasActive;
                            if (riderStatusFilter === 'Active / In Transit') return hasActive;
                            return true;
                          });

                          if (filteredRiders.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No riders match the selected status filter.</p>;
                          }

                          return (
                            <div className="table-responsive">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Rider Name</th>
                                    <th>Phone</th>
                                    <th>Vehicle Type</th>
                                    <th>Coverage Area</th>
                                    <th>Active Assignments</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredRiders.map(rider => {
                                    // Calculate active assignments
                                    const activePharmacy = inquiries.filter(i => i.assignedRider === rider.name && i.status === 'Out for Delivery');
                                    const activeLab = appointments.filter(a => a.assignedRider === rider.name && a.status === 'Sample Collected');
                                    const activeCount = activePharmacy.length + activeLab.length;
                                    const isTransit = activeCount > 0;

                                    return (
                                      <tr key={rider.email}>
                                        <td>
                                          <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{rider.name}</div>
                                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{rider.email}</div>
                                        </td>
                                        <td>{rider.phone || 'N/A'}</td>
                                        <td>
                                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                                            <i className={`fa-solid ${rider.vehicleType === 'Delivery Van' ? 'fa-truck' : rider.vehicleType === 'Bicycle' ? 'fa-bicycle' : 'fa-motorcycle'}`} style={{ color: 'var(--color-indigo)' }}></i>
                                            {rider.vehicleType}
                                          </span>
                                        </td>
                                        <td>{rider.dispatchArea || 'Lagos Metro'}</td>
                                        <td>
                                          {isTransit ? (
                                            <span style={{ fontWeight: '600', color: 'var(--color-accent)' }}>
                                              {activeCount} active task{activeCount > 1 ? 's' : ''}
                                            </span>
                                          ) : (
                                            <span style={{ color: 'var(--color-text-muted)' }}>0 tasks</span>
                                          )}
                                        </td>
                                        <td>
                                          <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: isTransit ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                            color: isTransit ? '#1d4ed8' : '#166534'
                                          }}>
                                            {isTransit ? 'Active / In Transit' : 'Idle'}
                                          </span>
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                            <button
                                              className="btn btn-outline btn-sm"
                                              onClick={() => {
                                                if (confirm(`Are you sure you want to offboard Rider "${rider.name}"?`)) {
                                                  setLogistics(logistics.filter(r => r.email !== rider.email));
                                                }
                                              }}
                                              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                            >
                                              <i className="fa-solid fa-trash-can"></i> Offboard
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
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

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'start' }}>
                          {/* Left Column: Appointments List */}
                          <div style={{ flex: '1 1 650px', minWidth: 0 }}>
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
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOpacity: '0.7', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={apt.symptoms}>
                                          {apt.symptoms}
                                        </td>
                                        <td>
                                          <span className={`status-badge status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {apt.status}
                                          </span>
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <button
                                              className="action-btn"
                                              style={{ background: 'transparent', color: 'var(--color-text)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: 'none', cursor: 'pointer' }}
                                              onClick={() => setAdminSelectedApt(apt)}
                                              title="View Details"
                                            >
                                              <i className="fa-solid fa-eye"></i> View
                                            </button>

                                            {apt.status === 'Pending' && (
                                              <>
                                                <button
                                                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                  onClick={() => handleApproveAppointment(apt.id)}
                                                  title="Approve Booking"
                                                >
                                                  <i className="fa-solid fa-circle-check"></i> Approve
                                                </button>

                                                <button
                                                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                                                  onClick={() => handleAutoRouteSpecialist(apt.id)}
                                                  title="Auto-Route to Most Available Doctor"
                                                >
                                                  <i className="fa-solid fa-route"></i> Route
                                                </button>

                                                <button
                                                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                  onClick={() => handleCancelAppointment(apt.id)}
                                                  title="Cancel/Reject Booking"
                                                >
                                                  <i className="fa-solid fa-circle-xmark"></i> Reject
                                                </button>
                                              </>
                                            )}

                                            <button
                                              style={{ background: 'transparent', color: 'var(--color-text)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                              onClick={() => startEditApt(apt)}
                                              title="Modify Ticket"
                                            >
                                              <i className="fa-solid fa-pen-to-square"></i> Reschedule
                                            </button>

                                            <button
                                              className="action-btn"
                                              style={{ color: '#EF4444', padding: '0.25rem' }}
                                              onClick={() => handleDeleteAppointment(apt.id)}
                                              title="Delete Record"
                                            >
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

                          {/* Right Column: Staff Availability Search & Tracker */}
                          <div style={{ flex: '1 1 320px', minWidth: '300px' }}>
                            <div className="glassmorphic" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--color-accent)' }}>
                                <i className="fa-solid fa-signal"></i> Staff Availability Tracker
                              </h4>
                              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                Verify pharmacist, laboratory, and rider availability status before routing.
                              </p>

                              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}></i>
                                <input
                                  type="text"
                                  placeholder="Search staff, role, status..."
                                  value={availabilitySearchQuery}
                                  onChange={(e) => setAvailabilitySearchQuery(e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.4rem 0.75rem 0.4rem 2rem',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    outline: 'none'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                {(() => {
                                  const query = availabilitySearchQuery.toLowerCase();
                                  const staffList = [
                                    { type: 'pharmacist', name: 'Pharmacy Dispense Hub', role: 'Pharmacist', available: isPharmacistAvailable, icon: 'fa-prescription-bottle-medical', email: 'pharmacist@simmycare.com' },
                                    { type: 'lab', name: 'Mobile Lab Collection Unit', role: 'Lab Tech', available: isLabTechAvailable, icon: 'fa-vials', email: 'lab@simmycare.com' },
                                    { type: 'logistics', name: 'Abuja Delivery Hub', role: 'Courier / Rider', available: isLogisticsAvailable, icon: 'fa-motorcycle', email: 'logistics@simmycare.com' },
                                    ...doctors.map(d => ({
                                      type: 'doctor',
                                      id: d.id,
                                      name: d.name.startsWith("Dr. ") ? d.name : `Dr. ${d.name}`,
                                      role: d.specialty,
                                      available: d.active !== false,
                                      icon: 'fa-user-doctor',
                                      email: d.email,
                                      phone: d.phone
                                    }))
                                  ];

                                  const filtered = staffList.filter(s =>
                                    s.name.toLowerCase().includes(query) ||
                                    s.role.toLowerCase().includes(query) ||
                                    (s.available ? 'online available' : 'offline unavailable').includes(query)
                                  );

                                  if (filtered.length === 0) {
                                    return <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>No matching staff found</div>;
                                  }

                                  return filtered.map((staff, idx) => {
                                    const handleToggle = () => {
                                      if (staff.type === 'doctor') {
                                        handleToggleDoctorActive(staff.id);
                                      } else if (staff.type === 'pharmacist') {
                                        setIsPharmacistAvailable(!isPharmacistAvailable);
                                      } else if (staff.type === 'lab') {
                                        setIsLabTechAvailable(!isLabTechAvailable);
                                      } else if (staff.type === 'logistics') {
                                        setIsLogisticsAvailable(!isLogisticsAvailable);
                                      }
                                    };

                                    return (
                                      <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.6rem 0.75rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        gap: '0.5rem'
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                                          <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: 'rgba(28, 43, 73, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-accent)',
                                            flexShrink: 0
                                          }}>
                                            <i className={`fa-solid ${staff.icon}`} style={{ fontSize: '0.85rem' }}></i>
                                          </div>
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                                              {staff.name}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.05rem' }}>
                                              <span>{staff.role}</span>
                                              {staff.email && (
                                                <a href={`mailto:${staff.email}`} title={`Email: ${staff.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                  <i className="fa-solid fa-envelope" style={{ fontSize: '0.75rem' }}></i>
                                                </a>
                                              )}
                                              {staff.phone && (
                                                <a href={`tel:${staff.phone}`} title={`Call: ${staff.phone}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                  <i className="fa-solid fa-phone" style={{ fontSize: '0.75rem' }}></i>
                                                </a>
                                              )}
                                              {staff.phone && (
                                                <a
                                                  href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  title="Chat on WhatsApp"
                                                  style={{ color: '#10B981', textDecoration: 'none' }}
                                                >
                                                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '0.8rem' }}></i>
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={handleToggle}
                                          title="Click to toggle availability directly"
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            background: staff.available ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            border: `1px solid ${staff.available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            flexShrink: 0
                                          }}
                                        >
                                          <span style={{
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            background: staff.available ? '#10b981' : '#ef4444',
                                            boxShadow: staff.available ? '0 0 6px #10b981' : 'none'
                                          }}></span>
                                          <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            color: staff.available ? '#10b981' : '#ef4444',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            {staff.available ? 'Online' : 'Offline'}
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
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
                            <div className="form-group">
                              <label>Professional Level</label>
                              <select
                                value={newDoctorData.level || 'Junior Doctor'}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, level: e.target.value })}
                              >
                                <option value="Junior Doctor">Junior Doctor</option>
                                <option value="General Practitioner">General Practitioner</option>
                                <option value="Consultant">Consultant</option>
                                <option value="Senior Consultant">Senior Consultant</option>
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
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const compressed = await compressImageFile(file, 400, 0.7);
                                      if (compressed) {
                                        setNewDoctorData({ ...newDoctorData, image: compressed });
                                      }
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
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const compressed = await compressImageFile(file, 600, 0.75);
                                      if (compressed) {
                                        setNewDoctorData({ ...newDoctorData, license: compressed });
                                      }
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

                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                              <input
                                type="checkbox"
                                id="admin-verify-checkbox"
                                checked={newDoctorData.verified === true}
                                onChange={(e) => setNewDoctorData({ ...newDoctorData, verified: e.target.checked })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <label htmlFor="admin-verify-checkbox" style={{ margin: 0, fontWeight: '600', color: 'var(--color-indigo)', cursor: 'pointer' }}>
                                Mark Profile as Audited & Verified (Award Verified Badge)
                              </label>
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
                                  setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', services: [], level: 'Junior Doctor', verified: false });
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
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <strong style={{ color: 'var(--color-indigo)' }}>{d.name}</strong>
                                            {d.verified !== false ? (
                                              <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: '0.85rem' }} title="Verified by board"></i>
                                            ) : (
                                              <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', padding: '1px 5px', borderRadius: '4px', fontWeight: '600' }}>Unverified</span>
                                            )}
                                            <span className={`status-badge ${d.active === false ? 'status-cancelled' : 'status-approved'}`} style={{ padding: '0.05rem 0.35rem', fontSize: '0.6rem', borderRadius: '4px' }}>
                                              {d.active === false ? 'Inactive' : 'Active'}
                                            </span>
                                          </div>
                                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{d.regNo || 'N/A'} • {d.level || 'Junior Doctor'}</span>
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
                                        <div>Email: {d.email ? <a href={`mailto:${d.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{d.email}</a> : <code>N/A</code>}</div>
                                        {d.phone && (
                                          <div>Phone: <a href={`tel:${d.phone}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{d.phone}</a></div>
                                        )}
                                        {d.phone && (
                                          <div style={{ marginTop: '0.15rem' }}>
                                            <a
                                              href={`https://wa.me/${d.phone.replace(/[^0-9]/g, '')}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.2rem',
                                                color: '#10B981',
                                                fontWeight: '600',
                                                fontSize: '0.72rem',
                                                textDecoration: 'none'
                                              }}
                                            >
                                              <i className="fa-brands fa-whatsapp"></i> Chat WhatsApp
                                            </a>
                                          </div>
                                        )}
                                        <div style={{ marginTop: '0.15rem', color: 'var(--color-text-muted)' }}>Password: <code>{d.password || 'N/A'}</code></div>
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
                                          onClick={() => handleToggleDoctorVerify(d.id)}
                                          title={d.verified !== false ? "Revoke Verification" : "Approve & Verify Credentials"}
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: d.verified !== false ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                                            color: d.verified !== false ? '#EF4444' : '#10B981'
                                          }}
                                        >
                                          <i className={`fa-solid ${d.verified !== false ? 'fa-user-xmark' : 'fa-user-check'}`}></i>
                                        </button>
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
                                          <i className="fa-solid fa-trash-can"></i>
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

      {/* --- 3. Footer Section --- */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <div className="logo-img-wrapper">
                <img className="logo-img" src={logoSvg} alt="SimmyCare Logo" />
              </div>
              <span className="logo-text">Simmy<span>Care</span></span>
            </a>
            <p>Nigeria's primary digital care network. Bridging the gap between patient care, diagnostics, and pharmaceutical logistics.</p>
            <div className="footer-social-icons">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Find Doctors</a></li>
              <li><a href="#booking" onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>Book Appointment</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>SPECIALTIES</h4>
            <ul>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); setDoctorFilter('General Medicine'); navigateTo('doctors'); }}>General Practitioner</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); setDoctorFilter('Gynaecology'); navigateTo('doctors'); }}>Gynaecologist</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); setDoctorFilter('Public Health'); navigateTo('doctors'); }}>Public Health</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); setDoctorFilter('Laboratory'); navigateTo('doctors'); }}>Laboratory</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>CONTACT</h4>
            <p><i className="fa-solid fa-phone"></i> +234 901 432 4442</p>
            <p><i className="fa-solid fa-envelope"></i> support@simmycare.com</p>
            <p><i className="fa-regular fa-clock"></i> Mon - Fri: 8AM - 5PM</p>
            <p><i className="fa-regular fa-clock"></i> Sat: 9AM - 2PM</p>
          </div>
        </div>
      </footer>

      {/* Footer Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p>&copy; 2026 SimmyCare. All rights reserved.</p>
          <p>RC Number: RC 9198656 | Developed by Nexel Technologies</p>
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
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {adminSelectedDoctor.phone ? (
                      <>
                        <a href={`tel:${adminSelectedDoctor.phone}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                          {adminSelectedDoctor.phone}
                        </a>
                        <a
                          href={`https://wa.me/${adminSelectedDoctor.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center' }}
                          title="Chat on WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp" style={{ fontSize: '1rem' }}></i>
                        </a>
                      </>
                    ) : 'N/A'}
                  </div>
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
                  <div>Email: {adminSelectedDoctor.email ? <a href={`mailto:${adminSelectedDoctor.email}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{adminSelectedDoctor.email}</a> : <strong>N/A</strong>}</div>
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

      {/* Pharmacist View Order Details Modal */}
      {pharmacistSelectedOrder && (
        <div className="modal-backdrop" onClick={() => setPharmacistSelectedOrder(null)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Order details: {pharmacistSelectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setPharmacistSelectedOrder(null)}>×</button>
            </div>

            <div style={{ padding: '1rem 0' }}>
              <div className="detail-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Customer/Patient:</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{pharmacistSelectedOrder.name}</p>
                </div>
                <div>
                  <strong>Date Placed:</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{pharmacistSelectedOrder.date}</p>
                </div>
              </div>
              <div className="detail-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>Email:</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{pharmacistSelectedOrder.email}</p>
                </div>
                <div>
                  <strong>Phone:</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{pharmacistSelectedOrder.phone}</p>
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <strong>Order Details & Delivery Specs:</strong>
                <p style={{ margin: '0.25rem 0 0 0', background: 'rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {pharmacistSelectedOrder.message}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <strong>Current Order Status: </strong>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#854d0e' }}>
                  {pharmacistSelectedOrder.status || 'Pending Review'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const updated = inquiries.map(i => i.id === pharmacistSelectedOrder.id ? { ...i, status: 'Processing & Packaging' } : i);
                    setInquiries(updated);
                    setPharmacistSelectedOrder(null);
                  }}
                >
                  Process Order
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    const updated = inquiries.map(i => i.id === pharmacistSelectedOrder.id ? { ...i, status: 'Awaiting Dispatch' } : i);
                    setInquiries(updated);
                    setPharmacistSelectedOrder(null);
                  }}
                >
                  Send to Logistics
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    const updated = inquiries.map(i => i.id === pharmacistSelectedOrder.id ? { ...i, status: 'Cancelled' } : i);
                    setInquiries(updated);
                    setPharmacistSelectedOrder(null);
                  }}
                  style={{ color: '#ef4444', borderColor: '#ef4444' }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacist Dispense Presc Modal */}
      {pharmacistSelectedPrescription && (
        <div className="modal-backdrop" onClick={() => setPharmacistSelectedPrescription(null)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Generate Dispense Order</h3>
              <button className="close-btn" onClick={() => setPharmacistSelectedPrescription(null)}>×</button>
            </div>
            <form onSubmit={handleCreatePrescOrder} style={{ padding: '1rem 0', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                <strong>Prescription to Dispense:</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-accent)' }}>{pharmacistSelectedPrescription.prescription}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  Patient: {pharmacistSelectedPrescription.patientName} | Doctor: {pharmacistSelectedPrescription.doctor}
                </div>
              </div>

              {/* Drug inventory stock selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Inventory Stock Matcher (Tick to add):</strong>
                <div style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  {CLINIC_DRUG_STOCK.map(drug => {
                    const isChecked = selectedDrugs.some(d => d.id === drug.id);
                    return (
                      <label key={drug.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updated;
                            if (e.target.checked) {
                              updated = [...selectedDrugs, drug];
                            } else {
                              updated = selectedDrugs.filter(d => d.id !== drug.id);
                            }
                            setSelectedDrugs(updated);
                            // Auto sum pricing
                            const total = updated.reduce((sum, d) => sum + d.price, 0);
                            setPrescOrderForm(prev => ({ ...prev, cost: total.toString() }));
                          }}
                          style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                        />
                        <span style={{ color: isChecked ? 'var(--color-accent)' : 'inherit' }}>
                          {drug.name} <strong style={{ color: 'rgba(255,255,255,0.6)' }}>(₦{drug.price.toLocaleString()})</strong>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Selection Summary */}
              {selectedDrugs.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem' }}>
                  <strong>Selected Package Contents:</strong>
                  <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.2rem' }}>
                    {selectedDrugs.map(d => d.name).join(', ')}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Shipping / Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, City, State"
                  value={prescOrderForm.address}
                  onChange={(e) => setPrescOrderForm({ ...prescOrderForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Dispensing Notes & Instructions</label>
                <textarea
                  rows="2"
                  placeholder="Dosage instructions, substitute details..."
                  value={prescOrderForm.notes}
                  onChange={(e) => setPrescOrderForm({ ...prescOrderForm, notes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Finalize Amount (₦) *</label>
                <input
                  type="number"
                  required
                  value={prescOrderForm.cost}
                  onChange={(e) => setPrescOrderForm({ ...prescOrderForm, cost: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-accent">Dispatch Package</button>
                <button type="button" className="btn btn-outline" onClick={() => setPharmacistSelectedPrescription(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Enter Results Modal */}
      {labSelectedRequest && (
        <div className="modal-backdrop" onClick={() => setLabSelectedRequest(null)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Upload Diagnostics Results: {labSelectedRequest.id}</h3>
              <button className="close-btn" onClick={() => setLabSelectedRequest(null)}>×</button>
            </div>
            <form onSubmit={handleSaveLabResults} style={{ padding: '1rem 0' }}>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                <strong>Patient:</strong> {labSelectedRequest.patientName} <br />
                <strong>Tests Requested:</strong> {labSelectedRequest.symptoms}
              </div>

              <div className="form-group">
                <label>Laboratory Findings & Report Findings *</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Enter detailed clinical findings, blood values, ranges..."
                  value={labResultsText}
                  onChange={(e) => setLabResultsText(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">Complete Test & Upload</button>
                <button type="button" className="btn btn-outline" onClick={() => setLabSelectedRequest(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logistics Detail & Issues Modal */}
      {logisticsSelectedShipment && (
        <div className="modal-backdrop" onClick={() => setLogisticsSelectedShipment(null)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Delivery details: {logisticsSelectedShipment.id}</h3>
              <button className="close-btn" onClick={() => setLogisticsSelectedShipment(null)}>×</button>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <p><strong>Customer Name:</strong> {logisticsSelectedShipment.name}</p>
              <p><strong>Phone:</strong> {logisticsSelectedShipment.phone}</p>
              <p style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: '6px' }}>
                <strong>Logistics details:</strong> <br />
                {logisticsSelectedShipment.message}
              </p>

              <form onSubmit={handleSaveDeliveryIssue} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Log Delivery Issue or Custom Alert Note</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="e.g. Recipient phone switched off, gates locked..."
                    value={deliveryIssueText}
                    onChange={(e) => setDeliveryIssueText(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-outline" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>Log Logistics Issue</button>
                  <button type="button" className="btn btn-outline" onClick={() => setLogisticsSelectedShipment(null)}>Close</button>
                </div>
              </form>
            </div>
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
            href="https://chat.whatsapp.com/C73ZsPudjxaAYzA20f3yJm?s=sh&p=a&ilr=4"
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
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-indigo)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {previewBookingDoc.name}
                  {previewBookingDoc.verified !== false && (
                    <i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', fontSize: '1rem' }} title="Verified Doctor"></i>
                  )}
                </strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '0.15rem' }}>
                  {previewBookingDoc.level || 'Junior Doctor'} • {getSpecialtyTitle(previewBookingDoc.specialty)}
                </div>
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
              <h4>1. Telehealth Consent & Clinical Scope</h4>
              <p>By using SimmyCare, you consent to receive remote clinical evaluations, diagnostic advice, and prescriptions from certified healthcare professionals. You acknowledge that telehealth consultations are not a substitute for emergency medical care. In case of a medical emergency, please visit the nearest physical emergency facility immediately.</p>

              <h4>2. Compliance with Data Protection Regulations (NDPR & GDPR)</h4>
              <p>SimmyCare complies with the Nigeria Data Protection Regulation (NDPR) and other applicable international data privacy standards. We process your personal and sensitive data (including health status, medical history, and clinical logs) solely with your explicit consent, which you grant by using our services. You retain the right to request access to, correction of, or erasure of your personal data at any time.</p>

              <h4>3. Medical Confidentiality (National Health Act, 2014)</h4>
              <p>In accordance with Section 26 of the National Health Act, 2014, all patient records are strictly confidential. We implement strict Role-Based Access Control (RBAC) and Row-Level Security (RLS) on our servers: only the assigned licensed medical doctor, authorized lab technicians, pharmacists, and logistics dispatchers have access to the specific patient logs required to fulfill their clinical duties.</p>

              <h4>4. Data Transmission & Messaging Consent</h4>
              <p>You consent to receive booking updates, health tips, and diagnostic reports via encrypted electronic channels, including email (Simmyclinic@gmail.com) and WhatsApp (+234 901 432 4442). You acknowledge that while we secure our transmission protocols, electronic communications carry inherent networks risks.</p>

              <h4>5. Physical Referrals & Jurisdiction</h4>
              <p>SimmyCare coordinates physical consultations and emergency diagnostics with fully registered and licensed partner clinics in Abuja, Kaduna, Kano, Bauchi, Gombe, and other approved jurisdictions in Nigeria.</p>

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
