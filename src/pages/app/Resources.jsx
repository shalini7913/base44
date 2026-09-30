import React, { useState } from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Boxes, Plus, CheckCircle2, Package, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Resources() {
  const { resources } = useDisaster();
  
  const [requestItem, setRequestItem] = useState('Clean Drinking Water');
  const [requestQty, setRequestQty] = useState('500');
  const [requestLocation, setRequestLocation] = useState('Sector 4 Field Shelter');
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Boxes className="w-7 h-7 text-sky-600" />
          <span>Disaster Logistics & Relief Supply Matrix</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track emergency food, clean water, medical gear, power generators, and flood rescue vessels.
        </p>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>RELIEF SUPPLY DISPATCH REQUEST SUBMITTED TO CENTRAL RESQ WAREHOUSE</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplies Matrix Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Current Stock & Distribution Depots</h3>
            <span className="text-xs text-slate-500 font-medium">{resources.length} Supply Categories</span>
          </div>

          <div className="space-y-3">
            {resources.map(res => (
              <div key={res.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{res.category}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Location: {res.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{res.quantity.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">{res.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Relief Supply Form (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Request Relief Supplies</h3>
            <p className="text-xs text-slate-500">Direct requisition to warehouse dispatch</p>
          </div>

          <form onSubmit={handleRequest} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Select Item Category:</label>
              <select
                value={requestItem}
                onChange={e => setRequestItem(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              >
                <option value="Clean Drinking Water">Clean Drinking Water (Liters)</option>
                <option value="Medical Kits">Emergency Trauma Kits</option>
                <option value="Inflatable Life Boats">Inflatable Life Boats</option>
                <option value="Diesel Power Generators">Diesel Power Generators</option>
                <option value="Rations & Ready Meals">Rations & Ready Food Packs</option>
                <option value="Thermal Blankets">Thermal Blankets</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Quantity Needed:</label>
              <Input
                value={requestQty}
                onChange={e => setRequestQty(e.target.value)}
                placeholder="e.g. 200"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Drop-off Shelter / Camp:</label>
              <Input
                value={requestLocation}
                onChange={e => setRequestLocation(e.target.value)}
                placeholder="e.g. Sector 4 Community Ground"
                required
              />
            </div>

            <Button type="submit" className="w-full text-xs h-11 mt-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs">
              <Truck className="w-4 h-4 mr-1.5" /> Submit Logistics Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
