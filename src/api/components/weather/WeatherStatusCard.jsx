import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Gauge, 
  Radio, 
  MapPin,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WEATHER_RISK_LEVELS } from '@/services/weatherRiskConfig';

export default function WeatherStatusCard({ showForecast = true, compact = false }) {
  const { 
    weather, 
    weatherRisk, 
    weatherLoading, 
    weatherError, 
    refreshWeather,
    sirenActive,
    stopSiren,
    audioBlocked,
    enableAudio,
    simulatedRisk,
    toggleSimulatedRisk
  } = useDisaster();

  const isCritical = weatherRisk?.isCritical;
  const isHighRisk = weatherRisk?.isHighRisk && !isCritical;
  const isLowRisk = weatherRisk?.level === WEATHER_RISK_LEVELS.LOW_RISK;
  const isNormal = weatherRisk?.level === WEATHER_RISK_LEVELS.NORMAL;

  // Visual styling according to evaluated risk
  const theme = isCritical
    ? {
        badgeBg: 'bg-red-500 text-white',
        cardBg: 'bg-gradient-to-br from-red-600 via-rose-600 to-red-700',
        ringColor: 'ring-red-400',
        dotColor: 'bg-red-500 animate-ping',
        statusEmoji: '🔴',
        statusLabel: 'CRITICAL ALERT',
      }
    : isHighRisk
    ? {
        badgeBg: 'bg-amber-500 text-white',
        cardBg: 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700',
        ringColor: 'ring-amber-400',
        dotColor: 'bg-amber-400 animate-ping',
        statusEmoji: '🟡',
        statusLabel: 'HIGH RISK',
      }
    : isLowRisk
    ? {
        badgeBg: 'bg-sky-500 text-white',
        cardBg: 'bg-gradient-to-br from-sky-600 to-blue-700',
        ringColor: 'ring-sky-300',
        dotColor: 'bg-sky-400',
        statusEmoji: '🔵',
        statusLabel: 'LOW RISK',
      }
    : {
        badgeBg: 'bg-emerald-500 text-white',
        cardBg: 'bg-gradient-to-br from-sky-600 to-blue-700',
        ringColor: 'ring-emerald-300',
        dotColor: 'bg-emerald-400',
        statusEmoji: '🟢',
        statusLabel: 'NORMAL',
      };

  return (
    <div className="space-y-6">
      {/* Main Status Hero Card */}
      <div className={`${theme.cardBg} text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden transition-all duration-300`}>
        {/* Subtle Decorative Elements */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        {/* Header: Location, Refresh, and Risk Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-100 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-200" />
                Live Meteorological Telemetry
              </span>

              {/* API Provider Badge */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                {weather?.provider || 'Satellite Doppler'}
              </span>

              {/* Siren Active Indicator */}
              {sirenActive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-white text-red-600 animate-pulse shadow-sm">
                  🚨 EMERGENCY SIREN ACTIVE
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {weather?.location || 'Disaster Grid Area'}
            </h2>
            <p className="text-xs text-sky-100 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-sky-200 shrink-0" />
              <span>{weather?.subLocation || 'Sector 4 Flood Plain'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-100 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{weather?.lastUpdated || 'Live Feed'}</span>
            </div>

            <Button
              onClick={refreshWeather}
              disabled={weatherLoading}
              size="sm"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-8 px-2.5 rounded-xl backdrop-blur-sm"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Center: Hero Temperature, Official Dynamic Icon, and Current Risk Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/20 relative z-10">
          <div className="flex items-center gap-5">
            {/* Dynamic Weather Icon from official API */}
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center p-2 shadow-inner shrink-0">
              {weather?.iconUrl ? (
                <img 
                  src={weather.iconUrl} 
                  alt={weather.condition} 
                  className="w-16 h-16 object-contain drop-shadow-md"
                  onError={(e) => {
                    // Graceful fallback to SVG if remote image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <CloudRain className="w-12 h-12 text-white animate-pulse" style={{ display: weather?.iconUrl ? 'none' : 'block' }} />
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black tracking-tight">{weather?.temp ?? 27}°C</div>
              <div className="text-xs sm:text-sm text-sky-100 font-medium">Feels like {weather?.tempF ?? 81}°F</div>
            </div>
          </div>

          {/* Condition and Evaluated Multi-Factor Risk State */}
          <div className="space-y-2 md:text-right max-w-sm">
            <div className="flex md:justify-end items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm ${theme.badgeBg}`}>
                <span className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
                {theme.statusEmoji} {theme.statusLabel}
              </span>
            </div>

            <p className="text-xl font-extrabold text-white leading-tight">
              {weather?.condition || 'Overcast Skies'}
            </p>

            <p className="text-xs text-sky-100 font-medium leading-relaxed">
              {weatherRisk?.severityNotice || 'Weather parameters within safe bounds'}
            </p>

            {/* Siren Controls in Status Card */}
            {sirenActive && (
              <div className="pt-1 flex md:justify-end">
                <Button
                  onClick={stopSiren}
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50 text-xs font-bold h-8 rounded-xl shadow-md"
                >
                  <VolumeX className="w-3.5 h-3.5 mr-1" /> Stop Siren
                </Button>
              </div>
            )}

            {audioBlocked && isCritical && (
              <div className="pt-1 flex md:justify-end">
                <Button
                  onClick={enableAudio}
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50 text-xs font-bold h-8 rounded-xl shadow-md"
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1" /> 🔊 Enable Sound
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Metrics Bar: Humidity, Wind, Rain, Visibility */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-xs relative z-10">
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-sky-100 font-medium text-[11px]">
              <Droplets className="w-3.5 h-3.5" /> Relative Humidity
            </div>
            <div className="text-lg font-black">{weather?.humidity || '75%'}</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-sky-100 font-medium text-[11px]">
              <Wind className="w-3.5 h-3.5" /> Wind Speed
            </div>
            <div className="text-lg font-black truncate">{weather?.wind || '18 km/h'}</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-sky-100 font-medium text-[11px]">
              <CloudRain className="w-3.5 h-3.5" /> Rainfall Rate
            </div>
            <div className="text-lg font-black">{weather?.rainfall || '0 mm'}</div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-sky-100 font-medium text-[11px]">
              <Eye className="w-3.5 h-3.5" /> Visibility
            </div>
            <div className="text-lg font-black">{weather?.visibility || '10.0 km'}</div>
          </div>
        </div>

        {weatherError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-300/30 text-xs text-amber-100">
            ⚠️ {weatherError} — Displaying resilient cached telemetry.
          </div>
        )}
      </div>

      {/* Interactive Testing & Verification Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-semibold text-slate-800">Weather-Risk Simulation Tester:</span>
          <span className="text-slate-500 text-[11px] hidden md:inline">
            (Verify siren transition and red alert states in real time)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => toggleSimulatedRisk(WEATHER_RISK_LEVELS.NORMAL)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              simulatedRisk === WEATHER_RISK_LEVELS.NORMAL 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🟢 Normal
          </button>

          <button
            onClick={() => toggleSimulatedRisk(WEATHER_RISK_LEVELS.HIGH_RISK)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              simulatedRisk === WEATHER_RISK_LEVELS.HIGH_RISK 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🟡 High Risk
          </button>

          <button
            onClick={() => toggleSimulatedRisk(WEATHER_RISK_LEVELS.CRITICAL)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              simulatedRisk === WEATHER_RISK_LEVELS.CRITICAL 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🔴 Critical (Siren)
          </button>

          {simulatedRisk && (
            <button
              onClick={() => toggleSimulatedRisk(null)}
              className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 underline text-[11px]"
            >
              Reset to Live
            </button>
          )}
        </div>
      </div>

      {/* Multi-Day Forecast Grid */}
      {showForecast && weather?.forecast && weather.forecast.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {weather.forecast.map((f, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{f.day}</span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                  {f.rainfall}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {f.iconUrl && (
                  <img src={f.iconUrl} alt={f.condition} className="w-9 h-9 object-contain drop-shadow-sm" />
                )}
                <div>
                  <div className="text-base font-extrabold text-slate-900">{f.temp}</div>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[120px]">{f.condition}</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-medium">
                Rain Probability: <span className="font-semibold text-slate-700">{f.chance}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
