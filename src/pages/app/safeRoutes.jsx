import React, { useState } from 'react';
import { MOCK_SAFE_ROUTES } from '@/services/mockData';
import DisasterMap from '@/api/components/map/Disastermap';
import { Navigation, ShieldCheck, AlertTriangle, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SafeRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(MOCK_SAFE_ROUTES[0]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Navigation className="w-7 h-7 text-slate-900" />
            <span>Evacuation Route Finder</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time pathfinding reroutes citizens away from flash flood rivers and chemical hazard plumes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            SAFE CORRIDORS ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Selector List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Available Evacuation Tracks</h3>
          
          <div className="space-y-3">
            {MOCK_SAFE_ROUTES.map(route => {
              const isSelected = selectedRoute?.id === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all space-y-3 shadow-xs ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/10'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{route.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {route.safetyScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>Destination: <strong className="text-slate-900">{route.destination}</strong></span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                    <div>Distance: <span className="text-slate-900 font-bold">{route.distance}</span></div>
                    <div>Est. Time: <span className="text-slate-900 font-bold">{route.estTime}</span></div>
                  </div>

                  <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{route.hazardAvoided}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-[520px] space-y-3 flex flex-col">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-900">Selected Path Overlay</span>
              <span className="text-xs text-emerald-700 font-semibold">{selectedRoute?.title}</span>
            </div>
            
            <div className="flex-1 w-full rounded-xl overflow-hidden">
              <DisasterMap selectedRoute={selectedRoute} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
