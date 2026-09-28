'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Appliance {
  id: string;
  name: string;
  watts: number;
  typicalQty: number;
  icon: string;
}

const commonAppliances: Appliance[] = [
  { id: 'led_lights', name: 'LED Bulbs (10W)', watts: 10, typicalQty: 8, icon: '💡' },
  { id: 'fans', name: 'Ceiling Fans (75W)', watts: 75, typicalQty: 3, icon: '🌀' },
  { id: 'tv', name: 'Smart TV + Decoder (120W)', watts: 120, typicalQty: 1, icon: '📺' },
  { id: 'fridge', name: 'Inverter Refrigerator (250W)', watts: 250, typicalQty: 1, icon: '🧊' },
  { id: 'laptops', name: 'Laptops / Routers (80W)', watts: 80, typicalQty: 2, icon: '💻' },
  { id: 'freezer', name: 'Deep Freezer (350W)', watts: 350, typicalQty: 0, icon: '❄️' },
];

export const BatteryCalculator: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    led_lights: 6,
    fans: 2,
    tv: 1,
    fridge: 1,
    laptops: 2,
    freezer: 0,
  });
  const [backupHours, setBackupHours] = useState<number>(8);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  // Calculations
  const totalWatts = commonAppliances.reduce(
    (sum, app) => sum + (quantities[app.id] || 0) * app.watts,
    0
  );

  // Inverter recommendation (add 30% safety surge headroom)
  const requiredInverterVa = Math.ceil((totalWatts * 1.35) / 500) * 500;
  const inverterRatingKva = Math.max(1, (requiredInverterVa / 1000)).toFixed(1);

  // Total energy in Watt-Hours (Wh)
  const totalEnergyWh = totalWatts * backupHours;

  // Battery Ah needed based on 48V or 24V system with 85% depth of discharge
  const systemVoltage = totalWatts > 1500 ? 48 : 24;
  const batteryAhNeeded = Math.round(totalEnergyWh / (systemVoltage * 0.85));
  const batteryKwh = (totalEnergyWh / 1000).toFixed(1);

  return (
    <section id="battery-calculator" className="bg-[#0D1B2A] text-white py-16 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Intelligent Sizing Tool
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Battery &amp; Inverter Power Sizer
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Not sure what size battery or inverter your home or workplace requires? Select your key appliances and desired backup runtime below.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Appliance Selection Box */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              1. Select Active Appliances During Outage
            </h3>

            <div className="space-y-3">
              {commonAppliances.map((app) => {
                const count = quantities[app.id] || 0;
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={app.name}>
                        {app.icon}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">{app.name}</div>
                        <div className="text-xs text-slate-400">{app.watts}W each</div>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => updateQty(app.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold transition-colors cursor-pointer"
                        aria-label={`Decrease ${app.name}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                        {count}
                      </span>
                      <button
                        onClick={() => updateQty(app.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold transition-colors cursor-pointer"
                        aria-label={`Increase ${app.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Runtime slider */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Desired Continuous Runtime
                </span>
                <span className="text-sm font-extrabold text-amber-400">
                  {backupHours} Hours Backup
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={backupHours}
                onChange={(e) => setBackupHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#CC0000]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>2 hrs (Quick cover)</span>
                <span>8 hrs (Overnight)</span>
                <span>24 hrs (Full day)</span>
              </div>
            </div>
          </div>

          {/* Sizing Recommendation Summary */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-red-900/40 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Calculated Engineering Spec
            </div>
            <h3 className="text-lg font-black text-white">
              Recommended Power Configuration
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div>
                  <div className="text-xs text-slate-400">Total Concurrent Load</div>
                  <div className="text-lg font-black text-white tabular-nums">{totalWatts} Watts</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Energy Required</div>
                  <div className="text-lg font-black text-amber-400 tabular-nums">{batteryKwh} kWh</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  Optimal Battery Sizing
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  {systemVoltage}V · ~{batteryAhNeeded}Ah LiFePO4
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Provides safe {backupHours} hours runtime at 85% depth of discharge with zero damage to cell health.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Hybrid Inverter
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  {inverterRatingKva} kVA / {systemVoltage}V Pure Sine Wave
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Provides adequate surge headroom for motor starts (fridge compressor &amp; fans).
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/products?category=Accessories"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#CC0000] hover:bg-[#B30000] text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all active:scale-[0.98]"
              >
                <span>View Matching Batteries &amp; Equipment</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatteryCalculator;
