import React, { useState } from 'react';
import { Section } from './ui/Section';

type Tab = 'shortening' | 'redirect';

export const Flows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('shortening');

  return (
    <Section id="flows" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">API Flows</h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1.5 rounded-xl inline-flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTab('shortening')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'shortening' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Shortening Flow
            </button>
            <button
              onClick={() => setActiveTab('redirect')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'redirect' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Retrieving Flow
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm min-h-[500px] flex items-center justify-center relative overflow-hidden">
          
          {activeTab === 'shortening' && (
            <div className="animate-fade-in flex flex-col items-center w-full">
              <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 p-2">
                <img
                  src="components/1.png"
                  alt="Shortening Flow Diagram"
                  className="w-[80%] h-auto mx-auto mix-blend-multiply"
                />
              </div>
              <p className="mt-6 text-slate-500 text-sm italic">
                * Sequence diagram illustrating the interaction between Client, Controller, Service, and Redis.
              </p>
            </div>
          )}

          {activeTab === 'redirect' && (
            <div className="animate-fade-in flex flex-col items-center w-full">
               <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 p-2">
                <img
                  src="components/2.png"
                  alt="URL Retrieving Flow Diagram"
                  className="w-[80%] h-auto mx-auto mix-blend-multiply"
                />
              </div>
              <p className="mt-6 text-slate-500 text-sm italic">
                * Sequence diagram detailing the L1 (Caffeine) and L2 (Redis) cache lookup strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};