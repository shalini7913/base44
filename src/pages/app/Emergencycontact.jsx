import React, { useState } from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { PhoneCall, Shield, HeartPulse, Flame, Radio, Plus, Trash2, Phone, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EmergencyContact() {
  const { userProfile, setUserProfile } = useDisaster();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');
  const [callActive, setCallActive] = useState(null);

  const officialHelplines = [
    { title: 'National Disaster Helpline', number: '1070', icon: Radio, desc: 'Central Disaster Control Room', color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Ambulance & Trauma Medical', number: '108', icon: HeartPulse, desc: 'Emergency Medical Care', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Police Emergency Response', number: '100 / 911', icon: Shield, desc: 'Law Enforcement & Immediate Triage', color: 'text-sky-600', bg: 'bg-sky-50' },
    { title: 'Fire & Rescue Brigade', number: '101', icon: Flame, desc: 'Fire & Hazard Suppression', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    setUserProfile(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: newContactName, phone: newContactPhone, relation: newContactRelation }
      ]
    }));

    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (index) => {
    setUserProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const simulateCall = (name, number) => {
    setCallActive({ name, number });
    setTimeout(() => setCallActive(null), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-7 h-7 text-sky-600" />
          <span>Emergency Hotlines & Personal Contacts</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct priority lines to national emergency control centers and your designated family contacts.
        </p>
      </div>

      {/* Simulated Call Banner */}
      {callActive && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-300 text-sky-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-pulse">
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-600 animate-spin" />
            DIALING HIGH-PRIORITY LINE TO {callActive.name.toUpperCase()} ({callActive.number})
          </span>
          <span className="text-emerald-700 font-bold">CONNECTING...</span>
        </div>
      )}

      {/* Official Emergency Hotlines */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">National Emergency Services</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {officialHelplines.map(h => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${h.bg} ${h.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-900">{h.number}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{h.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{h.desc}</p>
                  </div>
                </div>

                <Button
                  onClick={() => simulateCall(h.title, h.number)}
                  className="w-full text-xs h-10 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Hotline
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Contacts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Contacts List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Designated Emergency Contacts</h3>
            <span className="text-xs text-slate-500 font-medium">{userProfile.emergencyContacts.length} Contacts Saved</span>
          </div>

          <div className="space-y-3">
            {userProfile.emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{contact.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {contact.relation}
                    </span>
                  </div>
                  <p className="text-xs text-sky-700 font-mono font-semibold">{contact.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => simulateCall(contact.name, contact.phone)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleRemoveContact(idx)}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Contact Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Add Emergency Contact</h3>
            <p className="text-xs text-slate-500">Auto-notified when SOS is triggered</p>
          </div>
          
          <form onSubmit={handleAddContact} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name:</label>
              <Input
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                placeholder="e.g. Sarah Mercer"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number:</label>
              <Input
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
                placeholder="e.g. +1 (555) 987-6543"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Relationship:</label>
              <select
                value={newContactRelation}
                onChange={e => setNewContactRelation(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              >
                <option value="Family">Family Member</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Doctor">Primary Physician</option>
                <option value="Neighbor">Neighbor</option>
              </select>
            </div>

            <Button type="submit" className="w-full text-xs h-11 mt-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs">
              <Plus className="w-4 h-4 mr-1" /> Save Contact
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
