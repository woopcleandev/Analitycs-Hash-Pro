
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, RouletteType, MarketStatus, CrazyTimeSymbol } from '../types';
import { generatePrediction, generateCrazyTimePredictions, generateAviatorPrediction, generateBlazePrediction } from '../utils/roulette';
import { CRAZY_TIME_SYMBOLS } from '../constants';
import VideoPlayer from './VideoPlayer';
import { speak } from '../utils/tts';

interface ResultProps {
  roulette: RouletteType;
  onExit: () => void;
  onReanalyze: () => void;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const getResultStyles = (res: string | number, isGameShow: boolean) => {
  if (!isGameShow) {
    const n = Number(res);
    if (n === 0) return { bg: 'bg-green-600/20', border: 'border-green-500/50', text: 'text-green-400', solidBg: 'bg-green-600' };
    if (RED_NUMBERS.includes(n)) return { bg: 'bg-accent-red/20', border: 'border-accent-red/50', text: 'text-accent-red', solidBg: 'bg-accent-red' };
    return { bg: 'bg-slate-900/40', border: 'border-slate-700/50', text: 'text-slate-100', solidBg: 'bg-neutral-900' };
  }
  return { bg: 'bg-zinc-800/40', border: 'border-white/10', text: 'text-white', solidBg: 'bg-zinc-800' };
};

const PredictionResult: React.FC<ResultProps> = ({ roulette, onExit, onReanalyze }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [aviatorData, setAviatorData] = useState<any>(null);
  const [blazeData, setBlazeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Pequeno delay para simular o "recebimento" dos dados neurais e evitar saltos de layout
    const timer = setTimeout(() => {
      if (roulette.id === 'blaze_double') {
        const data = generateBlazePrediction();
        setBlazeData(data);
        if (!audioStartedRef.current) {
          const colorName = data.mainColor === 'red' ? 'Vermelho' : 'Preto';
          speak(`Sinal detectado para Blaze Double. Cor principal ${colorName} com proteção obrigatória no Branco.`);
          audioStartedRef.current = true;
        }
      } else if (roulette.id === 'aviator_betbr') {
        const data = generateAviatorPrediction();
        setAviatorData(data);
        if (!audioStartedRef.current) {
          speak(`Sinal de Crash detectado. Sair em ${data.exitPoint}. Potencial de vela até ${data.maxVela}.`);
          audioStartedRef.current = true;
        }
      } else if (roulette.id === 'crazy_time_main') {
        const results = generateCrazyTimePredictions(roulette);
        setPredictions(results);
        if (!audioStartedRef.current) {
          speak(`Análise Crazy Time concluída. Verifique os alvos dinâmicos no painel.`);
          audioStartedRef.current = true;
        }
      } else {
        const p1 = generatePrediction(roulette);
        let p2 = generatePrediction(roulette);
        let attempts = 0;
        while (p2.mainResult === p1.mainResult && attempts < 50) {
          p2 = generatePrediction(roulette);
          attempts++;
        }
        setPredictions([p1, p2]);
        if (!audioStartedRef.current) {
          speak(`Análise concluída para ${roulette.name}. Números vizinhos mapeados para cobertura estratégica.`);
          audioStartedRef.current = true;
        }
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [roulette]);

  const handleReanalyzeClick = () => {
    audioStartedRef.current = false;
    onReanalyze();
  };

  // Estado de carregamento interno (evita crashes por dados nulos)
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
           <span className="material-symbols-outlined text-primary text-5xl animate-spin">radar</span>
           <p className="font-display text-[10px] text-primary/60 tracking-[0.4em] animate-pulse uppercase">Syncing Neural Data...</p>
        </div>
      </div>
    );
  }

  // --- Layout Blaze Double ---
  if (roulette.id === 'blaze_double' && blazeData) {
    const isRed = blazeData.mainColor === 'red';
    const colorImg = isRed ? 'https://blaze.bet.br/images/roulette/red-0.svg' : 'https://blaze.bet.br/images/roulette/black-0.svg';
    const whiteImg = 'https://blaze.bet.br/images/roulette/white.svg';

    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 bg-black overflow-y-auto">
        <header className="flex flex-col items-center justify-center pt-8 mb-8">
           <img src={roulette.image} alt="Blaze" className="w-32 mb-4" />
           <h1 className="font-display text-xl text-white tracking-widest font-black uppercase italic">
             DOUBLE NEURAL SENSE
           </h1>
           <div className="w-16 h-1 bg-[#f12c4c] mt-1 rounded-full shadow-[0_0_15px_rgba(241,44,76,0.5)]"></div>
        </header>

        <div className="flex-1 space-y-6">
          <div className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 p-8 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-6 right-6 flex flex-col items-end">
               <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Confidence</span>
               <span className="text-xs font-mono text-green-500 font-black">{blazeData.accuracy}%</span>
            </div>

            <div className="w-full flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-display text-white/40 uppercase tracking-[0.4em] mb-4 font-bold">Entrada na Cor</span>
                <div className="relative group">
                  <div className={`absolute -inset-4 ${isRed ? 'bg-[#f12c4c]/20' : 'bg-white/10'} rounded-full blur-xl animate-pulse`}></div>
                  <img src={colorImg} alt={blazeData.mainColor} className="w-28 h-28 relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
                </div>
                <span className={`mt-4 font-display font-black uppercase text-xl italic tracking-tighter ${isRed ? 'text-[#f12c4c]' : 'text-white'}`}>
                  {isRed ? 'VERMELHO (2x)' : 'PRETO (2x)'}
                </span>
              </div>

              <div className="w-full flex flex-col items-center pt-4 border-t border-white/5">
                <span className="text-[8px] font-display text-white/40 uppercase tracking-[0.4em] mb-3">Proteção Obrigatória</span>
                <div className="flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                   <img src={whiteImg} alt="White" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                   <div className="flex flex-col">
                      <span className="text-white font-display font-black text-sm italic uppercase tracking-tighter">BRANCO (14x)</span>
                      <span className="text-[7px] text-green-500 font-mono font-bold uppercase tracking-widest">Neural Trigger active</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {blazeData.isKeyWindow && (
            <div className="bg-green-600/10 rounded-2xl p-4 border border-green-500/30 flex items-center space-x-4 animate-bounce">
               <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-500 text-2xl">verified</span>
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-display text-white font-black uppercase tracking-wider leading-tight">
                   HORÁRIO CHAVE DETECTADO!
                 </p>
                 <p className="text-[8px] text-white/40 font-mono mt-0.5 uppercase tracking-tighter">Probabilidade de Branco aumentada significativamente</p>
               </div>
            </div>
          )}
        </div>

        <div className="mt-auto pb-10">
          <button onClick={handleReanalyzeClick} className="w-full h-16 bg-[#f12c4c] rounded-3xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_10px_40px_rgba(241,44,76,0.3)]">
            <span className="material-symbols-outlined text-white font-bold">insights</span>
            <span className="font-display text-sm font-black text-white uppercase italic tracking-wider">RECALCULAR PADRÕES</span>
          </button>
          <button onClick={onExit} className="w-full mt-6 text-[10px] text-white/20 font-mono uppercase tracking-[0.4em] hover:text-white/50 transition-colors text-center">VOLTAR AO SISTEMA</button>
        </div>
      </div>
    );
  }

  // --- Layout Aviator ---
  if (roulette.id === 'aviator_betbr' && aviatorData) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 bg-black overflow-y-auto">
        <header className="flex flex-col items-center justify-center pt-8 mb-8">
           <img src={roulette.image} alt="Aviator" className="w-24 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
           <h1 className="font-display text-2xl text-white italic tracking-tighter font-black uppercase">AVIATOR SIGNAL</h1>
           <div className="w-16 h-1 bg-red-600 mt-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
        </header>

        <div className="flex-1 space-y-6">
          <div className="bg-[#0f0f0f] rounded-[2.5rem] border border-red-900/30 p-10 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">{aviatorData.timestamp}</div>
            <span className="text-xs font-display text-red-500 uppercase tracking-[0.4em] mb-2 font-black italic">SAIR EM</span>
            <div className="text-8xl font-display font-black text-white italic drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">{aviatorData.exitPoint}</div>
            <div className="mt-12 w-full grid grid-cols-2 gap-4">
              <div className="bg-black/60 rounded-3xl p-5 border border-white/5 flex flex-col items-center">
                 <span className="text-[9px] font-mono text-red-600 uppercase font-black tracking-widest mb-1">RISCO</span>
                 <span className="text-xl font-display text-white font-black">{aviatorData.risk}</span>
              </div>
              <div className="bg-black/60 rounded-3xl p-5 border border-white/5 flex flex-col items-center">
                 <span className="text-[9px] font-mono text-green-500 uppercase font-black tracking-widest mb-1">ESTIMATIVA</span>
                 <span className="text-xl font-display text-white font-black">{aviatorData.maxVela}</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-600/20 via-red-600/5 to-transparent rounded-2xl p-5 border border-red-600/30 flex items-center space-x-4 backdrop-blur-sm">
             <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 animate-pulse text-2xl">warning</span>
             </div>
             <div className="flex-1">
               <p className="text-[11px] font-display text-white font-black uppercase tracking-wider leading-tight">A Vela pode subir até <span className="text-red-500">{aviatorData.maxVela}</span></p>
               <p className="text-[8px] text-white/30 font-mono mt-0.5 uppercase">Neural extraction in progress</p>
             </div>
          </div>
        </div>

        <div className="mt-auto pb-10">
          <button onClick={handleReanalyzeClick} className="w-full h-16 bg-red-600 rounded-3xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_10px_40px_rgba(239,68,68,0.4)]">
            <span className="material-symbols-outlined text-white font-bold text-2xl">rocket_launch</span>
            <span className="font-display text-sm font-black text-white uppercase italic tracking-wider">GERAR NOVO SINAL</span>
          </button>
          <button onClick={onExit} className="w-full mt-6 text-[10px] text-white/20 font-mono uppercase tracking-[0.4em] hover:text-white/50 transition-colors text-center">VOLTAR AO SISTEMA</button>
        </div>
      </div>
    );
  }

  // --- Layout Crazy Time ---
  if (roulette.id === 'crazy_time_main') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 bg-black overflow-y-auto">
        <header className="flex flex-col items-center justify-center pt-6 mb-10">
           <h1 className="font-display text-2xl text-white italic tracking-tighter font-black uppercase text-center">CRAZY PREDICTION</h1>
           <div className="w-12 h-1 bg-green-500 mt-1 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.9)]"></div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {predictions.map((pred, idx) => {
            const ctSymbol = CRAZY_TIME_SYMBOLS.find(s => s.id === pred.mainResult);
            if (!ctSymbol) return null;
            return (
              <div key={idx} className="relative aspect-[3/4] bg-[#0c0c0c] rounded-3xl border border-white/5 flex flex-col items-center justify-between p-4 overflow-hidden shadow-2xl group transition-all duration-300 hover:border-white/20">
                <div className="absolute top-3 right-3 bg-black/80 px-1.5 py-0.5 rounded border border-yellow-500/40">
                  <span className="text-[8px] font-mono text-yellow-500 font-bold">{pred.accuracy}%</span>
                </div>
                <div className="flex-1 flex items-center justify-center w-full px-1">
                  <img src={ctSymbol.image} alt={ctSymbol.name} className="w-full h-auto max-h-[110px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center pb-2">
                  <span className="text-[9px] font-mono text-yellow-500 uppercase font-black tracking-[0.25em]">{ctSymbol.type === 'number' ? 'NUMBER' : 'BONUS'}</span>
                  <h3 className="text-[13px] font-display text-cyan-400 font-black tracking-tight mt-1 truncate w-full max-w-[120px]">{ctSymbol.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pb-10">
          <button onClick={handleReanalyzeClick} className="w-full h-16 bg-[#22c55e] rounded-3xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.4)]">
            <span className="material-symbols-outlined text-black font-bold text-2xl">insights</span>
            <span className="font-display text-sm font-black text-black uppercase italic tracking-wider">NOVA EXTRAÇÃO NEURAL</span>
          </button>
          <button onClick={onExit} className="w-full mt-6 text-[10px] text-white/20 font-mono uppercase tracking-[0.4em] hover:text-white/50 transition-colors text-center">VOLTAR AO SISTEMA</button>
        </div>
      </div>
    );
  }

  // --- Layout Roletas Tradicionais (Fortune, Brasileira, Lightning, etc) ---
  const videoUrl = roulette.videoUrls ? roulette.videoUrls[0] : roulette.videoUrl;
  const currentPrediction = predictions.length > 0 ? predictions[0] : null;
  const isPaying = currentPrediction?.marketStatus === MarketStatus.PAYING;
  
  const statusColor = isPaying ? 'text-green-500' : 'text-red-500';
  const statusBg = isPaying ? 'bg-green-500' : 'bg-red-500';
  const statusBorder = isPaying ? 'border-green-500/30' : 'border-red-500/30';
  const themeGlow = isPaying ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 bg-background-dark overflow-y-auto space-y-6">
      <header className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${statusBg} shadow-[0_0_10px_currentColor]`}></div>
          <div>
            <h1 className="font-display text-[11px] tracking-[0.2em] text-white font-bold uppercase leading-none">ANALITYCS_HASH</h1>
            <p className={`text-[8px] ${statusColor} font-mono mt-1 font-black`}>ROULETTE_LOGIC_ACTIVE</p>
          </div>
        </div>
        <button onClick={onExit} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </header>

      <div className={`w-full py-2.5 px-4 rounded-xl border ${statusBorder} bg-black/40 flex items-center justify-between backdrop-blur-md`}>
         <div className="flex flex-col">
            <span className={`text-[9px] font-display font-black uppercase tracking-widest ${statusColor}`}>
                {isPaying ? 'Status: Pagante' : 'Status: Coletor'}
            </span>
            <span className="text-[7px] text-white/40 font-mono mt-0.5">Mesa: {roulette.name.toUpperCase()}</span>
         </div>
      </div>

      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 shadow-inner">
        {videoUrl ? (
          <VideoPlayer url={videoUrl} poster={roulette.image} />
        ) : (
          <img alt="Game" className="w-full h-full object-cover opacity-60" src={roulette.image} />
        )}
      </div>

      <div className="space-y-4">
        {predictions.map((pred, idx) => {
          const styles = getResultStyles(pred.mainResult, false);
          return (
            <div key={idx} className={`p-6 rounded-[2rem] bg-panel-dark border ${statusBorder} flex flex-col items-center space-y-6 relative overflow-hidden transition-all duration-700 shadow-2xl ${themeGlow}`}>
              <div className="absolute top-4 left-6 flex flex-col">
                <span className="text-[7px] font-display text-white/40 tracking-widest uppercase font-bold">Precisão</span>
                <span className={`text-xs font-mono font-black ${statusColor}`}>{pred.accuracy}%</span>
              </div>
              
              {/* Octógono Central do Número Principal */}
              <div className="relative w-32 h-32 flex items-center justify-center mt-4">
                <div className={`octagon absolute inset-0 ${styles.bg} border ${styles.border} animate-pulse`}></div>
                <span className={`font-display ${String(pred.mainResult).length > 2 ? 'text-xl' : 'text-5xl'} font-black ${styles.text} text-center px-4 leading-tight relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                  {pred.mainResult}
                </span>
              </div>

              {/* Seção de Números Vizinhos */}
              <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center space-y-3">
                <span className="text-[8px] font-display text-white/40 uppercase tracking-[0.4em] font-bold">Vizinhos da Estratégia</span>
                <div className="flex justify-center items-center gap-3 w-full px-2">
                  {pred.neighbors.map((neighbor, nIdx) => {
                    const nStyles = getResultStyles(neighbor, false);
                    return (
                      <div key={nIdx} className="flex flex-col items-center group">
                        <div className={`w-10 h-10 octagon ${nStyles.bg} border ${nStyles.border} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <span className={`text-xs font-display font-black ${nStyles.text}`}>
                            {neighbor}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 pb-6">
        <button onClick={handleReanalyzeClick} className={`w-full h-14 ${statusBg} rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-3`}>
          <span className="material-symbols-outlined font-bold text-black text-xl">refresh</span>
          <span className="font-display font-black text-black text-xs uppercase tracking-widest italic">Recalcular Hash</span>
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;
