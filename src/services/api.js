import { supabase, isSupabaseConfigured } from '../supabaseClient';

// Helper to normalize Supabase appointment record to React app format
const formatAppointment = (row) => ({
  id: row.id,
  patientName: row.patient_name || row.patientName,
  phone: row.phone,
  email: row.email,
  doctor: row.doctor_name || row.doctor || 'General Practitioner',
  doctorId: row.doctor_id || row.doctorId,
  date: row.date,
  time: row.time || '10:00 AM',
  symptoms: row.symptoms,
  status: row.status,
  prescription: row.prescription,
  prescriptionNotes: row.prescription_notes || row.prescriptionNotes,
  createdAt: row.created_at || row.createdAt
});

// Helper to normalize Pharmacy Order record
const formatPharmacyOrder = (row) => ({
  id: row.id,
  patientName: row.patient_name || row.patientName,
  email: row.email,
  phone: row.phone,
  address: row.shipping_address || row.address,
  rxNotes: row.rx_notes || row.rxNotes,
  totalCost: Number(row.total_cost || row.totalCost || 0),
  status: row.status,
  assignedRiderId: row.assigned_rider_id || row.assignedRiderId,
  items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
  date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : (row.date || new Date().toISOString().split('T')[0])
});

// Helper to normalize Lab Request record
const formatLabRequest = (row) => ({
  id: row.id,
  patientName: row.patient_name || row.patientName,
  email: row.email,
  phone: row.phone,
  testDetails: row.test_details || row.testDetails,
  address: row.address,
  specialInstructions: row.special_instructions || row.specialInstructions,
  status: row.status,
  assignedRiderId: row.assigned_rider_id || row.assignedRiderId,
  labTechnicianId: row.lab_technician_id || row.labTechnicianId,
  resultText: row.result_text || row.resultText,
  resultFileUrl: row.result_file_url || row.resultFileUrl,
  date: row.date || (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
  time: row.time || '11:00 AM'
});

// ----------------------------------------------------
// 1. APPOINTMENTS SERVICE
// ----------------------------------------------------
export const appointmentsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase fetch appointments error:', error.message);
        return null;
      }
      return data ? data.map(formatAppointment) : [];
    } catch (err) {
      console.warn('Appointments API exception:', err);
      return null;
    }
  },

  async create(appointment) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbRow = {
        patient_name: appointment.patientName,
        phone: appointment.phone,
        email: appointment.email,
        doctor_name: appointment.doctor || 'General Medicine Specialist',
        doctor_id: appointment.doctorId || null,
        date: appointment.date,
        time: appointment.time || '10:00 AM',
        symptoms: appointment.symptoms || '',
        status: appointment.status || 'Pending'
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([dbRow])
        .select();

      if (error) {
        console.warn('Supabase insert appointment error:', error.message);
        return null;
      }
      return data && data[0] ? formatAppointment(data[0]) : null;
    } catch (err) {
      console.warn('Appointments API create exception:', err);
      return null;
    }
  },

  async update(id, updates) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbUpdates = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.prescription) dbUpdates.prescription = updates.prescription;
      if (updates.prescriptionNotes) dbUpdates.prescription_notes = updates.prescriptionNotes;

      const { data, error } = await supabase
        .from('appointments')
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) {
        console.warn('Supabase update appointment error:', error.message);
        return null;
      }
      return data && data[0] ? formatAppointment(data[0]) : null;
    } catch (err) {
      console.warn('Appointments API update exception:', err);
      return null;
    }
  }
};

