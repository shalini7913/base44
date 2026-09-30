import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  X, 
  CloudRain, 
  Wind, 
  Thermometer,
  Radio,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmergencyAlert() {
  const { 
    weatherRisk, 
    sirenActive, 
    audioBlocked, 
    alertDismissed, 
    stopSiren, 
    enableAudio, 
    dismissAlert,
    weather
  } = useDisaster();

  if (!weatherRisk || alertDismissed) return null;

  const isCritical = weatherRisk.isCritical;
  const isHighRisk = weatherRisk.isHighRisk && !isCritical;

  // Only display for HIGH RISK or CRITICAL
  if (!isCritical && !isHighRisk) return null;

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg border relative overflow-hidden mb-6 ${
      isCritical 
        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-500 shadow-red-500/20 animate-pulse-border'
        : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white border-amber-400 shadow-amber-500/20'
    }`}>
      {/* Background atmospheric ambient flare */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left: Icon & Alert Messaging */}
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
            isCritical ? 'bg-red-800/80 text-white animate-bounce' : 'bg-amber-800/80 text-white'
          }`}>
            {isCritical ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase ${
                isCritical ? 'bg-white text-red-700' : 'bg-white text-amber-800'
              }`}>
                {isCritical ? '🚨 CRITICAL / PEAK HAZARD' : '⚠️ HIGH RISK ADVISORY'}
              </span>

              {sirenActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/30 text-white border border-white/30 animate-pulse">
                  <BellRing className="w-3 h-3 text-red-200 animate-spin" /> SIREN ACTIVE
                </span>
              )}

              <span className="text-xs text-white/80 font-medium">
                {weather?.location || 'Disaster Grid'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              {isCritical ? weatherRisk.summary : weatherRisk.severityNotice}
            </h3>

            {/* List of specific danger triggers */}
            {weatherRisk.reasons && weatherRisk.reasons.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-white/90">
                {weatherRisk.reasons.map((reason, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Emergency Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
          {/* Autoplay restriction fallback button */}
          {audioBlocked && isCritical && (
            <Button
              onClick={enableAudio}
              size="sm"
              className="bg-white text-red-700 hover:bg-red-50 font-bold text-xs h-9 px-3.5 rounded-xl shadow-md"
            >
              <Volume2 className="w-3.5 h-3.5 mr-1.5 text-red-600 animate-pulse" />
              🔊 Enable Emergency Sound
            </Button>
          )}

          {/* Siren Mute button */}
          {sirenActive && (
            <Button
              onClick={stopSiren}
              size="sm"
              variant="outline"
              className="bg-red-950/60 hover:bg-red-950 text-white border-white/30 font-bold text-xs h-9 px-3.5 rounded-xl"
            >
              <VolumeX className="w-3.5 h-3.5 mr-1.5 text-red-300" />
              Stop Siren
            </Button>
          )}

          {/* Dismiss Alert button */}
          <Button
            onClick={dismissAlert}
            size="sm"
            variant="ghost"
            className="hover:bg-white/15 text-white font-semibold text-xs h-9 px-3 rounded-xl"
          >
            <X className="w-3.5 h-3.5 mr-1 text-white/80" />
            Dismiss Alert
          </Button>
        </div>
      </div>
    </div>
  );
}
