import React from 'react';
import { Section } from './ui/Section';
import { GitBranch, PieChart, Settings } from 'lucide-react';

export const Future: React.FC = () => {
  return (
    <Section id="future" className="py-24 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-16 text-center">Future Improvements</h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* CI/CD */}
          <div className="group bg-slate-800 rounded-2xl p-1 shadow-lg hover:bg-slate-700 transition-colors duration-300">
            <div className="h-full bg-slate-800/50 rounded-xl p-8 border border-slate-700 group-hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <GitBranch size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Automated CI/CD</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Set up a workflow in <strong className="text-white">GitHub Actions</strong> to automatically build, test, and deploy the application whenever changes are pushed to main.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border-t border-slate-700/50 pt-4">
                <span>Code</span> → <span>Build</span> → <span>Deploy</span>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="group bg-slate-800 rounded-2xl p-1 shadow-lg hover:bg-slate-700 transition-colors duration-300">
             <div className="h-full bg-slate-800/50 rounded-xl p-8 border border-slate-700 group-hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <PieChart size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Enhanced Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Implement a dashboard to monitor user behavior, including click counts, referral sources, and campaign performance metrics for data-driven decisions.
              </p>
              {/* Fake Mini Chart UI */}
              <div className="flex items-end gap-1 h-8 border-b border-slate-600 pb-1 w-full opacity-50">
                <div className="bg-emerald-500 w-1/5 h-4 rounded-t-sm"></div>
                <div className="bg-emerald-500 w-1/5 h-6 rounded-t-sm"></div>
                <div className="bg-emerald-500 w-1/5 h-3 rounded-t-sm"></div>
                <div className="bg-emerald-500 w-1/5 h-8 rounded-t-sm"></div>
                <div className="bg-emerald-500 w-1/5 h-5 rounded-t-sm"></div>
              </div>
            </div>
          </div>

          {/* Management */}
          <div className="group bg-slate-800 rounded-2xl p-1 shadow-lg hover:bg-slate-700 transition-colors duration-300">
             <div className="h-full bg-slate-800/50 rounded-xl p-8 border border-slate-700 group-hover:border-primary-500/50 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Advanced Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Introduce a management dashboard that allows administrators to update, disable, or modify shortened links even after distribution.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-24 text-center border-t border-slate-800 pt-12">
          <p className="text-2xl font-semibold text-white mb-6">Thank you!</p>
          <p className="text-slate-500 text-sm">&copy; 2025 Zhifei Ye • Northeastern University • Shorto Demo</p>
        </div>
      </div>
    </Section>
  );
};