// ----------------------------------------------------
// 2. PHARMACY ORDERS SERVICE
// ----------------------------------------------------
export const pharmacyOrdersApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('pharmacy_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch pharmacy_orders error:', error.message);
        return null;
      }
      return data ? data.map(formatPharmacyOrder) : [];
    } catch (err) {
      console.warn('Pharmacy orders API exception:', err);
      return null;
    }
  },

  async create(order) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbRow = {
        patient_name: order.patientName,
        email: order.email,
        phone: order.phone,
        shipping_address: order.address || order.shipping_address,
        rx_notes: order.rxNotes || '',
        total_cost: order.totalCost || 0,
        status: order.status || 'Awaiting Dispatch',
        items: order.items || []
      };

      const { data, error } = await supabase
        .from('pharmacy_orders')
        .insert([dbRow])
        .select();

      if (error) {
        console.warn('Supabase insert pharmacy_order error:', error.message);
        return null;
      }
      return data && data[0] ? formatPharmacyOrder(data[0]) : null;
    } catch (err) {
      console.warn('Pharmacy orders API create exception:', err);
      return null;
    }
  },

  async updateStatus(id, status, assignedRiderId = null) {
    if (!isSupabaseConfigured()) return null;
    try {
      const updates = { status };
      if (assignedRiderId) updates.assigned_rider_id = assignedRiderId;

      const { data, error } = await supabase
        .from('pharmacy_orders')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.warn('Supabase update pharmacy_order error:', error.message);
        return null;
      }
      return data && data[0] ? formatPharmacyOrder(data[0]) : null;
    } catch (err) {
      console.warn('Pharmacy orders API update exception:', err);
      return null;
    }
  }
};

// ----------------------------------------------------
// 3. LAB REQUESTS SERVICE
// ----------------------------------------------------
export const labRequestsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('lab_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch lab_requests error:', error.message);
        return null;
      }
      return data ? data.map(formatLabRequest) : [];
    } catch (err) {
      console.warn('Lab requests API exception:', err);
      return null;
    }
  },

  async create(request) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbRow = {
        patient_name: request.patientName,
        email: request.email,
        phone: request.phone,
        test_details: request.testDetails,
        address: request.address,
        special_instructions: request.specialInstructions || '',
        status: request.status || 'Pending',
        date: request.date || new Date().toISOString().split('T')[0],
        time: request.time || '11:00 AM'
      };

      const { data, error } = await supabase
        .from('lab_requests')
        .insert([dbRow])
        .select();

      if (error) {
        console.warn('Supabase insert lab_request error:', error.message);
        return null;
      }
      return data && data[0] ? formatLabRequest(data[0]) : null;
    } catch (err) {
      console.warn('Lab requests API create exception:', err);
      return null;
    }
  },

  async updateResult(id, updates) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbUpdates = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.resultText) dbUpdates.result_text = updates.resultText;
      if (updates.resultFileUrl) dbUpdates.result_file_url = updates.resultFileUrl;
      if (updates.assignedRiderId) dbUpdates.assigned_rider_id = updates.assignedRiderId;

      const { data, error } = await supabase
        .from('lab_requests')
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) {
        console.warn('Supabase update lab_request error:', error.message);
        return null;
      }
      return data && data[0] ? formatLabRequest(data[0]) : null;
    } catch (err) {
      console.warn('Lab requests API update exception:', err);
      return null;
    }
  }
};

// ----------------------------------------------------
// 4. CLINIC DRUGS / INVENTORY SERVICE
// ----------------------------------------------------
export const clinicDrugsApi = {
  async getAll() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('clinic_drugs')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Supabase fetch clinic_drugs error:', error.message);
        return null;
      }
      return data ? data.map(d => ({
        id: d.id,
        name: d.name,
        price: Number(d.price),
        category: d.category,
        inStock: d.in_stock
      })) : [];
    } catch (err) {
      console.warn('Clinic drugs API exception:', err);
      return null;
    }
  },

  async updateStock(name, inStock) {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('clinic_drugs')
        .update({ in_stock: inStock })
        .eq('name', name)
        .select();

      if (error) {
        console.warn('Supabase update drug stock error:', error.message);
        return null;
      }
      return data ? data[0] : null;
    } catch (err) {
      console.warn('Clinic drugs update exception:', err);
      return null;
    }
  }
};

