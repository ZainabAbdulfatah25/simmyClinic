import React, { useState, useEffect } from 'react';
import { supabase, uploadAvatarToSupabase, isSupabaseConfigured } from './supabaseClient';
import { appointmentsApi, pharmacyOrdersApi, labRequestsApi, clinicDrugsApi, profilesApi } from './services/api';
import doctorFatimaImg from './assets/doctor_fatima.jpg';
import doctorAdamImg from './assets/doctor_adam.jpg';
import doctorTijjaniImg from './assets/doctor_saddiqa.jpg';
import doctorBamalliImg from './assets/doctor_bamalli.jpg';
import doctorWasilaImg from './assets/doctor_wasila.jpg';
import doctorHadizaImg from './assets/doctor_hadiza.jpg';
import doctorAsmauImg from './assets/doctor_asmau.png';
import doctorSaimaImg from './assets/doctor_saima.jpg';
import pharmMashkuratuImg from './assets/pharm_mashkuratu_jibril.jpg';
import firdausiSaniImg from './assets/firdausi_sani_usman.jpg';
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

const CLINIC_LAB_STOCK = [
  { id: 'lab-1', name: 'Full Blood Count (FBC) Diagnostic Panel', price: 8000, category: 'Hematology', desc: 'General screening for anemia, infections & immunity.' },
  { id: 'lab-2', name: 'Fasting Blood Sugar (FBS) Test Strips & Kit', price: 2500, category: 'Biochemistry', desc: 'Diabetes screening & glycemic evaluation.' },
  { id: 'lab-3', name: 'Malaria Smear & Widal Typhoid Panel', price: 5000, category: 'Parasitology', desc: 'Rapid diagnostic screening for common fevers.' },
  { id: 'lab-4', name: 'Lipid Profile Diagnostic Test (Cholesterol)', price: 12000, category: 'Biochemistry', desc: 'Measures HDL, LDL, and cardiovascular markers.' },
  { id: 'lab-5', name: 'Kidney Function Test (KFT / E/U/Cr)', price: 15000, category: 'Nephrology', desc: 'Evaluates urea, creatinine, and electrolytes.' },
  { id: 'lab-6', name: 'Liver Function Test (LFT) Reagents', price: 15000, category: 'Biochemistry', desc: 'Assesses liver proteins and enzyme health.' },
  { id: 'lab-7', name: 'Urine Analysis Multistix 10-Parameter Strips', price: 3000, category: 'Urinalysis', desc: 'Screening for UTIs, glucose levels & kidney status.' },
  { id: 'lab-8', name: 'Hepatitis B & C Rapid Test Cassettes', price: 3500, category: 'Serology', desc: 'Rapid viral hepatitis antibody screening.' },
  { id: 'lab-9', name: 'COVID-19 & Flu Rapid Ag Test Kits', price: 5000, category: 'Virology', desc: 'Respiratory viral antigen diagnostic cassette.' }
];


const NIGERIA_LOCATION_DATA = {
  "Abuja (FCT)": {
    "Abuja Municipal (AMAC)": ["Wuse Zone 1-7", "Wuse II", "Garki I & II", "Maitama", "Asokoro", "Jabi", "Utako", "Gwarinpa", "Lugbe", "Karu", "Nyanya", "City Centre", "Kabusa"],
    "Bwari": ["Bwari Central", "Kubwa", "Dutse Alhaji", "Ushafa", "Dawaki", "Mpape", "Byazhin", "Igu"],
    "Gwagwalada": ["Gwagwalada Center", "Kutunku", "Paiko", "Dobi", "Tungan Maje", "Zuba"],
    "Kuje": ["Kuje Central", "Rubochi", "Gaube", "Chibiri", "Kujo"],
    "Kwali": ["Kwali Ward", "Kilankwa", "Yangoji", "Sheda", "Ashara"],
    "Abaji": ["Abaji Central", "Abaji East", "Nuku", "Yaba"]
  },
  "Lagos State": {
    "Ikeja": ["Alausa", "Ikeja GRA", "Agidingbi", "Oregun", "Ojodu", "Computer Village", "Anifowoshe"],
    "Eti-Osa": ["Ikoyi", "Victoria Island", "Lekki Phase 1 & 2", "Ikate", "Ajah", "Chevron", "Sangotedo", "VGC"],
    "Lagos Mainland": ["Yaba", "Ebute Metta", "Akoka", "Sabo", "Iwaya"],
    "Surulere": ["Ojuelegba", "Aguda", "Itire", "Ijesha", "Surulere Central"],
    "Alimosho": ["Egbeda", "Idimu", "Igando", "Ikotun", "Ipaja", "Ayobo"],
    "Lagos Island": ["Olowogbowo", "Marina", "Lagos Island East", "Lagos Island West"],
    "Ikorodu": ["Ikorodu Central", "Ipakodo", "Imota", "Ikorodu North"],
    "Kosofe": ["Gbagada", "Ojota", "Ikosi", "Ketu", "Mile 12"]
  },
  "Kano State": {
    "Kano Municipal": ["Shahuchi", "Sharada", "Zango", "Jakara", "Gandun Albasa", "Goron Dutse"],
    "Nasarawa": ["Dakata", "Giginyu", "Tudun Wada", "Kaura Goje", "Gama"],
    "Dala": ["Dala", "Kabuga", "Gwammaja", "Madabo", "Yahaya Gusau"],
    "Gwale": ["Gwale", "Diso", "Dorayi", "Galadanci"],
    "Tarauni": ["Tarauni", "Gyadi-Gyadi", "Unguwa Uku", "Hotoro"]
  },
  "Rivers State": {
    "Port Harcourt": ["Port Harcourt Township", "Diobu", "GRA Phase 1-4", "D-Line", "Borokiri"],
    "Obio-Akpor": ["Rumuokoro", "Rumuola", "Trans Amadi", "GRA Phase 5", "Elelenwo", "Eliozu"],
    "Oyigbo": ["Oyigbo West", "Asa", "Komkom", "Afam"]
  },
  "Oyo State": {
    "Ibadan North": ["Bodija", "Agbowo", "Sango", "University of Ibadan", "Samonda"],
    "Ibadan South-West": ["Ring Road", "Challenge", "Molete", "Oluyole", "Iyaganku"],
    "Ibadan North-East": ["Agodi", "Iwo Road", "Testing Ground", "Monatan"]
  },
  "Kaduna State": {
    "Kaduna North": ["Barnawa", "Sabon Gari", "Badarawa", "Unguwan Rimi", "Kawo"],
    "Kaduna South": ["Kakuri", "Tudun Wada", "Sabon Tasha", "Television"]
  },
  "Enugu State": {
    "Enugu North": ["Independence Layout", "New Haven", "Ogbete", "GRA Enugu"],
    "Enugu South": ["Uwani", "Achara Layout", "Awkunanaw", "Garriki"]
  },
  "Edo State": {
    "Oredo": ["GRA Benin", "Ring Road", "Airport Road", "Uselu", "New Benin"],
    "Ikpoba-Okha": ["Aduwawa", "St Saviour", "Upper Sakponba", "Ikpoba Hill"]
  },
  "Anambra State": {
    "Awka South": ["Awka Central", "Amawbia", "Nise", "Okpuno"],
    "Onitsha North": ["GRA Onitsha", "Inland Town", "Odoakpu", "Fegge"]
  },
  "Delta State": {
    "Warri South": ["Warri Central", "Effurun", "Enerhen", "Okumagba"],
    "Oshimili South": ["Asaba GRA", "Okpanam Road", "Cable Point", "Nnebisi"]
  },
  "Ogun State": {
    "Abeokuta South": ["Ibara", "Oke-Ilewo", "Ake", "Isale-Igbein"],
    "Ado-Odo/Ota": ["Sango Ota", "Itta", "Igbesa", "Agbado"]
  },
  "Kwara State": {
    "Ilorin South": ["Fate", "Challenge", "Gbagba", "Tanke"],
    "Ilorin West": ["Taiwo Road", "Adewole", "Sawmill", "Oja Oba"]
  },
  "Other State / Region": {
    "General Area": ["Central Ward", "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Other Ward"]
  }
};

const isSupabaseReady = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && anonKey && url !== 'https://placeholder.supabase.co' && !url.includes('placeholder'));
};

const getSpecialtyTitle = (specialty) => {
  if (!specialty) return '';
  const mapping = {
    'Gynaecology': 'Obstetrician & Gynaecologist',
    'Obstetrics & Gynaecology': 'Obstetrician & Gynaecologist',
    'Pediatrics': 'Pediatrician',
    'General Medicine': 'General Practitioner',
    'Laboratory': 'Laboratory Specialist',
    'Pharmacy': 'Pharmacist',
    'Dentistry': 'Dentist',
    'Optometry': 'Optometrist',
    'Cardiology': 'Cardiologist',
    'Dermatology': 'Dermatologist',
    'Psychology': 'Psychology & Mental Health Specialist',
    'Public Health': 'Public Health & Community Health Officer',
    'ENT': 'ENT Specialist (Ear, Nose & Throat)'
  };
  return mapping[specialty] || specialty;
};

