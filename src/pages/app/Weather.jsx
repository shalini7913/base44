import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { 
  CloudRain, 
  MapPin, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Compass,
  Map as MapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EmergencyAlert from '@/api/components/alert/EmergencyAlert';
import WeatherStatusCard from '@/api/components/weather/WeatherStatusCard';
import DisasterMap from '@/api/components/map/Disastermap';

export default function WeatherPage() {
  const { weather, weatherRisk } = useDisaster();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-16">
      {/* Real-Time Red Emergency Alert & Siren Notification Banner */}
      <EmergencyAlert />

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            <span>National Meteorological Disaster Radar & Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Live Weather & Flood Watch
          </h1>
          <p className="text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{weather?.location || 'Central Disaster Grid'} • {weather?.subLocation}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            weatherRisk?.isCritical 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : weatherRisk?.isHighRisk 
              ? 'bg-amber-50 border-amber-200 text-amber-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{weatherRisk?.severityNotice || weather?.severityNotice}</span>
          </div>
          <Button 
            onClick={() => navigate('/routes')} 
            className="bg-sky-600 text-white hover:bg-sky-700 text-xs font-semibold h-10 px-4 rounded-xl shadow-sm"
          >
            Safe Evac Routes <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Real-Time Live Weather Status Card & 4-Day Forecast */}
      <WeatherStatusCard showForecast={true} />

      {/* Integrated Telemetry Map View for Location Weather Selection */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-sky-600" />
              <span>Interactive Telemetry Map (Click map to update weather location)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click anywhere across the region grid to stream instant weather telemetry for those exact coordinates.
            </p>
          </div>
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            size="sm"
            className="text-xs h-8 rounded-xl"
          >
            Full Map View
          </Button>
        </div>

        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200">
          <DisasterMap />
        </div>
      </div>
    </div>
  );
}
