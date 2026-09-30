import React, { useState } from 'react';
import DisasterMap from '@/api/components/map/Disastermap';
import { Map, Filter, Layers, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmergencyAlert from '@/api/components/alert/EmergencyAlert';

export default function RMap() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-4 pb-12">
      {/* Real-Time Red Emergency Alert & Siren Notification Banner */}
      <EmergencyAlert />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-sky-600" />
            <span>Search & Rescue Tactical Map</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time geospatial grid overlays, unit telemetry, and danger perimeter boundaries.
          </p>
        </div>

        {/* Map Layer Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'sos', 'crews', 'drones'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                filter === f
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[620px] rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <DisasterMap activeFilter={filter} />
      </div>
    </div>
  );
}
