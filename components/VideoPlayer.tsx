
import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  url?: string;
  poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let hls: any = null;
    const video = videoRef.current;

    if (!video || !url) {
      if (!url) setError(true);
      return;
    }

    const setupHls = () => {
      // Verifica se a biblioteca Hls está disponível no objeto window
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 0,
          maxBufferLength: 5,
          manifestLoadingMaxRetry: 3,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            console.log("Autoplay bloqueado pelo navegador, aguardando interação");
          });
          setIsLive(true);
        });
        hls.on(window.Hls.Events.ERROR, (_event: any, data: any) => {
          if (data.fatal) {
            console.warn("Erro fatal no HLS:", data.type);
            setError(true);
            setIsLive(false);
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback nativo para Safari/iOS
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
          setIsLive(true);
        });
      } else {
        console.warn("HLS não suportado neste navegador");
        setError(true);
      }
    };

    // Pequeno delay para garantir que o script do CDN foi parseado
    const timeout = setTimeout(setupHls, 100);

    return () => {
      clearTimeout(timeout);
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  if (error || !url) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
        <img src={poster} alt="Fallback" className="w-full h-full object-cover opacity-40 grayscale" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
           <span className="material-symbols-outlined text-white/20 text-4xl mb-2">videocam_off</span>
           <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Feed indisponível em sua região</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden video-container">
      <video
        ref={videoRef}
        poster={poster}
        muted
        playsInline
        autoPlay
        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
      />
      
      {/* Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
        <div className="scanline opacity-20"></div>
      </div>

      {/* Status Indicators */}
      {isLive && (
        <div className="absolute top-3 left-3 flex items-center gap-2 z-30">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[8px] font-mono text-white/80 font-bold uppercase tracking-widest">LIVE_FEED</span>
          </div>
          <div className="bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md border border-primary/30">
            <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-widest">NEURAL_SYNC</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

declare global {
  interface Window {
    Hls: any;
  }
}
