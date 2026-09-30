import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Building2, Navigation, Phone, Activity, HeartPulse, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Hospitals() {
  const { hospitals } = useDisaster();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-sky-600" />
          <span>Trauma Centers & Field Hospitals</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Live telemetry feed of emergency room bed availability, ICU capacity, oxygen supply, and trauma care levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hospitals.map(hosp => (
          <div key={hosp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md space-y-5 flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {hosp.traumaLevel}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{hosp.name}</h3>
                </div>
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg shrink-0">{hosp.distance}</span>
              </div>

              <p className="text-xs text-slate-500">{hosp.address}</p>

              {/* Resource Gauge */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">EVAC BEDS:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{hosp.bedsAvailable} Available</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">ICU UNITS:</span>
                  <span className="text-amber-700 font-extrabold text-sm">{hosp.icuBeds} Free</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">OXYGEN:</span>
                  <span className="text-sky-700 font-bold">{hosp.oxygenLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">BLOOD:</span>
                  <span className="text-red-700 font-bold text-[10px] truncate block">{hosp.bloodBank}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Button 
                onClick={() => navigate('/routes')} 
                className="w-full text-xs h-10 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 mr-1.5" /> Emergency Evac Route
              </Button>
              <a 
                href={`tel:${hosp.phone}`}
                className="w-full text-xs h-9 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Direct Desk: {hosp.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
