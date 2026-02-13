
import React, { useState, useEffect } from 'react';
import { AppScreen, RouletteType } from './types';
import AuthGate from './components/AuthGate';
import RouletteSelection from './components/RouletteSelection';
import NeuralLoading from './components/NeuralLoading';
import PredictionResult from './components/PredictionResult';
import AdminArea from './components/AdminArea';
import { MASTER_ADMIN_EMAIL } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.AUTH);
  const [selectedRoulette, setSelectedRoulette] = useState<RouletteType | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setScreen(AppScreen.SELECTION);
  };

  const handleSelectRoulette = (roulette: RouletteType) => {
    setSelectedRoulette(roulette);
    setScreen(AppScreen.LOADING);
  };

  const handleLoadingComplete = () => {
    setScreen(AppScreen.RESULT);
  };

  const handleBackToSelection = () => {
    setScreen(AppScreen.SELECTION);
    setSelectedRoulette(null);
  };

  const handleReanalyze = () => {
    setScreen(AppScreen.LOADING);
  };

  const handleOpenAdmin = () => {
    setScreen(AppScreen.ADMIN);
  };

  const isAdmin = userEmail === MASTER_ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary/30 overflow-x-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none"></div>
      
      <main className="relative z-10 min-h-screen flex flex-col items-center">
        {screen === AppScreen.AUTH && (
          <AuthGate onSuccess={handleAuthSuccess} />
        )}

        {screen === AppScreen.SELECTION && (
          <div className="w-full flex flex-col items-center">
            {isAdmin && (
              <div className="w-full max-w-md px-6 pt-6">
                <button 
                  onClick={handleOpenAdmin}
                  className="w-full py-2 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest italic">Área Administrativa Master</span>
                </button>
              </div>
            )}
            <RouletteSelection onSelect={handleSelectRoulette} />
          </div>
        )}

        {screen === AppScreen.LOADING && (
          <NeuralLoading 
            selectedRoulette={selectedRoulette} 
            onComplete={handleLoadingComplete} 
          />
        )}

        {screen === AppScreen.RESULT && selectedRoulette && (
          <PredictionResult 
            roulette={selectedRoulette} 
            onExit={handleBackToSelection}
            onReanalyze={handleReanalyze}
          />
        )}

        {screen === AppScreen.ADMIN && isAdmin && (
          <AdminArea onBack={handleBackToSelection} />
        )}
      </main>

      {/* Decorative Overlays */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="fixed bottom-0 left-0 w-full h-px bg-white/5"></div>
    </div>
  );
};

export default App;
