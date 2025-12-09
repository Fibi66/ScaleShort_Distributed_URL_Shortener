import React from 'react';
import { Section } from './ui/Section';
import { Smartphone, Globe, Database, Cpu, ArrowRight } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <Section id="architecture" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">System Architecture</h2>

        <div className="flex items-center justify-center gap-4">

          {/* Client */}
          <div className="relative z-10 bg-white p-5 rounded-xl shadow-md border border-slate-200 w-52 h-32 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-700">
              <Smartphone size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Client</h3>
            <p className="text-xs text-slate-500">Browser / Mobile</p>
          </div>

          {/* Arrow */}
          <div className="text-slate-400">
            <ArrowRight size={24} />
          </div>

          {/* App */}
          <div className="relative z-10 bg-white p-5 rounded-xl shadow-md border-t-4 border-primary-500 w-52 h-32 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mb-2 text-primary-600">
              <Globe size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Spring Boot App</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-1 rounded">REST | Service</p>
          </div>

          {/* Arrow */}
          <div className="text-slate-400">
            <ArrowRight size={24} />
          </div>

          {/* Caching */}
          <div className="relative z-10 bg-white p-5 rounded-xl shadow-md border-t-4 border-amber-500 w-52 h-32 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-2 text-amber-600">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Caching Layer</h3>
            <p className="text-xs text-slate-500 mt-1">L1: Caffeine | L2: Redis</p>
          </div>

          {/* Arrow */}
          <div className="text-slate-400">
            <ArrowRight size={24} />
          </div>

          {/* Storage */}
          <div className="relative z-10 bg-slate-800 p-5 rounded-xl shadow-xl w-52 h-32 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300 group">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mb-2 text-white group-hover:bg-primary-600 transition-colors">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Redis Storage</h3>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-white font-semibold px-2 py-1 bg-emerald-600 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
               AOF Enabled
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
};