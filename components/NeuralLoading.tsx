
import React, { useState, useEffect, useRef } from 'react';
import { TERMINAL_MESSAGES } from '../constants';
import { RouletteType } from '../types';
import VideoPlayer from './VideoPlayer';
import { speak } from '../utils/tts';

interface TerminalMessage {
  text: string;
  id: number;
}

interface LoadingProps {
  onComplete: () => void;
  selectedRoulette?: RouletteType | null;
}

const NeuralLoading: React.FC<LoadingProps> = ({ onComplete, selectedRoulette }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [progress, setProgress] = useState(0);
  const loadingTimeRef = useRef(Math.floor(Math.random() * (27000 - 8000 + 1)) + 8000);
  const terminalRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    // Falar a mensagem de sistema ao iniciar
    if (!audioStartedRef.current) {
      speak("Aguarde estou fazendo a Leitura dos Hash Calculando Possíveis resultados");
      audioStartedRef.current = true;
    }

    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / loadingTimeRef.current) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 30);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      let nextMsgText = "";
      
      const rand = Math.random();
      if (rand < 0.2 && selectedRoulette) {
        nextMsgText = `SYNCING_WITH: [${selectedRoulette.name.toUpperCase()}] :: ADDR:0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}`;
      } else if (rand < 0.5) {
        const hash = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        nextMsgText = `SHA256_HASH: 0x${hash.substring(0, 8)}...${hash.substring(24)}`;
      } else if (rand < 0.7) {
        const sid = `${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}-X`;
        nextMsgText = `SID_NODE: ${sid} :: STATUS:OK`;
      } else if (messageIndex < TERMINAL_MESSAGES.length) {
        nextMsgText = TERMINAL_MESSAGES[messageIndex];
        messageIndex++;
      } else {
        messageIndex = 0;
        nextMsgText = TERMINAL_MESSAGES[0];
      }

      const id = nextIdRef.current++;
      setMessages((prev) => {
        const newMessage = { text: nextMsgText, id };
        return [...prev, newMessage].slice(-40);
      });
    }, 45);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [onComplete, selectedRoulette]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-between p-6 bg-black relative overflow-hidden font-mono">
      {selectedRoulette?.videoUrl && (
        <div className="absolute inset-0 opacity-30 brightness-[0.3] grayscale scale-110 pointer-events-none">
          <VideoPlayer url={selectedRoulette.videoUrl} poster={selectedRoulette.image} />
        </div>
      )}

      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none"></div>
      <div className="scanline"></div>

      <div className="w-full flex justify-between items-center text-[8px] tracking-[0.2em] text-primary/60 p-1 border-b border-white/10 z-20 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          AN_HASH_LINK_v4
        </div>
        <div className="flex gap-4">
          <span className="text-primary/80 uppercase font-black">{selectedRoulette?.name}</span>
          <span className="text-white/20">PID: {Math.floor(Math.random() * 8000 + 1000)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 z-20 py-6">
        <div className="relative group">
          <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative bg-black/60 backdrop-blur-md border border-primary/40 w-16 h-16 flex items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(250,204,21,0.2)]">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin" style={{ animationDuration: '2s' }}>
              radar
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="font-display text-primary text-[10px] tracking-[0.5em] font-black uppercase drop-shadow-lg">
            ANALYSING_NEURAL_STREAM
          </h1>
          <div className="w-64 h-1 bg-white/5 rounded-full relative overflow-hidden border border-white/5">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-out shadow-[0_0_15px_rgba(250,204,21,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-white/40 uppercase px-1 font-bold tracking-widest">
            <span>BITRATE: {(progress * 4.2).toFixed(1)}MBPS</span>
            <span>{progress.toFixed(1)}% SYNCED</span>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 mb-4 flex flex-col overflow-hidden z-20 mt-4">
        <div className="flex items-center justify-between px-3 py-1 bg-black/60 border-t border-x border-white/10 rounded-t-md backdrop-blur-md">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/60"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60"></div>
          </div>
          <span className="text-[6px] text-primary/60 tracking-[0.5em] font-mono font-black uppercase">SESSION_LOG_BUFFER</span>
        </div>
        
        <div 
          ref={terminalRef}
          className="w-full flex-1 bg-black/80 border border-white/10 rounded-b-md p-2 font-mono text-[9px] leading-[1.2] overflow-y-auto scrollbar-hide backdrop-blur-md shadow-2xl"
        >
          <div className="text-primary/90 space-y-0.5">
            {messages.map((msg) => (
              <p key={msg.id} className="flex gap-2 opacity-90 whitespace-nowrap overflow-hidden">
                <span className="text-white/20 select-none font-bold">[{msg.id.toString().padStart(2, '0')}]</span>
                <span className="flex-1 text-primary/80 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]">&gt; {msg.text}</span>
              </p>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-green-500/60 font-bold">&gt;</span>
              <span className="w-1.5 h-2.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-4 gap-1 pb-4 px-1 z-20">
        <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-md border border-white/10 flex flex-col items-center">
          <span className="text-[5px] text-white/30 uppercase font-black">Entropy</span>
          <span className="text-[8px] text-primary/80">{(Math.random() * 0.1).toFixed(3)}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-md border border-white/10 flex flex-col items-center">
          <span className="text-[5px] text-white/30 uppercase font-black">Link</span>
          <span className="text-[8px] text-green-400 font-bold">SECURE</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-md border border-white/10 flex flex-col items-center">
          <span className="text-[5px] text-white/30 uppercase font-black">Cores</span>
          <span className="text-[8px] text-primary/80">32/32</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-md border border-white/10 flex flex-col items-center">
          <span className="text-[5px] text-white/30 uppercase font-black">Jitter</span>
          <span className="text-[8px] text-primary/80">1.2ms</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralLoading;
