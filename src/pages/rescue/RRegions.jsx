import React from 'react';
import { MOCK_REGIONS } from '@/services/mockData';
import { Layers, ShieldAlert, Users, CheckCircle2 } from 'lucide-react';

export default function RRegions() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-sky-600" />
          <span>Disaster Sector Breakdown & Evacuation Status</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sub-division tracking of population evacuation percentage, assigned ground squads, and casualties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REGIONS.map(reg => (
          <div key={reg.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{reg.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                reg.riskLevel === 'Critical' || reg.riskLevel === 'Extreme'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {reg.riskLevel} Threat
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Evacuation Progress</span>
                <span className="text-emerald-700 font-bold">{reg.evacuated}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: reg.evacuated }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Casualties</span>
                <span className="text-red-600 font-bold">{reg.casualties}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Safe Shelters</span>
                <span className="text-sky-700 font-bold">{reg.shelters}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Assigned Squad</span>
                <span className="text-slate-900 text-[11px] block font-semibold truncate">{reg.teamAssigned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
