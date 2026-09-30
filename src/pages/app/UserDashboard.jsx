import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisaster } from '@/services/DisasterContext';
import { 
  ShieldAlert, 
  Radio, 
  Map, 
  Navigation, 
  PhoneCall, 
  Building2, 
  Boxes, 
  Activity, 
  Bot, 
  ArrowRight, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Shield,
  HeartPulse,
  Clock,
  Eye,
  Phone,
  Check,
  Flame,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DisasterMap from '@/api/components/map/Disastermap';
import EmergencyAlert from '@/api/components/alert/EmergencyAlert';
import WeatherStatusCard from '@/api/components/weather/WeatherStatusCard';
import GlobeBackground from '@/components/GlobeBackground';

export default function UserDashboard() {
  const { alerts, devices, sosActive, sosDetails, userLocation, userProfile, triggerSOS, cancelSOS, weather } = useDisaster();
  const navigate = useNavigate();

  const [sosReason, setSosReason] = useState('Immediate Danger');
  const [sosNotes, setSosNotes] = useState('');

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const criticalCount = activeAlerts.filter(a => a.severity === 'Critical' || a.severity === 'Extreme').length;

  const handleSosSubmit = (e) => {
    e.preventDefault();
    triggerSOS(sosReason, sosNotes || 'Emergency dispatch requested from home portal');
  };

  return (
    <div className="relative space-y-12 pb-20">
      {/* Ambient 3D Rotating Globe in Front Page Background */}
      <div className="fixed top-12 -right-16 w-[620px] h-[620px] -z-10 pointer-events-none opacity-25 overflow-hidden hidden xl:block">
        <GlobeBackground className="w-full h-full" />
      </div>

      {/* Real-Time Red Emergency Alert & Siren Notification Banner */}
      <EmergencyAlert />

      {/* 1. HERO SECTION - Bright, Wide Banner with Clean Blue Accents */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-100/60 border border-sky-100 shadow-sm p-8 sm:p-12 lg:p-16">
        {/* 3D Rotating Globe in Hero Background */}
        <div className="absolute -right-16 sm:-right-8 lg:right-6 top-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] pointer-events-none z-0 flex items-center justify-center opacity-85">
          <GlobeBackground className="w-full h-full" />
        </div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>National Disaster Management & Emergency Operations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Rapid Emergency SOS & Disaster Response
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Real-time disaster threat monitoring, verified emergency alerts, safe evacuation route calculation, and AI-assisted rescue team dispatch protecting citizens 24/7.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {sosActive ? (
              <Button
                onClick={() => navigate('/sos')}
                variant="destructive"
                size="lg"
                className="font-bold bg-red-600 hover:bg-red-700 text-white shadow-md rounded-xl text-sm h-12 px-7"
              >
                <Radio className="w-4 h-4 mr-2 animate-spin" /> SOS BROADCAST ACTIVE
              </Button>
            ) : (
              <Button
                onClick={() => {
                  triggerSOS('HERO_CTA', 'One-Tap Emergency Distress Signal');
                  navigate('/sos');
                }}
                variant="destructive"
                size="lg"
                className="font-bold bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-md rounded-xl text-sm h-12 px-7"
              >
                <ShieldAlert className="w-4 h-4 mr-2" /> Trigger SOS
              </Button>
            )}

            <Button
              onClick={() => navigate('/map')}
              variant="outline"
              size="lg"
              className="font-semibold text-sky-900 border-sky-200 bg-white hover:bg-sky-50 rounded-xl text-sm h-12 px-6 shadow-xs"
            >
              <Map className="w-4 h-4 mr-2 text-sky-600" /> View Disaster Map
            </Button>
          </div>

          {/* Quick status chips */}
          <div className="flex flex-wrap items-center gap-5 pt-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Telemetry Mesh 100% Operational
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-sky-600" /> {devices.length} Active Rescue Squads
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> {activeAlerts.length} Weather Warnings
            </span>
          </div>
        </div>

        {/* Subtle Right Side Graphical Element */}
        <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-sky-200/30 to-blue-300/20 blur-2xl pointer-events-none z-0" />
        
        {/* Compact Right-Aligned Rescue Helpline Card */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute right-6 xl:right-8 top-1/2 -translate-y-1/2 w-60 p-4 bg-white/85 backdrop-blur-md rounded-2xl border border-sky-100/90 shadow-md space-y-3 text-center z-10 transition-all hover:shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
            <PhoneCall className="w-5 h-5 text-sky-600" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-xs">Need Direct Rescue Help?</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Toll-free 24-Hour Emergency Helpline</p>
          </div>
          <a 
            href="tel:911" 
            className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 1070 / 911
          </a>
        </div>
      </section>

      {/* 2. FEATURE CARDS - 6 Simple Rectangular Cards with White Backgrounds & Subtle Shadows */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Emergency Quick Services</h2>
            <p className="text-xs text-slate-500">Select an emergency service to request immediate support or route assistance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Emergency SOS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Emergency SOS Broadcast</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transmit your exact GPS coordinates, medical records, and family contacts to nearest rescue squads.
              </p>
            </div>
            <Button
              onClick={() => navigate('/sos')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Open SOS Beacon <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Card 2: Live Disaster Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Live Disaster Alerts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verified bulletins on river inundation, toxic chemical smoke plumes, and active seismic warnings.
              </p>
            </div>
            <Button
              onClick={() => navigate('/alerts')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              View {activeAlerts.length} Active Alerts <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Card 3: Evacuation Routes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Navigation className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Safe Evacuation Routes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dynamic turn-by-turn pathfinding steering citizens clear of flooded bridges and blocked expressways.
              </p>
            </div>
            <Button
              onClick={() => navigate('/routes')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Find Safe Corridors <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Card 4: Disaster Map */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Map className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Interactive Tactical Map</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live geospatial map with rescue team locations, hospital emergency room capacity, and danger perimeters.
              </p>
            </div>
            <Button
              onClick={() => navigate('/map')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Open Full Map <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Card 5: Weather Forecast */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CloudRain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Weather & Flood Radar</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Meteorological rain gauges, wind velocity, humidity telemetry, and 4-day precipitation forecasts.
              </p>
            </div>
            <Button
              onClick={() => navigate('/weather')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              View Forecast ({weather.temp}°C) <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Card 6: Rescue Teams */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Rescue Squad Command</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ground units, watercraft boats, thermal drones, and field paramedics coordinating relief operations.
              </p>
            </div>
            <Button
              onClick={() => navigate('/rescue/command')}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Command Operations <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. DISASTER / STATUS SECTION - Clear Status Colors: Green, Yellow, Orange, Red */}
      <section id="dashboard" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Current Emergency Situation</h2>
            <p className="text-xs text-slate-500">Live operational telemetry across municipal sectors and emergency response grid.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>DISASTER LEVEL 3: ACTIVE RIVER OVERFLOW</span>
          </div>
        </div>

        {/* 6 Grid Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Metric 1: Current Disaster Level (Orange/Red) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Disaster Level</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Level 3 Critical
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">Elevated Watch</div>
            <p className="text-xs text-slate-500 font-medium">Mula River Basin North Inundated</p>
          </div>

          {/* Metric 2: Active Warnings (Red = Emergency) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Warnings</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                {criticalCount} Critical
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">{activeAlerts.length} Bulletins</div>
            <p className="text-xs text-slate-500 font-medium">Flood & Hazardous gas leak reported</p>
          </div>

          {/* Metric 3: People at Risk (Orange) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Citizens at Risk</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Sector 4 & 2
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">~25,800</div>
            <p className="text-xs text-slate-500 font-medium">Under active evacuation advisory</p>
          </div>

          {/* Metric 4: Active Rescue Teams (Green = Safe/Operational) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rescue Squads</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Operational
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">{devices.length} Units</div>
            <p className="text-xs text-slate-500 font-medium">Crews, water boats & UAV scouts</p>
          </div>

          {/* Metric 5: Safe Zones & Shelters (Green = Safe) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Verified Safe Zones</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                100% Stocked
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">15 Shelters</div>
            <p className="text-xs text-slate-500 font-medium">Food rations, clean water & power</p>
          </div>

          {/* Metric 6: Evacuation Status (Yellow/Green) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Evacuation Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                88% Complete
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">14,200 Evacuated</div>
            <p className="text-xs text-slate-500 font-medium">Lowland Colony safely transferred</p>
          </div>
        </div>
      </section>

      {/* 4. MAP SECTION - Clean White Card with Blue Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
              <Map className="w-4 h-4" /> Live Geospatial Tracking
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Disaster Map & Evacuation Grid</h2>
            <p className="text-xs text-slate-500">
              Interactive map displaying hazard perimeters, live GPS rescue squad positions, and field hospitals.
            </p>
          </div>
          <Button
            onClick={() => navigate('/map')}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold h-10 px-5 rounded-xl shadow-xs shrink-0"
          >
            Open Full Screen Map <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
          <DisasterMap />
        </div>
      </section>

      {/* 5. WEATHER SECTION - Real-Time Weather Card & Forecasting Radar */}
      <section className="space-y-4">
        <WeatherStatusCard />
      </section>

      {/* 6. SOS SECTION - Prominent Orange/Red Emergency Section with Feedback */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Priority Emergency Broadcast
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Emergency SOS Request</h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Transmits your exact GPS position and medical notes directly to the dispatch terminal of all nearby rescue squads.
            </p>
          </div>

          {sosActive ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-red-100 text-red-800 text-xs font-bold animate-pulse">
                🚨 SOS Signal ID: {sosDetails?.id || 'Active'}
              </div>
              <Button
                onClick={cancelSOS}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-10 rounded-xl"
              >
                Cancel SOS
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                triggerSOS('QUICK_SOS', 'Emergency Signal Broadcasted');
              }}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-black text-sm h-12 px-8 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Radio className="w-4 h-4 mr-2" /> TRIGGER SOS
            </Button>
          )}
        </div>

        {/* Status Feedback or Emergency Details Form */}
        {sosActive ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-950">Rescue Squad Dispatched & Tracking Signal</h4>
                <p className="text-xs text-red-800">
                  Responders from <strong>Alpha Rescue Squad</strong> have received your coordinates ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}). Stay calm and move to high ground if safe.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSosSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Emergency Type:</label>
              <select
                value={sosReason}
                onChange={e => setSosReason(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-sky-600"
              >
                <option value="Flood / Water Trapped">Flood / Water Trapped</option>
                <option value="Critical Medical Care">Critical Medical Care</option>
                <option value="Fire / Hazardous Smoke">Fire / Hazardous Smoke</option>
                <option value="Building Collapse / Debris">Building Collapse / Debris</option>
                <option value="Other Life-Threatening Situation">Other Life-Threatening Situation</option>
              </select>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Landmark / Floor / Notes (Optional):</label>
              <input
                type="text"
                value={sosNotes}
                onChange={e => setSosNotes(e.target.value)}
                placeholder="e.g. 2nd floor, water rising, 3 people..."
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div className="md:col-span-3">
              <Button
                type="submit"
                className="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Transmit SOS Broadcast
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
