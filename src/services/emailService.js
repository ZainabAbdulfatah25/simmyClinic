// ============================================================
// SIMMYCLINIC - EMAIL NOTIFICATION & HOSPITAL SERVICES DISPATCHER
// ============================================================

export const HOSPITAL_SERVICES_CATALOG = [
  {
    category: "Specialist & Telehealth Consultations",
    icon: "fa-user-doctor",
    items: [
      { name: "General Medicine Online Consultation", fee: "₦3,000", desc: "Virtual assessment, diagnosis, electronic prescription issuance, and clinical follow-up." },
      { name: "Obstetrics & Gynaecology (Women's Health)", fee: "₦5,000", desc: "Antenatal guidance, reproductive health, fertility counseling, and postpartum checkups." },
      { name: "Pediatric Care & Child Health", fee: "₦4,000", desc: "Neonatal screenings, childhood illness treatment, immunization guidance, and nutrition." },
      { name: "Home Visit Doctor Consultation", fee: "₦15,000", desc: "A licensed physician visits your residence with bedside diagnostic tools for thorough evaluation." }
    ]
  },
  {
    category: "Mobile Laboratory Diagnostics & Home Testing",
    icon: "fa-flask-vial",
    items: [
      { name: "Full Blood Count (FBC) Diagnostic Panel", fee: "₦8,000", desc: "Complete blood screening for anemia, systemic infections, and immune health." },
      { name: "Fasting Blood Sugar (FBS) & HbA1c", fee: "₦2,500", desc: "Comprehensive diabetes monitoring and glycemic control evaluation." },
      { name: "Malaria Smear & Widal Typhoid Panel", fee: "₦5,000", desc: "Rapid diagnostic verification and pathogen profiling for endemic fevers." },
      { name: "Kidney Function & Electrolytes (KFT / E/U/Cr)", fee: "₦15,000", desc: "Detailed analysis of serum urea, creatinine, sodium, potassium, and chloride." },
      { name: "Liver Function Test (LFT) Comprehensive", fee: "₦15,000", desc: "Hepatic enzyme profile, bilirubin, total proteins, and liver tissue integrity." },
      { name: "Urine Analysis Multistix 10-Parameter", fee: "₦3,000", desc: "Instant urinalysis for urinary tract infections, proteinuria, and kidney markers." }
    ]
  },
  {
    category: "Doorstep Pharmacy & Medication Delivery",
    icon: "fa-pills",
    items: [
      { name: "Certified Prescription Fulfillment", fee: "Retail Pricing", desc: "100% genuine PCN-certified medications dispensed directly from hospital inventory." },
      { name: "Express Cold-Chain & Courier Delivery", fee: "₦1,500 - ₦2,500", desc: "Temperature-controlled dispatch straight to your home or office within hours." },
      { name: "Medication Therapy Review", fee: "Free with Order", desc: "Pharmacist counseling on dosage schedules, drug interactions, and dietary guidelines." }
    ]
  },
  {
    category: "Antenatal & Specialized Home Healthcare",
    icon: "fa-baby-carriage",
    items: [
      { name: "Post-natal Care (Mother & Baby Care)", fee: "₦30,000", desc: "Postpartum nursing care, umbilical hygiene, wound monitoring, and infant vital screening." },
      { name: "Elderly & Chronic Disease Home Monitoring", fee: "₦25,000", desc: "Dedicated nurse visits for hypertension, stroke rehabilitation, and blood sugar control." },
      { name: "NHIS / HMO Co-Pay Coverage", fee: "Up to 90% Subsidized", desc: "Registered enrollees receive up to 90% tariff deduction on consultations and medications." }
    ]
  }
];

