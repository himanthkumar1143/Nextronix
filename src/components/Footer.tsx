/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Github, Twitter, Linkedin, Rss, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPage, setActiveCategory } = useApp();

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    setPage('products');
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Info and brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
              <div className="p-2 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nextronix
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Pioneering high-spec responsive tech hardware. We design physical desk companions, tactile linear typing instruments, and micro-acoustics.
            </p>

          </div>

          {/* Column 2: Corporate Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Help & Info</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setPage('contact')} className="hover:text-emerald-400 transition-colors">Contact Support</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-emerald-400 transition-colors">Features</button></li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="https://github.com/lasyapriya26" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 w-fit"
                >
                  <Github className="h-4 w-4" /> Github
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/lasya-priya-dasari-080384409/?isSelfProfile=false" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 w-fit"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nextronix Hardware Labs. Distributed securely across full-stack sandbox endpoints. All simulated transactions are secure.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
