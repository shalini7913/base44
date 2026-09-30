import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Radio, Battery, Wifi, Cpu, RefreshCw, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Rdevices() {
  const { devices, updateDeviceStatus } = useDisaster();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Radio className="w-6 h-6 text-sky-600" />
          <span>IoT Hardware & UAV Telemetry Tracker</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor search & rescue drones, IoT satellite beacons, LoRa mesh gateways, and emergency response trucks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {device.type}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-2">{device.name}</h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                  device.status === 'sos' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {device.status}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Zone:</span>
                  <span className="text-slate-900 font-semibold">{device.assignedZone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Battery Charge:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" /> {device.battery}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telemetry Link:</span>
                  <span className="text-sky-600 font-semibold flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> {device.contact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Ping:</span>
                  <span className="text-slate-700">{device.lastPing}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateDeviceStatus(device.id, device.status === 'sos' ? 'safe' : 'sos')}
                className="w-full text-xs h-9 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Ping Hardware
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