// ----------------------------------------------------
// 5. PROFILES / USERS SERVICE
// ----------------------------------------------------
const formatProfile = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  phone: row.phone || '',
  role: row.role || 'patient',
  specialty: row.specialty || '',
  schedule: row.schedule || '',
  experience: row.experience || '',
  regNo: row.reg_no || '',
  clinicRoom: row.clinic_room || '',
  consultationRate: row.consultation_rate || '',
  consultationDuration: row.consultation_duration || '30 mins',
  services: Array.isArray(row.services) ? row.services : [],
  level: row.level || '',
  image: row.image || '',
  bio: row.bio || '',
  pharmacyName: row.facility_name || '',
  pharmacyLicense: row.license_no || '',
  facilityName: row.facility_name || '',
  labLicense: row.license_no || '',
  vehicleType: row.vehicle_type || 'Motorbike',
  dispatchArea: row.dispatch_area || '',
  verified: row.verified !== undefined ? row.verified : true,
  active: row.active !== undefined ? row.active : true,
  createdAt: row.created_at
});

export const profilesApi = {
  async getAllProfiles() {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.warn('Supabase fetch profiles error:', error.message);
        return null;
      }
      return data ? data.map(formatProfile) : [];
    } catch (err) {
      console.warn('Profiles API exception:', err);
      return null;
    }
  },

  async upsertProfile(profile) {
    if (!isSupabaseConfigured()) return null;
    try {
      const dbRow = {
        email: profile.email,
        name: profile.name,
        phone: profile.phone || null,
        role: profile.role || 'patient',
        specialty: profile.specialty || null,
        schedule: profile.schedule || null,
        experience: profile.experience || null,
        reg_no: profile.regNo || profile.reg_no || null,
        clinic_room: profile.clinicRoom || profile.clinic_room || null,
        consultation_rate: profile.consultationRate || profile.consultation_rate || null,
        consultation_duration: profile.consultationDuration || profile.consultation_duration || '30 mins',
        services: profile.services || [],
        level: profile.level || null,
        image: profile.image || profile.image_url || null,
        bio: profile.bio || null,
        facility_name: profile.facilityName || profile.pharmacyName || profile.facility_name || null,
        license_no: profile.license || profile.pharmacyLicense || profile.labLicense || profile.license_no || null,
        vehicle_type: profile.vehicleType || profile.vehicle_type || null,
        dispatch_area: profile.dispatchArea || profile.dispatch_area || null,
        verified: profile.verified !== undefined ? profile.verified : true,
        active: profile.active !== undefined ? profile.active : true,
        terms_accepted: true
      };

      // Only attach id if it's explicitly marked as a verified auth user ID
      if (profile.supabaseUserId) {
        dbRow.id = profile.supabaseUserId;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert([dbRow], { onConflict: 'email' })
        .select();

      if (error) {
        console.warn('Supabase upsert profile error:', error.message);
        return null;
      }
      return data && data[0] ? formatProfile(data[0]) : null;
    } catch (err) {
      console.warn('Profiles API upsert exception:', err);
      return null;
    }
  },

  async deleteProfile(email) {
    if (!isSupabaseConfigured()) return null;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);

      if (error) {
        console.warn('Supabase delete profile error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Profiles API delete exception:', err);
      return false;
    }
  },

  async syncAllLocalUsers(doctors, patients, pharmacists, labs, logistics, admins) {
    if (!isSupabaseConfigured()) return;
    try {
      const existingProfiles = await this.getAllProfiles();
      const existingEmails = new Set(existingProfiles ? existingProfiles.map(p => p.email.toLowerCase()) : []);

      const userQueue = [
        ...doctors.map(d => ({ ...d, role: 'doctor' })),
        ...patients.map(p => ({ ...p, role: 'patient' })),
        ...pharmacists.map(p => ({ ...p, role: 'pharmacist' })),
        ...labs.map(l => ({ ...l, role: 'lab' })),
        ...logistics.map(l => ({ ...l, role: 'logistics' })),
        ...admins.map(a => ({ ...a, role: 'admin' }))
      ];

      for (const u of userQueue) {
        if (u.email && !existingEmails.has(u.email.toLowerCase())) {
          await this.upsertProfile(u);
        }
      }
    } catch (err) {
      console.warn('Sync local users exception:', err);
    }
  }
};