export function generateHospitalServicesEmailHtml(recipientName = "Valued Patient") {
  const categoriesHtml = HOSPITAL_SERVICES_CATALOG.map(cat => `
    <div style="margin-bottom: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
      <h3 style="margin-top: 0; color: #1e3a8a; font-size: 16px; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px;">
        ${cat.category}
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        ${cat.items.map(item => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 6px; font-weight: 600; color: #0f172a; width: 45%;">
              ${item.name}
              <div style="font-weight: 400; color: #64748b; font-size: 11px; margin-top: 2px;">${item.desc}</div>
            </td>
            <td style="padding: 10px 6px; text-align: right; font-weight: 700; color: #0284c7; width: 25%;">
              ${item.fee}
            </td>
            <td style="padding: 10px 6px; text-align: right; width: 30%;">
              <a href="https://simmyclinic.com/#booking" style="background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 600;">Book Service</a>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>SimmyClinic - Complete Hospital Services Guide</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
    <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">SimmyClinic Healthcare</h1>
        <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Official Hospital Services, Specialist Consultations & Diagnostics Guide</p>
      </div>

      <!-- Welcome Note -->
      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${recipientName}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">
          Thank you for trusting SimmyClinic. Here is our official clinical services portfolio, including telehealth consultation rates, home visit doctor services, mobile laboratory diagnostic profiles, and prescription delivery logistics.
        </p>

        <!-- Services Catalog Cards -->
        ${categoriesHtml}

        <!-- 24/7 Support Banner -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 20px; text-align: center;">
          <h4 style="margin: 0 0 6px; color: #1e40af;">24/7 Clinical Triage & Emergency Support</h4>
          <p style="margin: 0; font-size: 13px; color: #1e3a8a;">
            Direct Medical Desk: <strong>+234 901 432 4442</strong> | WhatsApp Support Available
          </p>
          <div style="margin-top: 12px;">
            <a href="https://simmyclinic.com/#booking" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px;">
              Access Patient Portal & Book
            </a>
          </div>
        </div>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 28px; line-height: 1.5;">
          SimmyClinic Healthcare Operations | Federal Ministry of Health & CAC Certified<br>
          Website: <a href="https://simmyclinic.com" style="color: #0284c7;">https://simmyclinic.com</a> | Email: <a href="mailto:support@simmyclinic.com" style="color: #0284c7;">support@simmyclinic.com</a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Dispatches an email notification.
 * Priority: Resend API → mailto fallback (opens user's mail client)
 */
export async function sendEmailNotification({
  toEmail,
  patientName = "Patient",
  subject,
  htmlContent,
  type = "services"
}) {
  if (!toEmail || !toEmail.includes('@')) {
    throw new Error("A valid email address is required to dispatch the notification.");
  }

  // 1. Try Resend API if key is present
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "SimmyClinic <notifications@simmyclinic.com>",
          to: [toEmail],
          subject: subject,
          html: htmlContent
        })
      });
      if (response.ok) {
        return { success: true, provider: "resend", email: toEmail };
      }
      const errData = await response.json().catch(() => ({}));
      console.warn("Resend API error:", errData);
    } catch (err) {
      console.warn("Resend email dispatch error:", err);
    }
  }

  // 2. mailto: fallback — opens the user's mail client pre-filled
  const plainTextBody = buildPlainTextCatalog(patientName);
  const mailtoUrl =
    `mailto:${encodeURIComponent(toEmail)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(plainTextBody)}`;

  window.open(mailtoUrl, '_blank');

  return {
    success: true,
    provider: "mailto",
    email: toEmail,
    timestamp: new Date().toISOString()
  };
}

/**
 * Builds a plain-text version of the catalog for the mailto body.
 */
function buildPlainTextCatalog(recipientName = "Valued Patient") {
  let body = `Dear ${recipientName},\n\nThank you for trusting SimmyClinic. Below is our official clinical services portfolio:\n\n`;
  body += `${'='.repeat(60)}\nSimmyClinic — Official Hospital Services & Clinical Fee Guide\n${'='.repeat(60)}\n\n`;

  HOSPITAL_SERVICES_CATALOG.forEach(cat => {
    body += `\n▶ ${cat.category.toUpperCase()}\n${'-'.repeat(50)}\n`;
    cat.items.forEach(item => {
      body += `  • ${item.name}  —  ${item.fee}\n    ${item.desc}\n`;
    });
  });

  body += `\n${'='.repeat(60)}\n`;
  body += `24/7 Clinical Triage & Emergency Support\n`;
  body += `Direct Medical Desk: +234 901 432 4442\n`;
  body += `Website: https://simmyclinic.com\n`;
  body += `Book online: https://simmyclinic.com/#booking\n`;
  body += `${'='.repeat(60)}\n`;
  body += `SimmyClinic Healthcare Operations | Federal Ministry of Health & CAC Certified\n`;

  return body;
}

