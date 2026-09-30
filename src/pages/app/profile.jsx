import React, { useState } from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { User, Shield, HeartPulse, Phone, AlertTriangle, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const { userProfile, setUserProfile } = useDisaster();

  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [bloodType, setBloodType] = useState(userProfile.bloodType);
  const [medicalConditions, setMedicalConditions] = useState(userProfile.medicalConditions);
  const [allergies, setAllergies] = useState(userProfile.allergies);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      phone,
      bloodType,
      medicalConditions,
      allergies,
    }));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          <span>User Safety & Medical Profile</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          This vital medical information is automatically attached to your SOS broadcasts for first responders.
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Safety medical profile updated successfully.
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Blood Group</label>
              <select
                value={bloodType}
                onChange={e => setBloodType(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="O Positive">O Positive (O+)</option>
                <option value="O Negative">O Negative (O-)</option>
                <option value="A Positive">A Positive (A+)</option>
                <option value="A Negative">A Negative (A-)</option>
                <option value="B Positive">B Positive (B+)</option>
                <option value="AB Positive">AB Positive (AB+)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Current Safety Status</label>
              <select
                value={userProfile.status}
                onChange={e => setUserProfile(prev => ({ ...prev, status: e.target.value }))}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="SAFE">🟢 SAFE (Normal Status)</option>
                <option value="NEED_ASSISTANCE">🟡 NEED ASSISTANCE (Non-Critical)</option>
                <option value="IN_DANGER">🔴 IN DANGER (Active Emergency)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Pre-existing Medical Conditions</label>
            <Input value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} placeholder="e.g. Asthma, Diabetes..." />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Known Allergies / Medication Sensitivities</label>
            <Input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Latex..." />
          </div>

          <Button type="submit" className="w-full text-sm h-11 font-semibold mt-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm">
            <Save className="w-4 h-4 mr-2" /> Save Medical Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
