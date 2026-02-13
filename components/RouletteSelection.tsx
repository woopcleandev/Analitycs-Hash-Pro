
import React from 'react';
import { ROULETTE_OPTIONS } from '../constants';
import { RouletteType } from '../types';

interface SelectionProps {
  onSelect: (option: RouletteType) => void;
}

const RouletteSelection: React.FC<SelectionProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen p-6 flex flex-col">
      <header className="mb-10 text-center relative">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#facc15]"></div>
          <h1 className="font-display text-xs tracking-widest text-primary uppercase font-bold">Analitycs_Hash_v5.0</h1>
        </div>
        <h2 className="text-3xl font-display font-black tracking-tighter text-white italic">SELECT SYSTEM</h2>
        <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Procedural Intelligence Enabled</p>
      </header>

      <div className="flex-1 space-y-4">
        {ROULETTE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className="w-full group relative overflow-hidden rounded-2xl border border-white/5 bg-panel-dark p-4 transition-all hover:border-primary/40 hover:bg-white/5 active:scale-95 shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-black/40 p-2 flex items-center justify-center relative">
                <img 
                  src={option.image} 
                  alt={option.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10" 
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex-1 text-left">
                <p className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">{option.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">NEURAL_SYNC_READY</p>
              </div>
              <span className="material-symbols-outlined text-slate-700 group-hover:text-primary transition-colors">arrow_forward_ios</span>
            </div>
            {/* Efeito de brilho ao passar o mouse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
          </button>
        ))}
      </div>

      <footer className="mt-10 py-6 border-t border-white/5">
        <p className="text-[8px] text-center font-display tracking-[0.4em] text-slate-600 uppercase font-bold">
          Full Logic Environment • No Cloud Dependency
        </p>
      </footer>
    </div>
  );
};

export default RouletteSelection;
