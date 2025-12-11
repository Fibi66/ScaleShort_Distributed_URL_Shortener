import React from 'react';
import { AboutMe } from './components/AboutMe';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Architecture } from './components/Architecture';
import { Flows } from './components/Flows';
import { CollisionHandling } from './components/CollisionHandling';
import { CloudDeployment } from './components/CloudDeployment';
import { StorageAndDeploy } from './components/StorageAndDeploy';
import { Future } from './components/Future';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Personal Introduction - About Me */}
      <AboutMe />

      {/* Shorto Project Presentation */}
      <main>
        <Hero />
        <Overview />
        <Architecture />
        <CloudDeployment />
        <Flows />
        <StorageAndDeploy />
        <CollisionHandling />
        <Future />
      </main>
    </div>
  );
}

export default App;