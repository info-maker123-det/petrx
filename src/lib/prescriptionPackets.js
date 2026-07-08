import { formatDateTime } from "@/lib/adminUtils";

function val(v) {
  return v || "—";
}

function petInfoBlock(rx) {
  return `
    <div class="section">
      <h2>Pet Information</h2>
      <div class="field"><span class="label">Pet Name</span><br/><span class="value">${val(rx.pet_name)}</span></div>
      <div class="field"><span class="label">Species</span><br/><span class="value">${val(rx.pet_species)}</span></div>
      <div class="field"><span class="label">Breed</span><br/><span class="value">${val(rx.pet_breed)}</span></div>
      <div class="field"><span class="label">Sex</span><br/><span class="value">${val(rx.pet_sex ? (rx.pet_spayed_neutered ? rx.pet_sex + " (spayed/neutered)" : rx.pet_sex) : null)}</span></div>
      <div class="field"><span class="label">Weight</span><br/><span class="value">${rx.pet_weight ? rx.pet_weight + " " + val(rx.pet_weight_unit) : "—"}</span></div>
      <div class="field"><span class="label">Date of Birth</span><br/><span class="value">${val(rx.pet_dob)}</span></div>
    </div>`;
}

function ownerInfoBlock(rx) {
  const fullAddress = [rx.owner_address, rx.owner_city, rx.owner_state, rx.owner_zip].filter(Boolean).join(", ");
  return `
    <div class="section">
      <h2>Pet Owner Information</h2>
      <div class="field"><span class="label">Name</span><br/><span class="value">${val(rx.owner_name)}</span></div>
      <div class="field"><span class="label">Phone</span><br/><span class="value">${val(rx.owner_phone)}</span></div>
      <div class="field"><span class="label">Email</span><br/><span class="value">${val(rx.owner_email)}</span></div>
      <div class="field"><span class="label">Address</span><br/><span class="value">${val(fullAddress)}</span></div>
    </div>`;
}

export function generateVetVerificationPacket(rx) {
  const ref = rx.id ? rx.id.slice(-8).toUpperCase() : "N/A";
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return `
    <div class="letterhead">
      <div class="brand">PetRx <span class="brand-accent">Pharmacy</span></div>
      <div class="meta">${date}<br/>Ref: ${ref}</div>
    </div>
    <h1>Prescription Verification Request</h1>

    ${petInfoBlock(rx)}

    <div class="section">
      <h2>Medication Requested</h2>
      <div class="field"><span class="value" style="font-size:18px;">${val(rx.medication_name)}</span></div>
    </div>

    ${ownerInfoBlock(rx)}

    <div class="section">
      <h2>Prescribing Veterinarian</h2>
      <div class="field"><span class="label">Clinic</span><br/><span class="value">${val(rx.vet_clinic_name)}</span></div>
      <div class="field"><span class="label">Veterinarian</span><br/><span class="value">${val(rx.vet_name)}</span></div>
      <div class="field"><span class="label">Phone</span><br/><span class="value">${val(rx.vet_phone)}</span></div>
      <div class="field"><span class="label">Fax</span><br/><span class="value">${val(rx.vet_fax)}</span></div>
      <div class="field"><span class="label">Email</span><br/><span class="value">${val(rx.vet_email)}</span></div>
      <div class="field"><span class="label">Address</span><br/><span class="value">${val(rx.vet_address)}</span></div>
    </div>

    <div class="box">
      <h2>Verification Request</h2>
      <p style="font-size:14px; margin-bottom:16px;">
        We are requesting verification of the above prescription for <strong>${val(rx.medication_name)}</strong>
        prescribed for <strong>${val(rx.pet_name)}</strong>. Please confirm or deny by responding via phone, fax, or email.
      </p>
      <div class="checkbox-row">
        <div class="checkbox-item">&#9744; Approved</div>
        <div class="checkbox-item">&#9744; Denied</div>
        <div class="checkbox-item">&#9744; Need More Information</div>
      </div>
      <div style="margin-top:24px;">
        <div class="label">Veterinarian Signature</div>
        <div class="sig-line"></div>
      </div>
      <div style="margin-top:16px;">
        <div class="label">Date</div>
        <div class="sig-line" style="width:200px;"></div>
      </div>
    </div>

    ${rx.notes ? `<div class="section"><h2>Additional Notes</h2><p style="font-size:14px;">${rx.notes}</p></div>` : ""}
  `;
}

