import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Boxes, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RResources() {
  const { resources } = useDisaster();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Boxes className="w-6 h-6 text-sky-600" />
          <span>Tactical Logistics & Equipment Controller</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Command interface for authorizing supply trucks, heavy excavators, medical plasma drops, and water tankers.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">Central Warehouse Inventory Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(res => (
            <div key={res.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-sky-700">{res.id}</span>
                <h4 className="font-bold text-sm text-slate-900">{res.category}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{res.location}</p>
              </div>

              <div className="text-right">
                <div className="text-base font-bold text-slate-900">{res.quantity.toLocaleString()} {res.unit}</div>
                <Button size="sm" className="text-xs h-8 mt-1.5 bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
                  <Truck className="w-3.5 h-3.5 mr-1" /> Dispatch
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
