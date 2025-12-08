import React, { useState, useEffect } from 'react';
import { Link } from 'lucide-react';
import { NavItem } from '../types';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Overview', id: 'overview' },
    { label: 'Architecture', id: 'architecture' },
    { label: 'Core Flows', id: 'flows' },
    { label: 'Storage', id: 'storage' },
    { label: 'Deployment', id: 'deployment' },
    { label: 'Future', id: 'future' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <Link size={20} strokeWidth={3} />
          </div>
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
            Shorto
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};