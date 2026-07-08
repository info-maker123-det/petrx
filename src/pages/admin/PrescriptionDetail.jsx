import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, PawPrint, Pill, Stethoscope, FileText, Paperclip, User } from "lucide-react";
import { effectiveRxStatus, getRxStatusConfig, formatDateTime } from "@/lib/adminUtils";
import PrescriptionWorkflow from "@/components/admin/PrescriptionWorkflow";
import PrescriptionTimeline from "@/components/admin/PrescriptionTimeline";
import PrivateFileLink from "@/components/admin/PrivateFileLink";

function InfoSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="mb-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value || "—"}</p>
    </div>
  );
}

export default function PrescriptionDetail() {
  const { id } = useParams();
  const [rx, setRx] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    base44.entities.Prescription
      .get(id)
      .then(setRx)
      .catch(() => setRx(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!rx) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl text-slate-900 mb-2">Prescription not found</p>
        <Link to="/admin/prescriptions" className="text-sm text-slate-500 hover:text-slate-700">Back to queue</Link>
      </div>
    );
  }

  const cfg = getRxStatusConfig(effectiveRxStatus(rx));

  return (
    <div>
      <Link to="/admin/prescriptions" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">{rx.medication_name}</h1>
          <p className="text-sm text-slate-500">For {rx.pet_name} ({rx.pet_species}) · {rx.vet_clinic_name}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-4 order-2 lg:order-1">
          <InfoSection icon={PawPrint} title="Pet Information">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pet Name" value={rx.pet_name} />
              <Field label="Species" value={rx.pet_species} />
              <Field label="Breed" value={rx.pet_breed} />
              <Field label="Sex" value={rx.pet_sex ? (rx.pet_spayed_neutered ? `${rx.pet_sex} (spayed/neutered)` : rx.pet_sex) : null} />
              <Field label="Weight" value={rx.pet_weight ? `${rx.pet_weight} ${rx.pet_weight_unit || "lbs"}` : null} />
              <Field label="Date of Birth" value={rx.pet_dob} />
            </div>
          </InfoSection>

          <InfoSection icon={User} title="Pet Owner">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={rx.owner_name} />
              <Field label="Phone" value={rx.owner_phone} />
              <Field label="Email" value={rx.owner_email} />
              <Field label="Address" value={[rx.owner_address, rx.owner_city, rx.owner_state, rx.owner_zip].filter(Boolean).join(", ") || null} />
            </div>
          </InfoSection>

          <InfoSection icon={Pill} title="Medication Requested">
            <Field label="Medication" value={rx.medication_name} />
            <Field label="Approval Method" value={rx.approval_method?.replace(/_/g, " ")} />
          </InfoSection>

          <InfoSection icon={Stethoscope} title="Prescribing Veterinarian">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Clinic" value={rx.vet_clinic_name} />
              <Field label="Veterinarian" value={rx.vet_name} />
              <Field label="Phone" value={rx.vet_phone} />
              <Field label="Fax" value={rx.vet_fax} />
              <Field label="Email" value={rx.vet_email} />
              <Field label="Address" value={rx.vet_address} />
            </div>
          </InfoSection>

          {rx.prescription_file_url && (
            <InfoSection icon={Paperclip} title="Uploaded Prescription">
              <PrivateFileLink fileUri={rx.prescription_file_url} label="View uploaded file" />
            </InfoSection>
          )}

          {rx.notes && (
            <InfoSection title="Customer Notes">
              <p className="text-sm text-slate-600">{rx.notes}</p>
            </InfoSection>
          )}

          {rx.tracking_number && (
            <InfoSection title="Tracking Number">
              <p className="text-sm font-mono text-slate-800">{rx.tracking_number}</p>
            </InfoSection>
          )}
        </div>

        <div className="space-y-4 order-1 lg:order-2 lg:sticky lg:top-8">
          <PrescriptionWorkflow rx={rx} onUpdate={load} />
          <PrescriptionTimeline rx={rx} />
        </div>
      </div>
    </div>
  );
}