import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Cpu, Radio, ShieldAlert, Activity, Users, MapPin, CheckCircle2, Phone, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DisasterMap from '@/api/components/map/Disastermap';

import EmergencyAlert from '@/api/components/alert/EmergencyAlert';

export default function Rcommand() {
  const { devices, alerts, sosActive, updateDeviceStatus } = useDisaster();

  return (
    <div className="space-y-6 pb-12">
      {/* Real-Time Red Emergency Alert & Siren Notification Banner */}
      <EmergencyAlert />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-900">Rescue Operations Command Center</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            First responder command grid: Live unit telemetry, incident triaging, and dispatch authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            COMMAND GRID ONLINE
          </span>
        </div>
      </div>

      {/* Stats KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Rescue Squads</span>
          <div className="text-2xl font-bold text-slate-900">{devices.length} Units</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Live SOS Broadcasts</span>
          <div className="text-2xl font-bold text-red-600">
            {devices.filter(d => d.status === 'sos').length} Active
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disaster Warnings</span>
          <div className="text-2xl font-bold text-amber-600">
            {alerts.filter(a => a.status === 'ACTIVE').length} Warnings
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Grid Efficiency</span>
          <div className="text-2xl font-bold text-emerald-600">98.4%</div>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactical Map View */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-[500px] flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Live Search & Rescue Tactical Grid</span>
            <span className="text-xs text-sky-600 font-medium">Real-time GPS Sync</span>
          </div>

          <div className="flex-1 w-full rounded-lg overflow-hidden border border-slate-200">
            <DisasterMap />
          </div>
        </div>

        {/* Responder Unit Status Controls */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Deployed Units & Telemetry</h3>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {devices.map(device => (
              <div key={device.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">{device.name}</span>
                  <select
                    value={device.status}
                    onChange={e => updateDeviceStatus(device.id, e.target.value)}
                    className="h-7 px-2 text-xs font-medium rounded-md bg-white text-slate-800 border border-slate-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="safe">🟢 Safe / Standby</option>
                    <option value="assistance">🟡 Assistance Needed</option>
                    <option value="sos">🔴 Active SOS Dispatch</option>
                    <option value="offline">⚫ Offline</option>
                  </select>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Zone: <strong className="text-slate-800">{device.assignedZone}</strong></span>
                    <span>Battery: <strong className="text-emerald-600">{device.battery}%</strong></span>
                  </div>
                  <div>Vehicle: <span className="text-slate-700 font-medium">{device.vehicle}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
