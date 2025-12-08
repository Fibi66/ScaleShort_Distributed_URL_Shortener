import React, { useState } from 'react';
import { Section } from './ui/Section';
import { Hash, ArrowRight, RefreshCw, CheckCircle, XCircle, ArrowDown } from 'lucide-react';

type Tab = 'shortening' | 'redirect' | 'collision';

export const Flows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('shortening');

  return (
    <Section id="flows" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Core Logic & Flows</h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1.5 rounded-xl inline-flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveTab('shortening')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'shortening' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              URL Shortening Flow
            </button>
            <button 
              onClick={() => setActiveTab('redirect')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'redirect' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Redirect Flow
            </button>
            <button 
              onClick={() => setActiveTab('collision')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'collision' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Collision Handling
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
                  alt="URL Shortening Flow Diagram"
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
                  alt="URL Redirect Flow Diagram"
                  className="w-[80%] h-auto mx-auto mix-blend-multiply"
                />
              </div>
              <p className="mt-6 text-slate-500 text-sm italic">
                * Sequence diagram detailing the L1 (Caffeine) and L2 (Redis) cache lookup strategy.
              </p>
            </div>
          )}

          {activeTab === 'collision' && (
            <div className="animate-fade-in w-full max-w-4xl">
              <div className="grid md:grid-cols-2 gap-12">
                
                {/* Algorithm Steps */}
                <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><Hash size={20} /></div>
                    Generation Algorithm
                  </h3>
                  <div className="space-y-4 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 -z-0"></div>

                    <div className="relative flex gap-4 items-start bg-white p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors z-10">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-md">01</div>
                      <div>
                        <strong className="block text-slate-800 text-sm uppercase tracking-wider mb-1">Hash</strong>
                        <span className="text-slate-600 text-sm">Perform SHA-256 Hash on the original URL.</span>
                      </div>
                    </div>

                    <div className="relative flex gap-4 items-start bg-white p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors z-10">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-md">02</div>
                      <div>
                        <strong className="block text-slate-800 text-sm uppercase tracking-wider mb-1">Extract</strong>
                        <span className="text-slate-600 text-sm">Take the first 6 bytes of the hash.</span>
                      </div>
                    </div>

                    <div className="relative flex gap-4 items-start bg-white p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors z-10">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-md">03</div>
                      <div>
                        <strong className="block text-slate-800 text-sm uppercase tracking-wider mb-1">Encode</strong>
                        <span className="text-slate-600 text-sm">Convert to Base62 (a-z, A-Z, 0-9). Result is a 6-char code.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visual Flow Chart */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 mb-6 text-center">Collision Handling Flow</h4>
                  
                  <div className="flex flex-col items-center space-y-3">
                    
                    {/* Step 1 */}
                    <div className="w-64 bg-primary-600 text-white py-3 px-4 rounded-lg text-center shadow-md font-medium text-sm">
                      Generate Short Code
                    </div>
                    
                    <ArrowDown size={20} className="text-slate-400" />
                    
                    {/* Step 2 */}
                    <div className="w-64 bg-blue-500 text-white py-3 px-4 rounded-lg text-center shadow-md font-medium text-sm">
                      Attempt Save (SET NX)
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 pt-2">
                       {/* Success Path */}
                       <div className="flex flex-col items-center">
                          <div className="h-8 w-0.5 bg-emerald-400 mb-1"></div>
                          <div className="w-full bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                             <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                               <CheckCircle size={16}/> Success
                             </div>
                             <div className="text-xs text-emerald-600">Return Code</div>
                          </div>
                       </div>

                       {/* Fail Path */}
                       <div className="flex flex-col items-center">
                          <div className="h-8 w-0.5 bg-rose-400 mb-1"></div>
                          <div className="w-full bg-rose-50 border border-rose-200 p-3 rounded-lg text-center relative">
                             <div className="flex items-center justify-center gap-2 text-rose-700 font-bold text-sm mb-1">
                               <XCircle size={16}/> Collision
                             </div>
                             <div className="text-xs text-rose-600">Retry with Salt</div>
                             
                             {/* Loopback Arrow Visualization */}
                             <div className="absolute top-1/2 -right-4 translate-x-full w-12 h-24 border-2 border-slate-300 border-l-0 rounded-r-xl -mt-10 pointer-events-none hidden md:block"></div>
                          </div>
                       </div>
                    </div>

                    {/* Retry Label */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm mt-4">
                      <RefreshCw size={12} />
                      <span className="font-mono">hash(url + "#1")</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};