export function generateVetVerificationText(rx, vet) {
  const ref = rx.id ? rx.id.slice(-8).toUpperCase() : "N/A";
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const val = (v) => v || "—";
  const clinic = vet ? vet.clinic_name : rx.vet_clinic_name;
  const ownerAddress = [rx.owner_address, rx.owner_city, rx.owner_state, rx.owner_zip].filter(Boolean).join(", ");

  return `PETRX PHARMACY — PRESCRIPTION VERIFICATION REQUEST
${date}
Reference: ${ref}

TO: ${clinic || "—"}
${vet && vet.vet_name ? `ATTN: Dr. ${vet.vet_name}\n` : ""}${vet && vet.email ? `Email: ${vet.email}\n` : ""}${vet && vet.fax ? `Fax: ${vet.fax}\n` : ""}${vet && vet.phone ? `Phone: ${vet.phone}\n` : ""}
PET INFORMATION
Pet Name: ${val(rx.pet_name)}
Species: ${val(rx.pet_species)}
Breed: ${val(rx.pet_breed)}
Sex: ${val(rx.pet_sex)}${rx.pet_spayed_neutered ? " (spayed/neutered)" : ""}
Weight: ${rx.pet_weight ? rx.pet_weight + " " + val(rx.pet_weight_unit) : "—"}
Date of Birth: ${val(rx.pet_dob)}

PET OWNER
Name: ${val(rx.owner_name)}
Phone: ${val(rx.owner_phone)}
Email: ${val(rx.owner_email)}
Address: ${val(ownerAddress)}

MEDICATION REQUESTED
${val(rx.medication_name)}
Approval Method: ${val(rx.approval_method ? rx.approval_method.replace(/_/g, " ") : null)}

PRESCRIBING VETERINARIAN (ON FILE)
Clinic: ${val(rx.vet_clinic_name)}
Veterinarian: ${val(rx.vet_name)}
Phone: ${val(rx.vet_phone)}
Fax: ${val(rx.vet_fax)}
Email: ${val(rx.vet_email)}
Address: ${val(rx.vet_address)}

VERIFICATION REQUEST
We are requesting verification of the above prescription for ${val(rx.medication_name)} prescribed for ${val(rx.pet_name)}. Please confirm or deny by responding via phone, fax, or email.

[ ] Approved
[ ] Denied
[ ] Need More Information

${rx.notes ? `ADDITIONAL NOTES\n${rx.notes}\n\n` : ""}—
PetRx Pharmacy
pharmacy@petrx.com`;
}

export function generateSisterPharmacyPacket(rx) {
  const ref = rx.id ? rx.id.slice(-8).toUpperCase() : "N/A";
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const verifiedDate = rx.vet_response_date ? formatDateTime(rx.vet_response_date) : "—";
  const shipAddress = [rx.owner_address, rx.owner_city, rx.owner_state, rx.owner_zip].filter(Boolean).join(", ");

  return `
    <div class="letterhead">
      <div class="brand">PetRx <span class="brand-accent">Pharmacy</span></div>
      <div class="meta">${date}<br/>Ref: ${ref}</div>
    </div>
    <h1>Dispensing &amp; Shipping Request</h1>
    <div class="badge">Prescription Verified</div>

    ${petInfoBlock(rx)}

    <div class="section">
      <h2>Medication to Dispense</h2>
      <div class="field"><span class="value" style="font-size:18px;">${val(rx.medication_name)}</span></div>
    </div>

    <div class="section">
      <h2>Ship To (Customer)</h2>
      <div class="field"><span class="label">Name</span><br/><span class="value">${val(rx.owner_name)}</span></div>
      <div class="field"><span class="label">Phone</span><br/><span class="value">${val(rx.owner_phone)}</span></div>
      <div class="field"><span class="label">Address</span><br/><span class="value">${val(shipAddress)}</span></div>
    </div>

    <div class="section">
      <h2>Verification Details</h2>
      <div class="field"><span class="label">Status</span><br/><span class="value">Verified &mdash; ${val(rx.vet_response)}</span></div>
      <div class="field"><span class="label">Verified On</span><br/><span class="value">${verifiedDate}</span></div>
      <div class="field"><span class="label">Verifying Veterinarian</span><br/><span class="value">${val(rx.vet_name)} &mdash; ${val(rx.vet_clinic_name)}</span></div>
      ${rx.vet_response_notes ? `<div class="field"><span class="label">Verification Notes</span><br/><span class="value">${rx.vet_response_notes}</span></div>` : ""}
    </div>

    <div class="section">
      <h2>Special Instructions</h2>
      <p style="font-size:14px;">${val(rx.notes)}</p>
    </div>

    <div class="box">
      <h2>Dispensing Confirmation</h2>
      <p style="font-size:14px; margin-bottom:16px;">
        Please dispense the above medication and ship to the customer. Provide tracking number upon shipment.
      </p>
      <div class="field"><span class="label">Tracking Number</span><br/><div class="sig-line" style="width:300px;"></div></div>
      <div style="margin-top:32px;">
        <div class="label">Dispensed By</div>
        <div class="sig-line"></div>
      </div>
    </div>
  `;
}