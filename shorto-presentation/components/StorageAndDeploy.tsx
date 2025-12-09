import React from 'react';
import { Section } from './ui/Section';
import { Database, Clock } from 'lucide-react';

export const StorageAndDeploy: React.FC = () => {
  return (
    <Section id="storage" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Storage Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Data Storage & Persistence</h2>
              <p className="text-slate-600 mb-8">
                Optimized for high-speed read/write operations using Redis key-value store with durability guarantees.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-primary-500">
                  <h4 className="font-bold text-slate-900">Forward Mapping</h4>
                  <code className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded mt-1 block w-fit">c:&#123;code&#125; → &#123;url&#125;</code>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-500">
                  <h4 className="font-bold text-slate-900">Reverse Index (Deduplication)</h4>
                  <code className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-1 block w-fit">u:&#123;url&#125; → &#123;code&#125;</code>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <StorageCard icon={<Database size={20}/>} title="Database" value="Redis Key-Value" />
              <StorageCard icon={<Clock size={20}/>} title="TTL Policy" value="30 Days (Default)" />
            </div>
          </div>
        </div>

        {/* Deployment Section (Slide 9) */}
        <div id="deployment" className="pt-12 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Cloud Deployment</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
             <div className="bg-blue-600 text-white p-6 rounded-xl text-center w-full md:w-64">
                <div className="text-4xl mb-2">🐳</div>
                <div className="font-bold text-xl">Docker</div>
                <div className="text-blue-100 text-sm mt-1">Containerization</div>
             </div>
             <div className="hidden md:block text-slate-300">➜</div>
             <div className="bg-sky-500 text-white p-6 rounded-xl text-center w-full md:w-64">
                <div className="text-4xl mb-2">☁️</div>
                <div className="font-bold text-xl">Azure</div>
                <div className="text-sky-100 text-sm mt-1">Container Apps</div>
             </div>
          </div>

        </div>

      </div>
    </Section>
  );
};

const StorageCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
    <div className="text-primary-500 mb-3">{icon}</div>
    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</div>
    <div className="text-slate-900 font-bold">{value}</div>
  </div>
);

