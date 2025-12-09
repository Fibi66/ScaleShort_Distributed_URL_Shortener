import React, { useState, useEffect } from 'react';
import { Section } from './ui/Section';
import { Hash, RefreshCw, CheckCircle, XCircle, ArrowDown, Frown, Lightbulb, AlertTriangle, PartyPopper } from 'lucide-react';

// Animated character component
const ThinkingCharacter: React.FC<{ mood: 'thinking' | 'sad' | 'idea' | 'happy'; text: string }> = ({ mood, text }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (mood === 'thinking') {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [mood]);

  const faces = {
    thinking: (
      <div className="relative">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-1">
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
            </div>
            <div className="w-4 h-2 border-b-2 border-slate-800 rounded-full"></div>
          </div>
        </div>
        <div className="absolute -top-8 -right-2 text-2xl animate-bounce">?</div>
      </div>
    ),
    sad: (
      <div className="relative">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <Frown className="w-8 h-8 text-slate-800" />
        </div>
        <div className="absolute -top-6 -right-2 text-xl">😰</div>
      </div>
    ),
    idea: (
      <div className="relative">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-1">
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
            </div>
            <div className="w-3 h-1.5 bg-slate-800 rounded-full"></div>
          </div>
        </div>
        <Lightbulb className="absolute -top-8 -right-2 w-8 h-8 text-yellow-500 animate-pulse" />
      </div>
    ),
    happy: (
      <div className="relative">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-1">
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
            </div>
            <div className="w-4 h-2 border-t-2 border-slate-800 rounded-full mt-1"></div>
          </div>
        </div>
        <PartyPopper className="absolute -top-6 -right-2 w-6 h-6 text-purple-500" />
      </div>
    ),
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {faces[mood]}
      <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 max-w-xs text-center relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
        <p className="text-sm text-slate-700">
          {text}{mood === 'thinking' ? dots : ''}
        </p>
      </div>
    </div>
  );
};

// STAR Story Step
const StoryStep: React.FC<{
  step: number;
  label: string;
  title: string;
  content: React.ReactNode;
  color: string;
  isActive: boolean;
}> = ({ step, label, title, content, color, isActive }) => (
  <div className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg border border-white/20`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{label}</span>
        <h4 className="text-white font-bold text-lg">{title}</h4>
      </div>
      <div className="text-white/90">{content}</div>
    </div>
  </div>
);

export const CollisionHandling: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Section id="collision" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Problem Encountered & Solution</h2>
        <p className="text-slate-500 text-center mb-12">My journey solving the URL shortening challenge</p>

        {/* STAR Story Section */}
        <div className="mb-16">
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {['S', 'T', 'A', 'R'].map((letter, idx) => (
              <button
                key={letter}
                onClick={() => setActiveStep(idx)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${
                  activeStep === idx
                    ? 'bg-indigo-600 text-white scale-110'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left: Animated Character */}
            <div className="flex justify-center py-8">
              {activeStep === 0 && <ThinkingCharacter mood="thinking" text="8 characters is too long!" />}
              {activeStep === 1 && <ThinkingCharacter mood="sad" text="Hash collision!" />}
              {activeStep === 2 && <ThinkingCharacter mood="idea" text="I can use salt method." />}
              {activeStep === 3 && <ThinkingCharacter mood="happy" text="Successfully shortened the code!" />}
            </div>

            {/* Right: STAR Content */}
            <div>
              {activeStep === 0 && (
                <StoryStep
                  step={0}
                  label="SITUATION"
                  title="The 8-Character Problem"
                  color="from-blue-500 to-blue-600"
                  isActive={true}
                  content={
                    <div className="space-y-2">
                      <p>Initially used database auto-increment ID for short URLs.</p>
                      <div className="bg-white/10 rounded-lg p-3 font-mono text-sm">
                        <span className="text-white/60">example:</span> s.zhifeiye.com/<span className="text-yellow-300">12345678</span>
                      </div>
                      <p className="text-white/70 text-sm">Too long! Not user-friendly for sharing.</p>
                    </div>
                  }
                />
              )}
              {activeStep === 1 && (
                <StoryStep
                  step={1}
                  label="TASK"
                  title="Hash Collision Challenge"
                  color="from-orange-500 to-red-500"
                  isActive={true}
                  content={
                    <div className="space-y-2">
                      <p>Switched to SHA-256 hash for shorter codes, but...</p>
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <AlertTriangle className="text-yellow-300" />
                        <span className="text-sm">Different URLs can produce same 6-char code!</span>
                      </div>
                      <p className="text-white/70 text-sm">Need to handle hash collisions gracefully.</p>
                    </div>
                  }
                />
              )}
              {activeStep === 2 && (
                <StoryStep
                  step={2}
                  label="ACTION"
                  title="Salt-Based Retry"
                  color="from-purple-500 to-indigo-600"
                  isActive={true}
                  content={
                    <div className="space-y-2">
                      <p>Implemented collision detection with salt retry:</p>
                      <div className="bg-white/10 rounded-lg p-3 font-mono text-xs space-y-1">
                        <div><span className="text-green-300">1.</span> hash(url) → check if exists</div>
                        <div><span className="text-yellow-300">2.</span> collision? → hash(url + "#1")</div>
                        <div><span className="text-blue-300">3.</span> still collision? → hash(url + "#2")</div>
                      </div>
                    </div>
                  }
                />
              )}
              {activeStep === 3 && (
                <StoryStep
                  step={3}
                  label="RESULT"
                  title="Clean 6-Character URLs"
                  color="from-emerald-500 to-teal-600"
                  isActive={true}
                  content={
                    <div className="space-y-2">
                      <p>Achieved short, collision-free URLs!</p>
                      <div className="bg-white/10 rounded-lg p-3 font-mono text-sm">
                        <span className="text-white/60">result:</span> s.zhifeiye.com/<span className="text-green-300">aB3xY9</span>
                      </div>
                      <p className="text-white/70 text-sm">62^6 = 56 billion possible combinations</p>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Original Generation Algorithm Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
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
      </div>
    </Section>
  );
};
