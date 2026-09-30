import React from 'react';
import { Activity, ShieldAlert, Waves, Flame, CloudRain, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Risk() {
  const navigate = useNavigate();

  const riskFactors = [
    { name: 'Flash Flood Vulnerability', score: 'HIGH (82%)', desc: 'Residing within 800 meters of Mula River Overflow', icon: Waves, color: 'text-sky-600', bg: 'bg-sky-50' },
    { name: 'Air Toxins & Chemical Leak', score: 'MODERATE (54%)', desc: 'Air Quality Index 195 (Elevated SO2 plume)', icon: Flame, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Seismic Tremor Rating', score: 'LOW (22%)', desc: 'Building reinforced concrete rating Class B', icon: AlertTriangle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Activity className="w-7 h-7 text-sky-600" />
          <span>Personal Vulnerability & Risk Assessment</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Calculates real-time environmental danger based on your current GPS location, weather satellite telemetry, and elevation data.
        </p>
      </div>

      {/* Main Score Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 text-center space-y-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Vulnerability Index
          </span>
          <div className="text-6xl sm:text-7xl font-black text-slate-900 flex items-center justify-center gap-2">
            <span className="text-amber-600">74</span>
            <span className="text-2xl sm:text-3xl text-slate-400 font-semibold">/ 100</span>
          </div>
          <div className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
            ELEVATED THREAT — EVACUATION ADVISED
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full rounded-full w-[74%]" />
        </div>

        <div className="flex justify-between text-xs font-semibold text-slate-500 px-2">
          <span>0 (Safe Zone)</span>
          <span>50 (Moderate)</span>
          <span className="text-red-600 font-bold">100 (Extreme Hazard)</span>
        </div>
      </div>

      {/* Breakdown Factors */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">Risk Factor Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {riskFactors.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${f.bg} ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">{f.score}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-base text-slate-900">Recommended Citizen Action</h4>
          <p className="text-xs text-slate-600">Evacuate to Sector 4 High School Field Shelter via Corridor Alpha.</p>
        </div>
        <Button onClick={() => navigate('/routes')} className="text-xs h-10 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs shrink-0 font-semibold">
          Find Evacuation Route
        </Button>
      </div>
    </div>
  );
}
