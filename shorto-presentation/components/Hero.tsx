import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import demoVideo from '../pic/demoVideo.mp4';
import toolongImg from '../pic/toolong.jpg';
import shortbetterImg from '../pic/shortbetter.jpg';

export const Hero: React.FC = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-b from-white to-slate-100">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 space-y-6">

        {/* Problem Statement + Before/After */}
        <div className="flex justify-center mb-6 mt-8">
          <span className="px-6 py-3 bg-slate-100 border border-slate-300 rounded-full text-xl text-slate-600 shadow-sm">
            URLs too long to share?
          </span>
        </div>

        {/* Before / After Comparison */}
        <div className="flex flex-col items-center gap-6 mb-8">
          {/* Before */}
          <div className="flex flex-col items-center">
            <span className="mb-3 px-6 py-2 bg-rose-100 text-rose-600 font-bold text-xl rounded-full">
              BEFORE
            </span>
            <img src={toolongImg} alt="Before - Long URLs" className="max-w-4xl w-full h-auto" />
          </div>

          {/* Arrow Down */}
          <div className="flex items-center justify-center text-indigo-500">
            <ArrowDown size={48} strokeWidth={3} />
          </div>

          {/* After */}
          <div className="flex flex-col items-center">
            <span className="mb-3 px-6 py-2 bg-emerald-100 text-emerald-600 font-bold text-xl rounded-full">
              AFTER
            </span>
            <img src={shortbetterImg} alt="After - Short URLs" className="max-w-4xl w-full h-auto" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900">
          Shorto
        </h1>

        <p className="text-lg md:text-xl text-slate-600 font-light">
          A High-Performance Distributed <span className="text-indigo-600 font-semibold">URL Shortener</span>
        </p>

        {/* Demo Video */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 w-full">
          <video
            src={demoVideo}
            controls
            autoPlay
            muted
            loop
            className="w-full h-auto"
          />
        </div>

        {/* Live URL */}
        <a
          href="https://s.zhifeiye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          https://s.zhifeiye.com/
        </a>

      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-400">
        <ArrowDown size={32} />
      </div>
    </header>
  );
};