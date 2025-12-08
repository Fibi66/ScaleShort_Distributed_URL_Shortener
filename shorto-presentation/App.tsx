import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Architecture } from './components/Architecture';
import { Flows } from './components/Flows';
import { StorageAndDeploy } from './components/StorageAndDeploy';
import { Future } from './components/Future';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Architecture />
        <Flows />
        <StorageAndDeploy />
        <Future />
      </main>
    </div>
  );
}

export default App;