const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "Dr. Fatima Yahaya Maiauduga",
    specialty: "Obstetrics & Gynaecology",
    schedule: "Mon - Wed (9am - 2pm)",
    experience: "8 Years",
    regNo: "MDCN/8431",
    image: doctorFatimaImg,
    email: "fatima@simmycare.com",
    password: "password123",
    phone: "08034567890",
    bio: "Junior doctor specializing in obstetrics, gynecology, maternal care, and female reproductive wellness under senior clinical supervision.",
    clinicRoom: "Room 102, West Wing",
    license: "MDCN/8431",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Junior Doctor",
    patientCapacity: "30 patients/month",
    remunerationNotes: "Standard clinical rate"
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
    license: "MDCN/7123",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Mobile Laboratory"],
    verified: true,
    level: "Consultant",
    patientCapacity: "40 patients/month",
    remunerationNotes: "Standard clinical rate"
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
    license: "MDCN/6203",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Senior Consultant",
    patientCapacity: "35 patients/month",
    remunerationNotes: "Special project consultancy rate negotiable"
  },
  {
    id: 4,
    name: "Dr. Abubakar Muhammad Bamalli",
    specialty: "Obstetrics & Gynaecology",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "9 Years",
    regNo: "MDCN/5890",
    image: doctorBamalliImg,
    email: "abubakarbalili79@gmail.com",
    password: "password123",
    phone: "+234 813 870 5738",
    bio: "Senior Consultant Obstetrician & Gynaecologist with 9 years of clinical practice in maternal health, reproductive medicine, high-risk obstetrics, and general medical care.",
    clinicRoom: "Room 207, Main Block",
    license: "MDCN/5890",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Senior Consultant",
    patientCapacity: "30 patients/month",
    remunerationNotes: "Standard clinical rate"
  },
  {
    id: 5,
    name: "Dr. Wasila Goranduma",
    specialty: "Laboratory",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "6 Years",
    regNo: "MLS/REG",
    image: doctorWasilaImg,
    email: "wasilagoranduma@gmail.com",
    password: "password123",
    phone: "+234 803 133 8534",
    bio: "Registered Medical Laboratory Scientist with 6 years of progressive experience in clinical laboratory diagnostics, public health screening, and quality assurance. Happy to collaborate and give maximum support any time.",
    clinicRoom: "Room 105, Diagnostic Wing",
    license: "MLS/REG/6831",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Mobile Laboratory"],
    verified: true,
    level: "Diagnostic Specialist",
    patientCapacity: "25 patients/month",
    remunerationNotes: "Negotiable for specialized diagnostic procedures"
  },
  {
    id: 6,
    name: "Hadiza Garba Ammani",
    specialty: "Psychology",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "9 Years",
    regNo: "MNCP/9821",
    image: doctorHadizaImg,
    email: "kadykubra@gmail.com",
    password: "password123",
    phone: "+234 706 665 0730",
    bio: "Dedicated and compassionate mental health specialist committed to promoting well-being, active listening, and culturally sensitive evidence-based mental health services.",
    clinicRoom: "Room 108, Wellness Wing",
    license: "MNCP/9821",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation"],
    verified: true,
    level: "Senior Consultant",
    patientCapacity: "5 patients/month",
    remunerationNotes: "Flexible consultancy rates based on nature and scope of assignment."
  },
  {
    id: 7,
    name: "Asma'u Zubairu",
    specialty: "Public Health",
    schedule: "Mon - Fri (8am - 4pm)",
    experience: "10 Years",
    regNo: "CHO/7812",
    image: doctorAsmauImg,
    email: "ridwanasmau901@gmail.com",
    password: "password123",
    phone: "+234 916 652 1888",
    bio: "Dedicated Community Health Officer committed to promoting quality primary healthcare through disease prevention, treatment of minor ailments, and health education.",
    clinicRoom: "Room 114, Community Health Unit",
    license: "CHO/7812",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation", "Home Services"],
    verified: true,
    level: "Senior Consultant",
    patientCapacity: "30 patients/month",
    remunerationNotes: "Negotiable based on scope of services, location, workload, and contract terms."
  },
  {
    id: 8,
    name: "Dr. Mohammed Sa'ima Jibril",
    specialty: "ENT",
    schedule: "Mon - Fri (9am - 5pm)",
    experience: "15 Years",
    regNo: "MDCN/4521",
    image: doctorSaimaImg,
    email: "mohammedrealsaemaj@gmail.com",
    password: "password123",
    phone: "+234 901 432 4442",
    bio: "Experienced ENT Specialist and Public Health Practitioner (ENT/MPH) with 15 years of clinical expertise in ear, nose, and throat care and preventive medicine.",
    clinicRoom: "Room 201, ENT & Specialist Wing",
    license: "MDCN/4521",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation", "Home Services"],
    verified: true,
    level: "Senior Consultant",
    patientCapacity: "Flexible / Unlimited",
    remunerationNotes: "Home services or traveling fees are negotiable."
  },
  {
    id: 9,
    name: "Pharm. Mashkuratu Jibril",
    specialty: "Pharmacy",
    schedule: "Mon - Sat (8am - 6pm)",
    experience: "3 Years",
    regNo: "PCN/P/1042",
    image: pharmMashkuratuImg,
    email: "mashkuratujibril@gmail.com",
    password: "password123",
    phone: "+234 810 581 9033",
    bio: "I am Mashkuratu Jibril, a dedicated and compassionate Pharmacy Technician with progressive experience in pharmaceutical care, drug dispensing, inventory management, and patient counseling.",
    clinicRoom: "Central Pharmacy, Ground Floor",
    license: "PCN/P/1042",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Pharmacy Delivery", "Online Consultation"],
    verified: true,
    level: "Head Pharmacist",
    patientCapacity: "50 patients/month",
    remunerationNotes: "Standard clinical rate"
  },
  {
    id: 10,
    name: "Firdausi Sani Usman",
    specialty: "General Medicine",
    schedule: "Mon - Fri (8am - 4pm)",
    experience: "5 Years",
    regNo: "NMCN/REG/4819",
    image: firdausiSaniImg,
    email: "firdausisani@gmail.com",
    password: "password123",
    phone: "+234 803 987 6543",
    bio: "Dedicated clinical care practitioner and nursing officer committed to patient triage, vital signs monitoring, inpatient care, and wellness support.",
    clinicRoom: "Room 104, Clinical Care Unit",
    license: "NMCN/REG/4819",
    consultationRate: "₦3,000",
    consultationDuration: "30 mins",
    services: ["Online Consultation", "Physical Consultation", "Home Services"],
    verified: true,
    level: "Senior Care Officer",
    patientCapacity: "40 patients/month",
    remunerationNotes: "Standard clinical rate"
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
    doctorName: "Dr. Fatima Ibrahim",
    isNhis: true,
    nhisNumber: "NHIS-928415-NG",
    nhisHmo: "NHIA Primary Scheme"
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
    doctorName: "Dr. Fatima Ibrahim",
    isNhis: false,
    nhisNumber: "",
    nhisHmo: ""
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

// Reusable Doctor Avatar Component with stateful error fallback
function DoctorAvatar({ image, name, size = 36, border = '2px solid var(--color-accent)', className = '' }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  const initials = (name || '')
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DR';

  const hasImage = image && typeof image === 'string' && image.length > 5 && !imgError;

  if (hasImage) {
    return (
      <img
        className={className}
        src={image}
        alt={name || 'Doctor'}
        onError={() => setImgError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border,
          flexShrink: 0
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #182B49, #2C5D88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size <= 40 ? '0.8rem' : size <= 70 ? '1.25rem' : '1.75rem',
        color: '#fff',
        fontWeight: 'bold',
        flexShrink: 0,
        border
      }}
    >
      {initials}
    </div>
  );
}

export default function App() {
  // --- Persistent State ---
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validViews = [
      'home', 'doctors', 'booking', 'contact', 'portal-login', 'dashboard', 'pricing',
      'service-online-consultation', 'service-mobile-lab', 'service-pharmacy-delivery', 'service-home-services', 'service-physical-consult',
      'specialty-general-medicine', 'specialty-pediatrics', 'specialty-gynaecology', 'specialty-psychology', 'specialty-dentistry'
    ];
    return validViews.includes(hash) ? hash : 'home';
  });

  // Map seed doctor IDs to their bundled image imports so they survive localStorage serialization
  const BUNDLED_IMAGES = { 
    1: doctorFatimaImg, 
    2: doctorAdamImg, 
    3: doctorTijjaniImg, 
    4: doctorBamalliImg,
    5: doctorWasilaImg,
    6: doctorHadizaImg,
    7: doctorAsmauImg,
    8: doctorSaimaImg,
    9: pharmMashkuratuImg,
    10: firdausiSaniImg
  };

  // Data version - increment to force localStorage refresh and remove stale/dummy data
  const DATA_VERSION = "v20_obstetrics_gynecology_damaturu_staff_expansion";

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
      const merged = parsed.map(doc => {
        const seedDoc = INITIAL_DOCTORS.find(sd => sd.id === doc.id);
        const updatedDoc = {
          ...doc,
          specialty: seedDoc ? seedDoc.specialty : doc.specialty,
          level: seedDoc ? seedDoc.level : doc.level,
          bio: seedDoc ? seedDoc.bio : doc.bio,
          consultationRate: doc.consultationRate !== undefined ? doc.consultationRate : (seedDoc ? seedDoc.consultationRate : ''),
          consultationDuration: doc.consultationDuration !== undefined ? doc.consultationDuration : (seedDoc ? seedDoc.consultationDuration : '30 mins'),
          services: doc.services !== undefined ? doc.services : (seedDoc ? seedDoc.services : [])
        };
        if (BUNDLED_IMAGES[doc.id] && (!doc.image || (!doc.image.startsWith('data:') && !doc.image.startsWith('http')))) {
          updatedDoc.image = BUNDLED_IMAGES[doc.id];
        }
        return updatedDoc;
      });
      const cachedIds = merged.map(d => d.id);
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
  const [showAllDoctors, setShowAllDoctors] = useState(false);

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
    symptoms: '',
    isNhis: false,
    nhisNumber: '',
    nhisHmo: 'NHIA Primary Scheme',
    serviceType: 'Virtual Consultation',
    packageTitle: '',
    price: '',
    consultationMode: 'Virtual Consultation',
    stateName: '',
    lga: '',
    ward: '',
    homeAddress: ''
  });

  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });
  const [successModal, setSuccessModal] = useState(null); // { title: '', message: '', ticket: '' }
  const [showTermsModal, setShowTermsModal] = useState(null); // null | 'view' | 'booking' | 'register'
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [bookingConsent, setBookingConsent] = useState(false);
  const [registerConsent, setRegisterConsent] = useState(false);

  // Rider Onboarding Modal states
  const [showRiderOnboardModal, setShowRiderOnboardModal] = useState(false);
  const [riderForm, setRiderForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'Motorbike',
    dispatchArea: 'Abuja Central',
    password: 'password123'
  });

  // --- Cart & Checkout States for Service Pages ---
  const [labCart, setLabCart] = useState([]);
  const [pharmacyCart, setPharmacyCart] = useState([]);
  const [labCheckout, setLabCheckout] = useState({ name: '', email: '', phone: '', date: '', address: '', notes: '' });
  const [pharmacyCheckout, setPharmacyCheckout] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [homeServiceCheckout, setHomeServiceCheckout] = useState({ name: '', email: '', phone: '', date: '', stateName: '', lga: '', ward: '', address: '', notes: '', package: 'Elderly Care & Companion Visit' });

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

  // Admin Staff Control States
  const [admins, setAdmins] = useState(() => {
    const stored = localStorage.getItem("simmy_admins");
    if (stored) {
      return JSON.parse(stored);
    } else {
      const storedCreds = localStorage.getItem("simmy_admin_credentials");
      const creds = storedCreds ? JSON.parse(storedCreds) : { username: 'admin', password: 'admin' };
      return [
        { staffId: 'ADM-0001', name: 'System Administrator', username: creds.username, email: 'admin@simmycare.com', password: creds.password }
      ];
    }
  });

  const [editingPharmacistId, setEditingPharmacistId] = useState(null);
  const [newPharmacistData, setNewPharmacistData] = useState({
    name: '', email: '', password: '', phone: '', pharmacyName: '', pharmacyLicense: '', verified: true, active: true
  });

  const [editingLabId, setEditingLabId] = useState(null);
  const [newLabData, setNewLabData] = useState({
    name: '', email: '', password: '', phone: '', facilityName: '', labLicense: '', verified: true, active: true
  });

  const [editingLogisticsId, setEditingLogisticsId] = useState(null);
  const [newLogisticsData, setNewLogisticsData] = useState({
    name: '', email: '', password: '', phone: '', vehicleType: 'Motorbike', dispatchArea: '', verified: true, active: true
  });

  const [editingAdminId, setEditingAdminId] = useState(null);
  const [newAdminData, setNewAdminData] = useState({
    name: '', username: '', email: '', password: ''
  });

  const generateStaffId = (role, list) => {
    const prefixMap = {
      doctor: 'DOC',
      pharmacist: 'PHM',
      lab: 'LAB',
      logistics: 'LGT',
      admin: 'ADM'
    };
    const prefix = prefixMap[role] || 'STF';
    let isUnique = false;
    let staffId = '';
    while (!isUnique) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      staffId = `${prefix}-${randNum}`;
      isUnique = !list.some(item => item.staffId === staffId);
    }
    return staffId;
  };

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

  // Drug Inventory Stock States
  const [clinicDrugStock, setClinicDrugStock] = useState(() => {
    const stored = localStorage.getItem("simmy_clinic_drug_stock");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return CLINIC_DRUG_STOCK.map((d, index) => ({ ...d, id: d.id || `dg-${index+1}`, in_stock: true }));
  });

  useEffect(() => {
    localStorage.setItem("simmy_clinic_drug_stock", JSON.stringify(clinicDrugStock));
  }, [clinicDrugStock]);

  const [newDrugForm, setNewDrugForm] = useState({ name: '', price: '', category: 'Analgesics', in_stock: true });
  const [showAddDrugModal, setShowAddDrugModal] = useState(false);
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  // Lab Diagnostic Kit Inventory Stock States
  const [clinicLabStock, setClinicLabStock] = useState(() => {
    const stored = localStorage.getItem("simmy_clinic_lab_stock");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return CLINIC_LAB_STOCK.map((item, index) => ({ ...item, id: item.id || `lab-${index+1}`, in_stock: true }));
  });

  useEffect(() => {
    localStorage.setItem("simmy_clinic_lab_stock", JSON.stringify(clinicLabStock));
  }, [clinicLabStock]);

  const [newLabKitForm, setNewLabKitForm] = useState({ name: '', price: '', category: 'Hematology', desc: '', in_stock: true });
  const [showAddLabKitModal, setShowAddLabKitModal] = useState(false);
  const [labKitSearchQuery, setLabKitSearchQuery] = useState('');
  const [labKitCategoryFilter, setLabKitCategoryFilter] = useState('All');

  // Custom Edit Price Modal State
  const [editPriceModal, setEditPriceModal] = useState(null);

  // Pricing Page & Admin Receipts States
  const [pricingCategory, setPricingCategory] = useState('consultations');
  const [pricingSearch, setPricingSearch] = useState('');
  const [pricingIsNhis, setPricingIsNhis] = useState(false);
  const [adminReceiptSearch, setAdminReceiptSearch] = useState('');
  const [adminReceiptFilter, setAdminReceiptFilter] = useState('All');

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
  const [logisticsStatusFilter, setLogisticsStatusFilter] = useState('All');
  const [labStatusFilter, setLabStatusFilter] = useState('All');
  const [pharmacyStatusFilter, setPharmacyStatusFilter] = useState('All');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('All');
  const [adminStatusFilter, setAdminStatusFilter] = useState('All');
  const [onboardRiderForm, setOnboardRiderForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleType: 'Motorbike',
    dispatchArea: ''
  });

  // Payment & Receipt Management States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalItem, setPaymentModalItem] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank_transfer');

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleOpenPayment = (item, type = 'appointment') => {
    setPaymentModalItem({ item, type });
    setSelectedPaymentMethod('bank_transfer');
    setShowPaymentModal(true);
  };

  const handleViewReceipt = (item, type = 'appointment') => {
    setReceiptData({ item, type });
    setShowReceiptModal(true);
  };

  const getVerifierIdentity = (role) => {
    // Resolve the actual logged-in staff member's name and role label
    if (role === 'admin') {
      return { name: adminCredentials?.username || 'Admin', label: 'System Administrator' };
    } else if (role === 'pharmacist' && loggedInPharmacist) {
      return { name: loggedInPharmacist.name, label: 'Licensed Pharmacist' };
    } else if (role === 'doctor' && loggedInDoctor) {
      return { name: loggedInDoctor.name, label: 'Medical Doctor' };
    } else if (role === 'lab' && loggedInLabOfficer) {
      return { name: loggedInLabOfficer.name, label: 'Lab Officer' };
    }
    return { name: role || 'Staff', label: 'Clinic Staff' };
  };

  const handleStaffApprovePayment = (item, type = 'appointment', staffRole = 'admin') => {
    const receiptId = item.receiptNo || `RC-${Math.floor(100000 + Math.random() * 900000)}`;
    const verifier = getVerifierIdentity(staffRole);
    const verifiedAt = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
    const verifierStamp = `${verifier.name} (${verifier.label})`;

    const updatedFields = {
      paymentStatus: 'Paid & Verified',
      paidApprovedBy: verifierStamp,
      verifiedAt,
      receiptNo: receiptId
    };

    setAppointments(prev => prev.map(apt => apt.id === item.id ? { ...apt, ...updatedFields } : apt));
    setInquiries(prev => prev.map(inq => inq.id === item.id ? { ...inq, ...updatedFields } : inq));
  };

  const renderPaymentStatusBadge = (item, type = 'appointment', role = 'patient') => {
    const status = item.paymentStatus || '';
    const isPaid = status === 'Paid & Verified' || status === 'Paid via NHIS Co-pay';
    const isPending = status === 'Payment Pending Approval' || status === 'Pending Verification' || status === 'Paid via NHIS Co-pay (Pending)';
    const isUnpaid = !isPaid && !isPending;

    if (isPaid) {
      return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <i className="fa-solid fa-circle-check"></i> Paid & Verified
            </span>
            {/* Receipt button — only shown after staff approval */}
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={(e) => { e.stopPropagation(); handleViewReceipt(item, type); }}
              style={{ padding: '0.15rem 0.45rem', fontSize: '0.72rem', borderColor: '#cbd5e1', color: 'var(--color-indigo)', fontWeight: '600' }}
            >
              <i className="fa-solid fa-receipt"></i> Receipt
            </button>
          </div>
          {item.paidApprovedBy && (
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <i className="fa-solid fa-user-shield" style={{ color: '#0284c7', fontSize: '0.65rem' }}></i>
              by {item.paidApprovedBy}
              {item.verifiedAt && <span style={{ color: '#94a3b8' }}> · {item.verifiedAt}</span>}
            </span>
          )}
        </div>
      );

    } else if (isPending) {
      return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#a16207', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <i className="fa-solid fa-clock"></i> Payment Pending Staff Approval
            </span>
            {role !== 'patient' ? (
              <button
                type="button"
                className="btn btn-xs"
                onClick={(e) => { e.stopPropagation(); handleStaffApprovePayment(item, type, role); }}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-check-circle"></i> Approve & Release Receipt
              </button>
            ) : (
              // Patient sees waiting notice — no receipt until approved
              <span style={{ fontSize: '0.72rem', color: '#92400e', background: 'rgba(234,179,8,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <i className="fa-solid fa-hourglass-half"></i> Awaiting staff verification
              </span>
            )}
          </div>
          {role === 'patient' && (
            <span style={{ fontSize: '0.7rem', color: '#78716c' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: '4px', color: '#0284c7' }}></i>
              Your receipt will be released once our team confirms your payment.
            </span>
          )}
        </div>
      );
    } else {
      // Unpaid
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <i className="fa-solid fa-circle-exclamation"></i> Unpaid
          </span>
          {role === 'patient' ? (
            <button
              type="button"
              className="btn btn-accent btn-xs"
              onClick={(e) => { e.stopPropagation(); handleOpenPayment(item, type); }}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 'bold' }}
            >
              <i className="fa-solid fa-credit-card"></i> Pay Now
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-xs"
                onClick={(e) => { e.stopPropagation(); handleStaffApprovePayment(item, type, role); }}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-check-circle"></i> Approve & Release Receipt
              </button>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={(e) => { e.stopPropagation(); handleViewReceipt(item, type); }}
                style={{ padding: '0.15rem 0.45rem', fontSize: '0.72rem', borderColor: '#cbd5e1', color: 'var(--color-indigo)', fontWeight: '600' }}
                title="View Official Invoice / Receipt"
              >
                <i className="fa-solid fa-receipt"></i> Invoice
              </button>
            </>
          )}
        </div>
      );
    }
  };

  const renderPaymentModal = () => {
    if (!showPaymentModal || !paymentModalItem) return null;
    const { item, type } = paymentModalItem;

    let title = "Clinical Consultation";
    let amount = "₦3,000";
    if (type === 'order' || (item.id && item.id.startsWith('ORD-'))) {
      title = "Pharmacy Medication Order";
      const parsed = parseOrderMessage(item.message || '');
      amount = parsed.total !== 'N/A' ? parsed.total : '₦5,500';
    } else if (type === 'lab' || (item.id && item.id.startsWith('LAB-'))) {
      title = "Mobile Lab Diagnostics Test";
      amount = "₦7,500";
    } else {
      title = `Doctor Consultation (${item.doctor || item.doctorName || 'Specialist'})`;
      amount = item.consultationRate || item.cost || "₦3,000";
    }

    return (
      <div className="modal-backdrop" onClick={() => setShowPaymentModal(false)}>
        <div className="modal-content glassmorphic animate-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left' }}>
          <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0 }}><i className="fa-solid fa-credit-card" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i> Pay for {title}</h3>
            <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
              <span>Item / Reference ID:</span>
              <strong style={{ fontFamily: 'monospace' }}>{item.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
              <span>Total Payable Amount:</span>
              <span style={{ color: 'var(--color-accent)' }}>{amount}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Select Payment Option</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${selectedPaymentMethod === 'bank_transfer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedPaymentMethod('bank_transfer')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.85rem', height: 'auto', gap: '0.35rem' }}
              >
                <i className="fa-solid fa-building-columns" style={{ fontSize: '1.3rem' }}></i>
                <span>Bank Transfer</span>
              </button>
              <button
                type="button"
                className={`btn ${selectedPaymentMethod === 'card_gateway' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedPaymentMethod('card_gateway')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.85rem', height: 'auto', gap: '0.35rem' }}
              >
                <i className="fa-solid fa-credit-card" style={{ fontSize: '1.3rem' }}></i>
                <span>Card Gateway</span>
              </button>
              <button
                type="button"
                className={`btn ${selectedPaymentMethod === 'nhis_copay' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedPaymentMethod('nhis_copay')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.85rem', height: 'auto', gap: '0.35rem', gridColumn: 'span 2' }}
              >
                <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.3rem', color: '#0284c7' }}></i>
                <span>NHIS / HMO Insurance Claim (10% Patient Co-Pay)</span>
              </button>
            </div>
          </div>

          {/* Details based on selected payment method */}
          {selectedPaymentMethod === 'bank_transfer' ? (
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.5rem' }}>Direct Bank Transfer Account</div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.35rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Bank Name:</span> <strong>Zenith Bank PLC</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>Account Name:</span> <strong>SimmyCare Digital Health Ltd</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>Account No:</span> <strong style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '1rem' }}>1029384756</strong>
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Transfer exact amount <strong>{amount}</strong> and click "Confirm Payment Sent" below. Staff will verify your payment instantly.
              </p>
            </div>
          ) : selectedPaymentMethod === 'nhis_copay' ? (
            <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.25)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 'bold', color: '#0284c7', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-shield-halved"></i> National Health Insurance (NHIS) Subvention
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>NHIS Covered Benefit (90%):</span>
                  <strong style={{ color: '#16a34a', fontSize: '1rem' }}>
                    ₦{Math.round((parseInt(amount.replace(/[^0-9]/g, '') || 3000) * 0.9)).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Patient Co-Pay Payable (10%):</span>
                  <strong style={{ color: '#0284c7', fontSize: '1rem' }}>
                    ₦{Math.round((parseInt(amount.replace(/[^0-9]/g, '') || 3000) * 0.1)).toLocaleString()}
                  </strong>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Enrollee ID: <strong>{item.nhisNumber || 'NHIS-VERIFIED'}</strong> | Scheme: <strong>{item.nhisHmo || 'NHIA Primary Scheme'}</strong>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 'bold', color: '#34d399', marginBottom: '0.5rem' }}>Paystack / Instant Card Gateway</div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Card Number</label>
                <input type="text" defaultValue="5399 •••• •••• 4211" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Expiry Date</label>
                  <input type="text" defaultValue="12/28" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>CVV</label>
                  <input type="text" defaultValue="842" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>Cancel</button>
            <button
              className="btn btn-accent"
              onClick={() => {
                // All payment methods go to 'Payment Pending Approval' — staff must approve before receipt is released
                const updatedStatus = selectedPaymentMethod === 'nhis_copay' ? 'Paid via NHIS Co-pay (Pending)' : 'Payment Pending Approval';
                const methodLabel = selectedPaymentMethod === 'bank_transfer' ? 'Bank Transfer' : selectedPaymentMethod === 'nhis_copay' ? 'NHIS Co-pay Claim' : 'Card Gateway';
                const receiptId = `RC-${Math.floor(100000 + Math.random() * 900000)}`;

                setInquiries(prev => prev.map(inq => inq.id === item.id ? { ...inq, paymentStatus: updatedStatus, paymentMethod: methodLabel, receiptNo: receiptId, isNhis: selectedPaymentMethod === 'nhis_copay' || inq.isNhis } : inq));
                setAppointments(prev => prev.map(apt => apt.id === item.id ? { ...apt, paymentStatus: updatedStatus, paymentMethod: methodLabel, receiptNo: receiptId, isNhis: selectedPaymentMethod === 'nhis_copay' || apt.isNhis } : apt));
                setShowPaymentModal(false);
              }}
            >
              <i className="fa-solid fa-paper-plane"></i> {selectedPaymentMethod === 'nhis_copay' ? 'Submit NHIS Claim' : 'Confirm Payment Sent — Awaiting Approval'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReceiptModal = () => {
    if (!showReceiptModal || !receiptData) return null;
    const { item, type } = receiptData;
    // Strict: only genuinely staff-approved payments count as paid
    const isPaid = item.paymentStatus === 'Paid & Verified' || item.paymentStatus === 'Paid via NHIS Co-pay';
    const isPending = item.paymentStatus === 'Payment Pending Approval' || item.paymentStatus === 'Pending Verification';
    const receiptId = item.receiptNo || `RC-${Math.floor(100000 + Math.abs((item.id || '1').split('').reduce((a,b)=>a+b.charCodeAt(0),0)) * 89) % 900000}`;
    const dateStr = item.date || new Date().toISOString().split('T')[0];

    // GATE: If patient is viewing and payment is not yet approved, show pending notice instead of full receipt
    const isPatientViewing = authRole === 'patient' || !authRole;
    if (isPatientViewing && !isPaid) {
      return (
        <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content glassmorphic animate-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(234,179,8,0.12)', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem', color: '#ca8a04' }}>
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: 'var(--color-heading)' }}>Receipt Pending Staff Approval</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', margin: '0 0 0.75rem' }}>
              Your payment has been received and is currently being verified by our team.
              Your official receipt will be released to you once a staff member confirms and approves your payment.
            </p>
            <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#92400e', marginBottom: '1.25rem' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: '6px', color: '#0284c7' }}></i>
              Reference ID: <strong style={{ fontFamily: 'monospace' }}>{item.id}</strong>
              {item.paymentMethod && <span> &nbsp;·&nbsp; Method: <strong>{item.paymentMethod}</strong></span>}
            </div>
            <button className="btn btn-outline" onClick={() => setShowReceiptModal(false)}>Close</button>
          </div>
        </div>
      );
    }

    let title = "Clinical Service";
    let patientName = item.patientName || item.name || "Patient";
    let amount = item.cost || item.consultationRate || "₦3,000";
    if (type === 'order' || (item.id && item.id.startsWith('ORD-'))) {
      title = "Pharmacy Medication Order";
      const parsed = parseOrderMessage(item.message || '');
      amount = parsed.total !== 'N/A' ? parsed.total : '₦5,500';
    } else if (type === 'lab' || (item.id && item.id.startsWith('LAB-'))) {
      title = "Mobile Diagnostic Test Package";
      amount = "₦7,500";
    } else {
      title = `Medical Consultation (${item.doctor || item.doctorName || 'Specialist'})`;
    }

    return (
      <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}>
        <div className="modal-content glassmorphic animate-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', color: '#1e293b', background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'left' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <img src={logoSvg} alt="Logo" style={{ height: '32px' }} />
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Simmy<span style={{ color: '#0284c7' }}>Care</span> Health</h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Official Digital Medical Receipt & Invoice</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Receipt No</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', color: '#0284c7' }}>{receiptId}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{dateStr}</div>
            </div>
          </div>

          {/* Verification Badge Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isPaid ? 'rgba(34, 197, 94, 0.08)' : 'rgba(234, 179, 8, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${isPaid ? '#bbf7d0' : '#fef08a'}`, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className={isPaid ? "fa-solid fa-circle-check" : "fa-solid fa-clock"} style={{ color: isPaid ? '#16a34a' : '#ca8a04', fontSize: '1.2rem' }}></i>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: isPaid ? '#15803d' : '#854d0e' }}>
                  {isPaid ? 'PAYMENT VERIFIED & APPROVED' : 'PAYMENT AWAITING VERIFICATION'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Method: <strong>{item.paymentMethod || 'Bank Transfer'}</strong>
                  {item.paidApprovedBy && (
                    <>
                      {' '}&bull;{' '}
                      <i className="fa-solid fa-user-shield" style={{ color: '#0284c7', marginRight: '3px' }}></i>
                      <strong style={{ color: '#0f172a' }}>Verified by: {item.paidApprovedBy}</strong>
                    </>
                  )}
                </span>
                {item.verifiedAt && (
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.15rem' }}>
                    <i className="fa-solid fa-clock" style={{ marginRight: '3px' }}></i>Verified on: {item.verifiedAt}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isPaid && (authRole === 'admin' || authRole === 'pharmacist' || authRole === 'doctor' || authRole === 'lab') && (
                <button
                  className="btn btn-xs"
                  onClick={() => {
                    const verifier = getVerifierIdentity(authRole);
                    const verifiedAt = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
                    const verifierStamp = `${verifier.name} (${verifier.label})`;
                    handleStaffApprovePayment(item, type, authRole);
                    setReceiptData({
                      ...receiptData,
                      item: {
                        ...item,
                        paymentStatus: 'Paid & Verified',
                        paidApprovedBy: verifierStamp,
                        verifiedAt
                      }
                    });
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <i className="fa-solid fa-check"></i> Mark as Paid
                </button>
              )}
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', background: isPaid ? '#22c55e' : '#eab308', color: '#ffffff' }}>
                {isPaid ? 'PAID' : 'PENDING'}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>BILLED TO PATIENT</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{patientName}</strong>
                {item.email && <div style={{ color: '#475569', fontSize: '0.8rem' }}>{item.email}</div>}
                {item.phone && <div style={{ color: '#475569', fontSize: '0.8rem' }}>{item.phone}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>SERVICE CATEGORY</span>
                <strong style={{ color: '#0f172a' }}>{title}</strong>
                <div style={{ color: '#475569', fontSize: '0.8rem' }}>Reference ID: {item.id}</div>
              </div>
            </div>

            {(item.isNhis || item.nhisNumber || item.paymentMethod === 'NHIS Co-pay Claim') && (
              <div style={{ background: '#f0f9ff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-solid fa-shield-halved"></i> NHIS / HMO INSURANCE COVERAGE BENEFIT
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#0369a1', marginTop: '0.15rem' }}>
                    Enrollee No: <strong>{item.nhisNumber || 'NHIS-928415-NG'}</strong> | HMO: <strong>{item.nhisHmo || 'NHIA Primary Scheme'}</strong>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 'bold', background: '#0284c7', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  90% Subvention
                </span>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Description</th>
                  <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0.8rem', color: '#334155' }}>
                    <strong>{title} (Standard Tariff)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {item.symptoms || item.prescription || item.message || 'Clinical consultations & digital health service'}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                    {amount}
                  </td>
                </tr>

                {(item.isNhis || item.nhisNumber || item.paymentMethod === 'NHIS Co-pay Claim') && (
                  <>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#16a34a' }}>
                        <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i>
                        <strong>NHIA Statutory Insurance Subsidy (90%)</strong>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                        -₦{Math.round((parseInt(amount.replace(/[^0-9]/g, '') || 3000) * 0.9)).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f0f9ff' }}>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#0369a1' }}>
                        <strong>Net Enrollee Co-Pay Amount (10%)</strong>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 'bold', color: '#0284c7', fontSize: '1rem' }}>
                        ₦{Math.round((parseInt(amount.replace(/[^0-9]/g, '') || 3000) * 0.1)).toLocaleString()}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Thank you for trusting SimmyCare. Keep this receipt for medical record purposes.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowReceiptModal(false)}
                style={{ borderColor: '#cbd5e1', color: '#475569' }}
              >
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => window.print()}
                style={{ background: '#0284c7', borderColor: '#0284c7' }}
              >
                <i className="fa-solid fa-print"></i> Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminReceiptsView = () => {
    // Collect all appointments with payment info or receipts
    const appointmentReceipts = appointments.map(apt => ({
      id: `RC-APT-${apt.id.replace('APT-', '')}`,
      referenceId: apt.id,
      date: apt.date || 'Today',
      patientName: apt.patientName || 'Patient',
      serviceType: 'Doctor Consultation',
      detail: `${apt.doctor} (${apt.type || 'Virtual'})`,
      amount: apt.isNhis ? Math.round(3000 * 0.1) : 3000,
      originalTariff: 3000,
      paymentMethod: apt.paymentMethod || (apt.isNhis ? 'NHIS 10% Co-Pay' : 'Bank Transfer'),
      paymentStatus: apt.paymentStatus || 'Paid & Verified',
      isNhis: apt.isNhis,
      nhisNumber: apt.nhisNumber,
      nhisHmo: apt.nhisHmo,
      rawItem: apt,
      itemType: 'appointment'
    }));

    // Collect all pharmacy & lab orders with receipts
    const orderReceipts = inquiries.filter(inq => inq.id.startsWith('ORD-') || inq.id.startsWith('LAB-')).map(inq => {
      const isLab = inq.id.startsWith('LAB-');
      const stdPrice = isLab ? 6500 : 8500;
      return {
        id: `RC-ORD-${inq.id.replace(/(ORD|LAB)-/, '')}`,
        referenceId: inq.id,
        date: inq.date || 'Recent',
        patientName: inq.name || 'Patient',
        serviceType: isLab ? 'Laboratory Diagnostic Test' : 'Dispensary Pharmacy Rx',
        detail: inq.subject || (inq.message ? inq.message.slice(0, 40) + '...' : 'Prescription Order'),
        amount: stdPrice,
        originalTariff: stdPrice,
        paymentMethod: inq.paymentMethod || 'Bank Transfer',
        paymentStatus: inq.paymentStatus || 'Paid & Verified',
        isNhis: false,
        rawItem: inq,
        itemType: isLab ? 'lab' : 'pharmacy'
      };
    });

    const allReceipts = [...appointmentReceipts, ...orderReceipts];

    let filtered = allReceipts;
    if (adminReceiptFilter !== 'All') {
      filtered = filtered.filter(r => r.paymentStatus === adminReceiptFilter);
    }
    if (adminReceiptSearch.trim()) {
      const q = adminReceiptSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.referenceId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q)
      );
    }

    const totalVerifiedRevenue = allReceipts
      .filter(r => r.paymentStatus === 'Paid & Verified')
      .reduce((sum, r) => sum + r.amount, 0);

    return (
      <div className="animate-fade">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Generated Receipts & Payments Register</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Audit patient payment proofs, official receipts, and NHIS subvention claims.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#047857', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-cash-register"></i> Total Collected: ₦{totalVerifiedRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: '1 1 250px', margin: 0 }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search receipt #, patient name, ref ID..."
              value={adminReceiptSearch}
              onChange={(e) => setAdminReceiptSearch(e.target.value)}
            />
          </div>

          <div className="specialty-filters" style={{ margin: 0 }}>
            {['All', 'Paid & Verified', 'Pending Verification'].map(status => (
              <button
                key={status}
                className={`filter-btn ${adminReceiptFilter === status ? 'active' : ''}`}
                onClick={() => setAdminReceiptFilter(status)}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Receipts Table */}
        {filtered.length === 0 ? (
          <div className="empty-state glassmorphic" style={{ padding: '2rem', textAlign: 'center' }}>
            <i className="fa-solid fa-receipt" style={{ fontSize: '2rem', color: 'var(--color-text-muted)' }}></i>
            <h4 style={{ marginTop: '0.5rem' }}>No generated receipts found</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No receipts match your search filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Ref ID</th>
                  <th>Patient Name</th>
                  <th>Service Category</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rc => (
                  <tr key={rc.id}>
                    <td>
                      <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {rc.id}
                      </strong>
                    </td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{rc.referenceId}</span></td>
                    <td>
                      <strong>{rc.patientName}</strong>
                      {rc.isNhis && (
                        <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 'bold' }}>
                          NHIS: {rc.nhisNumber || 'Enrollee'}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)' }}>
                        {rc.serviceType}
                      </span>
                    </td>
                    <td>
                      <strong>₦{rc.amount.toLocaleString()}</strong>
                      {rc.isNhis && (
                        <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>10% Co-Pay Rate</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {rc.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: rc.paymentStatus === 'Paid & Verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: rc.paymentStatus === 'Paid & Verified' ? '#047857' : '#b45309'
                      }}>
                        {rc.paymentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setReceiptData({ item: rc.rawItem, type: rc.itemType });
                            setShowReceiptModal(true);
                          }}
                          title="View / Print Official Receipt"
                        >
                          <i className="fa-solid fa-receipt"></i> Inspect Receipt
                        </button>
                        {rc.paymentStatus === 'Pending Verification' && (
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => handleStaffApprovePayment(rc.rawItem, rc.itemType, authRole)}
                            title="Approve & Verify Payment"
                            style={{ position: 'relative', zIndex: 3 }}
                          >
                            <i className="fa-solid fa-check"></i> Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderEditPriceModal = () => {
    if (!editPriceModal) return null;
    return (
      <div className="modal-backdrop" onClick={() => setEditPriceModal(null)}>
        <div
          className="modal-content glassmorphic animate-fade"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '440px', textAlign: 'left' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-tag" style={{ color: 'var(--color-primary)' }}></i> Update Price Tariff
            </h3>
            <button
              onClick={() => setEditPriceModal(null)}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              &times;
            </button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Medication Stock Item
            </div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-heading)' }}>
              {editPriceModal.name}
            </strong>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.35rem' }}>
              New Unit Selling Price (₦)
            </label>
            <input
              type="number"
              step="50"
              value={editPriceModal.price}
              onChange={(e) => setEditPriceModal({ ...editPriceModal, price: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '1.15rem', fontWeight: 'bold' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setEditPriceModal(prev => ({ ...prev, price: Math.round(Number(prev.price) * 1.05) }))}
            >
              +5% Inflation
            </button>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setEditPriceModal(prev => ({ ...prev, price: Math.round(Number(prev.price) * 1.1) }))}
            >
              +10% Rate
            </button>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setEditPriceModal(prev => ({ ...prev, price: Math.round(Number(prev.price) * 0.9) }))}
            >
              -10% Discount
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setEditPriceModal(null)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const num = Number(editPriceModal.price);
                if (!isNaN(num) && num >= 0) {
                  if (editPriceModal.isLab) {
                    setClinicLabStock(prev => prev.map(k => k.id === editPriceModal.id ? { ...k, price: num } : k));
                  } else {
                    setClinicDrugStock(prev => prev.map(d => d.id === editPriceModal.id ? { ...d, price: num } : d));
                  }
                  setEditPriceModal(null);
                } else {
                  alert('Please enter a valid price.');
                }
              }}
            >
              <i className="fa-solid fa-floppy-disk"></i> Save Tariff Price
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStockInventoryView = () => {
    const categories = ['All', 'Analgesics', 'Antibiotics', 'Antimalarials', 'Supplements', 'Antihistamines', 'Respiratory', 'Pediatrics', 'Diagnostics'];
    let filtered = clinicDrugStock;
    if (drugCategoryFilter !== 'All') {
      filtered = filtered.filter(d => d.category === drugCategoryFilter);
    }
    if (drugSearchQuery.trim()) {
      const q = drugSearchQuery.toLowerCase();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
    }

    const inStockCount = clinicDrugStock.filter(d => d.in_stock !== false).length;
    const outOfStockCount = clinicDrugStock.length - inStockCount;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Clinical Drug Inventory & Stock Hub</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Manage available pharmacy inventory, pricing, and stock status across the clinic.</p>
          </div>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setShowAddDrugModal(true)}
          >
            <i className="fa-solid fa-plus"></i> Add New Medication to Stock
          </button>
        </div>

        {/* Stock Summary Cards */}
        <div className="stats-row glassmorphic" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
          <div className="stat-item">
            <h3>{clinicDrugStock.length}</h3>
            <p>REGISTERED MEDICATIONS</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 style={{ color: '#10b981' }}>{inStockCount}</h3>
            <p>AVAILABLE IN STOCK</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 style={{ color: '#ef4444' }}>{outOfStockCount}</h3>
            <p>OUT OF STOCK</p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: '1 1 250px', margin: 0 }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search drug name or category..."
              value={drugSearchQuery}
              onChange={(e) => setDrugSearchQuery(e.target.value)}
            />
          </div>
          <div className="specialty-filters" style={{ margin: 0 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${drugCategoryFilter === cat ? 'active' : ''}`}
                onClick={() => setDrugCategoryFilter(cat)}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        {filtered.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No medications found matching your criteria.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Drug / Medication Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(drug => {
                  const isInStock = drug.in_stock !== false;
                  return (
                    <tr key={drug.id}>
                      <td><strong>{drug.name}</strong></td>
                      <td>
                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {drug.category}
                        </span>
                      </td>
                      <td><strong>₦{Number(drug.price).toLocaleString()}</strong></td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setClinicDrugStock(prev => prev.map(d => d.id === drug.id ? { ...d, in_stock: !isInStock } : d));
                          }}
                          style={{
                            border: 'none',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backgroundColor: isInStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isInStock ? '#047857' : '#b91c1c'
                          }}
                          title="Click to toggle availability"
                        >
                          <i className={`fa-solid ${isInStock ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: '4px' }}></i>
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setEditPriceModal({ id: drug.id, name: drug.name, price: drug.price })}
                            title="Update Price Tariff"
                          >
                            <i className="fa-solid fa-pen-to-square"></i> Price
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => {
                              if (confirm(`Remove ${drug.name} from clinic inventory?`)) {
                                setClinicDrugStock(prev => prev.filter(d => d.id !== drug.id));
                              }
                            }}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                            title="Remove Drug"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderLabStockInventoryView = () => {
    const categories = ['All', 'Hematology', 'Biochemistry', 'Parasitology', 'Serology', 'Virology', 'Nephrology', 'Urinalysis'];
    let filtered = clinicLabStock;
    if (labKitCategoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === labKitCategoryFilter);
    }
    if (labKitSearchQuery.trim()) {
      const q = labKitSearchQuery.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q)));
    }

    const inStockCount = clinicLabStock.filter(item => item.in_stock !== false).length;
    const outOfStockCount = clinicLabStock.length - inStockCount;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Laboratory Diagnostic Kits & Test Inventory</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Manage available laboratory diagnostic kits, test tariffs, and reagent stock availability across the clinic.</p>
          </div>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setShowAddLabKitModal(true)}
          >
            <i className="fa-solid fa-plus"></i> Add New Diagnostic Test / Kit
          </button>
        </div>

        {/* Stock Summary Cards */}
        <div className="stats-row glassmorphic" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
          <div className="stat-item">
            <h3>{clinicLabStock.length}</h3>
            <p>REGISTERED DIAGNOSTIC KITS</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 style={{ color: '#10b981' }}>{inStockCount}</h3>
            <p>AVAILABLE IN STOCK</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 style={{ color: '#ef4444' }}>{outOfStockCount}</h3>
            <p>OUT OF STOCK / REORDER</p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: '1 1 250px', margin: 0 }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search diagnostic kit name or category..."
              value={labKitSearchQuery}
              onChange={(e) => setLabKitSearchQuery(e.target.value)}
            />
          </div>
          <div className="specialty-filters" style={{ margin: 0 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${labKitCategoryFilter === cat ? 'active' : ''}`}
                onClick={() => setLabKitCategoryFilter(cat)}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        {filtered.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No lab diagnostic kits found matching your criteria.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Diagnostic Kit / Test Name</th>
                  <th>Category</th>
                  <th>Standard Tariff</th>
                  <th>Stock Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const isInStock = item.in_stock !== false;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.desc && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.desc}</div>}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {item.category}
                        </span>
                      </td>
                      <td><strong>₦{Number(item.price).toLocaleString()}</strong></td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setClinicLabStock(prev => prev.map(k => k.id === item.id ? { ...k, in_stock: !isInStock } : k));
                          }}
                          style={{
                            border: 'none',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backgroundColor: isInStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isInStock ? '#047857' : '#b91c1c'
                          }}
                          title="Click to toggle availability"
                        >
                          <i className={`fa-solid ${isInStock ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: '4px' }}></i>
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setEditPriceModal({ id: item.id, name: item.name, price: item.price, isLab: true })}
                            title="Update Price Tariff"
                          >
                            <i className="fa-solid fa-pen-to-square"></i> Price
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => {
                              if (confirm(`Remove ${item.name} from clinic lab inventory?`)) {
                                setClinicLabStock(prev => prev.filter(k => k.id !== item.id));
                              }
                            }}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                            title="Remove Kit"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderAdminPharmacyOrdersView = () => {
    const orders = inquiries.filter(inq => inq.id && inq.id.startsWith('ORD-'));
    const totalRevenue = orders.reduce((sum, o) => {
      const costMatch = o.message && o.message.match(/₦([\d,]+)/);
      if (costMatch) {
        return sum + parseInt(costMatch[1].replace(/,/g, ''), 10);
      }
      return sum;
    }, 0);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Pharmacy Medication Orders Registry</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Monitor and manage all patient prescription and over-the-counter medicine delivery orders.</p>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
            Total Revenue: ₦{totalRevenue.toLocaleString()}
          </span>
        </div>

        {orders.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pharmacy medication orders logged in the database yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer / Patient</th>
                  <th>Details & Prescription</th>
                  <th>Status</th>
                  <th>Payment Status</th>
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
                        <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.message}
                        </p>
                      </td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: badgeColor, color: textColor }}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <select
                            value={status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setInquiries(prev => prev.map(inq => inq.id === order.id ? { ...inq, status: newStatus } : inq));
                            }}
                            style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Processing & Packaging">Processing & Packaging</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={() => setAdminSelectedInquiry(order)}>
                            <i className="fa-solid fa-eye"></i> Details
                          </button>
                          <button className="btn btn-outline btn-sm" onClick={() => handleViewReceipt(order, 'order')} title="Generate Invoice / Receipt">
                            <i className="fa-solid fa-receipt"></i> Receipt / Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Shared Real-Time GPS Simulation background timer
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Pharmacy Orders (inquiries) in transit
      setInquiries(prev => {
        let changed = false;
        const next = prev.map(inq => {
          if (inq.id.startsWith('ORD-') && (inq.status === 'Out for Delivery' || inq.isSimulating)) {
            const currentProg = inq.deliveryProgress !== undefined ? inq.deliveryProgress : 0;
            if (currentProg < 100) {
              changed = true;
              return { ...inq, deliveryProgress: Math.min(100, currentProg + 5) };
            }
          }
          return inq;
        });
        return changed ? next : prev;
      });

      // 2. Update Lab Trips (appointments) in transit
      setAppointments(prev => {
        let changed = false;
        const next = prev.map(apt => {
          if (apt.id.startsWith('LAB-') && (apt.isSimulating || (apt.status === 'Pending' && apt.assignedRider) || apt.status === 'Sample Collected')) {
            const currentProg = apt.deliveryProgress !== undefined ? apt.deliveryProgress : 0;
            if (currentProg < 100) {
              changed = true;
              return { ...apt, deliveryProgress: Math.min(100, currentProg + 5) };
            }
          }
          return apt;
        });
        return changed ? next : prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Control Room Live Tracking Map Simulation Progress timer
  useEffect(() => {
    let timer;
    if (isMapSimulating) {
      timer = setInterval(() => {
        setMapSimulationProgress(prev => {
          if (prev >= 100) {
            setIsMapSimulating(false);
            if (mapTrackedTripId) {
              const isOrder = mapTrackedTripId.startsWith('ORD-');
              const setList = isOrder ? setInquiries : setAppointments;
              setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 100, status: isOrder ? 'Delivered' : 'Completed' } : x));
            }
            return 100;
          }
          const nextVal = Math.min(100, prev + 5);
          if (mapTrackedTripId) {
            const isOrder = mapTrackedTripId.startsWith('ORD-');
            const setList = isOrder ? setInquiries : setAppointments;
            setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: nextVal } : x));
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMapSimulating, mapTrackedTripId]);

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

  useEffect(() => {
    localStorage.setItem("simmy_admins", JSON.stringify(admins));
  }, [admins]);

  // Migration to ensure all staff members have a unique staffId
  useEffect(() => {
    let updated = false;

    // 1. Doctors
    const updatedDoctors = doctors.map((d, index) => {
      if (!d.staffId) {
        updated = true;
        return { ...d, staffId: `DOC-${String(d.id || index + 1).padStart(4, '0')}` };
      }
      return d;
    });

    // 2. Pharmacists
    const updatedPharmacists = pharmacists.map((p, index) => {
      if (!p.staffId) {
        updated = true;
        return { ...p, staffId: `PHM-${String(index + 1).padStart(4, '0')}` };
      }
      return p;
    });

    // 3. Labs
    const updatedLabs = labs.map((l, index) => {
      if (!l.staffId) {
        updated = true;
        return { ...l, staffId: `LAB-${String(index + 1).padStart(4, '0')}` };
      }
      return l;
    });

    // 4. Logistics
    const updatedLogistics = logistics.map((l, index) => {
      if (!l.staffId) {
        updated = true;
        return { ...l, staffId: `LGT-${String(index + 1).padStart(4, '0')}` };
      }
      return l;
    });

    // 5. Admins
    const updatedAdmins = admins.map((a, index) => {
      if (!a.staffId) {
        updated = true;
        return { ...a, staffId: `ADM-${String(index + 1).padStart(4, '0')}` };
      }
      return a;
    });

    if (updated) {
      setDoctors(updatedDoctors);
      setPharmacists(updatedPharmacists);
      setLabs(updatedLabs);
      setLogistics(updatedLogistics);
      setAdmins(updatedAdmins);
    }
  }, [doctors, pharmacists, labs, logistics, admins]);

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

  // Helper to merge fetched profiles with existing state lists
  const mergeProfiles = (existingList, fetchedProfiles, role) => {
    const map = new Map();
    existingList.forEach(item => {
      const key = item.email ? item.email.toLowerCase() : item.id;
      if (key) map.set(String(key), item);
    });
    fetchedProfiles.forEach(item => {
      const key = item.email ? item.email.toLowerCase() : item.id;
      if (key) {
        const prev = map.get(String(key)) || {};
        map.set(String(key), { ...prev, ...item, role });
      }
    });
    return Array.from(map.values());
  };

  // Fetch initial data & profiles from Supabase backend if configured
  useEffect(() => {
    async function loadSupabaseBackendData() {
      if (!isSupabaseConfigured()) return;
      try {
        const [apts, orders, labReqs, drugsData, profilesData] = await Promise.all([
          appointmentsApi.getAll(),
          pharmacyOrdersApi.getAll(),
          labRequestsApi.getAll(),
          clinicDrugsApi.getAll(),
          profilesApi.getAllProfiles()
        ]);
        if (apts && apts.length > 0) setAppointments(apts);
        if (orders && orders.length > 0) setInquiries(orders);

        if (profilesData && profilesData.length > 0) {
          const sDoctors = profilesData.filter(p => p.role === 'doctor');
          const sPatients = profilesData.filter(p => p.role === 'patient');
          const sPharmacists = profilesData.filter(p => p.role === 'pharmacist');
          const sLabs = profilesData.filter(p => p.role === 'lab');
          const sLogistics = profilesData.filter(p => p.role === 'logistics');
          const sAdmins = profilesData.filter(p => p.role === 'admin');

          if (sDoctors.length > 0) setDoctors(prev => mergeProfiles(prev, sDoctors, 'doctor'));
          if (sPatients.length > 0) setPatients(prev => mergeProfiles(prev, sPatients, 'patient'));
          if (sPharmacists.length > 0) setPharmacists(prev => mergeProfiles(prev, sPharmacists, 'pharmacist'));
          if (sLabs.length > 0) setLabs(prev => mergeProfiles(prev, sLabs, 'lab'));
          if (sLogistics.length > 0) setLogistics(prev => mergeProfiles(prev, sLogistics, 'logistics'));
          if (sAdmins.length > 0) setAdmins(prev => mergeProfiles(prev, sAdmins, 'admin'));
        }

        // Auto sync all local seed/stored users to Supabase profiles
        profilesApi.syncAllLocalUsers(doctors, patients, pharmacists, labs, logistics, admins);
      } catch (err) {
        console.info('Supabase initial fetch info:', err);
      }
    }
    loadSupabaseBackendData();
  }, []);

  // Supabase Auth Session Restoration — runs once on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Restore existing session on page reload
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile) return;
          sessionStorage.setItem('simmy_auth_role', profile.role);
          setAuthRole(profile.role);
          if (profile.role === 'patient') { setLoggedInPatient(profile); sessionStorage.setItem('simmy_auth_patient', JSON.stringify(profile)); }
          else if (profile.role === 'doctor') { setLoggedInDoctor(profile); sessionStorage.setItem('simmy_auth_doctor', JSON.stringify(profile)); }
          else if (profile.role === 'pharmacist') { setLoggedInPharmacist(profile); sessionStorage.setItem('simmy_auth_pharmacist', JSON.stringify(profile)); }
          else if (profile.role === 'lab') { setLoggedInLab(profile); sessionStorage.setItem('simmy_auth_lab', JSON.stringify(profile)); }
          else if (profile.role === 'logistics') { setLoggedInLogistics(profile); sessionStorage.setItem('simmy_auth_logistics', JSON.stringify(profile)); }
        });
    });

    // Listen for future auth events (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setAuthRole(null);
        setLoggedInPatient(null);
        setLoggedInDoctor(null);
        setLoggedInPharmacist(null);
        setLoggedInLab(null);
        setLoggedInLogistics(null);
        ['simmy_auth_role','simmy_auth_patient','simmy_auth_doctor','simmy_auth_pharmacist','simmy_auth_lab','simmy_auth_logistics'].forEach(k => sessionStorage.removeItem(k));
      }
    });

    return () => subscription?.unsubscribe();
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

  // Router Hash & Navigation Persistence
  useEffect(() => {
    // Scroll listener for scroll persistence across refreshes
    const handleScroll = () => {
      sessionStorage.setItem("simmy_scroll_y", window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position after view or modal changes
  useEffect(() => {
    const savedY = sessionStorage.getItem("simmy_scroll_y");
    if (savedY) {
      const yPos = parseInt(savedY, 10);
      if (!isNaN(yPos) && yPos > 0) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: yPos, behavior: 'instant' });
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [currentView, adminNavView, doctorNavView, previewBookingDoc, adminSelectedDoctor]);

  // Sync state variables to sessionStorage and URL hash/query
  useEffect(() => {
    sessionStorage.setItem("simmy_current_view", currentView);
    sessionStorage.setItem("simmy_admin_nav_view", adminNavView);
    sessionStorage.setItem("simmy_doctor_nav_view", doctorNavView);

    let queryParts = [];
    if (previewBookingDoc) {
      queryParts.push(`doc=${previewBookingDoc.id}`);
      sessionStorage.setItem("simmy_preview_doc_id", previewBookingDoc.id.toString());
    } else {
      sessionStorage.removeItem("simmy_preview_doc_id");
    }

    if (adminSelectedDoctor) {
      queryParts.push(`adminDoc=${adminSelectedDoctor.id}`);
      sessionStorage.setItem("simmy_admin_doc_id", adminSelectedDoctor.id.toString());
    } else {
      sessionStorage.removeItem("simmy_admin_doc_id");
    }

    if (currentView === 'dashboard' && authRole === 'admin') {
      queryParts.push(`adminTab=${adminNavView}`);
    } else if (currentView === 'dashboard' && authRole === 'doctor') {
      queryParts.push(`doctorTab=${doctorNavView}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const newHash = `${currentView}${queryString}`;
    if (window.location.hash.replace('#', '') !== newHash) {
      window.history.replaceState(null, '', `#${newHash}`);
    }
  }, [currentView, adminNavView, doctorNavView, previewBookingDoc, adminSelectedDoctor, authRole]);

  // Restore modals or nested tabs from URL/session on initial load or doctors change
  useEffect(() => {
    const fullHash = window.location.hash.replace('#', '');
    const [, queryPart] = fullHash.split('?');
    const params = new URLSearchParams(queryPart || '');

    const docId = params.get('doc') || sessionStorage.getItem("simmy_preview_doc_id");
    if (docId && doctors.length > 0) {
      const found = doctors.find(d => d.id.toString() === docId.toString());
      if (found) setPreviewBookingDoc(found);
    }

    const adminDocId = params.get('adminDoc') || sessionStorage.getItem("simmy_admin_doc_id");
    if (adminDocId && doctors.length > 0) {
      const found = doctors.find(d => d.id.toString() === adminDocId.toString());
      if (found) setAdminSelectedDoctor(found);
    }
  }, [doctors]);

  // PopState & HashChange Event Handler (Browser Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [viewPart, queryPart] = fullHash.split('?');
      const params = new URLSearchParams(queryPart || '');

      const validViews = [
        'home', 'doctors', 'booking', 'contact', 'portal-login', 'dashboard', 'pricing',
        'service-online-consultation', 'service-mobile-lab', 'service-pharmacy-delivery', 'service-home-services', 'service-physical-consult',
        'specialty-general-medicine', 'specialty-pediatrics', 'specialty-gynaecology', 'specialty-psychology', 'specialty-dentistry'
      ];

      if (viewPart && validViews.includes(viewPart)) {
        const storedRole = sessionStorage.getItem("simmy_auth_role") || authRole;
        if (viewPart === 'dashboard' && !storedRole) {
          setCurrentView('portal-login');
        } else {
          setCurrentView(viewPart);
        }
      }

      const docId = params.get('doc');
      if (docId) {
        const found = doctors.find(d => d.id.toString() === docId);
        if (found) setPreviewBookingDoc(found);
      } else {
        setPreviewBookingDoc(null);
      }

      const adminDocId = params.get('adminDoc');
      if (adminDocId) {
        const found = doctors.find(d => d.id.toString() === adminDocId);
        if (found) setAdminSelectedDoctor(found);
      } else {
        setAdminSelectedDoctor(null);
      }

      const adminTab = params.get('adminTab');
      if (adminTab) setAdminNavView(adminTab);

      const doctorTab = params.get('doctorTab');
      if (doctorTab) setDoctorNavView(doctorTab);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [authRole, doctors]);

  const [viewHistory, setViewHistory] = useState(['home']);

  const navigateTo = (view) => {
    setViewHistory(prev => {
      if (prev[prev.length - 1] === view) return prev;
      return [...prev, view];
    });
    const storedRole = sessionStorage.getItem("simmy_auth_role") || authRole;
    if (view === 'dashboard' && !storedRole) {
      window.history.pushState(null, '', '#portal-login');
      setCurrentView('portal-login');
    } else {
      window.history.pushState(null, '', `#${view}`);
      setCurrentView(view);
    }
  };

  const navigateBack = () => {
    if (previewBookingDoc) {
      setPreviewBookingDoc(null);
      return;
    }
    if (adminSelectedDoctor) {
      setAdminSelectedDoctor(null);
      return;
    }
    setViewHistory(prev => {
      if (prev.length <= 1) {
        window.history.pushState(null, '', '#home');
        setCurrentView('home');
        return ['home'];
      }
      const newHist = prev.slice(0, -1);
      const prevView = newHist[newHist.length - 1];
      window.history.pushState(null, '', `#${prevView}`);
      setCurrentView(prevView);
      return newHist;
    });
  };

  const startBooking = (context = {}) => {
    setBookingFormData((prev) => {
      const docId =
        context.doctorId !== undefined
          ? context.doctorId.toString()
          : prev.doctorId;
      const targetDoc = doctors.find((d) => d.id.toString() === docId);
      const isHome =
        context.consultationMode === "Home Visit" ||
        context.serviceType?.toLowerCase().includes("home") ||
        context.packageTitle?.toLowerCase().includes("home");

      return {
        ...prev,
        patientName: prev.patientName || loggedInPatient?.name || "",
        phone: prev.phone || loggedInPatient?.phone || "",
        email: prev.email || loggedInPatient?.email || "",
        doctorId: docId,
        consultationMode: isHome ? "Home Visit" : (context.consultationMode || prev.consultationMode || "Virtual Consultation"),
        serviceType:
          context.serviceType ||
          (targetDoc
            ? `${getSpecialtyTitle(targetDoc.specialty)} Consultation`
            : isHome ? "Home Visit Doctor Consultation" : "Virtual Consultation"),
        packageTitle:
          context.packageTitle ||
          (targetDoc ? `Consultation with ${targetDoc.name}` : ""),
        price:
          context.price ||
          (targetDoc?.consultationRate
            ? `₦${targetDoc.consultationRate.toLocaleString()}`
            : ""),
        symptoms: context.symptoms || prev.symptoms || "",
        isNhis: context.isNhis !== undefined ? context.isNhis : prev.isNhis,
        stateName: context.stateName || prev.stateName || "",
        lga: context.lga || prev.lga || "",
        ward: context.ward || prev.ward || "",
        homeAddress: context.homeAddress || prev.homeAddress || ""
      };
    });
    navigateTo("booking");
  };

  // --- Auth Handlers ---
  const handleGoogleAuth = async () => {
    setLoginError('');
    try {
      if (supabase && supabase.auth) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (err) {
      console.log("Supabase Google Auth fallback:", err);
    }

    const gEmail = patientLoginForm.email || "google.user@simmycare.com";
    const gName = patientLoginForm.name || "Google Authenticated User";
    const userRole = registerRole || "patient";

    const userObj = {
      name: gName,
      email: gEmail,
      phone: patientLoginForm.phone || "+234 800 123 4567",
      role: userRole,
      provider: "google"
    };

    if (userRole === 'doctor') {
      const existingDoc = doctors.find(d => d.email.toLowerCase() === gEmail.toLowerCase());
      if (existingDoc) {
        setLoggedInDoctor(existingDoc);
        setAuthRole('doctor');
        localStorage.setItem("simmy_authRole", 'doctor');
        localStorage.setItem("simmy_loggedInDoctor", JSON.stringify(existingDoc));
      } else {
        const newDoc = {
          id: Date.now(),
          name: gName.startsWith("Dr.") ? gName : `Dr. ${gName}`,
          specialty: patientLoginForm.specialty || 'General Medicine',
          schedule: 'Mon - Fri (9am - 5pm)',
          experience: '5 Years',
          regNo: patientLoginForm.regNo || 'MDCN/GGL-99',
          image: '',
          email: gEmail,
          password: 'google-oauth',
          phone: userObj.phone,
          bio: 'Verified practitioner authenticated via Google.',
          clinicRoom: 'Room 303, Telemedicine Wing',
          license: '',
          consultationRate: '₦3,000',
          consultationDuration: '30 mins',
          services: ['Online Consultation'],
          verified: true,
          level: patientLoginForm.level || 'Consultant'
        };
        setDoctors(prev => [newDoc, ...prev]);
        setLoggedInDoctor(newDoc);
        setAuthRole('doctor');
        localStorage.setItem("simmy_authRole", 'doctor');
        localStorage.setItem("simmy_loggedInDoctor", JSON.stringify(newDoc));
      }
    } else {
      setAuthRole(userRole);
      setCurrentPatientUser(userObj);
      localStorage.setItem("simmy_authRole", userRole);
      localStorage.setItem("simmy_currentPatientUser", JSON.stringify(userObj));
    }
    navigateTo('dashboard');
  };

  const handleUnifiedLoginSubmit = async (e) => {
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
      if (isSupabaseReady()) {
        try {
          const metadata = {
            name: patientLoginForm.name || (registerRole === 'doctor' ? `Dr. ${patientLoginForm.name}` : patientLoginForm.name),
            phone: patientLoginForm.phone || "",
            role: registerRole,
            terms_accepted: true
          };

          if (registerRole === 'doctor') {
            metadata.specialty = patientLoginForm.specialty || "General Medicine";
            metadata.reg_no = patientLoginForm.regNo || `MDCN/${Math.floor(1000 + Math.random() * 9000)}`;
            metadata.level = patientLoginForm.level || "Junior Doctor";
          } else if (registerRole === 'pharmacist') {
            metadata.facility_name = patientLoginForm.pharmacyName || "SimmyCare Central Pharmacy";
            metadata.license_no = patientLoginForm.pharmacyLicense || `PCN/P/${Math.floor(1000 + Math.random() * 9000)}`;
          } else if (registerRole === 'lab') {
            metadata.facility_name = patientLoginForm.facilityName || "SimmyCare Diagnostic Lab";
            metadata.license_no = patientLoginForm.labLicense || `MLSCN/L/${Math.floor(1000 + Math.random() * 9000)}`;
          } else if (registerRole === 'logistics') {
            metadata.vehicle_type = patientLoginForm.vehicleType || "Motorbike";
            metadata.dispatch_area = patientLoginForm.dispatchArea || "Lagos Metro";
          }

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
          });

          if (error) throw error;

          if (data?.user) {
            // Retrieve created profile
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileErr) throw profileErr;

            if (profile.role !== 'patient' && profile.role !== 'admin' && !profile.verified) {
              alert("Account created successfully! Your staff profile is pending administrator approval before you can sign in.");
              clearForm();
              setIsPatientRegistering(false);
              return;
            }

            setAuthRole(profile.role);
            if (profile.role === 'patient') {
              setLoggedInPatient(profile);
              sessionStorage.setItem("simmy_auth_patient", JSON.stringify(profile));
            } else if (profile.role === 'doctor') {
              setLoggedInDoctor(profile);
              sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(profile));
            } else if (profile.role === 'pharmacist') {
              setLoggedInPharmacist(profile);
              sessionStorage.setItem("simmy_auth_pharmacist", JSON.stringify(profile));
            } else if (profile.role === 'lab') {
              setLoggedInLab(profile);
              sessionStorage.setItem("simmy_auth_lab", JSON.stringify(profile));
            } else if (profile.role === 'logistics') {
              setLoggedInLogistics(profile);
              sessionStorage.setItem("simmy_auth_logistics", JSON.stringify(profile));
            }

            sessionStorage.setItem("simmy_auth_role", profile.role);
            clearForm();
            setIsPatientRegistering(false);
            navigateTo('dashboard');
          }
        } catch (err) {
          setLoginError(err.message || "Failed to register account via Supabase.");
        }
      } else {
        // Fallback local memory signup
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
          clearForm();
          setIsPatientRegistering(false);
          navigateTo('dashboard');
        } else {
          // Staff roles registration - set active: false, verified: false and show approval alert
          if (registerRole === 'doctor') {
            const staffId = generateStaffId('doctor', doctors);
            const newDoc = {
              id: doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1,
              staffId,
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
          } else if (registerRole === 'pharmacist') {
            const staffId = generateStaffId('pharmacist', pharmacists);
            const newPharm = {
              staffId,
              email,
              name: patientLoginForm.name || "Pharm. Specialist",
              phone: patientLoginForm.phone || "",
              password: password,
              pharmacyName: patientLoginForm.pharmacyName || "SimmyCare Pharmacy Partner",
              pharmacyLicense: patientLoginForm.pharmacyLicense || `PCN/P/${Math.floor(1000 + Math.random() * 9000)}`,
              verified: false,
              active: false
            };
            setPharmacists([...pharmacists, newPharm]);
          } else if (registerRole === 'lab') {
            const staffId = generateStaffId('lab', labs);
            const newLab = {
              staffId,
              email,
              name: patientLoginForm.name || "MLS Specialist",
              phone: patientLoginForm.phone || "",
              password: password,
              facilityName: patientLoginForm.facilityName || "SimmyCare Diagnostic Lab",
              labLicense: patientLoginForm.labLicense || `MLSCN/L/${Math.floor(1000 + Math.random() * 9000)}`,
              verified: false,
              active: false
            };
            setLabs([...labs, newLab]);
          } else if (registerRole === 'logistics') {
            const staffId = generateStaffId('logistics', logistics);
            const newLog = {
              staffId,
              email,
              name: patientLoginForm.name || "Logistics Dispatcher",
              phone: patientLoginForm.phone || "",
              password: password,
              vehicleType: patientLoginForm.vehicleType || "Motorbike",
              dispatchArea: patientLoginForm.dispatchArea || "Lagos Metro",
              verified: false,
              active: false
            };
            setLogistics([...logistics, newLog]);
          }
          alert("Account created successfully! Your staff profile is pending administrator approval before you can sign in.");
          clearForm();
          setIsPatientRegistering(false);
        }
      }
    } else {
      const normEmail = email.toLowerCase().trim();

      const attemptLocalLogin = () => {
        // 1. Check Admin
        const matchedAdmin = admins.find(a => 
          (normEmail === a.email.toLowerCase().trim() || normEmail === (a.username || '').toLowerCase().trim()) && 
          password === a.password
        );
        if (matchedAdmin || (normEmail === 'admin' && (password === 'admin' || password === 'password123')) || (normEmail === 'admin@simmycare.com' && (password === 'password123' || password === 'admin123' || password === 'admin'))) {
          setAuthRole('admin');
          sessionStorage.setItem("simmy_auth_role", "admin");
          if (matchedAdmin) {
            sessionStorage.setItem("simmy_auth_admin", JSON.stringify(matchedAdmin));
          } else {
            sessionStorage.setItem("simmy_auth_admin", JSON.stringify({ username: 'admin', name: 'System Administrator', email: 'admin@simmycare.com' }));
          }
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        // 2. Check Pharmacist
        const pharm = pharmacists.find(p => p.email && p.email.toLowerCase().trim() === normEmail);
        if (pharm && (pharm.password === password || !pharm.password)) {
          if (pharm.active === false || pharm.verified === false) {
            setLoginError("Your staff account is pending administrator activation.");
            return true;
          }
          setAuthRole('pharmacist');
          setLoggedInPharmacist(pharm);
          sessionStorage.setItem("simmy_auth_role", "pharmacist");
          sessionStorage.setItem("simmy_auth_pharmacist", JSON.stringify(pharm));
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        // 3. Check Lab Tech
        const labUser = labs.find(l => l.email && l.email.toLowerCase().trim() === normEmail);
        if (labUser && (labUser.password === password || !labUser.password)) {
          if (labUser.active === false || labUser.verified === false) {
            setLoginError("Your staff account is pending administrator activation.");
            return true;
          }
          setAuthRole('lab');
          setLoggedInLab(labUser);
          sessionStorage.setItem("simmy_auth_role", "lab");
          sessionStorage.setItem("simmy_auth_lab", JSON.stringify(labUser));
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        // 4. Check Logistics
        const logUser = logistics.find(l => l.email && l.email.toLowerCase().trim() === normEmail);
        if (logUser && (logUser.password === password || !logUser.password)) {
          if (logUser.active === false || logUser.verified === false) {
            setLoginError("Your staff account is pending administrator activation.");
            return true;
          }
          setAuthRole('logistics');
          setLoggedInLogistics(logUser);
          sessionStorage.setItem("simmy_auth_role", "logistics");
          sessionStorage.setItem("simmy_auth_logistics", JSON.stringify(logUser));
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        // 5. Check Doctor
        const doc = doctors.find(d => d.email && d.email.toLowerCase().trim() === normEmail);
        if (doc && (doc.password === password || !doc.password)) {
          if (doc.active === false || doc.verified === false) {
            setLoginError("Your staff account is pending administrator activation.");
            return true;
          }
          setAuthRole('doctor');
          setLoggedInDoctor(doc);
          sessionStorage.setItem("simmy_auth_role", "doctor");
          sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(doc));
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        // 6. Check Patient
        const existing = patients.find(p => p.email && p.email.toLowerCase().trim() === normEmail);
        if (existing && (existing.password === password || !existing.password)) {
          setAuthRole('patient');
          setLoggedInPatient(existing);
          sessionStorage.setItem("simmy_auth_role", "patient");
          sessionStorage.setItem("simmy_auth_patient", JSON.stringify(existing));
          clearForm();
          navigateTo('dashboard');
          return true;
        }

        return false;
      };

      // First check if credentials match a local seed account
      if (attemptLocalLogin()) {
        return;
      }

      // If not local seed, try Supabase Auth
      if (isSupabaseReady()) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (data?.user) {
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileErr) throw profileErr;

            if (profile.role !== 'patient' && profile.role !== 'admin' && !profile.verified) {
              setLoginError("Your staff account is pending administrator activation.");
              return;
            }

            setAuthRole(profile.role);
            if (profile.role === 'patient') {
              setLoggedInPatient(profile);
              sessionStorage.setItem("simmy_auth_patient", JSON.stringify(profile));
            } else if (profile.role === 'doctor') {
              setLoggedInDoctor(profile);
              sessionStorage.setItem("simmy_auth_doctor", JSON.stringify(profile));
            } else if (profile.role === 'pharmacist') {
              setLoggedInPharmacist(profile);
              sessionStorage.setItem("simmy_auth_pharmacist", JSON.stringify(profile));
            } else if (profile.role === 'lab') {
              setLoggedInLab(profile);
              sessionStorage.setItem("simmy_auth_lab", JSON.stringify(profile));
            } else if (profile.role === 'logistics') {
              setLoggedInLogistics(profile);
              sessionStorage.setItem("simmy_auth_logistics", JSON.stringify(profile));
            } else if (profile.role === 'admin') {
              sessionStorage.setItem("simmy_auth_role", "admin");
            }

            sessionStorage.setItem("simmy_auth_role", profile.role);
            clearForm();
            navigateTo('dashboard');
            return;
          }
        } catch (err) {
          setLoginError("Invalid email address or password.");
        }
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

  const handleLogout = async () => {
    // Sign out from Supabase Auth (clears JWT session & cookies)
    if (isSupabaseConfigured()) {
      try { await supabase.auth.signOut(); } catch (err) { console.warn('Supabase sign out error:', err); }
    }
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

    const locationParts = [
      bookingFormData.stateName ? `State: ${bookingFormData.stateName}` : '',
      bookingFormData.lga ? `LGA: ${bookingFormData.lga}` : '',
      bookingFormData.ward ? `Ward: ${bookingFormData.ward}` : '',
      bookingFormData.homeAddress ? `Street Address: ${bookingFormData.homeAddress}` : ''
    ].filter(Boolean).join(', ');

    const isHome = bookingFormData.consultationMode === 'Home Visit' || bookingFormData.serviceType?.toLowerCase().includes('home') || bookingFormData.packageTitle?.toLowerCase().includes('home');
    const fullSymptoms = (isHome || locationParts) && !bookingFormData.symptoms.includes('Home Visit Address:')
      ? `[Home Visit Location: ${locationParts || 'Address provided'}] ${bookingFormData.symptoms || ''}`.trim()
      : (bookingFormData.symptoms || "None provided");

    const ticketNumber = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      id: ticketNumber,
      patientName: bookingFormData.patientName,
      phone: bookingFormData.phone,
      email: bookingFormData.email.toLowerCase(),
      doctor: selectedDoc.name,
      doctorId: selectedDoc.id.toString(),
      specialty: selectedDoc.specialty,
      consultationMode: isHome ? "Home Visit" : (bookingFormData.consultationMode || "Virtual Consultation"),
      serviceType: bookingFormData.serviceType || (isHome ? "Home Visit Consultation" : "Virtual Consultation"),
      packageTitle: bookingFormData.packageTitle || "",
      price: bookingFormData.price || "",
      date: bookingFormData.date,
      time: bookingFormData.time,
      symptoms: fullSymptoms,
      homeAddress: locationParts || bookingFormData.homeAddress || "",
      stateName: bookingFormData.stateName || "",
      lga: bookingFormData.lga || "",
      ward: bookingFormData.ward || "",
      status: "Pending",
      notes: "",
      prescription: "",
      isNhis: !!bookingFormData.isNhis,
      nhisNumber: bookingFormData.isNhis ? bookingFormData.nhisNumber : '',
      nhisHmo: bookingFormData.isNhis ? bookingFormData.nhisHmo : ''
    };

    setAppointments([newAppointment, ...appointments]);
    if (isSupabaseConfigured()) {
      appointmentsApi.create(newAppointment).catch(err => console.info('Supabase appointment creation sync:', err));
    }
    setBookingFormData({
      patientName: '',
      phone: '',
      email: '',
      doctorId: '',
      date: '',
      time: '10:00 AM',
      symptoms: '',
      isNhis: false,
      nhisNumber: '',
      nhisHmo: 'NHIA Primary Scheme',
      serviceType: 'Virtual Consultation',
      packageTitle: '',
      price: '',
      consultationMode: 'Virtual Consultation',
      stateName: '',
      lga: '',
      ward: '',
      homeAddress: ''
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
    let updatedDoc = null;
    setDoctors(doctors.map(d => {
      if (d.id === docId) {
        updatedDoc = { ...d, active: d.active === false ? true : false, role: 'doctor' };
        return updatedDoc;
      }
      return d;
    }));
    if (updatedDoc) profilesApi.upsertProfile(updatedDoc);
    if (loggedInDoctor && loggedInDoctor.id === docId) {
      setLoggedInDoctor(prev => prev ? { ...prev, active: prev.active === false ? true : false } : null);
    }
  };

  const handleToggleDoctorVerify = (docId) => {
    let updatedDoc = null;
    setDoctors(doctors.map(d => {
      if (d.id === docId) {
        updatedDoc = { ...d, verified: d.verified === true ? false : true, role: 'doctor' };
        return updatedDoc;
      }
      return d;
    }));
    if (updatedDoc) profilesApi.upsertProfile(updatedDoc);
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
      password: adminSelfData.password.trim(),
      email: 'admin@simmycare.com',
      name: 'System Administrator',
      role: 'admin'
    };
    setAdminCredentials(updated);
    profilesApi.upsertProfile(updated);
    setIsEditingAdminSelf(false);
    alert("Admin login credentials updated successfully!");
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (editingDoctorId) {
      const oldDoc = doctors.find(d => d.id === editingDoctorId);
      const oldName = oldDoc ? oldDoc.name : '';
      const newName = newDoctorData.name.startsWith("Dr. ") ? newDoctorData.name : `Dr. ${newDoctorData.name}`;

      let updatedDoctorObj = null;
      setDoctors(doctors.map(d => {
        if (d.id === editingDoctorId) {
          updatedDoctorObj = {
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
            services: newDoctorData.services,
            role: 'doctor'
          };
          return updatedDoctorObj;
        }
        return d;
      }));

      if (updatedDoctorObj) profilesApi.upsertProfile(updatedDoctorObj);

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
        services: newDoctorData.services || [],
        role: 'doctor'
      };
      const staffId = generateStaffId('doctor', doctors);
      const newDocWithId = { ...newDoc, staffId };
      setDoctors([...doctors, newDocWithId]);
      profilesApi.upsertProfile(newDocWithId);
      setNewDoctorData({ name: '', specialty: 'Pediatrics', schedule: '', experience: '', regNo: '', email: '', password: '', image: '', phone: '', bio: '', clinicRoom: '', license: '', consultationRate: '', consultationDuration: '', services: [] });
      alert(`Doctor profile added successfully! Staff ID: ${staffId}`);
    }
  };

  const handleAddPharmacist = (e) => {
    e.preventDefault();
    if (editingPharmacistId) {
      let updatedP = null;
      setPharmacists(pharmacists.map(p => {
        if (p.email === editingPharmacistId) {
          updatedP = {
            ...p,
            name: newPharmacistData.name,
            email: newPharmacistData.email,
            password: newPharmacistData.password,
            phone: newPharmacistData.phone,
            pharmacyName: newPharmacistData.pharmacyName,
            pharmacyLicense: newPharmacistData.pharmacyLicense,
            verified: newPharmacistData.verified !== undefined ? newPharmacistData.verified : true,
            active: newPharmacistData.active !== undefined ? newPharmacistData.active : true,
            role: 'pharmacist'
          };
          return updatedP;
        }
        return p;
      }));
      if (updatedP) profilesApi.upsertProfile(updatedP);
      setEditingPharmacistId(null);
      setNewPharmacistData({ name: '', email: '', password: '', phone: '', pharmacyName: '', pharmacyLicense: '', verified: true, active: true });
      alert("Pharmacist profile updated successfully!");
    } else {
      const staffId = generateStaffId('pharmacist', pharmacists);
      const newPharm = {
        staffId,
        name: newPharmacistData.name,
        email: newPharmacistData.email,
        password: newPharmacistData.password,
        phone: newPharmacistData.phone,
        pharmacyName: newPharmacistData.pharmacyName || "SimmyCare Central Pharmacy",
        pharmacyLicense: newPharmacistData.pharmacyLicense || `PCN/P/${Math.floor(1000 + Math.random() * 9000)}`,
        verified: true,
        active: true,
        role: 'pharmacist'
      };
      setPharmacists([...pharmacists, newPharm]);
      profilesApi.upsertProfile(newPharm);
      setNewPharmacistData({ name: '', email: '', password: '', phone: '', pharmacyName: '', pharmacyLicense: '', verified: true, active: true });
      alert(`Pharmacist registered successfully! Staff ID: ${staffId}`);
    }
  };

  const handleAddLab = (e) => {
    e.preventDefault();
    if (editingLabId) {
      let updatedL = null;
      setLabs(labs.map(l => {
        if (l.email === editingLabId) {
          updatedL = {
            ...l,
            name: newLabData.name,
            email: newLabData.email,
            password: newLabData.password,
            phone: newLabData.phone,
            facilityName: newLabData.facilityName,
            labLicense: newLabData.labLicense,
            verified: newLabData.verified !== undefined ? newLabData.verified : true,
            active: newLabData.active !== undefined ? newLabData.active : true,
            role: 'lab'
          };
          return updatedL;
        }
        return l;
      }));
      if (updatedL) profilesApi.upsertProfile(updatedL);
      setEditingLabId(null);
      setNewLabData({ name: '', email: '', password: '', phone: '', facilityName: '', labLicense: '', verified: true, active: true });
      alert("Laboratory profile updated successfully!");
    } else {
      const staffId = generateStaffId('lab', labs);
      const newL = {
        staffId,
        name: newLabData.name,
        email: newLabData.email,
        password: newLabData.password,
        phone: newLabData.phone,
        facilityName: newLabData.facilityName || "SimmyCare Lab Partner",
        labLicense: newLabData.labLicense || `MLSCN/L/${Math.floor(1000 + Math.random() * 9000)}`,
        verified: true,
        active: true,
        role: 'lab'
      };
      setLabs([...labs, newL]);
      profilesApi.upsertProfile(newL);
      setNewLabData({ name: '', email: '', password: '', phone: '', facilityName: '', labLicense: '', verified: true, active: true });
      alert(`Laboratory Technician registered successfully! Staff ID: ${staffId}`);
    }
  };

  const handleAddLogistics = (e) => {
    e.preventDefault();
    if (editingLogisticsId) {
      let updatedLg = null;
      setLogistics(logistics.map(l => {
        if (l.email === editingLogisticsId) {
          updatedLg = {
            ...l,
            name: newLogisticsData.name,
            email: newLogisticsData.email,
            password: newLogisticsData.password,
            phone: newLogisticsData.phone,
            vehicleType: newLogisticsData.vehicleType,
            dispatchArea: newLogisticsData.dispatchArea,
            verified: newLogisticsData.verified !== undefined ? newLogisticsData.verified : true,
            active: newLogisticsData.active !== undefined ? newLogisticsData.active : true,
            role: 'logistics'
          };
          return updatedLg;
        }
        return l;
      }));
      if (updatedLg) profilesApi.upsertProfile(updatedLg);
      setEditingLogisticsId(null);
      setNewLogisticsData({ name: '', email: '', password: '', phone: '', vehicleType: 'Motorbike', dispatchArea: '', verified: true, active: true });
      alert("Logistics profile updated successfully!");
    } else {
      const staffId = generateStaffId('logistics', logistics);
      const newLg = {
        staffId,
        name: newLogisticsData.name,
        email: newLogisticsData.email,
        password: newLogisticsData.password,
        phone: newLogisticsData.phone,
        vehicleType: newLogisticsData.vehicleType || "Motorbike",
        dispatchArea: newLogisticsData.dispatchArea || "Lagos Metro",
        verified: true,
        active: true,
        role: 'logistics'
      };
      setLogistics([...logistics, newLg]);
      profilesApi.upsertProfile(newLg);
      setNewLogisticsData({ name: '', email: '', password: '', phone: '', vehicleType: 'Motorbike', dispatchArea: '', verified: true, active: true });
      alert(`Logistics Rider registered successfully! Staff ID: ${staffId}`);
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (editingAdminId) {
      let updatedAd = null;
      setAdmins(admins.map(a => {
        if (a.email === editingAdminId) {
          updatedAd = {
            ...a,
            name: newAdminData.name,
            username: newAdminData.username,
            email: newAdminData.email,
            password: newAdminData.password,
            role: 'admin'
          };
          return updatedAd;
        }
        return a;
      }));
      if (updatedAd) profilesApi.upsertProfile(updatedAd);
      setEditingAdminId(null);
      setNewAdminData({ name: '', username: '', email: '', password: '' });
      alert("Administrator profile updated successfully!");
    } else {
      const staffId = generateStaffId('admin', admins);
      const newAd = {
        staffId,
        name: newAdminData.name,
        username: newAdminData.username,
        email: newAdminData.email,
        password: newAdminData.password,
        role: 'admin'
      };
      setAdmins([...admins, newAd]);
      profilesApi.upsertProfile(newAd);
      setNewAdminData({ name: '', username: '', email: '', password: '' });
      alert(`Administrator registered successfully! Staff ID: ${staffId}`);
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
      const docToDelete = doctors.find(d => d.id === id);
      setDoctors(doctors.filter(d => d.id !== id));
      if (docToDelete && docToDelete.email) {
        profilesApi.deleteProfile(docToDelete.email);
      }
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
      services: docSelfData.services,
      role: 'doctor'
    };

    setDoctors(doctors.map(d => d.id === loggedInDoctor.id ? updatedDoc : d));
    profilesApi.upsertProfile(updatedDoc);

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
      password: patSelfData.password,
      role: 'patient'
    };

    setPatients(patients.map(p => p.email.toLowerCase() === oldEmail.toLowerCase() ? updatedPat : p));
    profilesApi.upsertProfile(updatedPat);

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

      let updatedPat = null;
      setPatients(patients.map(p => {
        if (p.email === editingPatientId) {
          updatedPat = {
            ...p,
            name: newName,
            email: newEmail,
            phone: newPhone,
            password: newPatientData.password,
            role: 'patient'
          };
          return updatedPat;
        }
        return p;
      }));
      if (updatedPat) profilesApi.upsertProfile(updatedPat);

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
        password: newPatientData.password,
        role: 'patient'
      };
      setPatients([...patients, newPatient]);
      profilesApi.upsertProfile(newPatient);
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
      profilesApi.deleteProfile(email);
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
    const matchesFilter = doctorFilter === 'all' ||
      doc.specialty.toLowerCase() === doctorFilter.toLowerCase() ||
      (doctorFilter.toLowerCase() === 'obstetrics & gynaecology' && doc.specialty.toLowerCase().includes('gynaec')) ||
      (doctorFilter.toLowerCase() === 'gynaecology' && doc.specialty.toLowerCase().includes('gynaec')) ||
      (doctorFilter.toLowerCase() === 'ent' && (doc.specialty.toLowerCase() === 'ent' || doc.specialty.toLowerCase().includes('ear'))) ||
      (doctorFilter.toLowerCase() === 'laboratory' && doc.specialty.toLowerCase().includes('lab')) ||
      (doctorFilter.toLowerCase() === 'pharmacy' && doc.specialty.toLowerCase().includes('pharm'));
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

  const getRiderCoords = (riderName) => {
    if (!riderName) return { x: 120, y: 80 };
    const idx = logistics.findIndex(r => r.name === riderName);
    const coords = [
      { x: 100, y: 80 },
      { x: 380, y: 70 },
      { x: 80, y: 220 },
      { x: 420, y: 260 },
      { x: 180, y: 280 },
    ];
    return coords[idx !== -1 ? idx % coords.length : 0];
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

  const getInterpolatedCoords = (progress, dest, riderName, tripId) => {
    const riderCoords = getRiderCoords(riderName);
    const hubCoords = { x: 250, y: 150 };
    const destCoords = dest || { x: 250, y: 150 };

    if (progress <= 40) {
      const factor = progress / 40;
      return {
        x: riderCoords.x + (hubCoords.x - riderCoords.x) * factor,
        y: riderCoords.y + (hubCoords.y - riderCoords.y) * factor
      };
    } else {
      const factor = (progress - 40) / 60;
      return {
        x: hubCoords.x + (destCoords.x - hubCoords.x) * factor,
        y: hubCoords.y + (destCoords.y - hubCoords.y) * factor
      };
    }
  };

  const getLogisticsTelemetry = (riderName, tripId = '') => {
    if (!riderName) {
      return {
        plate: 'RV-UNASSIGNED',
        speed: '0 km/h',
        rating: '5.0 ★',
        otp: '0000',
        temp: '4.0°C',
        coldChainStatus: 'Optimal',
        helmetVerified: true,
        insulationSeals: true,
        totalCompleted: '0'
      };
    }
    const hash = (riderName + tripId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const plateId = 100 + (hash % 899);
    const speed = 35 + (hash % 20); // 35 - 55 km/h
    const rating = (4.6 + (hash % 4) / 10).toFixed(1); // 4.6 - 4.9 rating
    const otp = 1000 + (hash % 9000); // 4-digit secure delivery PIN
    const plateLetters = ["ABJ", "DT", "LA", "KD", "PH"][hash % 5];
    const plate = `RV-${plateId}-${plateLetters}`;
    
    // Medical logistics specific metrics (Cold-chain)
    const tempDecimal = (3.5 + (hash % 35) / 10).toFixed(1); // 3.5°C to 7.0°C (standard cold-chain for drugs/blood/samples is 2°C to 8°C)
    
    return {
      plate,
      speed: `${speed} km/h`,
      rating: `${rating} ★`,
      otp,
      temp: `${tempDecimal}°C`,
      coldChainStatus: 'Optimal (2.0°C - 8.0°C)',
      helmetVerified: true,
      insulationSeals: true,
      totalCompleted: `${240 + (hash % 800)}`
    };
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
    const activeItem = activeOrder || activeTrip;
    const currentProgress = activeItem ? (activeItem.deliveryProgress !== undefined ? activeItem.deliveryProgress : 0) : 0;
    const isItemSimulating = activeItem ? (activeItem.isSimulating !== false) : false;
    const currentCoords = getInterpolatedCoords(currentProgress, dest, courier, mapTrackedTripId);
    const riderCoords = getRiderCoords(courier);

    return (
      <div style={{ background: '#0b1329', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {showDropdown && (
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECT ACTIVE DISPATCH TO TRACK:</label>
            <select
              value={mapTrackedTripId || ''}
              onChange={(e) => {
                setMapTrackedTripId(e.target.value || null);
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
            {currentProgress > 0 && currentProgress < 100 ? 'RIDER IN TRANSIT' : currentProgress === 100 ? 'RIDER ARRIVED' : 'TELEMETRY IDLE'}
          </div>

          <svg viewBox="0 0 500 300" style={{ width: '100%', height: 'auto', background: '#070d1e' }}>
            <defs>
              <pattern id="mapGridMini" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="500" height="300" fill="url(#mapGridMini)" />

            {/* Soft background elements simulating water/parks */}
            <path d="M 0,220 C 150,230 300,180 500,210 L 500,300 L 0,300 Z" fill="#0d1b3e" opacity="0.4" />
            <path d="M 0,220 C 150,230 300,180 500,210" stroke="#1b3b6f" strokeWidth="4" fill="none" opacity="0.6" />
            <text x="350" y="255" fill="#3a6073" fontSize="8" style={{ fontStyle: 'italic', letterSpacing: '1px' }}>Jabi River</text>

            <rect x="50" y="60" width="80" height="60" rx="8" fill="#14362d" opacity="0.3" />
            <text x="65" y="95" fill="#1d6f42" fontSize="7" fontWeight="600" opacity="0.7">Millennium Park</text>
            <rect x="360" y="40" width="90" height="50" rx="8" fill="#14362d" opacity="0.3" />
            <text x="380" y="70" fill="#1d6f42" fontSize="7" fontWeight="600" opacity="0.7">Maitama Park</text>

            {/* Realistic Road Grid (Google Maps style) */}
            <path d="M 20,40 L 480,40 M 20,260 L 480,260 M 70,20 L 70,280 M 430,20 L 430,280" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
            
            {/* Main Highways / Expressways */}
            <path d="M 0,150 L 500,150" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
            <path d="M 0,150 L 500,150" stroke="#0f172a" strokeWidth="6" fill="none" />
            <text x="20" y="146" fill="rgba(255,255,255,0.3)" fontSize="6" fontWeight="bold">CONSTITUTION EXPRESSWAY</text>

            <path d="M 250,0 L 250,300" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
            <path d="M 250,0 L 250,300" stroke="#0f172a" strokeWidth="6" fill="none" />
            <text x="254" y="20" fill="rgba(255,255,255,0.3)" fontSize="6" fontWeight="bold" transform="rotate(90, 254, 20)">HERBERT MACAULAY WAY</text>

            <path d="M 20,20 L 480,280" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <path d="M 20,20 L 480,280" stroke="#0f172a" strokeWidth="4" fill="none" />
            <text x="120" y="90" fill="rgba(255,255,255,0.2)" fontSize="6" fontWeight="bold" transform="rotate(29, 120, 90)">AMBASE BYPASS</text>

            {/* Central Hub */}
            <g transform="translate(250, 150)">
              <circle r="6" fill="#10b981" />
              <circle r="12" fill="#10b981" fillOpacity="0.15" />
              <text x="10" y="3" fill="#10b981" fontSize="8" fontWeight="bold">Central Hub</text>
            </g>

            {/* Other riders */}
            {logistics.filter(r => r.name !== courier).map((rider, idx) => {
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
                <g key={rider.id} transform={`translate(${pt.x}, ${pt.y})`} style={{ cursor: 'pointer', opacity: 0.4 }}>
                  <circle r="5" fill={isRiderOnline ? 'var(--color-accent)' : '#ef4444'} />
                  <text x="8" y="3" fill="rgba(255,255,255,0.4)" fontSize="7">{rider.name}</text>
                </g>
              );
            })}

            {/* Target Route */}
            {mapTrackedTripId && (
              <>
                {/* Leg 1: Rider -> Central Hub */}
                <line
                  x1={riderCoords.x}
                  y1={riderCoords.y}
                  x2="250"
                  y2="150"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  opacity={currentProgress <= 40 ? 1 : 0.3}
                />

                {/* Leg 2: Central Hub -> Client Location */}
                <line
                  x1="250"
                  y1="150"
                  x2={dest.x}
                  y2={dest.y}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={currentProgress < 40 ? "5,5" : "none"}
                  opacity={currentProgress >= 40 ? 1 : 0.4}
                />

                {/* Client Location Pin */}
                <g transform={`translate(${dest.x}, ${dest.y})`}>
                  <circle r="7" fill="#ec4899" />
                  <circle r="14" fill="#ec4899" fillOpacity="0.2" className="ping-ring" />
                  <text x="10" y="3" fill="#ec4899" fontSize="9" fontWeight="bold">{clientName}</text>
                </g>

                {/* Current Moving Courier */}
                <g transform={`translate(${currentCoords.x}, ${currentCoords.y})`}>
                  <circle r="8" fill="#06b6d4" />
                  <circle r="15" fill="#06b6d4" fillOpacity="0.25" />
                  <text textAnchor="middle" y="3" fill="#fff" fontSize="8">{currentProgress < 40 ? '🏍️' : '📦'}</text>
                  <text x="10" y="-3" fill="#06b6d4" fontSize="8" fontWeight="bold">{courier}</text>
                </g>
              </>
            )}
          </svg>
        </div>

        {mapTrackedTripId ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Progress:</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)' }}>{currentProgress}%</strong>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${currentProgress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const isOrder = mapTrackedTripId.startsWith('ORD-');
                  let targetList = isOrder ? inquiries : appointments;
                  let setList = isOrder ? setInquiries : setAppointments;
                  
                  setList(targetList.map(x => {
                    if (x.id === mapTrackedTripId) {
                      const currentProg = x.deliveryProgress || 0;
                      return { 
                        ...x, 
                        isSimulating: !x.isSimulating, 
                        deliveryProgress: currentProg >= 100 ? 0 : currentProg 
                      };
                    }
                    return x;
                  }));
                }}
                style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
              >
                <i className={activeItem && activeItem.isSimulating ? "fa-solid fa-pause" : "fa-solid fa-play"}></i> {activeItem && activeItem.isSimulating ? 'Pause Simulation' : 'Start Simulation'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  const isOrder = mapTrackedTripId.startsWith('ORD-');
                  let targetList = isOrder ? inquiries : appointments;
                  let setList = isOrder ? setInquiries : setAppointments;
                  setList(targetList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 0, isSimulating: false } : x));
                }}
                style={{ padding: '0.35rem', fontSize: '0.75rem' }}
              >
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>

            {/* Route Checkpoints with Manual Logging */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Transit Checkpoint Logger</strong>

              {/* Checkpoint 1: Depot Departure */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentProgress >= 0 ? '#fff' : 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: currentProgress >= 0 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                  <span>Departed SimmyCare Depot</span>
                </div>
                {currentProgress === 0 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-accent"
                    onClick={() => {
                      const isOrder = mapTrackedTripId.startsWith('ORD-');
                      const setList = isOrder ? setInquiries : setAppointments;
                      setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 30, status: isOrder ? 'Out for Delivery' : 'Sample Collected' } : x));
                    }}
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHeight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Log Depart
                  </button>
                )}
              </div>

              {/* Checkpoint 2: Abuja Ring Expressway */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentProgress >= 30 ? '#fff' : 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: currentProgress >= 30 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                  <span>Transiting Expressway</span>
                </div>
                {currentProgress === 30 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-accent"
                    onClick={() => {
                      const isOrder = mapTrackedTripId.startsWith('ORD-');
                      const setList = isOrder ? setInquiries : setAppointments;
                      setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 70 } : x));
                    }}
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHeight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Log Transit
                  </button>
                )}
              </div>

              {/* Checkpoint 3: Destination Ward */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentProgress >= 70 ? '#fff' : 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: currentProgress >= 70 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                  <span>Entering Destination Area</span>
                </div>
                {currentProgress === 70 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-accent"
                    onClick={() => {
                      const isOrder = mapTrackedTripId.startsWith('ORD-');
                      const setList = isOrder ? setInquiries : setAppointments;
                      setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 100, status: isOrder ? 'Delivered' : 'Completed' } : x));
                    }}
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHeight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Log Arrival
                  </button>
                )}
              </div>

              {/* Checkpoint 4: Delivered */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: currentProgress === 100 ? '#fff' : 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: currentProgress === 100 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                <span>Delivered & Handed Over</span>
              </div>
            </div>

            {(() => {
              const telemetry = getLogisticsTelemetry(courier, mapTrackedTripId);
              return (
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#f1f5f9', lineHeight: '1.4' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <div><span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Courier Dispatch Details</span></div>
                    <div style={{ textAlign: 'right' }}><span style={{ background: '#10b981', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>{telemetry.plate}</span></div>
                  </div>
                  
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Cargo Type:</strong> {cargoType}</div>
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Assigned Courier:</strong> {courier} ({telemetry.rating} • {telemetry.totalCompleted} deliveries)</div>
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Live Telemetry:</strong> {currentProgress > 0 && currentProgress < 100 ? telemetry.speed : '0 km/h'} • Cold-Chain Temp: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{telemetry.temp}</span></div>
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Secure Handover PIN (OTP):</strong> <strong style={{ color: '#f59e0b', fontSize: '0.95rem' }}>{telemetry.otp}</strong></div>
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Compliance Check:</strong> <span style={{ color: '#10b981' }}><i className="fa-solid fa-circle-check"></i> Helmet Compliant & Insulation Sealed ({telemetry.coldChainStatus})</span></div>
                  <div style={{ marginBottom: '0.35rem' }}><strong style={{ color: 'var(--color-accent)' }}>Recipient Patient:</strong> <span style={{ color: '#fff', fontWeight: 'bold' }}>{clientName}</span> ({phone})</div>
                  <div><strong style={{ color: 'var(--color-accent)' }}>Destination Address:</strong> {address}</div>
                </div>
              );
            })()}

            {currentProgress === 100 && (
              <div style={{ padding: '0.5rem', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#eab308', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                Awaiting Patient Receipt Confirmation...
              </div>
            )}

            <button
              type="button"
              className="btn btn-success btn-sm"
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.45rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.25rem' }}
              onClick={() => {
                const isOrder = mapTrackedTripId.startsWith('ORD-');
                if (isOrder) {
                  setInquiries(inquiries.map(inq =>
                    inq.id === mapTrackedTripId ? { ...inq, status: 'Delivered', deliveryProgress: 100 } : inq
                  ));
                } else {
                  setAppointments(appointments.map(apt =>
                    apt.id === mapTrackedTripId ? { ...apt, status: 'Completed', deliveryProgress: 100 } : apt
                  ));
                }
                alert(`Admin Override: Delivery status marked as completed for dispatch task: ${mapTrackedTripId}`);
              }}
            >
              <i className="fa-solid fa-shield-halved"></i> Administrative Override: Mark Delivered
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
                <li><a href="#doctors" className={currentView === 'doctors' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Staff & Specialists</a></li>
                <li><a href="#pricing" className={currentView === 'pricing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('pricing'); }}>Pricing</a></li>
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
                  SimmyCare connects you directly with MDCN-certified specialists, general practitioners, and laboratory consultants. Access on-demand virtual sessions or book physical visits and home healthcare across Abuja, Kaduna, Kano, Bauchi, Gombe, and Damaturu.
                </p>
                <div className="hero-ctas">
                  <button className="btn btn-primary" onClick={() => navigateTo('booking')}>Book Consultation</button>
                  <button className="btn btn-outline" onClick={() => navigateTo('doctors')}>Meet Our Specialists & Staff</button>
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
                      <strong>MDCN & PCN Verified</strong>
                      <span>Accredited Medical Staff</span>
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
                  <div className="benefit-item" onClick={() => navigateTo('service-online-consultation')} style={{ cursor: 'pointer' }}>
                    <div className="benefit-icon"><i className="fa-solid fa-comments"></i></div>
                    <div className="benefit-text">
                      <strong>Consult Anytime, Anywhere</strong>
                      <span>24/7 access to medical professionals</span>
                    </div>
                  </div>
                  <div className="benefit-item" onClick={() => navigateTo('portal-login')} style={{ cursor: 'pointer' }}>
                    <div className="benefit-icon"><i className="fa-solid fa-shield-halved"></i></div>
                    <div className="benefit-text">
                      <strong>Safe, Secure & Confidential</strong>
                      <span>Your data is fully protected</span>
                    </div>
                  </div>
                  <div className="benefit-item" onClick={() => navigateTo('booking')} style={{ cursor: 'pointer' }}>
                    <div className="benefit-icon"><i className="fa-regular fa-clock"></i></div>
                    <div className="benefit-text">
                      <strong>Rapid Care Cycle</strong>
                      <span>Skip wait times with scheduled or direct-dial consultations</span>
                    </div>
                  </div>
                  <div className="benefit-item" onClick={() => navigateTo('doctors')} style={{ cursor: 'pointer' }}>
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
                  <div className="health-tip-item" onClick={() => navigateTo('booking')} style={{ cursor: 'pointer' }}><i className="fa-solid fa-circle-check"></i> Nutrition Tips</div>
                  <div className="health-tip-item" onClick={() => navigateTo('booking')} style={{ cursor: 'pointer' }}><i className="fa-solid fa-circle-check"></i> Exercise Tips</div>
                  <div className="health-tip-item" onClick={() => { setDoctorFilter('Psychology'); navigateTo('doctors'); }} style={{ cursor: 'pointer' }}><i className="fa-solid fa-circle-check"></i> Mental Health</div>
                  <div className="health-tip-item" onClick={() => navigateTo('service-online-consultation')} style={{ cursor: 'pointer' }}><i className="fa-solid fa-circle-check"></i> Disease Prevention</div>
                  <div className="health-tip-item" onClick={() => navigateTo('booking')} style={{ cursor: 'pointer' }}><i className="fa-solid fa-circle-check"></i> Healthy Lifestyle</div>
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
                <div className="step-card glassmorphic" onClick={() => navigateTo('portal-login')} style={{ cursor: 'pointer' }}>
                  <div className="step-icon"><i className="fa-solid fa-heart-pulse"></i></div>
                  <span className="step-label">STEP 1</span>
                  <h3>Set Up Your Health Record</h3>
                  <p>Register securely and build a comprehensive medical profile for seamless doctor handovers.</p>
                  <span className="service-link" style={{ marginTop: 'auto' }}>Get Started <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
                <div className="step-card glassmorphic" onClick={() => navigateTo('doctors')} style={{ cursor: 'pointer' }}>
                  <div className="step-icon"><i className="fa-solid fa-stethoscope"></i></div>
                  <span className="step-label">STEP 2</span>
                  <h3>Schedule with a Specialist</h3>
                  <p>Match with accredited clinicians based on therapeutic specialty, availability, or location.</p>
                  <span className="service-link" style={{ marginTop: 'auto' }}>Browse Specialists <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
                <div className="step-card glassmorphic" onClick={() => navigateTo('booking')} style={{ cursor: 'pointer' }}>
                  <div className="step-icon"><i className="fa-solid fa-video"></i></div>
                  <span className="step-label">STEP 3</span>
                  <h3>Receive Integrated Care</h3>
                  <p>Connect securely online, get detailed care plans, digital prescriptions, and logistics tracking.</p>
                  <span className="service-link" style={{ marginTop: 'auto' }}>Book Now <i className="fa-solid fa-arrow-right-long"></i></span>
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
                      {doc.specialty === 'Laboratory' ? (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          navigateTo('service-mobile-lab');
                        }}><i className="fa-solid fa-vial" style={{ marginRight: '4px' }}></i> Order Lab Test</button>
                      ) : doc.specialty === 'Pharmacy' ? (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          navigateTo('service-pharmacy-delivery');
                        }}><i className="fa-solid fa-pills" style={{ marginRight: '4px' }}></i> Order Prescription</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          setPreviewBookingDoc(doc);
                        }}>Book Session</button>
                      )}
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
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-vials" style={{ color: 'var(--color-primary)' }}></i> Select Diagnostic Tests
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Choose diagnostic lab tests from the dropdown menu to schedule for home collection:
                </p>

                {/* Diagnostic Test Dropdown Selector */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="diagnosticTestSelect" style={{ fontWeight: 'bold', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <i className="fa-solid fa-list-check" style={{ color: 'var(--color-accent)' }}></i> Diagnostic Test / Panel Dropdown
                  </label>
                  <select
                    id="diagnosticTestSelect"
                    value=""
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      if (selectedVal && !labCart.includes(selectedVal)) {
                        setLabCart([...labCart, selectedVal]);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <option value="" disabled>-- Select a Lab Test to Add ({clinicLabStock.length} Available) --</option>
                    {clinicLabStock.map((test) => {
                      const isSelected = labCart.includes(test.name);
                      const isInStock = test.in_stock !== false;
                      return (
                        <option
                          key={test.id}
                          value={test.name}
                          disabled={!isInStock}
                        >
                          {isSelected ? '✓ ' : ''}{test.name}   ₦{Number(test.price).toLocaleString()} [{test.category}]{!isInStock ? ' (Out of Stock)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Selected Tests List Badges */}
                {labCart.length > 0 ? (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--color-indigo)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Selected Tests ({labCart.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setLabCart([])}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Clear All
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {labCart.map((testName) => {
                        const testItem = clinicLabStock.find(k => k.name === testName);
                        const price = testItem ? Number(testItem.price) : 5000;
                        return (
                          <div
                            key={testName}
                            style={{
                              display: 'flex',
                              justify: 'space-between',
                              alignItems: 'center',
                              padding: '0.65rem 0.9rem',
                              borderRadius: '8px',
                              background: 'rgba(2, 132, 199, 0.08)',
                              border: '1px solid rgba(2, 132, 199, 0.25)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <i className="fa-solid fa-flask-vial" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}></i>
                              <div>
                                <strong style={{ fontSize: '0.88rem', display: 'block' }}>{testName}</strong>
                                {testItem?.desc && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{testItem.desc}</span>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <strong style={{ color: 'var(--color-indigo)', fontSize: '0.9rem' }}>₦{price.toLocaleString()}</strong>
                              <button
                                type="button"
                                onClick={() => setLabCart(labCart.filter(item => item !== testName))}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  color: '#ef4444',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                                title="Remove test"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--color-border)', padding: '1rem', borderRadius: '8px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                    <i className="fa-solid fa-arrow-up" style={{ marginRight: '6px', color: 'var(--color-accent)' }}></i>
                    Please click the dropdown menu above to pick diagnostic tests for your booking.
                  </div>
                )}

                {labCart.length > 0 && (
                  <div className="lab-cart-summary glassmorphic">
                    <div className="cart-row">
                      <span>Selected Tests ({labCart.length}):</span>
                      <strong>
                        ₦{labCart.reduce((sum, name) => {
                          const item = clinicLabStock.find(k => k.name === name);
                          return sum + (item ? Number(item.price) : 5000);
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
                          const item = clinicLabStock.find(k => k.name === name);
                          return sum + (item ? Number(item.price) : 5000);
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
                  const locationParts = [
                    homeServiceCheckout.stateName ? `State: ${homeServiceCheckout.stateName}` : '',
                    homeServiceCheckout.lga ? `LGA: ${homeServiceCheckout.lga}` : '',
                    homeServiceCheckout.ward ? `Ward: ${homeServiceCheckout.ward}` : '',
                    homeServiceCheckout.address ? `Street/Address: ${homeServiceCheckout.address}` : ''
                  ].filter(Boolean).join(', ');

                  const newApt = {
                    id: ticketId,
                    patientName: homeServiceCheckout.name,
                    phone: homeServiceCheckout.phone,
                    email: homeServiceCheckout.email.toLowerCase(),
                    doctor: "Home Care Unit",
                    date: homeServiceCheckout.date,
                    time: "10:00 AM",
                    symptoms: `Home Care Service Request: [${homeServiceCheckout.package}]. Location: [${locationParts}]. Special client request: [${homeServiceCheckout.notes || 'None'}]`,
                    status: 'Pending'
                  };
                  setAppointments([newApt, ...appointments]);
                  setHomeServiceCheckout({ name: '', email: '', phone: '', date: '', stateName: '', lga: '', ward: '', address: '', notes: '', package: 'Elderly Care & Companion Visit' });
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

                  {/* Dropdowns for State, Local Government, Ward, and Street Address */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>State</label>
                      <select
                        required
                        value={homeServiceCheckout.stateName || ''}
                        onChange={(e) => {
                          const newState = e.target.value;
                          setHomeServiceCheckout({
                            ...homeServiceCheckout,
                            stateName: newState,
                            lga: '',
                            ward: ''
                          });
                        }}
                      >
                        <option value="">-- Select State --</option>
                        {Object.keys(NIGERIA_LOCATION_DATA).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Local Government Area (LGA)</label>
                      <select
                        required
                        disabled={!homeServiceCheckout.stateName}
                        value={homeServiceCheckout.lga || ''}
                        onChange={(e) => {
                          const newLga = e.target.value;
                          setHomeServiceCheckout({
                            ...homeServiceCheckout,
                            lga: newLga,
                            ward: ''
                          });
                        }}
                      >
                        <option value="">-- Select Local Govt --</option>
                        {homeServiceCheckout.stateName && NIGERIA_LOCATION_DATA[homeServiceCheckout.stateName] &&
                          Object.keys(NIGERIA_LOCATION_DATA[homeServiceCheckout.stateName]).map((lga) => (
                            <option key={lga} value={lga}>{lga}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ward</label>
                      <select
                        required
                        disabled={!homeServiceCheckout.lga}
                        value={homeServiceCheckout.ward || ''}
                        onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, ward: e.target.value })}
                      >
                        <option value="">-- Select Ward --</option>
                        {homeServiceCheckout.stateName && homeServiceCheckout.lga && NIGERIA_LOCATION_DATA[homeServiceCheckout.stateName]?.[homeServiceCheckout.lga] &&
                          NIGERIA_LOCATION_DATA[homeServiceCheckout.stateName][homeServiceCheckout.lga].map((w) => (
                            <option key={w} value={w}>{w}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Street / Home Address</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. House 4, Close B, Off Airport Road"
                        value={homeServiceCheckout.address}
                        onChange={(e) => setHomeServiceCheckout({ ...homeServiceCheckout, address: e.target.value })}
                      />
                    </div>
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
                      {doc.specialty === 'Laboratory' ? (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          navigateTo('service-mobile-lab');
                        }}><i className="fa-solid fa-vial" style={{ marginRight: '4px' }}></i> Order Lab Test</button>
                      ) : doc.specialty === 'Pharmacy' ? (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          navigateTo('service-pharmacy-delivery');
                        }}><i className="fa-solid fa-pills" style={{ marginRight: '4px' }}></i> Order Prescription</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }} onClick={() => {
                          setPreviewBookingDoc(doc);
                        }}>Book Slot</button>
                      )}
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
                            <DoctorAvatar image={doc.image} name={doc.name} size={110} border="none" className="doctor-avatar-img" />
                            <div className="doctor-badge">{doc.experience}</div>
                          </div>

                          <div className="doctor-info">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {doc.name}
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '12px',
                                fontWeight: '600',
                                color: doc.active !== false ? '#15803D' : '#6B7280',
                                background: doc.active !== false ? '#DCFCE7' : '#F3F4F6'
                              }}>
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: doc.active !== false ? '#22C55E' : '#9CA3AF'
                                }}></span>
                                {doc.active !== false ? 'Online' : 'Offline'}
                              </span>
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
              <h2>Medical Staff & Specialist Directory</h2>
              <p>Search and connect with verified medical doctors, pharmacists, laboratory scientists, and healthcare specialists.</p>
            </div>

            {/* Filter controls */}
            <div className="filter-bar glassmorphic">
              <div className="search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search staff name, clinical focus, or role..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                />
              </div>

              <div className="specialty-filters">
                {['all', 'Obstetrics & Gynaecology', 'Pediatrics', 'General Medicine', 'Public Health', 'Psychology', 'ENT', 'Laboratory', 'Pharmacy'].map(spec => (
                  <button
                    key={spec}
                    className={`filter-btn ${doctorFilter === spec ? 'active' : ''}`}
                    onClick={() => { setDoctorFilter(spec); setShowAllDoctors(true); }}
                  >
                    {spec === 'all' ? 'All Focus' : spec === 'Obstetrics & Gynaecology' ? 'Obstetrics & Gynae' : spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor cards list */}
            {filteredDoctors.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-heading)', fontWeight: '500' }}>
                    Showing <strong>{showAllDoctors ? filteredDoctors.length : Math.min(4, filteredDoctors.length)}</strong> of <strong>{filteredDoctors.length}</strong> verified medical staff members
                  </span>
                  {filteredDoctors.length > 4 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowAllDoctors(!showAllDoctors)}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                    >
                      {showAllDoctors ? (
                        <><i className="fa-solid fa-chevron-up"></i> Show Fewer (Top 4)</>
                      ) : (
                        <><i className="fa-solid fa-chevron-down"></i> View More Staff ({filteredDoctors.length - 4} More)</>
                      )}
                    </button>
                  )}
                </div>

                <div className="doctors-grid">
                  {(showAllDoctors ? filteredDoctors : filteredDoctors.slice(0, 4)).map((doc, idx) => {
                    const grad = getAvatarGradient(idx);
                    return (
                      <div className="doctor-card glassmorphic" key={doc.id}>
                        <div className="doctor-image-container">
                          <DoctorAvatar image={doc.image} name={doc.name} size={110} border="none" className="doctor-avatar-img" />
                          <div className="doctor-badge">{doc.experience}</div>
                        </div>

                        <div className="doctor-info">
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {doc.name}
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.7rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '12px',
                              fontWeight: '600',
                              color: doc.active !== false ? '#15803D' : '#6B7280',
                              background: doc.active !== false ? '#DCFCE7' : '#F3F4F6'
                            }}>
                              <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: doc.active !== false ? '#22C55E' : '#9CA3AF'
                              }}></span>
                              {doc.active !== false ? 'Online' : 'Offline'}
                            </span>
                          </h3>
                          <div className="doctor-specialty">
                            <span style={{ fontWeight: '600' }}>{doc.level || 'Junior Doctor'}</span> • {getSpecialtyTitle(doc.specialty)}
                          </div>
                          <div className="doctor-details">
                            <span><i className="fa-regular fa-clock"></i> {doc.schedule}</span>
                            {doc.consultationRate && (
                              <div style={{ marginTop: '0.2rem' }}>
                                <span><i className="fa-solid fa-money-bill-wave"></i> Consultation Rate: <strong>{doc.consultationRate}</strong></span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                                  * Note: Special services fees are negotiable
                                </span>
                              </div>
                            )}
                            {doc.services && doc.services.length > 0 && (
                              <div className="doctor-services-list" style={{ marginTop: '0.5rem' }}>
                                <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Offered Services:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                  {doc.services.map(srv => (
                                    <span key={srv} style={{ fontSize: '0.78rem', color: 'var(--color-indigo)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <i className="fa-solid fa-check" style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}></i> {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {doc.specialty === 'Laboratory' ? (
                            <button className="btn btn-primary" onClick={() => {
                              navigateTo('service-mobile-lab');
                            }}>
                              <i className="fa-solid fa-vial" style={{ marginRight: '6px' }}></i> Order Lab Test
                            </button>
                          ) : doc.specialty === 'Pharmacy' ? (
                            <button className="btn btn-primary" onClick={() => {
                              navigateTo('service-pharmacy-delivery');
                            }}>
                              <i className="fa-solid fa-pills" style={{ marginRight: '6px' }}></i> Order Prescription
                            </button>
                          ) : (
                            <button className="btn btn-primary" onClick={() => {
                              setPreviewBookingDoc(doc);
                            }}>
                              Book Consultation
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredDoctors.length > 4 && !showAllDoctors && (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowAllDoctors(true)}
                      style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 'bold' }}
                    >
                      <i className="fa-solid fa-users-line" style={{ marginRight: '8px' }}></i> View All {filteredDoctors.length} Medical Staff & Specialists →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state glassmorphic">
                <i className="fa-solid fa-user-slash"></i>
                <h3>No medical specialists found</h3>
                <p>Try searching for a different name or specialty category.</p>
              </div>
            )}
          </section>
        )}

        {/* --- VIEW: PRICING DIRECTORY --- */}
        {currentView === 'pricing' && (
          <section id="pricing-view" className="view-section animate-fade">
            <button className="back-nav-btn" onClick={navigateBack} style={{ marginBottom: '1.5rem' }}>
              <i className="fa-solid fa-arrow-left"></i> Back to Previous
            </button>

            {/* Pricing Hero */}
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'inline-block', marginBottom: '0.75rem' }}>
                <i className="fa-solid fa-tags" style={{ marginRight: '6px' }}></i> Transparent Healthcare Tariffs
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 0.75rem 0' }}>Simple, Flat-Rate Medical Pricing</h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                No surprise bills or hidden facility fees. Explore verified rates for online consultations, mobile diagnostic lab tests, prescriptions, and annual family care plans.
              </p>

              {/* NHIS Enrollee Benefit Calculator Switch */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(2, 132, 199, 0.08)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.25)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: pricingIsNhis ? 'var(--color-text-muted)' : 'var(--color-heading)' }}>
                    Standard Private Tariff
                  </span>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                    <input
                      type="checkbox"
                      checked={pricingIsNhis}
                      onChange={(e) => setPricingIsNhis(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: pricingIsNhis ? '#0284c7' : '#cbd5e1', transition: '.3s', borderRadius: '34px' }}>
                      <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: pricingIsNhis ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%' }}></span>
                    </span>
                  </label>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: pricingIsNhis ? '#0284c7' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-shield-halved"></i> NHIS / HMO Enrollee (10% Co-Pay)
                  </span>
                </div>
                {pricingIsNhis && (
                  <span style={{ fontSize: '0.8rem', color: '#0369a1', background: '#e0f2fe', padding: '0.2rem 0.75rem', borderRadius: '20px', fontWeight: 'bold' }}>
                    ✨ 90% Statutory Government & HMO Coverage Applied Across All Rates
                  </span>
                )}
              </div>
            </div>

            {/* Category Pills & Search */}
            <div className="filter-bar glassmorphic" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div className="specialty-filters" style={{ margin: 0 }}>
                {[
                  { id: 'consultations', label: 'Doctor Consultations', icon: 'fa-user-doctor' },
                  { id: 'lab', label: 'Lab Tests & Diagnostics', icon: 'fa-flask-vial' },
                  { id: 'pharmacy', label: 'Pharmacy Medications', icon: 'fa-pills' },
                  { id: 'packages', label: 'Care Packages', icon: 'fa-heart-pulse' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${pricingCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setPricingCategory(cat.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
                  </button>
                ))}
              </div>

              <div className="search-box" style={{ maxWidth: '300px' }}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search service, drug, or test..."
                  value={pricingSearch}
                  onChange={(e) => setPricingSearch(e.target.value)}
                />
              </div>
            </div>

            {/* CATEGORY 1: CONSULTATIONS */}
            {pricingCategory === 'consultations' && (
              <div className="pricing-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
                {[
                  {
                    title: "General Practitioner (GP)",
                    standardPrice: 3000,
                    desc: "20-minute consultation with an MDCN-certified general practitioner for acute illness, vitals review, and general health inquiries.",
                    features: ["20-min HD Video/Audio Call", "Digital Prescription Sent to Phone", "Specialist Referral if Required", "Follow-up Messaging (24hrs)"],
                    badge: "Most Popular",
                    icon: "fa-stethoscope"
                  },
                  {
                    title: "Specialist Consultant",
                    standardPrice: 6000,
                    desc: "Dedicated appointment with a Senior Consultant in Pediatrics, Gynaecology, Cardiology, Psychology, or Public Health.",
                    features: ["30-minute Specialist Session", "Comprehensive Care Plan", "Diagnostic Test Interpretation", "Official Medical Report"],
                    badge: "Specialized Care",
                    icon: "fa-user-doctor"
                  },
                  {
                    title: "Urgent Home Visit Doctor",
                    standardPrice: 15000,
                    desc: "In-person visit by a licensed medical practitioner to your home or office in Abuja, Kaduna, Kano, Bauchi, or Gombe.",
                    features: ["Physical Examination at Home", "On-site Rapid Diagnostics", "Immediate First-dose Medication", "Emergency Triage Coordination"],
                    badge: "On-Demand Home Care",
                    icon: "fa-house-medical"
                  },
                  {
                    title: "Follow-Up Review Slot",
                    standardPrice: 2000,
                    desc: "Quick check-in session within 7 days of initial consultation to review lab results or evaluate medication progress.",
                    features: ["15-min Video or Call", "Lab Result Evaluation", "Prescription Refill Adjustment", "Clinical Progress Check"],
                    badge: "Existing Patients",
                    icon: "fa-rotate-right"
                  }
                ]
                .filter(item => !pricingSearch || item.title.toLowerCase().includes(pricingSearch.toLowerCase()) || item.desc.toLowerCase().includes(pricingSearch.toLowerCase()))
                .map((item, idx) => {
                  const finalPrice = pricingIsNhis ? Math.round(item.standardPrice * 0.1) : item.standardPrice;
                  return (
                    <div key={idx} className="pricing-card glassmorphic animate-fade" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                      {item.badge && (
                        <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '12px', textTransform: 'uppercase' }}>
                          {item.badge}
                        </span>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{item.title}</h3>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          {item.desc}
                        </p>

                        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {pricingIsNhis ? 'NHIS Enrollee Co-Pay Fee' : 'Standard Rate'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-heading)' }}>
                              ₦{finalPrice.toLocaleString()}
                            </span>
                            {pricingIsNhis && (
                              <span style={{ fontSize: '0.85rem', color: '#16a34a', textDecoration: 'line-through' }}>
                                ₦{item.standardPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {pricingIsNhis && (
                            <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.25rem', fontWeight: 'bold' }}>
                              90% (₦{(item.standardPrice - finalPrice).toLocaleString()}) covered by NHIA Insurance
                            </div>
                          )}
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                          {item.features.map((f, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                              <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: '0.85rem' }}></i> {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="btn btn-primary btn-block"
                        onClick={() =>
                          startBooking({
                            serviceType: "Virtual Consultation",
                            packageTitle: item.title,
                            price: `₦${finalPrice.toLocaleString()}`,
                            isNhis: pricingIsNhis,
                          })
                        }
                      >
                        Book {item.title}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CATEGORY 2: LAB TESTS & DIAGNOSTICS */}
            {pricingCategory === 'lab' && (
              <div className="glassmorphic" style={{ padding: '1.5rem', borderRadius: '16px', overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.8rem' }}>Diagnostic Test Package</th>
                      <th style={{ padding: '0.8rem' }}>Clinical Scope</th>
                      <th style={{ padding: '0.8rem' }}>Standard Tariff</th>
                      <th style={{ padding: '0.8rem' }}>NHIS 10% Co-Pay</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Full Blood Count (FBC)", scope: "Hemoglobin, WBC, Platelets, RBC indices", standard: 4500, copay: 450 },
                      { name: "Fasting Blood Sugar (FBS)", scope: "Diabetes screening & glycemic evaluation", standard: 2500, copay: 250 },
                      { name: "Malaria Smear & Widal Typhoid Panel", scope: "Thick smear microscopy + Salmonella titers", standard: 5000, copay: 500 },
                      { name: "Lipid Profile (Cholesterol Panel)", scope: "Total cholesterol, Triglycerides, HDL, LDL", standard: 6500, copay: 650 },
                      { name: "Liver Function Test (LFT)", scope: "ALT, AST, Bilirubin, Alkaline Phosphatase", standard: 7000, copay: 700 },
                      { name: "Kidney Electrolytes & Creatinine (E/U/Cr)", scope: "Sodium, Potassium, Urea, Creatinine", standard: 7500, copay: 750 },
                      { name: "Mobile Lab Rider Sample Collection", scope: "Dispatch certified phlebotomist rider to home", standard: 1500, copay: 0 }
                    ]
                    .filter(t => !pricingSearch || t.name.toLowerCase().includes(pricingSearch.toLowerCase()) || t.scope.toLowerCase().includes(pricingSearch.toLowerCase()))
                    .map((t, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.85rem' }}>
                          <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-flask" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}></i> {t.name}
                          </strong>
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{t.scope}</td>
                        <td style={{ padding: '0.85rem', fontWeight: 'bold' }}>₦{t.standard.toLocaleString()}</td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            ₦{t.copay.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              startBooking({
                                serviceType: "Mobile Diagnostic Lab",
                                packageTitle: `Diagnostic Test: ${t.name}`,
                                price: pricingIsNhis
                                  ? `₦${t.copay.toLocaleString()} (NHIS Copay)`
                                  : `₦${t.standard.toLocaleString()}`,
                                isNhis: pricingIsNhis,
                              })
                            }
                          >
                            Request Test
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CATEGORY 3: PHARMACY MEDICATIONS */}
            {pricingCategory === 'pharmacy' && (
              <div className="glassmorphic" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Live Pharmacy Stock Price Directory</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Real-time tariffs synced directly with SimmyCare central dispensary.</p>
                  </div>
                  {(authRole === 'pharmacist' || authRole === 'admin') && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-lock-open"></i> Staff Mode: Edit Price buttons active
                    </span>
                  )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.8rem' }}>Medication Name</th>
                        <th style={{ padding: '0.8rem' }}>Category</th>
                        <th style={{ padding: '0.8rem' }}>Availability</th>
                        <th style={{ padding: '0.8rem' }}>Standard Price</th>
                        <th style={{ padding: '0.8rem' }}>NHIS 10% Co-Pay</th>
                        <th style={{ padding: '0.8rem', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinicDrugStock
                        .filter(drug => !pricingSearch || drug.name.toLowerCase().includes(pricingSearch.toLowerCase()) || drug.category?.toLowerCase().includes(pricingSearch.toLowerCase()))
                        .map((drug) => {
                          const stdPrice = drug.price || 1200;
                          const copayPrice = Math.round(stdPrice * 0.1);
                          return (
                            <tr key={drug.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '0.85rem' }}>
                                <strong>{drug.name}</strong>
                              </td>
                              <td style={{ padding: '0.85rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                                {drug.category || 'General Pharma'}
                              </td>
                              <td style={{ padding: '0.85rem' }}>
                                <span style={{ color: drug.in_stock !== false ? '#16a34a' : '#ef4444', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                  {drug.in_stock !== false ? '● Available' : '○ Out of Stock'}
                                </span>
                              </td>
                              <td style={{ padding: '0.85rem', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                ₦{stdPrice.toLocaleString()}
                              </td>
                              <td style={{ padding: '0.85rem' }}>
                                <span style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                  ₦{copayPrice.toLocaleString()}
                                </span>
                              </td>
                              <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                  {(authRole === 'pharmacist' || authRole === 'admin') && (
                                    <button
                                      className="btn btn-outline btn-sm"
                                      onClick={() => setEditPriceModal({ id: drug.id, name: drug.name, price: drug.price })}
                                      title="Update Price Tariff"
                                    >
                                      <i className="fa-solid fa-pen-to-square"></i> Edit Price
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                      startBooking({
                                        serviceType: "Prescription & Pharmacy Delivery",
                                        packageTitle: `Rx Drug Order: ${drug.name}`,
                                        price: pricingIsNhis
                                          ? `₦${copayPrice.toLocaleString()} (NHIS Copay)`
                                          : `₦${stdPrice.toLocaleString()}`,
                                        isNhis: pricingIsNhis,
                                      })
                                    }
                                  >
                                    Order Rx
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CATEGORY 4: ANNUAL CARE PACKAGES */}
            {pricingCategory === 'packages' && (
              <div className="pricing-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[
                  {
                    title: "Individual Wellness Subscription",
                    price: 12000,
                    period: "/ year",
                    desc: "Ideal for young professionals seeking preventive care and hassle-free telemedicine.",
                    features: ["4 Free GP Consultations/yr", "1 Free Full Blood Count Test", "10% Discount on Pharmacy Delivery", "Digital Medical Vault Storage"],
                    badge: "Essential",
                    icon: "fa-user-shield"
                  },
                  {
                    title: "Family Primary Care Plan",
                    price: 45000,
                    period: "/ year (Up to 5 Family Members)",
                    desc: "Comprehensive coverage for parents, children, or elderly dependents.",
                    features: ["Unlimited Virtual GP Sessions", "Priority Specialist Booking", "Free Mobile Lab Rider Dispatch", "15% Discount on Medication", "Dedicated Family Doctor Triage"],
                    badge: "Best Value",
                    icon: "fa-people-roof"
                  },
                  {
                    title: "Senior Chronic Care Plan",
                    price: 30000,
                    period: "/ year per Senior",
                    desc: "Tailored for hypertensive, diabetic, or arthritic seniors needing continuous monitoring.",
                    features: ["Monthly Home Nurse Vitals Check", "Automated Prescription Refill Delivery", "Direct Phone Line to Senior GP", "Quarterly Blood Sugar & Lipid Audit"],
                    badge: "Elderly Care",
                    icon: "fa-heart-circle-bolt"
                  }
                ]
                .filter(p => !pricingSearch || p.title.toLowerCase().includes(pricingSearch.toLowerCase()) || p.desc.toLowerCase().includes(pricingSearch.toLowerCase()))
                .map((plan, idx) => (
                  <div key={idx} className="pricing-card glassmorphic animate-fade" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          <i className={`fa-solid ${plan.icon}`}></i>
                        </div>
                        {plan.badge && (
                          <span style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>{plan.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                        {plan.desc}
                      </p>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-heading)' }}>
                            ₦{plan.price.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{plan.period}</span>
                        </div>
                      </div>

                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                        {plan.features.map((f, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: '0.85rem' }}></i> {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="btn btn-primary btn-block"
                      onClick={() =>
                        startBooking({
                          serviceType: "Wellness Subscription Package",
                          packageTitle: plan.title,
                          price: pricingIsNhis ? plan.nhisPrice : plan.price,
                          isNhis: pricingIsNhis,
                        })
                      }
                    >
                      Subscribe to {plan.title}
                    </button>
                  </div>
                ))}
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
                {/* Booking Mode Tabs */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setBookingFormData(prev => ({ ...prev, consultationMode: 'Virtual Consultation' }))}
                    style={{
                      flex: 1,
                      padding: '0.65rem 1rem',
                      border: 'none',
                      borderRight: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.88rem',
                      transition: 'background 0.2s',
                      background: bookingFormData.consultationMode !== 'Home Visit' ? 'var(--color-primary)' : 'transparent',
                      color: bookingFormData.consultationMode !== 'Home Visit' ? '#fff' : 'var(--color-text-muted)'
                    }}
                  >
                    <i className="fa-solid fa-video" style={{ marginRight: '6px' }}></i> Online Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingFormData(prev => ({ ...prev, consultationMode: 'Home Visit' }))}
                    style={{
                      flex: 1,
                      padding: '0.65rem 1rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.88rem',
                      transition: 'background 0.2s',
                      background: bookingFormData.consultationMode === 'Home Visit' ? 'var(--color-primary)' : 'transparent',
                      color: bookingFormData.consultationMode === 'Home Visit' ? '#fff' : 'var(--color-text-muted)'
                    }}
                  >
                    <i className="fa-solid fa-house" style={{ marginRight: '6px' }}></i> Home Visit
                  </button>
                </div>

                {bookingFormData.serviceType === "Prescription & Pharmacy Delivery" || bookingFormData.packageTitle?.toLowerCase().includes("pharm") ? (
                  <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <i className="fa-solid fa-capsules" style={{ fontSize: '1.2rem', color: '#1d4ed8' }}></i>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#1e40af', display: 'block' }}>Pharmacy Prescription & Medication Orders</strong>
                        <span style={{ fontSize: '0.78rem', color: '#1e3a8a' }}>Use our dedicated Pharmacy Page for online medicine catalog and home dispatch.</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigateTo('service-pharmacy-delivery')}>
                      Go to Pharmacy Page →
                    </button>
                  </div>
                ) : bookingFormData.serviceType === "Mobile Diagnostic Lab" || bookingFormData.packageTitle?.toLowerCase().includes("lab") ? (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <i className="fa-solid fa-flask-vial" style={{ fontSize: '1.2rem', color: '#15803d' }}></i>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'block' }}>Mobile Diagnostic Lab & Home Sample Collection</strong>
                        <span style={{ fontSize: '0.78rem', color: '#14532d' }}>Use our Mobile Lab Page to schedule home phlebotomy riders and lab panels.</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigateTo('service-mobile-lab')}>
                      Go to Mobile Lab Page →
                    </button>
                  </div>
                ) : null}
                {(bookingFormData.packageTitle || bookingFormData.serviceType) && (
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(2, 132, 199, 0.08))",
                      border: "1px solid rgba(2, 132, 199, 0.25)",
                      borderRadius: "12px",
                      padding: "0.85rem 1rem",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: "var(--color-primary)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          flexShrink: 0,
                        }}
                      >
                        <i className="fa-solid fa-receipt"></i>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "var(--color-text-muted)",
                            fontWeight: "bold",
                          }}
                        >
                          Request Context
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "0.95rem",
                            color: "var(--color-primary)",
                          }}
                        >
                          {bookingFormData.packageTitle ||
                            bookingFormData.serviceType}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--color-text-muted)",
                            marginTop: "1px",
                          }}
                        >
                          Type: <strong>{bookingFormData.serviceType}</strong>
                          {bookingFormData.price
                            ? ` • Tariff: ${bookingFormData.price}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    {bookingFormData.packageTitle && (
                      <button
                        className="btn btn-outline btn-sm"
                        type="button"
                        onClick={() =>
                          setBookingFormData((prev) => ({
                            ...prev,
                            packageTitle: "",
                            price: "",
                            serviceType: "Virtual Consultation",
                          }))
                        }
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
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



                  {/* Home Visit Residential Address Section */}
                  {(bookingFormData.consultationMode === 'Home Visit' || bookingFormData.serviceType?.toLowerCase().includes('home') || bookingFormData.packageTitle?.toLowerCase().includes('home')) && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '1rem' }}>Home Visit Address</p>

                      <div className="form-row" style={{ marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>State *</label>
                          <select
                            required={bookingFormData.consultationMode === 'Home Visit'}
                            value={bookingFormData.stateName || ''}
                            onChange={(e) => {
                              setBookingFormData({
                                ...bookingFormData,
                                stateName: e.target.value,
                                lga: '',
                                ward: ''
                              });
                            }}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          >
                            <option value="">-- Select State --</option>
                            {Object.keys(NIGERIA_LOCATION_DATA).map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Local Government (LGA) *</label>
                          <select
                            required={bookingFormData.consultationMode === 'Home Visit'}
                            disabled={!bookingFormData.stateName}
                            value={bookingFormData.lga || ''}
                            onChange={(e) => {
                              setBookingFormData({
                                ...bookingFormData,
                                lga: e.target.value,
                                ward: ''
                              });
                            }}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          >
                            <option value="">-- Select LGA --</option>
                            {bookingFormData.stateName && NIGERIA_LOCATION_DATA[bookingFormData.stateName] &&
                              Object.keys(NIGERIA_LOCATION_DATA[bookingFormData.stateName]).map((lga) => (
                                <option key={lga} value={lga}>{lga}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Ward *</label>
                          <select
                            required={bookingFormData.consultationMode === 'Home Visit'}
                            disabled={!bookingFormData.lga}
                            value={bookingFormData.ward || ''}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, ward: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          >
                            <option value="">-- Select Ward --</option>
                            {bookingFormData.stateName && bookingFormData.lga && NIGERIA_LOCATION_DATA[bookingFormData.stateName]?.[bookingFormData.lga] &&
                              NIGERIA_LOCATION_DATA[bookingFormData.stateName][bookingFormData.lga].map((w) => (
                                <option key={w} value={w}>{w}</option>
                              ))
                            }
                          </select>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Street / House Address *</label>
                          <input
                            type="text"
                            required={bookingFormData.consultationMode === 'Home Visit'}
                            placeholder="e.g. House 12, Close B, Off Airport Road"
                            value={bookingFormData.homeAddress}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, homeAddress: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

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

                  {/* NHIS / HMO Patient Enrollee Section */}
                  <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(2, 132, 199, 0.2)', marginBottom: '1.25rem' }}>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-indigo)', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={!!bookingFormData.isNhis}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, isNhis: e.target.checked })}
                        style={{ width: 'auto', margin: 0 }}
                      />
                      <span><i className="fa-solid fa-shield-halved" style={{ color: '#0284c7', marginRight: '6px' }}></i> Patient is an NHIS / HMO Insurance Enrollee</span>
                    </label>

                    {bookingFormData.isNhis && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.85rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>NHIS / HMO Number *</label>
                          <input
                            type="text"
                            required={bookingFormData.isNhis}
                            placeholder="e.g. NHIS-849201"
                            value={bookingFormData.nhisNumber}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, nhisNumber: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>HMO / Provider Name</label>
                          <select
                            value={bookingFormData.nhisHmo}
                            onChange={(e) => setBookingFormData({ ...bookingFormData, nhisHmo: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', height: '38px' }}
                          >
                            <option value="NHIA Primary Scheme">NHIA Primary Health Scheme</option>
                            <option value="Hygeia HMO">Hygeia HMO</option>
                            <option value="Total Health Trust">Total Health Trust</option>
                            <option value="Reliance HMO">Reliance HMO</option>
                            <option value="AXA Mansard Health">AXA Mansard Health</option>
                            <option value="Anchor HMO">Anchor HMO</option>
                            <option value="Other Licensed HMO">Other Licensed HMO</option>
                          </select>
                        </div>
                      </div>
                    )}
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
                              <button type="button" className="pw-toggle-btn" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPasswords(p => ({ ...p, patient: !p.patient })); }} tabIndex={-1} aria-label="Toggle password visibility">
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
                            <button type="button" className="pw-toggle-btn" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPasswords(p => ({ ...p, patient: !p.patient })); }} tabIndex={-1} aria-label="Toggle password visibility">
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(24,43,73,0.15)' }}></div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OR</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(24,43,73,0.15)' }}></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="btn btn-outline btn-block"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        background: '#ffffff',
                        color: '#3c4043',
                        border: '1px solid #dadce0',
                        fontWeight: '600',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                      </svg>
                      {isPatientRegistering ? "Sign up with Google" : "Continue with Google"}
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
                  <div
                    className={`stat-item clickable ${patientNavView === 'bookings' ? 'active' : ''}`}
                    onClick={() => setPatientNavView('bookings')}
                  >
                    <h3>{myPatientAppointments.length}</h3>
                    <p>CLINICAL CONSULTATIONS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${patientNavView === 'orders' ? 'active' : ''}`}
                    onClick={() => {
                      setPatientNavView('orders');
                      setSelectedPharmacyOrder(null);
                      setActiveTrackingId(null);
                    }}
                  >
                    <h3>{myPatientPharmacyOrders.length}</h3>
                    <p>PHARMACY DELIVERIES</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${patientNavView === 'labs' ? 'active' : ''}`}
                    onClick={() => {
                      setPatientNavView('labs');
                      setSelectedLabRequest(null);
                      setActiveTrackingId(null);
                    }}
                  >
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
                                        <div style={{ marginTop: '0.35rem' }}>
                                          {renderPaymentStatusBadge(apt, 'appointment', 'patient')}
                                        </div>
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
                                          <button
                                            style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                            onClick={() => handleViewReceipt(apt, 'appointment')}
                                            title="Invoice & Receipt"
                                          >
                                            <i className="fa-solid fa-file-invoice"></i> Invoice & Receipt
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                  <div style={{ padding: '0.75rem', background: 'rgba(28,43,73,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                      <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Total Cost Paid</strong>
                                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-success)', display: 'block' }}>{total}</strong>
                                    </div>
                                    <button
                                      className="btn btn-outline btn-xs"
                                      onClick={() => handleViewReceipt(selectedPharmacyOrder, 'order')}
                                      style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', alignSelf: 'flex-start' }}
                                    >
                                      <i className="fa-solid fa-receipt"></i> Generate Receipt / Invoice
                                    </button>
                                  </div>
                                </div>

                                {/* Logistics Live Tracking Map for In Transit */}
                                 {status === 'Out for Delivery' && (() => {
                                   const progressVal = selectedPharmacyOrder.deliveryProgress || 0;
                                   const courierName = selectedPharmacyOrder.assignedRider || 'Default Courier';
                                   const destCoords = getTripCoords(selectedPharmacyOrder.id);
                                   const currentCoords = getInterpolatedCoords(progressVal, destCoords, courierName, selectedPharmacyOrder.id);
                                   const riderCoords = getRiderCoords(courierName);
                                   
                                   return (
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
                                           ETA: {Math.max(1, Math.round(15 * (1 - progressVal / 100)))} MINS
                                         </div>

                                         <svg viewBox="0 0 500 300" style={{ width: '100%', height: 'auto', background: '#070d1e', borderRadius: '8px' }}>
                                           {/* Road Map Grid */}
                                           <defs>
                                             <pattern id="mapGridMini2" width="20" height="20" patternUnits="userSpaceOnUse">
                                               <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                             </pattern>
                                           </defs>
                                           <rect width="500" height="300" fill="url(#mapGridMini2)" />

                                           {/* Water / Parks */}
                                           <path d="M 0,220 C 150,230 300,180 500,210 L 500,300 L 0,300 Z" fill="#0d1b3e" opacity="0.4" />
                                           <path d="M 0,220 C 150,230 300,180 500,210" stroke="#1b3b6f" strokeWidth="4" fill="none" opacity="0.6" />
                                           <rect x="50" y="60" width="80" height="60" rx="8" fill="#14362d" opacity="0.3" />
                                           <rect x="360" y="40" width="90" height="50" rx="8" fill="#14362d" opacity="0.3" />

                                           {/* Streets */}
                                           <path d="M 20,40 L 480,40 M 20,260 L 480,260 M 70,20 L 70,280 M 430,20 L 430,280" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
                                           <path d="M 0,150 L 500,150" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                           <path d="M 0,150 L 500,150" stroke="#0f172a" strokeWidth="6" fill="none" />
                                           <path d="M 250,0 L 250,300" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                           <path d="M 250,0 L 250,300" stroke="#0f172a" strokeWidth="6" fill="none" />
                                           <path d="M 20,20 L 480,280" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                                           <path d="M 20,20 L 480,280" stroke="#0f172a" strokeWidth="4" fill="none" />

                                           {/* Central Hub Pin */}
                                           <circle cx="250" cy="150" r="6" fill="#10b981" />
                                           <circle cx="250" cy="150" r="12" fill="#10b981" fillOpacity="0.15" />
                                           <text x="260" y="154" fill="#10b981" fontSize="8" fontWeight="bold">Central Hub</text>

                                           {/* Leg 1 Path */}
                                           <line
                                             x1={riderCoords.x}
                                             y1={riderCoords.y}
                                             x2="250"
                                             y2="150"
                                             stroke="#f59e0b"
                                             strokeWidth="2.5"
                                             strokeDasharray="4,4"
                                             opacity={progressVal <= 40 ? 1 : 0.3}
                                           />

                                           {/* Leg 2 Path */}
                                           <line
                                             x1="250"
                                             y1="150"
                                             x2={destCoords.x}
                                             y2={destCoords.y}
                                             stroke="#10b981"
                                             strokeWidth="3"
                                             strokeDasharray={progressVal < 40 ? "5,5" : "none"}
                                             opacity={progressVal >= 40 ? 1 : 0.4}
                                           />

                                           {/* Destination Pin */}
                                           <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
                                             <circle r="7" fill="#ef4444" />
                                             <circle r="13" fill="#ef4444" fillOpacity="0.15" />
                                             <text x="10" y="3" fill="#ef4444" fontSize="9" fontWeight="bold">{selectedPharmacyOrder.name || loggedInPatient.name}</text>
                                           </g>

                                           {/* Moving Courier */}
                                           <g transform={`translate(${currentCoords.x}, ${currentCoords.y})`}>
                                             <circle r="9" fill="var(--color-accent)" />
                                             <circle r="16" fill="var(--color-accent)" fillOpacity="0.3" style={{ animation: 'ping 1.5s infinite' }} />
                                             <text textAnchor="middle" y="3" fill="#fff" fontSize="9">{progressVal < 40 ? '🏍️' : '📦'}</text>
                                           </g>
                                         </svg>

                                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                           <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                             {courierName.charAt(0).toUpperCase()}
                                           </div>
                                           <div>
                                             <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                               {courierName}
                                             </div>
                                             <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                               SimmyCare Dispatcher • Motorbike
                                             </div>
                                           </div>
                                           <a href="tel:08012345678" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                             <i className="fa-solid fa-phone" style={{ fontSize: '0.8rem' }}></i>
                                           </a>
                                         </div>

                                         {progressVal === 100 ? (
                                           <button
                                             type="button"
                                             className="btn btn-success"
                                             onClick={() => {
                                               const updatedOrders = inquiries.map(inq =>
                                                 inq.id === selectedPharmacyOrder.id ? { ...inq, status: 'Delivered' } : inq
                                               );
                                               setInquiries(updatedOrders);
                                               setSelectedPharmacyOrder({ ...selectedPharmacyOrder, status: 'Delivered' });
                                               alert("Thank you! You have confirmed receipt of your drugs. Your order status is now 'Delivered'.");
                                             }}
                                             style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#22c55e', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                                           >
                                             <i className="fa-solid fa-circle-check"></i> Confirm Receipt of Drugs
                                           </button>
                                         ) : (
                                           <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#93c5fd', textAlign: 'center' }}>
                                             <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.35rem' }}></i>
                                             Courier is en route. Please confirm receipt here once the rider arrives.
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                   );
                                 })()}

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
                                  (() => {
                                    const progressVal = selectedLabRequest.deliveryProgress || 0;
                                    const courierName = selectedLabRequest.assignedRider || 'Default Courier';
                                    const destCoords = getTripCoords(selectedLabRequest.id);
                                    const riderCoords = getRiderCoords(courierName);
                                    
                                    let currentCoords;
                                    if (status === 'Sample Collected') {
                                      // Return leg: Client -> Hub
                                      const factor = progressVal / 100;
                                      currentCoords = {
                                        x: destCoords.x + (250 - destCoords.x) * factor,
                                        y: destCoords.y + (150 - destCoords.y) * factor
                                      };
                                    } else {
                                      // Collection leg: Rider -> Hub -> Client
                                      currentCoords = getInterpolatedCoords(progressVal, destCoords, courierName, selectedLabRequest.id);
                                    }

                                    return (
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
                                            ETA: {Math.max(1, Math.round(15 * (1 - progressVal / 100)))} MINS
                                          </div>

                                          <svg viewBox="0 0 500 300" style={{ width: '100%', height: 'auto', background: '#070d1e', borderRadius: '8px' }}>
                                            {/* Road Map Grid */}
                                            <defs>
                                              <pattern id="mapGridMini3" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                                              </pattern>
                                            </defs>
                                            <rect width="500" height="300" fill="url(#mapGridMini3)" />

                                            {/* Water / Parks */}
                                            <path d="M 0,220 C 150,230 300,180 500,210 L 500,300 L 0,300 Z" fill="#0d1b3e" opacity="0.4" />
                                            <path d="M 0,220 C 150,230 300,180 500,210" stroke="#1b3b6f" strokeWidth="4" fill="none" opacity="0.6" />
                                            <rect x="50" y="60" width="80" height="60" rx="8" fill="#14362d" opacity="0.3" />
                                            <rect x="360" y="40" width="90" height="50" rx="8" fill="#14362d" opacity="0.3" />

                                            {/* Streets */}
                                            <path d="M 20,40 L 480,40 M 20,260 L 480,260 M 70,20 L 70,280 M 430,20 L 430,280" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
                                            <path d="M 0,150 L 500,150" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                            <path d="M 0,150 L 500,150" stroke="#0f172a" strokeWidth="6" fill="none" />
                                            <path d="M 250,0 L 250,300" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                                            <path d="M 250,0 L 250,300" stroke="#0f172a" strokeWidth="6" fill="none" />
                                            <path d="M 20,20 L 480,280" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                                            <path d="M 20,20 L 480,280" stroke="#0f172a" strokeWidth="4" fill="none" />

                                            {/* Central Hub Pin */}
                                            <circle cx="250" cy="150" r="6" fill="#10b981" />
                                            <circle cx="250" cy="150" r="12" fill="#10b981" fillOpacity="0.15" />
                                            <text x="260" y="154" fill="#10b981" fontSize="8" fontWeight="bold">Central Hub</text>

                                            {/* Route path Leg 1 (dashed or active depending on stage) */}
                                            {status !== 'Sample Collected' && (
                                              <line
                                                x1={riderCoords.x}
                                                y1={riderCoords.y}
                                                x2="250"
                                                y2="150"
                                                stroke="#f59e0b"
                                                strokeWidth="2.5"
                                                strokeDasharray="4,4"
                                                opacity={progressVal <= 40 ? 1 : 0.3}
                                              />
                                            )}

                                            {/* Leg 2 path: Hub -> Patient */}
                                            <line
                                              x1="250"
                                              y1="150"
                                              x2={destCoords.x}
                                              y2={destCoords.y}
                                              stroke="#10b981"
                                              strokeWidth="3"
                                              strokeDasharray={progressVal < 40 && status !== 'Sample Collected' ? "5,5" : "none"}
                                              opacity={progressVal >= 40 || status === 'Sample Collected' ? 1 : 0.4}
                                            />

                                            {/* Patient Location Pin */}
                                            <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
                                              <circle r="7" fill="#ef4444" />
                                              <circle r="13" fill="#ef4444" fillOpacity="0.15" />
                                              <text x="10" y="3" fill="#ef4444" fontSize="9" fontWeight="bold">{selectedLabRequest.patientName || loggedInPatient.name}</text>
                                            </g>

                                            {/* Moving Courier */}
                                            <g transform={`translate(${currentCoords.x}, ${currentCoords.y})`}>
                                              <circle r="9" fill="#f59e0b" />
                                              <circle r="16" fill="#f59e0b" fillOpacity="0.3" style={{ animation: 'ping 1.5s infinite' }} />
                                              <text textAnchor="middle" y="3" fill="#fff" fontSize="9">{status === 'Sample Collected' ? '🧪' : '🚁'}</text>
                                            </g>
                                          </svg>

                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                              {courierName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                                                {courierName}
                                              </div>
                                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                Simmy Diagnostics Specialist • Mobile Lab Unit
                                              </div>
                                            </div>
                                            <a href="tel:08012345678" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                              <i className="fa-solid fa-phone" style={{ fontSize: '0.8rem' }}></i>
                                            </a>
                                          </div>

                                          {status === 'Pending' && progressVal === 100 && (
                                            <button
                                              type="button"
                                              className="btn btn-warning"
                                              onClick={() => {
                                                const updatedApts = appointments.map(apt =>
                                                  apt.id === selectedLabRequest.id ? { ...apt, status: 'Sample Collected', deliveryProgress: 0, isSimulating: true } : apt
                                                );
                                                setAppointments(updatedApts);
                                                setSelectedLabRequest({ ...selectedLabRequest, status: 'Sample Collected', deliveryProgress: 0, isSimulating: true });
                                                alert("Thank you! You have confirmed technician arrival and sample collection. The technician is now returning to the laboratory.");
                                              }}
                                              style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#f59e0b', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                              <i className="fa-solid fa-vial-circle-check"></i> Confirm Sample Collection
                                            </button>
                                          )}

                                          {status === 'Sample Collected' && progressVal === 100 && (
                                            <button
                                              type="button"
                                              className="btn btn-success"
                                              onClick={() => {
                                                const updatedApts = appointments.map(apt =>
                                                  apt.id === selectedLabRequest.id ? { ...apt, status: 'Completed', deliveryProgress: 100 } : apt
                                                );
                                                setAppointments(updatedApts);
                                                setSelectedLabRequest({ ...selectedLabRequest, status: 'Completed', deliveryProgress: 100 });
                                                alert("Thank you! You have confirmed safe delivery of laboratory samples to the pathology laboratory. Clinical diagnostics will begin immediately.");
                                              }}
                                              style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#22c55e', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                              <i className="fa-solid fa-circle-check"></i> Confirm Lab Delivery Completion
                                            </button>
                                          )}

                                          {progressVal < 100 && (
                                            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#fcd34d', textAlign: 'center' }}>
                                              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.35rem' }}></i>
                                              {status === 'Sample Collected' ? 'Technician is returning samples to pathology lab. Please confirm final delivery once they arrive.' : 'Technician is en route to your location. Please confirm collection here when they arrive.'}
                                            </div>
                                          )}
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
                                    );
                                  })()
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
                    <DoctorAvatar image={loggedInDoctor.image} name={loggedInDoctor.name} size={48} />
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
                  <div
                    className={`stat-item clickable ${doctorStatusFilter === 'All' && doctorNavView === 'backlog' ? 'active' : ''}`}
                    onClick={() => {
                      setDoctorStatusFilter('All');
                      setDoctorNavView('backlog');
                    }}
                  >
                    <h3>{myDoctorAppointments.length}</h3>
                    <p>TOTAL ASSIGNED PATIENTS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${doctorStatusFilter === 'Pending' && doctorNavView === 'backlog' ? 'active' : ''}`}
                    onClick={() => {
                      setDoctorStatusFilter(doctorStatusFilter === 'Pending' ? 'All' : 'Pending');
                      setDoctorNavView('backlog');
                    }}
                  >
                    <h3>{myDoctorAppointments.filter(a => a.status === 'Pending').length}</h3>
                    <p>AWAITING REVIEW</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${doctorNavView === 'profile' ? 'active' : ''}`}
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

                    {doctorNavView === 'backlog' && (() => {
                      const filteredAppointments = doctorStatusFilter === 'Pending' ? myDoctorAppointments.filter(a => a.status === 'Pending') : myDoctorAppointments;
                      return (
                        <div>
                          <h3>My Consultation Backlog ({filteredAppointments.length})</h3>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'start' }}>
                            {/* Left Column: Appointments */}
                            <div style={{ flex: '1 1 650px', minWidth: 0 }}>
                              {filteredAppointments.length > 0 ? (
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
                                    {filteredAppointments.map(apt => (
                                      <React.Fragment key={apt.id}>
                                        <tr
                                          className="clickable-row"
                                          onClick={(e) => {
                                            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                              setAdminSelectedApt(apt);
                                            }
                                          }}
                                          style={{ background: apt.status === 'Approved' ? 'rgba(34,197,94,0.02)' : apt.status === 'Rejected' ? 'rgba(239,68,68,0.01)' : 'transparent', cursor: 'pointer' }}
                                        >
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
                                            <div style={{ marginTop: '0.35rem' }}>
                                              {renderPaymentStatusBadge(apt, 'appointment', 'doctor')}
                                            </div>
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
                                                style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                                onClick={() => handleViewReceipt(apt, 'appointment')}
                                                title="Generate Invoice & Receipt"
                                              >
                                                <i className="fa-solid fa-receipt"></i> Invoice & Receipt
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
                    );
                  })()}

                    {doctorNavView === 'profile' && (
                      <div>
                        {!isEditingDocSelf ? (
                          <div className="doctor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(28,43,73,0.05)', borderRadius: '12px' }}>
                              <DoctorAvatar image={loggedInDoctor.image} name={loggedInDoctor.name} size={96} border="3px solid var(--color-accent)" />
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
                                      <span key={srv} style={{ fontSize: '0.85rem', color: 'var(--color-indigo)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <i className="fa-solid fa-check" style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}></i> {srv}
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
                                        const uploadedUrl = await uploadAvatarToSupabase(file, 'doc_profile');
                                        const compressed = await compressImageFile(file, 400, 0.7);
                                        const finalImg = uploadedUrl || compressed;
                                        if (finalImg) {
                                          setDocSelfData({ ...docSelfData, image: finalImg });
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
                      <div
                        className={`stat-item clickable ${pharmacyStatusFilter === 'All' && pharmacistNavView === 'orders' ? 'active' : ''}`}
                        onClick={() => {
                          setPharmacyStatusFilter('All');
                          setPharmacistNavView('orders');
                        }}
                      >
                        <h3>{orders.length}</h3>
                        <p>TOTAL ORDERS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${pharmacyStatusFilter === 'Pending' && pharmacistNavView === 'orders' ? 'active' : ''}`}
                        onClick={() => {
                          setPharmacyStatusFilter(pharmacyStatusFilter === 'Pending' ? 'All' : 'Pending');
                          setPharmacistNavView('orders');
                        }}
                      >
                        <h3>{pending.length}</h3>
                        <p>PENDING REVIEW</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${pharmacyStatusFilter === 'In Progress' && pharmacistNavView === 'orders' ? 'active' : ''}`}
                        onClick={() => {
                          setPharmacyStatusFilter(pharmacyStatusFilter === 'In Progress' ? 'All' : 'In Progress');
                          setPharmacistNavView('orders');
                        }}
                      >
                        <h3>{processing.length + dispatched.length}</h3>
                        <p>IN PROGRESS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${pharmacistNavView === 'prescriptions' ? 'active' : ''}`}
                        onClick={() => {
                          setPharmacistNavView('prescriptions');
                        }}
                      >
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
                    <button
                      className={`sidebar-link ${pharmacistNavView === 'stock' ? 'active' : ''}`}
                      onClick={() => setPharmacistNavView('stock')}
                    >
                      <i className="fa-solid fa-pills"></i> Available Stock & Inventory
                    </button>
                  </div>

                  {/* Right Column: Workspaces */}
                  <div className="dashboard-workspace glassmorphic">

                    {/* Workspace: Orders */}
                    {pharmacistNavView === 'orders' && (
                      <div>
                        <h3>Medication Delivery Orders</h3>
                        {(() => {
                          let orders = inquiries.filter(inq => inq.id.startsWith('ORD-'));
                          if (pharmacyStatusFilter === 'Pending') {
                            orders = orders.filter(o => !o.status || o.status === 'Pending' || o.status === 'Pending Review');
                          } else if (pharmacyStatusFilter === 'In Progress') {
                            orders = orders.filter(o => o.status === 'Processing & Packaging' || o.status === 'Out for Delivery' || o.status === 'Awaiting Dispatch');
                          }
                          if (orders.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pharmacy orders match the selected filter.</p>;
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
                                      <tr
                                        key={order.id}
                                        className="clickable-row"
                                        onClick={(e) => {
                                          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                            setPharmacistSelectedOrder(order);
                                          }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      >
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
                                          {renderPaymentStatusBadge(order, 'order', 'pharmacist')}
                                        </td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => setPharmacistSelectedOrder(order)}>
                                              <i className="fa-solid fa-eye"></i> View & Process
                                            </button>
                                            <button
                                              className="btn btn-sm"
                                              style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)', fontWeight: 'bold' }}
                                              onClick={() => handleViewReceipt(order, 'order')}
                                              title="Generate Invoice & Receipt"
                                            >
                                              <i className="fa-solid fa-receipt"></i> Invoice
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

                    {/* Workspace: Available Stock & Inventory */}
                    {pharmacistNavView === 'stock' && renderStockInventoryView()}

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
                      <div
                        className={`stat-item clickable ${labStatusFilter === 'All' ? 'active' : ''}`}
                        onClick={() => {
                          setLabStatusFilter('All');
                          setLabNavView('requests');
                        }}
                      >
                        <h3>{requests.length}</h3>
                        <p>TOTAL LAB BOOKINGS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${labStatusFilter === 'Pending' ? 'active' : ''}`}
                        onClick={() => {
                          setLabStatusFilter(labStatusFilter === 'Pending' ? 'All' : 'Pending');
                          setLabNavView('requests');
                        }}
                      >
                        <h3>{pending.length}</h3>
                        <p>PENDING COLLECTION</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${labStatusFilter === 'Sample Collected' ? 'active' : ''}`}
                        onClick={() => {
                          setLabStatusFilter(labStatusFilter === 'Sample Collected' ? 'All' : 'Sample Collected');
                          setLabNavView('requests');
                        }}
                      >
                        <h3>{collected.length}</h3>
                        <p>SAMPLES COLLECTED</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${labStatusFilter === 'Ready' ? 'active' : ''}`}
                        onClick={() => {
                          setLabStatusFilter(labStatusFilter === 'Ready' ? 'All' : 'Ready');
                          setLabNavView('history');
                        }}
                      >
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
                    <button
                      className={`sidebar-link ${labNavView === 'inventory' ? 'active' : ''}`}
                      onClick={() => setLabNavView('inventory')}
                    >
                      <i className="fa-solid fa-boxes-stacked"></i> Lab Test & Kit Inventory
                    </button>
                  </div>

                  {/* Right Column: Workspaces */}
                  <div className="dashboard-workspace glassmorphic">

                    {/* Workspace: Lab Stock Inventory */}
                    {labNavView === 'inventory' && renderLabStockInventoryView()}

                    {/* Workspace: Active Requests */}
                    {labNavView === 'requests' && (
                      <div>
                        <h3>Active Lab Bookings & Tests</h3>
                        {(() => {
                          let requests = appointments.filter(apt => (apt.id.startsWith('LAB-') || apt.doctor === 'Mobile Lab Unit') && apt.status !== 'Completed' && apt.status !== 'Approved');
                          if (labStatusFilter === 'Pending') {
                            requests = requests.filter(r => r.status === 'Pending');
                          } else if (labStatusFilter === 'Sample Collected') {
                            requests = requests.filter(r => r.status === 'Sample Collected');
                          }
                          if (requests.length === 0) {
                            return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No active laboratory bookings match the selected filter.</p>;
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
                                      <tr
                                        key={req.id}
                                        className="clickable-row"
                                        onClick={(e) => {
                                          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                            setLabSelectedRequest(req);
                                            setLabResultsText('');
                                          }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      >
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
                      <div
                        className={`stat-item clickable ${logisticsStatusFilter === 'Pending' ? 'active' : ''}`}
                        onClick={() => {
                          setLogisticsStatusFilter(logisticsStatusFilter === 'Pending' ? 'All' : 'Pending');
                          if (logisticsNavView !== 'deliveries' && logisticsNavView !== 'lab-trips') {
                            setLogisticsNavView('deliveries');
                          }
                        }}
                      >
                        <h3>{pendingDisp + pendingColl}</h3>
                        <p>PENDING TASKS</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${logisticsStatusFilter === 'In Transit' ? 'active' : ''}`}
                        onClick={() => {
                          setLogisticsStatusFilter(logisticsStatusFilter === 'In Transit' ? 'All' : 'In Transit');
                          if (logisticsNavView !== 'deliveries' && logisticsNavView !== 'lab-trips') {
                            setLogisticsNavView('deliveries');
                          }
                        }}
                      >
                        <h3>{inTransit}</h3>
                        <p>IN TRANSIT</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div
                        className={`stat-item clickable ${logisticsStatusFilter === 'Completed' ? 'active' : ''}`}
                        onClick={() => {
                          setLogisticsStatusFilter(logisticsStatusFilter === 'Completed' ? 'All' : 'Completed');
                          if (logisticsNavView !== 'deliveries' && logisticsNavView !== 'lab-trips') {
                            setLogisticsNavView('deliveries');
                          }
                        }}
                      >
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {/* Left Column: Shipment Table */}
                          <div>
                            {(() => {
                              let shipments = inquiries.filter(inq => inq.id.startsWith('ORD-') && (inq.status === 'Awaiting Dispatch' || inq.status === 'Out for Delivery' || inq.status === 'Delivered'));
                              if (logisticsStatusFilter === 'Pending') {
                                shipments = shipments.filter(s => s.status === 'Awaiting Dispatch');
                              } else if (logisticsStatusFilter === 'In Transit') {
                                shipments = shipments.filter(s => s.status === 'Out for Delivery');
                              } else if (logisticsStatusFilter === 'Completed') {
                                shipments = shipments.filter(s => s.status === 'Delivered');
                              }
                              if (shipments.length === 0) {
                                return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pharmacy packages found matching the selected filter.</p>;
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
                                          <tr
                                            key={ship.id}
                                            className="clickable-row"
                                            onClick={(e) => {
                                              if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                                setMapTrackedTripId(ship.id);
                                              }
                                            }}
                                            style={{ background: isTrackingThis ? 'rgba(6, 182, 212, 0.08)' : 'transparent', cursor: 'pointer' }}
                                          >
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {/* Left Column: Trips Table */}
                          <div>
                            {(() => {
                              let trips = appointments.filter(apt => apt.id.startsWith('LAB-') && (apt.status === 'Pending' || apt.status === 'Sample Collected'));
                              if (logisticsStatusFilter === 'Pending') {
                                trips = trips.filter(t => t.status === 'Pending');
                              } else if (logisticsStatusFilter === 'In Transit') {
                                trips = trips.filter(t => t.status === 'Sample Collected');
                              } else if (logisticsStatusFilter === 'Completed') {
                                trips = trips.filter(t => t.status === 'Completed');
                              }
                              if (trips.length === 0) {
                                return <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No lab collection trips found matching the selected filter.</p>;
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
                                          <tr
                                            key={trip.id}
                                            className="clickable-row"
                                            onClick={(e) => {
                                              if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                                setMapTrackedTripId(trip.id);
                                              }
                                            }}
                                            style={{ background: isTrackingThis ? 'rgba(6, 182, 212, 0.08)' : 'transparent', cursor: 'pointer' }}
                                          >
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
                                        onClick={() => {
                                          if (mapSimulationProgress >= 100) {
                                            setMapSimulationProgress(0);
                                          }
                                          setIsMapSimulating(true);
                                        }}
                                        disabled={isMapSimulating}
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

                                   {/* Route Checkpoints with Manual Logging */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <strong style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>Route Checkpoints</strong>

                                    {/* Checkpoint 1: Depot Departure */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mapSimulationProgress >= 0 ? '#fff' : 'var(--color-text-muted)' }}>
                                        <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 0 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                        <span>Departed SimmyCare Depot</span>
                                      </div>
                                      {mapSimulationProgress === 0 && (
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-accent"
                                          onClick={() => {
                                            setMapSimulationProgress(30);
                                            const isOrder = mapTrackedTripId.startsWith('ORD-');
                                            const setList = isOrder ? setInquiries : setAppointments;
                                            setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 30, status: isOrder ? 'Out for Delivery' : 'Sample Collected' } : x));
                                          }}
                                          style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHighlight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                          Log Depart
                                        </button>
                                      )}
                                    </div>

                                    {/* Checkpoint 2: Abuja Ring Expressway */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mapSimulationProgress >= 30 ? '#fff' : 'var(--color-text-muted)' }}>
                                        <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 30 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                        <span>Transiting Expressway</span>
                                      </div>
                                      {mapSimulationProgress === 30 && (
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-accent"
                                          onClick={() => {
                                            setMapSimulationProgress(70);
                                            const isOrder = mapTrackedTripId.startsWith('ORD-');
                                            const setList = isOrder ? setInquiries : setAppointments;
                                            setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 70 } : x));
                                          }}
                                          style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHighlight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                          Log Transit
                                        </button>
                                      )}
                                    </div>

                                    {/* Checkpoint 3: Destination Ward */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.8rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mapSimulationProgress >= 70 ? '#fff' : 'var(--color-text-muted)' }}>
                                        <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress >= 70 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                        <span>Entering Destination Area</span>
                                      </div>
                                      {mapSimulationProgress === 70 && (
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-accent"
                                          onClick={() => {
                                            setMapSimulationProgress(100);
                                            const isOrder = mapTrackedTripId.startsWith('ORD-');
                                            const setList = isOrder ? setInquiries : setAppointments;
                                            setList(currentList => currentList.map(x => x.id === mapTrackedTripId ? { ...x, deliveryProgress: 100, status: isOrder ? 'Delivered' : 'Completed' } : x));
                                          }}
                                          style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', height: 'auto', lineHighlight: '1', background: 'var(--color-accent)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                          Log Arrival
                                        </button>
                                      )}
                                    </div>

                                    {/* Checkpoint 4: Delivered */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: mapSimulationProgress === 100 ? '#fff' : 'var(--color-text-muted)' }}>
                                      <i className="fa-solid fa-circle-check" style={{ color: mapSimulationProgress === 100 ? '#10b981' : 'rgba(255,255,255,0.2)' }}></i>
                                      <span>Delivered & Handed Over</span>
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
                              setRiderForm({
                                name: '',
                                email: '',
                                phone: '',
                                vehicleType: 'Motorbike',
                                dispatchArea: 'Abuja Central',
                                password: 'password123'
                              });
                              setShowRiderOnboardModal(true);
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
                  <div
                    className={`stat-item clickable ${adminStatusFilter === 'All' && adminNavView === 'appointments' ? 'active' : ''}`}
                    onClick={() => {
                      setAdminNavView('appointments');
                      setAdminStatusFilter('All');
                    }}
                  >
                    <h3>{appointments.length}</h3>
                    <p>TOTAL BOOKINGS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminStatusFilter === 'Pending' && adminNavView === 'appointments' ? 'active' : ''}`}
                    onClick={() => {
                      setAdminNavView('appointments');
                      setAdminStatusFilter(adminStatusFilter === 'Pending' ? 'All' : 'Pending');
                    }}
                  >
                    <h3>{appointments.filter(a => a.status === 'Pending').length}</h3>
                    <p>PENDING APPROVALS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminNavView === 'doctors' ? 'active' : ''}`}
                    onClick={() => setAdminNavView('doctors')}
                  >
                    <h3>{doctors.length}</h3>
                    <p>ACTIVE DOCTORS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminNavView === 'patients' ? 'active' : ''}`}
                    onClick={() => setAdminNavView('patients')}
                  >
                    <h3>{patients.length}</h3>
                    <p>REGISTERED PATIENTS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminNavView === 'pharmacists' ? 'active' : ''}`}
                    onClick={() => setAdminNavView('pharmacists')}
                  >
                    <h3>{pharmacists.length}</h3>
                    <p>PHARMACISTS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminNavView === 'labs' ? 'active' : ''}`}
                    onClick={() => setAdminNavView('labs')}
                  >
                    <h3>{labs.length}</h3>
                    <p>LAB TECHS</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div
                    className={`stat-item clickable ${adminNavView === 'logistics' ? 'active' : ''}`}
                    onClick={() => setAdminNavView('logistics')}
                  >
                    <h3>{logistics.length}</h3>
                    <p>LOGISTICS STAFF</p>
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
                      className={`sidebar-nav-btn ${adminNavView === 'pharmacists' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('pharmacists')}
                    >
                      <i className="fa-solid fa-prescription-bottle-medical"></i> Pharmacists
                    </button>
                    <button
                      className={`sidebar-nav-btn ${adminNavView === 'labs' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('labs')}
                    >
                      <i className="fa-solid fa-vials"></i> Lab Technicians
                    </button>
                    <button
                      className={`sidebar-nav-btn ${adminNavView === 'logistics' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('logistics')}
                    >
                      <i className="fa-solid fa-motorcycle"></i> Logistics Dispatch
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
                      className={`sidebar-nav-btn ${adminNavView === 'pharmacy_orders' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('pharmacy_orders')}
                    >
                      <i className="fa-solid fa-boxes-stacked"></i> Pharmacy Orders
                    </button>
                    <button
                      className={`sidebar-nav-btn ${adminNavView === 'receipts' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('receipts')}
                    >
                      <i className="fa-solid fa-receipt"></i> Receipts & Payments
                    </button>
                    <button
                      className={`sidebar-nav-btn ${adminNavView === 'drug_stock' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('drug_stock')}
                    >
                      <i className="fa-solid fa-pills"></i> Inventory & Stock Hub
                    </button>
                    <button
                      className={`sidebar-nav-btn ${adminNavView === 'admins' ? 'active' : ''}`}
                      onClick={() => setAdminNavView('admins')}
                    >
                      <i className="fa-solid fa-user-shield"></i> Admins Directory
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
                    {adminNavView === 'appointments' && (() => {
                      const filtered = adminStatusFilter === 'Pending' ? appointments.filter(a => a.status === 'Pending') : appointments;
                      return (
                        <div>
                          <h3>Appointments Registry</h3>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'start' }}>
                            {/* Left Column: Appointments List */}
                            <div style={{ flex: '1 1 650px', minWidth: 0 }}>
                              {filtered.length > 0 ? (
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
                                    {filtered.map(apt => (
                                      <tr
                                        key={apt.id}
                                        className="clickable-row"
                                        onClick={(e) => {
                                          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('select') && !e.target.closest('input')) {
                                            setAdminSelectedApt(apt);
                                          }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      >
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
                                          <div style={{ marginTop: '0.35rem' }}>
                                            {renderPaymentStatusBadge(apt, 'appointment', authRole)}
                                          </div>
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

                                            <button
                                              style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                                              onClick={() => handleViewReceipt(apt, 'appointment')}
                                              title="Generate Invoice & Official Receipt"
                                            >
                                              <i className="fa-solid fa-receipt"></i> Invoice & Receipt
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
                    );
                  })()}

                    {adminNavView === 'doctors' && (
                      <div>
                        <h3>Manage Staff & Specialist Directory</h3>

                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddDoctor}>
                          <h4>{editingDoctorId ? "Edit Specialist Profile" : "Register New Specialist Profile"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Staff / Specialist Full Name</label>
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
                                      const uploadedUrl = await uploadAvatarToSupabase(file, 'doc_profile');
                                      const compressed = await compressImageFile(file, 400, 0.7);
                                      const finalImg = uploadedUrl || compressed;
                                      if (finalImg) {
                                        setNewDoctorData({ ...newDoctorData, image: finalImg });
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
                          <h4>Registered Medical Staff & Specialists ({doctors.length})</h4>
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
                                        <DoctorAvatar image={d.image} name={d.name} size={36} />
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <strong style={{ color: 'var(--color-indigo)' }}>{d.name}</strong>
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(24, 43, 73, 0.08)', color: 'var(--color-text-muted)', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}>{d.staffId || 'N/A'}</span>
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
                                            <span key={srv} style={{ fontSize: '0.75rem', color: 'var(--color-indigo)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                              <i className="fa-solid fa-check" style={{ fontSize: '0.65rem', color: 'var(--color-accent)' }}></i> {srv}
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

                    {adminNavView === 'pharmacists' && (
                      <div>
                        <h3>Manage Pharmacy Directory</h3>

                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddPharmacist}>
                          <h4>{editingPharmacistId ? "Edit Pharmacist Profile" : "Register New Pharmacist Profile"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Pharmacist Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Bello Ibrahim"
                                value={newPharmacistData.name}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Pharmacy Facility Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. SimmyCare Central Pharmacy"
                                value={newPharmacistData.pharmacyName}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, pharmacyName: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>PCN License Number</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. PCN/P/9482"
                                value={newPharmacistData.pharmacyLicense}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, pharmacyLicense: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="pharmacist@simmycare.com"
                                value={newPharmacistData.email}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Contact Phone</label>
                              <input
                                type="text"
                                placeholder="e.g. 08012345678"
                                value={newPharmacistData.phone}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, phone: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Login Password</label>
                              <input
                                type="text"
                                required
                                placeholder="password123"
                                value={newPharmacistData.password}
                                onChange={(e) => setNewPharmacistData({ ...newPharmacistData, password: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary">{editingPharmacistId ? "Update Profile" : "Save Profile to Board"}</button>
                            {editingPharmacistId && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                  setEditingPharmacistId(null);
                                  setNewPharmacistData({ name: '', email: '', password: '', phone: '', pharmacyName: '', pharmacyLicense: '', verified: true, active: true });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Pharmacists ({pharmacists.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Staff ID</th>
                                  <th>Pharmacist</th>
                                  <th>Pharmacy Facility</th>
                                  <th>PCN License</th>
                                  <th>Contact Details</th>
                                  <th>Status</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pharmacists.map(p => (
                                  <tr key={p.email}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.staffId || 'N/A'}</td>
                                    <td>
                                      <strong>{p.name}</strong>
                                    </td>
                                    <td>{p.pharmacyName}</td>
                                    <td><code>{p.pharmacyLicense}</code></td>
                                    <td>
                                      <div style={{ fontSize: '0.8rem' }}>
                                        <div>Email: {p.email}</div>
                                        {p.phone && <div>Phone: {p.phone}</div>}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`status-badge ${p.active === false ? 'status-cancelled' : 'status-approved'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                                        {p.active === false ? 'Offline' : 'Online'}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setPharmacists(pharmacists.map(x => x.email === p.email ? { ...x, active: !x.active } : x));
                                          }}
                                          title={p.active === false ? "Go Online" : "Go Offline"}
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: p.active === false ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            color: p.active === false ? '#10B981' : '#EF4444'
                                          }}
                                        >
                                          <i className={`fa-solid ${p.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setEditingPharmacistId(p.email);
                                            setNewPharmacistData({
                                              name: p.name,
                                              email: p.email,
                                              password: p.password,
                                              phone: p.phone || '',
                                              pharmacyName: p.pharmacyName,
                                              pharmacyLicense: p.pharmacyLicense,
                                              verified: p.verified !== undefined ? p.verified : true,
                                              active: p.active !== undefined ? p.active : true
                                            });
                                          }}
                                          title="Edit Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}
                                        >
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to offboard Pharmacist ${p.name}?`)) {
                                              setPharmacists(pharmacists.filter(x => x.email !== p.email));
                                            }
                                          }}
                                          title="Delete Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}
                                        >
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

                    {adminNavView === 'labs' && (
                      <div>
                        <h3>Manage Laboratory Directory</h3>

                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddLab}>
                          <h4>{editingLabId ? "Edit Lab Technician Profile" : "Register New Lab Technician Profile"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Technician Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Wasila Goranduma"
                                value={newLabData.name}
                                onChange={(e) => setNewLabData({ ...newLabData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Lab Facility Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. SimmyCare Diagnostics"
                                value={newLabData.facilityName}
                                onChange={(e) => setNewLabData({ ...newLabData, facilityName: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>MLSCN License Number</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. MLSCN/L/3821"
                                value={newLabData.labLicense}
                                onChange={(e) => setNewLabData({ ...newLabData, labLicense: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="lab@simmycare.com"
                                value={newLabData.email}
                                onChange={(e) => setNewLabData({ ...newLabData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Contact Phone</label>
                              <input
                                type="text"
                                placeholder="e.g. 08023456789"
                                value={newLabData.phone}
                                onChange={(e) => setNewLabData({ ...newLabData, phone: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Login Password</label>
                              <input
                                type="text"
                                required
                                placeholder="password123"
                                value={newLabData.password}
                                onChange={(e) => setNewLabData({ ...newLabData, password: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary">{editingLabId ? "Update Profile" : "Save Profile to Board"}</button>
                            {editingLabId && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                  setEditingLabId(null);
                                  setNewLabData({ name: '', email: '', password: '', phone: '', facilityName: '', labLicense: '', verified: true, active: true });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Lab Technicians ({labs.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Staff ID</th>
                                  <th>Technician</th>
                                  <th>Diagnostic Facility</th>
                                  <th>MLSCN License</th>
                                  <th>Contact Details</th>
                                  <th>Status</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {labs.map(l => (
                                  <tr key={l.email}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{l.staffId || 'N/A'}</td>
                                    <td>
                                      <strong>{l.name}</strong>
                                    </td>
                                    <td>{l.facilityName}</td>
                                    <td><code>{l.labLicense}</code></td>
                                    <td>
                                      <div style={{ fontSize: '0.8rem' }}>
                                        <div>Email: {l.email}</div>
                                        {l.phone && <div>Phone: {l.phone}</div>}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`status-badge ${l.active === false ? 'status-cancelled' : 'status-approved'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                                        {l.active === false ? 'Offline' : 'Online'}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setLabs(labs.map(x => x.email === l.email ? { ...x, active: !x.active } : x));
                                          }}
                                          title={l.active === false ? "Go Online" : "Go Offline"}
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: l.active === false ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            color: l.active === false ? '#10B981' : '#EF4444'
                                          }}
                                        >
                                          <i className={`fa-solid ${l.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setEditingLabId(l.email);
                                            setNewLabData({
                                              name: l.name,
                                              email: l.email,
                                              password: l.password,
                                              phone: l.phone || '',
                                              facilityName: l.facilityName,
                                              labLicense: l.labLicense,
                                              verified: l.verified !== undefined ? l.verified : true,
                                              active: l.active !== undefined ? l.active : true
                                            });
                                          }}
                                          title="Edit Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}
                                        >
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to offboard Lab Tech ${l.name}?`)) {
                                              setLabs(labs.filter(x => x.email !== l.email));
                                            }
                                          }}
                                          title="Delete Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}
                                        >
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

                    {adminNavView === 'logistics' && (
                      <div>
                        <h3>Manage Logistics & Dispatch Directory</h3>

                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddLogistics}>
                          <h4>{editingLogisticsId ? "Edit Logistics Rider Profile" : "Register New Logistics Rider Profile"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Rider / Dispatcher Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Chinedu Okeke"
                                value={newLogisticsData.name}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Vehicle Type</label>
                              <select
                                value={newLogisticsData.vehicleType}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, vehicleType: e.target.value })}
                              >
                                <option value="Motorbike">Motorbike</option>
                                <option value="Bicycle">Bicycle</option>
                                <option value="Van">Delivery Van</option>
                                <option value="Drone">Autonomous Drone</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Dispatch Hub Area</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Abuja Central"
                                value={newLogisticsData.dispatchArea}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, dispatchArea: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="rider@simmycare.com"
                                value={newLogisticsData.email}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Contact Phone</label>
                              <input
                                type="text"
                                placeholder="e.g. 08034567890"
                                value={newLogisticsData.phone}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, phone: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Login Password</label>
                              <input
                                type="text"
                                required
                                placeholder="password123"
                                value={newLogisticsData.password}
                                onChange={(e) => setNewLogisticsData({ ...newLogisticsData, password: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary">{editingLogisticsId ? "Update Profile" : "Save Profile to Board"}</button>
                            {editingLogisticsId && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                  setEditingLogisticsId(null);
                                  setNewLogisticsData({ name: '', email: '', password: '', phone: '', vehicleType: 'Motorbike', dispatchArea: '', verified: true, active: true });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Logistics Dispatchers ({logistics.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Staff ID</th>
                                  <th>Rider Name</th>
                                  <th>Vehicle</th>
                                  <th>Dispatch Area</th>
                                  <th>Contact Details</th>
                                  <th>Status</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logistics.map(l => (
                                  <tr key={l.email}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{l.staffId || 'N/A'}</td>
                                    <td>
                                      <strong>{l.name}</strong>
                                    </td>
                                    <td>{l.vehicleType}</td>
                                    <td>{l.dispatchArea}</td>
                                    <td>
                                      <div style={{ fontSize: '0.8rem' }}>
                                        <div>Email: {l.email}</div>
                                        {l.phone && <div>Phone: {l.phone}</div>}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`status-badge ${l.active === false ? 'status-cancelled' : 'status-approved'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                                        {l.active === false ? 'Offline' : 'Online'}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setLogistics(logistics.map(x => x.email === l.email ? { ...x, active: !x.active } : x));
                                          }}
                                          title={l.active === false ? "Go Online" : "Go Offline"}
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: l.active === false ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            color: l.active === false ? '#10B981' : '#EF4444'
                                          }}
                                        >
                                          <i className={`fa-solid ${l.active === false ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setEditingLogisticsId(l.email);
                                            setNewLogisticsData({
                                              name: l.name,
                                              email: l.email,
                                              password: l.password,
                                              phone: l.phone || '',
                                              vehicleType: l.vehicleType,
                                              dispatchArea: l.dispatchArea,
                                              verified: l.verified !== undefined ? l.verified : true,
                                              active: l.active !== undefined ? l.active : true
                                            });
                                          }}
                                          title="Edit Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}
                                        >
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to offboard Logistics Rider ${l.name}?`)) {
                                              setLogistics(logistics.filter(x => x.email !== l.email));
                                            }
                                          }}
                                          title="Delete Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}
                                        >
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

                    {adminNavView === 'admins' && (
                      <div>
                        <h3>Manage Administrator Directory & Access</h3>

                        <form className="add-doctor-form glassmorphic" onSubmit={handleAddAdmin}>
                          <h4>{editingAdminId ? "Edit Admin Credentials" : "Register New Administrator Profile"}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Administrator Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Zainab Abdulfatah"
                                value={newAdminData.name}
                                onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Admin Username (for Sign-In)</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. zainab_admin"
                                value={newAdminData.username}
                                onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="zainab@simmycare.com"
                                value={newAdminData.email}
                                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Admin Sign-In Password</label>
                              <input
                                type="text"
                                required
                                placeholder="password123"
                                value={newAdminData.password}
                                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary">{editingAdminId ? "Update Profile" : "Save Profile to Board"}</button>
                            {editingAdminId && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                  setEditingAdminId(null);
                                  setNewAdminData({ name: '', username: '', email: '', password: '' });
                                }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </form>

                        <div style={{ marginTop: '2rem' }}>
                          <h4>Registered Administrators ({admins.length})</h4>
                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Staff ID</th>
                                  <th>Admin Name</th>
                                  <th>Username</th>
                                  <th>Email</th>
                                  <th>Credentials Preview</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {admins.map(a => (
                                  <tr key={a.email}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{a.staffId || 'N/A'}</td>
                                    <td>
                                      <strong>{a.name}</strong>
                                    </td>
                                    <td><code>{a.username}</code></td>
                                    <td>{a.email}</td>
                                    <td>Password: <code>{a.password}</code></td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            setEditingAdminId(a.email);
                                            setNewAdminData({
                                              name: a.name,
                                              username: a.username,
                                              email: a.email,
                                              password: a.password
                                            });
                                          }}
                                          title="Edit Profile"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(28, 43, 73, 0.08)', color: 'var(--color-indigo)' }}
                                        >
                                          <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                          className="delete-doctor-btn"
                                          onClick={() => {
                                            if (a.username === 'admin') {
                                              alert("Cannot revoke access from the primary system administrator account.");
                                              return;
                                            }
                                            if (confirm(`Are you sure you want to revoke admin access from ${a.name}?`)) {
                                              setAdmins(admins.filter(x => x.email !== a.email));
                                            }
                                          }}
                                          title="Revoke Admin Access"
                                          style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}
                                        >
                                          <i className="fa-solid fa-user-slash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div style={{ marginTop: '3rem', borderTop: '2px dashed rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                          <h4 style={{ color: 'var(--color-accent)' }}>Grant Admin Access to Existing Staff</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            You can promote existing staff members (Doctors, Pharmacists, Lab Techs, and Logistics) to have Administrator privileges. This allows them to log in and manage the clinic dashboard.
                          </p>

                          <div className="table-responsive">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Staff ID</th>
                                  <th>Staff Member</th>
                                  <th>Role / Specialty</th>
                                  <th>Email</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  ...doctors.map(d => ({ ...d, roleLabel: `Doctor (${d.specialty})`, rawRole: 'doctor' })),
                                  ...pharmacists.map(p => ({ ...p, roleLabel: 'Pharmacist', rawRole: 'pharmacist' })),
                                  ...labs.map(l => ({ ...l, roleLabel: 'Lab Tech', rawRole: 'lab' })),
                                  ...logistics.map(l => ({ ...l, roleLabel: 'Logistics Rider', rawRole: 'logistics' }))
                                ].map(staff => {
                                  const alreadyAdmin = admins.some(a => a.email.toLowerCase() === staff.email.toLowerCase());
                                  return (
                                    <tr key={staff.email}>
                                      <td style={{ fontFamily: 'monospace' }}>{staff.staffId || 'N/A'}</td>
                                      <td><strong>{staff.name}</strong></td>
                                      <td>{staff.roleLabel}</td>
                                      <td>{staff.email}</td>
                                      <td>
                                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                          {alreadyAdmin ? (
                                            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 'bold' }}>✓ Already Admin</span>
                                          ) : (
                                            <button
                                              className="btn btn-outline btn-xs"
                                              onClick={() => {
                                                if (confirm(`Are you sure you want to grant Administrator access to ${staff.name}?`)) {
                                                  const staffId = generateStaffId('admin', admins);
                                                  const newAd = {
                                                    staffId,
                                                    name: staff.name,
                                                    username: staff.email.split('@')[0],
                                                    email: staff.email,
                                                    password: staff.password || 'password123'
                                                  };
                                                  setAdmins([...admins, newAd]);
                                                  alert(`Admin access successfully granted to ${staff.name}!`);
                                                }
                                              }}
                                              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                            >
                                              <i className="fa-solid fa-user-shield"></i> Grant Admin Access
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
                        </div>
                      </div>
                    )}

                    {/* Workspace: Pharmacy Orders (Admin View) */}
                    {adminNavView === 'pharmacy_orders' && renderAdminPharmacyOrdersView()}

                    {/* Workspace: Receipts & Payments (Admin View) */}
                    {adminNavView === 'receipts' && renderAdminReceiptsView()}

                    {/* Workspace: Available Stock & Inventory (Admin View) */}
                    {adminNavView === 'drug_stock' && renderStockInventoryView()}

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
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); navigateTo('doctors'); }}>Find Staff & Specialists</a></li>
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
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {adminSelectedApt.patientName}
                    {(adminSelectedApt.isNhis || adminSelectedApt.nhisNumber) && (
                      <span style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        <i className="fa-solid fa-shield-halved"></i> NHIS Enrollee
                      </span>
                    )}
                  </strong>
                  {(adminSelectedApt.isNhis || adminSelectedApt.nhisNumber) && (
                    <div style={{ fontSize: '0.82rem', color: '#0284c7', marginTop: '0.25rem', background: 'rgba(2, 132, 199, 0.05)', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(2, 132, 199, 0.15)' }}>
                      <strong>NHIS ID:</strong> {adminSelectedApt.nhisNumber || 'NHIS-ACTIVE-ENROLLEE'} | <strong>HMO:</strong> {adminSelectedApt.nhisHmo || 'NHIA Primary Scheme'}
                    </div>
                  )}
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Phone: {adminSelectedApt.phone || 'N/A'}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email: {adminSelectedApt.email || 'N/A'}</div>
                  {(adminSelectedApt.homeAddress || adminSelectedApt.consultationMode === 'Home Visit' || adminSelectedApt.symptoms?.includes('Location:')) && (
                    <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.4rem', background: 'rgba(34, 197, 94, 0.08)', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                      <strong><i className="fa-solid fa-house-medical" style={{ marginRight: '4px' }}></i> Home Visit Address:</strong> {adminSelectedApt.homeAddress || (adminSelectedApt.symptoms?.includes('Location: ') ? adminSelectedApt.symptoms.split('Location: ')[1]?.split(']')[0] : 'Residence details recorded')}
                    </div>
                  )}
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

            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-accent" onClick={() => handleViewReceipt(adminSelectedInquiry, 'order')}>
                <i className="fa-solid fa-receipt"></i> Generate Receipt / Invoice
              </button>
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
              <DoctorAvatar image={adminSelectedDoctor.image} name={adminSelectedDoctor.name} size={72} border="3px solid var(--color-accent)" />
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>
                    * Note: Special services fees are negotiable
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Consultation Duration</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', fontWeight: 'bold' }}>{adminSelectedDoctor.consultationDuration || '30 mins'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Monthly Patient Capacity</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.15rem', fontWeight: '600' }}>{adminSelectedDoctor.patientCapacity || 'Standard (30/month)'}</div>
                </div>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Remuneration Terms</strong>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.15rem', color: 'var(--color-text-muted)' }}>{adminSelectedDoctor.remunerationNotes || 'Standard clinical terms'}</div>
                </div>
              </div>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Offered Services / Features</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {adminSelectedDoctor.services && adminSelectedDoctor.services.length > 0 ? (
                    adminSelectedDoctor.services.map(srv => (
                      <span key={srv} style={{ fontSize: '0.85rem', color: 'var(--color-indigo)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="fa-solid fa-check" style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}></i> {srv}
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
                  className="btn btn-outline"
                  onClick={() => {
                    handleViewReceipt(pharmacistSelectedOrder, 'order');
                  }}
                >
                  <i className="fa-solid fa-receipt"></i> Generate Receipt / Invoice
                </button>
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
                  {clinicDrugStock.map(drug => {
                    const isChecked = selectedDrugs.some(d => d.id === drug.id);
                    const isInStock = drug.in_stock !== false;
                    return (
                      <label key={drug.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isInStock ? 'pointer' : 'not-allowed', fontSize: '0.85rem', userSelect: 'none', opacity: isInStock ? 1 : 0.5 }}>
                        <input
                          type="checkbox"
                          disabled={!isInStock}
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
                          style={{ width: 'auto', margin: 0, cursor: isInStock ? 'pointer' : 'not-allowed' }}
                        />
                        <span style={{ color: isChecked ? 'var(--color-accent)' : 'inherit' }}>
                          {drug.name} <strong style={{ color: 'rgba(255,255,255,0.6)' }}>(₦{Number(drug.price).toLocaleString()})</strong>
                          {!isInStock && <span style={{ marginLeft: '6px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>(Out of Stock)</span>}
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
            href="https://wa.me/2349014324442?text=Hello%20simmycare%20I%20will%20like%20to%20book%20for%20consultation.%20"
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
              <DoctorAvatar image={previewBookingDoc.image} name={previewBookingDoc.name} size={64} border="3px solid var(--color-accent)" />
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
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {previewBookingDoc.specialty === 'Laboratory'
                    ? 'Diagnostic Tariff & Duration:'
                    : previewBookingDoc.specialty === 'Pharmacy'
                    ? 'Pharmacy Dispensing Tariff & Duration:'
                    : 'Consultation Rates & Duration:'}
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-indigo)' }}>
                      {previewBookingDoc.specialty === 'Laboratory'
                        ? 'Diagnostic Testing Tariff'
                        : previewBookingDoc.specialty === 'Pharmacy'
                        ? 'Rx Dispensing & Handling Fee'
                        : 'General Consultation Rate'}
                    </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-hover)' }}>{previewBookingDoc.consultationRate || '₦3,000'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-indigo)' }}>Session / Dispatch Duration</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-hover)' }}>{previewBookingDoc.consultationDuration || '30 mins'}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                    * Note: Special procedures and customized requests are negotiable
                  </span>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Offered Clinical Services:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {previewBookingDoc.services && previewBookingDoc.services.length > 0 ? (
                    previewBookingDoc.services.map(srv => (
                      <div key={srv} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-indigo)', fontSize: '0.85rem', fontWeight: '500' }}>
                        <i className="fa-solid fa-check" style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}></i> {srv}
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
                if (previewBookingDoc.specialty === 'Laboratory') {
                  setPreviewBookingDoc(null);
                  navigateTo('service-mobile-lab');
                } else if (previewBookingDoc.specialty === 'Pharmacy') {
                  setPreviewBookingDoc(null);
                  navigateTo('service-pharmacy-delivery');
                } else {
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
                }
              }}>
                {previewBookingDoc.specialty === 'Laboratory'
                  ? 'Proceed to Lab Page'
                  : previewBookingDoc.specialty === 'Pharmacy'
                  ? 'Proceed to Pharmacy Page'
                  : 'Confirm & Proceed to Booking Form'}
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
              <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px double var(--color-border)', paddingBottom: '1rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>SIMMYCARE CLINICAL WORKSPACE & TELEMEDICINE AGREEMENT</strong><br />
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>REGULATORY COMPLIANT DOCUMENT: NHA 2014 & NDPA 2023</strong>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                <em>LAST REVISED: JULY 15, 2026. Please read this Patient User Agreement, Consent to Telehealth Services, and Privacy Policy (collectively, the "Agreement") carefully before accessing or using the SimmyCare health portal. By signing up, scheduling a consultation, or initiating an order, you agree to be bound by these legal terms.</em>
              </p>

              <h4>SECTION 1: CLINICAL SERVICES & TELEHEALTH CONSENT</h4>
              <p>1.1 <strong>Scope of Service:</strong> SimmyCare (the "Portal", "Platform") facilitates remote medical consultations, laboratory diagnostic requests, pharmacy delivery dispatch, and clinical health services through licensed healthcare providers. By executing this Agreement, you grant consent to our clinical specialists to conduct virtual assessments, order laboratory evaluations, and write digital prescriptions.</p>
              <p>1.2 <strong>Clinical Limitations:</strong> Telehealth consultations utilize interactive audio, video, and electronic communications. You acknowledge and accept that a virtual consultation has inherent limitations compared to an in-person clinical examination (such as the inability to perform physical palpation, direct auscultation, or immediate clinical vitals verification). As a result, the accuracy of diagnostic assessments is highly dependent on the information you provide.</p>
              <p>1.3 <strong>Emergency Disclaimer:</strong> SimmyCare IS NOT AN EMERGENCY MEDICAL PORTAL. Our clinicians do not treat acute, life-threatening medical emergencies. If you are experiencing symptoms of a severe nature (such as severe chest pain, shortness of breath, heavy bleeding, or sudden neurological deficits), you must immediately report to the nearest physical emergency facility or call local emergency services.</p>

              <h4>SECTION 2: HEALTH DATA CONFIDENTIALITY & LEGAL STANDARDS</h4>
              <p>2.1 <strong>Statutory Confidentiality:</strong> In accordance with Section 26 and 29 of the National Health Act (NHA), 2014, and the Medical and Dental Practitioners Act, all medical records, diagnostic results, and clinical logs compiled by SimmyCare are treated with the highest degree of confidentiality. No medical records will be disclosed to external parties without your prior written authorization, except where mandated by law or court order.</p>
              <p>2.2 <strong>Server Access Governance (RBAC & RLS):</strong> To protect patient security, we implement strict Role-Based Access Control (RBAC) and database-level Row-Level Security (RLS) on our servers. Access to clinical records is strictly compartmentalized:
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <li><strong>Medical Practitioners:</strong> Can access only their assigned patients' files, clinical logs, and symptom records.</li>
                  <li><strong>Laboratory Scientists:</strong> Can access only lab requests assigned to their station and submit result sheets.</li>
                  <li><strong>Pharmacists:</strong> Can access only authorized prescriptions and medication inventories to dispense orders.</li>
                  <li><strong>Logistics Dispatchers:</strong> Can view only transit delivery addresses, patient contact numbers, and delivery package statuses (clinical histories and diagnoses are hidden).</li>
                </ul>
              </p>

              <h4>SECTION 3: DATA PRIVACY & COMPLIANCE (NDPA 2023 & GDPR)</h4>
              <p>3.1 <strong>Consent to Data Processing:</strong> In compliance with the Nigeria Data Protection Act (NDPA) 2023 and the General Data Protection Regulation (GDPR), you explicitly consent to the collection, storage, processing, and transfer of your personal data, including sensitive health records, contact information, and billing details. We act as the Data Controller, and all processing is carried out strictly to execute your medical care.</p>
              <p>3.2 <strong>Data Subject Rights:</strong> You possess the statutory right to request access to, correction of, and erasure of your personal data stored within our databases. You may withdraw your consent to data processing at any time by contacting our Data Protection Officer at Simmyclinic@gmail.com. Please note that withdrawal of consent may result in the termination of active telemedicine services.</p>

              <h4>SECTION 4: DIGITAL COMMUNICATIONS & SYSTEM TRANSIT</h4>
              <p>4.1 <strong>Notification Protocols:</strong> You consent to receive patient appointment alerts, lab sample collection notifications, dispatch statuses, and clinical follow-up updates via encrypted email and WhatsApp messaging (+234 901 432 4442). You acknowledge that while we deploy end-to-end data encryption protocols, transit over public telecommunication networks carries inherent risks of latency or third-party interference.</p>

              <h4>SECTION 5: PHARMACY DISPENSING & PARTNER LABS</h4>
              <p>5.1 <strong>Medication Dispensing:</strong> All pharmacy orders and prescription fulfillment are handled strictly by partner pharmacy outlets duly registered and licensed by the Pharmacy Council of Nigeria (PCN).</p>
              <p>5.2 <strong>Diagnostics Processing:</strong> All mobile laboratory investigations are processed in collaboration with accredited diagnostic centers registered with the Medical Laboratory Science Council of Nigeria (MLSCN).</p>
              <p>5.3 <strong>Physical Referrals:</strong> For conditions requiring physical evaluation, requests are routed to fully licensed medical centers and doctor offices in Abuja, Kaduna, Kano, Bauchi, Gombe, and other certified locations in Nigeria.</p>

              <h4>SECTION 6: GOVERNING LAW & DISPUTE RESOLUTION</h4>
              <p>6.1 <strong>Jurisdiction:</strong> This Agreement is governed by, and construed in accordance with, the laws of the Federal Republic of Nigeria.</p>
              <p>6.2 <strong>Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to this agreement, including its validity, invalidity, breach, or termination, shall be settled by arbitration in accordance with the Arbitration and Mediation Act of Nigeria.</p>

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

      {/* --- 8. Onboard Rider Modal Form --- */}
      {showRiderOnboardModal && (
        <div className="modal-backdrop">
          <div className="modal-content glassmorphic animate-fade" style={{ maxWidth: '500px', textAlign: 'left', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: 'var(--color-indigo)', fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
                <i className="fa-solid fa-user-plus" style={{ marginRight: '8px', color: 'var(--color-accent)' }}></i>
                Onboard Dispatch Rider
              </h3>
              <button
                type="button"
                onClick={() => setShowRiderOnboardModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!riderForm.name || !riderForm.email || !riderForm.phone) {
                  alert('Please fill out all required fields.');
                  return;
                }
                const newRider = {
                  ...riderForm,
                  status: 'Idle'
                };
                setLogistics([...logistics, newRider]);
                setShowRiderOnboardModal(false);
                alert(`Rider "${riderForm.name}" successfully onboarded into SimmyCare Logistics network!`);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Sani"
                  value={riderForm.name}
                  onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@simmycare.com"
                    value={riderForm.email}
                    onChange={(e) => setRiderForm({ ...riderForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08034567890"
                    value={riderForm.phone}
                    onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>VEHICLE TYPE</label>
                  <select
                    value={riderForm.vehicleType}
                    onChange={(e) => setRiderForm({ ...riderForm, vehicleType: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', height: '38px', outline: 'none' }}
                  >
                    <option value="Motorbike">🏍️ Motorbike</option>
                    <option value="Bicycle">🚲 Bicycle</option>
                    <option value="Delivery Van">🚐 Delivery Van</option>
                    <option value="Electric Scooter">🛴 Electric Scooter</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>COVERAGE REGION</label>
                  <input
                    type="text"
                    placeholder="Abuja Central"
                    value={riderForm.dispatchArea}
                    onChange={(e) => setRiderForm({ ...riderForm, dispatchArea: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-indigo)' }}>CREATE ACCOUNT PASSWORD *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.logistics ? 'text' : 'password'}
                    required
                    placeholder="password123"
                    value={riderForm.password}
                    onChange={(e) => setRiderForm({ ...riderForm, password: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 2.5rem 0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                  />
                  <button type="button" className="pw-toggle-btn" onClick={() => setShowPasswords(p => ({ ...p, logistics: !p.logistics }))} tabIndex={-1} aria-label="Toggle password visibility">
                    <i className={`fa-solid ${showPasswords.logistics ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Onboard Rider Account
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowRiderOnboardModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add New Medication to Stock Modal --- */}
      {showAddDrugModal && (
        <div className="modal-backdrop" onClick={() => setShowAddDrugModal(false)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}><i className="fa-solid fa-pills" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i> Add Medication to Inventory</h3>
              <button className="modal-close" onClick={() => setShowAddDrugModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newDrugForm.name || !newDrugForm.price) return;
              const newItem = {
                id: `dg-${Date.now()}`,
                name: newDrugForm.name,
                price: Number(newDrugForm.price),
                category: newDrugForm.category,
                in_stock: newDrugForm.in_stock
              };
              setClinicDrugStock(prev => [newItem, ...prev]);
              setShowAddDrugModal(false);
              setNewDrugForm({ name: '', price: '', category: 'Analgesics', in_stock: true });
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Drug / Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omeprazole Capsules 20mg"
                  value={newDrugForm.name}
                  onChange={(e) => setNewDrugForm({ ...newDrugForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Category</label>
                  <select
                    value={newDrugForm.category}
                    onChange={(e) => setNewDrugForm({ ...newDrugForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Analgesics">Analgesics</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Antimalarials">Antimalarials</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Antihistamines">Antihistamines</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Diagnostics">Diagnostics</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Unit Price (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2500"
                    value={newDrugForm.price}
                    onChange={(e) => setNewDrugForm({ ...newDrugForm, price: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={newDrugForm.in_stock}
                    onChange={(e) => setNewDrugForm({ ...newDrugForm, in_stock: e.target.checked })}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  Mark as Available in Stock
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddDrugModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent">Add to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add New Lab Diagnostic Kit/Test Modal --- */}
      {showAddLabKitModal && (
        <div className="modal-backdrop" onClick={() => setShowAddLabKitModal(false)}>
          <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0 }}><i className="fa-solid fa-vials" style={{ color: 'var(--color-accent)', marginRight: '8px' }}></i> Add Diagnostic Kit to Inventory</h3>
              <button className="modal-close" onClick={() => setShowAddLabKitModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newLabKitForm.name || !newLabKitForm.price) return;
              const newItem = {
                id: `lab-${Date.now()}`,
                name: newLabKitForm.name,
                price: Number(newLabKitForm.price),
                category: newLabKitForm.category,
                desc: newLabKitForm.desc,
                in_stock: newLabKitForm.in_stock
              };
              setClinicLabStock(prev => [newItem, ...prev]);
              setShowAddLabKitModal(false);
              setNewLabKitForm({ name: '', price: '', category: 'Hematology', desc: '', in_stock: true });
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Diagnostic Test / Kit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thyroid Panel (TSH/T3/T4) Diagnostic Kit"
                  value={newLabKitForm.name}
                  onChange={(e) => setNewLabKitForm({ ...newLabKitForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Test Description / Clinical Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Evaluates thyroid hormones and metabolic activity"
                  value={newLabKitForm.desc}
                  onChange={(e) => setNewLabKitForm({ ...newLabKitForm, desc: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Category</label>
                  <select
                    value={newLabKitForm.category}
                    onChange={(e) => setNewLabKitForm({ ...newLabKitForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Parasitology">Parasitology</option>
                    <option value="Serology">Serology</option>
                    <option value="Virology">Virology</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Urinalysis">Urinalysis</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Tariff Price (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10000"
                    value={newLabKitForm.price}
                    onChange={(e) => setNewLabKitForm({ ...newLabKitForm, price: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={newLabKitForm.in_stock}
                    onChange={(e) => setNewLabKitForm({ ...newLabKitForm, in_stock: e.target.checked })}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span>Mark as Available in Stock</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddLabKitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Save Diagnostic Kit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {renderPaymentModal()}
      {renderReceiptModal()}
      {renderEditPriceModal()}
    </div>
  );
}
