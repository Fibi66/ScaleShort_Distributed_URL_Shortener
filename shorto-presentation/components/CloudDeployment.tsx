import React from 'react';
import { Section } from './ui/Section';

export const CloudDeployment: React.FC = () => {
  return (
    <Section id="deployment" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Cloud Deployment</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
           <div className="bg-blue-600 text-white p-4 rounded-xl text-center w-full md:w-52 h-32 flex flex-col items-center justify-center shadow-md">
              <div className="text-3xl mb-1">🐳</div>
              <div className="font-bold text-sm">Docker</div>
              <div className="text-blue-100 text-xs mt-1">Containerization</div>
           </div>
           <div className="hidden md:block text-slate-400">➜</div>
           <div className="bg-sky-500 text-white p-4 rounded-xl text-center w-full md:w-52 h-32 flex flex-col items-center justify-center shadow-md">
              <div className="text-3xl mb-1">☁️</div>
              <div className="font-bold text-sm">Azure</div>
              <div className="text-sky-100 text-xs mt-1">Container Apps</div>
           </div>
        </div>
      </div>
    </Section>
  );
};
