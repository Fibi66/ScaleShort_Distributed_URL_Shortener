import React from 'react';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-b from-white to-slate-100">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900">
          Shorto
        </h1>
        
        <p className="text-2xl md:text-3xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
          A High-Performance <span className="text-primary-600 font-semibold">URL Shortening Service</span>
        </p>

        <div className="mt-12 pt-8 border-t border-slate-200/60 inline-flex flex-col items-center space-y-2">
          <p className="text-lg font-medium text-slate-900">Zhifei Ye</p>
          <p className="text-slate-500">Northeastern University</p>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-400">
        <ArrowDown size={32} />
      </div>
    </header>
  );
};