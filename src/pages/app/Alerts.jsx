import React, { useState } from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Bell, AlertTriangle, ShieldAlert, Filter, CheckCircle2, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTimestamp } from '@/services/utils';

export default function Alerts() {
  const { alerts } = useDisaster();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity.toUpperCase() === filterSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-sky-600" />
            <span>Official Disaster Warnings & Bulletins</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time verified emergency announcements issued by National Disaster Management Services.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['ALL', 'CRITICAL', 'EXTREME', 'HIGH', 'MEDIUM'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`bg-white p-6 rounded-2xl border space-y-4 shadow-sm transition-all hover:shadow-md ${
              alert.severity === 'Critical' || alert.severity === 'Extreme'
                ? 'border-red-200 hover:border-red-300'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{alert.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    alert.severity === 'Critical' || alert.severity === 'Extreme'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{alert.title}</h3>
              </div>

              <span className="text-xs text-slate-500 shrink-0 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatTimestamp(alert.timestamp)}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" /> Required Safety Protocol:
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">{alert.actionRequired}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-600" /> {alert.location}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-600" /> {alert.impactedPeople} Affected
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
