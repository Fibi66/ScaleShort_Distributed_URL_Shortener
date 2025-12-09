import React from 'react';
import { ArrowDown } from 'lucide-react';
import demoVideo from '../pic/demoVideo.mp4';

export const Hero: React.FC = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-b from-white to-slate-100">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 space-y-8">

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900">
          Shorto
        </h1>

        <p className="text-2xl md:text-3xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
          A High-Performance Distributed <span className="text-primary-600 font-semibold">URL Shortening Service</span>
        </p>

        {/* Live URL */}
        <a
          href="https://s.zhifeiye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          https://s.zhifeiye.com/
        </a>

        {/* Demo Video */}
        <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 w-full">
          <video
            src={demoVideo}
            controls
            autoPlay
            muted
            loop
            className="w-full h-auto"
          />
        </div>

      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-400">
        <ArrowDown size={32} />
      </div>
    </header>
  );
};