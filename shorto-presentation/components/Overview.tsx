import React from 'react';
import { Section } from './ui/Section';
import { AlertTriangle, BarChart3, Server, Database, Container } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <Section id="overview" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Project Definition */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Overview</h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Shorto is a distributed, <span className="text-primary-600 font-semibold">high-performance</span> URL shortening service with fast redirection and <span className="text-primary-600 font-semibold">high availability</span>.
          </p>
        </div>

        {/* Problems */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-6">
              <AlertTriangle />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Long and Unmanageable URLs</h3>
            <p className="text-slate-600">
              Many URLs contain complex tracking parameters, making them long, hard to read, and inconvenient to share, especially on platforms with character limits (SMS, Twitter, etc.).
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Lack of Click Tracking</h3>
            <p className="text-slate-600">
              When sharing raw URLs, it is difficult to track user clicks, measure campaign effectiveness, or analyze referral traffic.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-2xl font-bold mb-10 relative z-10 border-b border-slate-700 pb-4 inline-block">Core Tech Stack</h3>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-300">
                <Server />
                <h4 className="font-semibold uppercase tracking-wider text-sm">Backend</h4>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Java</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Spring Boot</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Caffeine (L1 Cache)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-300">
                <Database />
                <h4 className="font-semibold uppercase tracking-wider text-sm">Storage</h4>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Redis</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>AOF Persistence</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>30-day TTL</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-300">
                <Container />
                <h4 className="font-semibold uppercase tracking-wider text-sm">Deployment</h4>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Docker</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>Azure Container Apps</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
};