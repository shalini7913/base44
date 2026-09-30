import React from 'react';
import { useDisaster } from '@/services/DisasterContext';
import { Bot, Cpu, CheckCircle2, Activity, Play, Zap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Agents() {
  const { agents } = useDisaster();

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Bot className="w-7 h-7 text-sky-600" />
          <span>Autonomous AI Disaster Response Agents</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated agents monitoring sensor telemetry, triaging SOS broadcasts, optimizing evacuation paths, and managing supply logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md space-y-5 flex flex-col justify-between transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {agent.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {agent.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{agent.name}</h3>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <span className="block text-emerald-700 font-extrabold text-sm">{agent.accuracy}</span>
                  <span className="text-[11px]">Accuracy</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <span className="text-sky-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Active Automated Task:
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">{agent.action}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Processed: <strong className="text-slate-900">{agent.processedCount}</strong> incidents</span>
              <Button size="sm" variant="outline" className="text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-50">
                <Cpu className="w-3.5 h-3.5 mr-1 text-sky-600" /> View Telemetry
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
