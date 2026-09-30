import React, { useState, useEffect } from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Phone, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Flame, 
  Waves, 
  HeartPulse,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SOSPage() {
  const { sosActive, sosDetails, userLocation, triggerSOS, cancelSOS, sirenActive, stopSiren, startSiren } = useDisaster();
  
  const [selectedReason, setSelectedReason] = useState('FLOOD_TRAPPED');
  const [customNotes, setCustomNotes] = useState('');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const emergencyReasons = [
    { id: 'FLOOD_TRAPPED', label: 'Flooded / Trapped in Water', icon: Waves, color: 'text-sky-600' },
    { id: 'MEDICAL_CRITICAL', label: 'Medical Critical Emergency', icon: HeartPulse, color: 'text-red-600' },
    { id: 'FIRE_HAZARD', label: 'Fire / Chemical Smoke', icon: Flame, color: 'text-amber-600' },
    { id: 'STRUCTURAL_COLLAPSE', label: 'Building Collapse / Debris', icon: AlertTriangle, color: 'text-orange-600' },
  ];

  // Hold-to-trigger timer logic
  useEffect(() => {
    let interval;
    if (isHolding && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerSOS(selectedReason, customNotes);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else if (!isHolding && holdProgress < 100) {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdProgress, selectedReason, customNotes]);

  const handleInstantTrigger = () => {
    triggerSOS(selectedReason, customNotes);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold shadow-xs">
          <Radio className="w-4 h-4 text-red-600" />
          <span>Priority Emergency Broadcast Frequency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Emergency Distress Signal</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Broadcasting sends your exact GPS coordinates, medical history, and emergency contact details directly to the nearest first responders.
        </p>
      </div>

      {sosActive ? (
        /* ACTIVE BROADCASTING STATE */
        <div className="bg-white p-8 rounded-3xl border-2 border-red-500 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Radio className="w-10 h-10 text-white animate-spin" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SOS DISTRESS SIGNAL ACTIVE</h2>
            <p className="text-xs text-slate-500 font-mono">
              Signal Broadcast Reference: <strong>{sosDetails?.id || 'SOS-9921'}</strong>
            </p>
          </div>

          {/* Rescue Team Dispatch Radar */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800">DISPATCHED RESPONDERS</span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">EN ROUTE</span>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Unit:</span>
                <span className="font-bold text-slate-900">Alpha Search & Rescue Squad</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Your GPS Coordinates:</span>
                <span className="font-mono text-slate-900">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">SMS Notifications:</span>
                <span className="text-emerald-700 font-semibold">Sent to Emergency Contacts</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => {
                if (sirenActive) {
                  stopSiren();
                } else {
                  startSiren();
                }
              }}
              variant="outline"
              className={`text-xs h-11 border-slate-200 rounded-xl transition-colors ${
                sirenActive ? 'bg-red-50 text-red-700 border-red-300' : 'bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              {sirenActive ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2 text-red-600 animate-pulse" />}
              {sirenActive ? 'Mute Siren' : 'Sound Audio Beacon Siren'}
            </Button>

            <Button
              onClick={cancelSOS}
              variant="default"
              className="text-xs h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
            >
              <XCircle className="w-4 h-4 mr-2 text-slate-300" />
              Cancel SOS / I Am Safe
            </Button>
          </div>
        </div>
      ) : (
        /* INACTIVE / PREPARE SOS TRIGGER STATE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reason Selection Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">1. Select Emergency Type</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              {emergencyReasons.map(r => {
                const Icon = r.icon;
                const isSelected = selectedReason === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${r.color}`} />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">Additional Notes / Landmark / Floor:</label>
              <textarea
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="e.g. 2nd floor, water rising above stairs, 2 people..."
                className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Hold to Trigger SOS Button */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">2. Transmit Distress Signal</h3>
              <p className="text-xs text-slate-500">Press and hold for 2 seconds to alert response command</p>
            </div>

            {/* Tactile SOS Trigger */}
            <div className="relative">
              <div 
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className="w-44 h-44 rounded-full bg-red-600 p-1 flex items-center justify-center cursor-pointer shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center p-4 relative overflow-hidden border-4 border-red-100">
                  {/* Fill Progress */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-red-500/20 transition-all duration-75 pointer-events-none"
                    style={{ height: `${holdProgress}%` }}
                  />
                  <ShieldAlert className="w-12 h-12 text-red-600 mb-1" />
                  <span className="text-sm font-black text-slate-900 tracking-wider uppercase">
                    {isHolding ? 'HOLDING...' : 'HOLD SOS'}
                  </span>
                  <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5">
                    {holdProgress > 0 ? `${holdProgress}%` : '2 SECONDS'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleInstantTrigger}
              variant="default"
              className="w-full text-xs h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
            >
              Or Tap For Instant SOS Dispatch
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
