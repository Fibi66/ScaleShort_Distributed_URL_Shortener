import React from 'react';
import { Section } from './ui/Section';
import { Server, Database, Container } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <Section id="overview" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tech Stack - Compact */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

          <h3 className="text-lg font-bold mb-4 relative z-10 text-primary-300">Core Tech Stack</h3>

          <div className="flex flex-wrap gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-primary-400" />
              <span className="text-slate-300 text-sm">Java / Spring Boot / Caffeine</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-primary-400" />
              <span className="text-slate-300 text-sm">Redis</span>
            </div>
            <div className="flex items-center gap-2">
              <Container size={16} className="text-primary-400" />
              <span className="text-slate-300 text-sm">Docker / Azure</span>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
};