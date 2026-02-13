
import React, { useState, useEffect } from 'react';
import { 
  CAKTO_PURCHASE_URL, 
  CAKTO_WEBHOOK_KEY, 
  VALIDATION_ENDPOINT, 
  MASTER_ADMIN_EMAIL,
  CAKTO_CLIENT_ID,
  CAKTO_CLIENT_SECRET 
} from '../constants';
import { User } from '../types';

interface AuthGateProps {
  onSuccess: (email: string) => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        // Tentativa de ping no endpoint
        await fetch(VALIDATION_ENDPOINT, { 
          method: 'GET', // Alterado para GET para teste mais comum
          mode: 'no-cors', 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        setApiStatus('online');
      } catch (e) {
        setApiStatus('offline');
      }
    };
    
    checkApi();

    const savedSession = localStorage.getItem('an_hash_session');
    if (savedSession) {
      try {
        const { timestamp, identifier: savedEmail } = JSON.parse(savedSession);
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (now - timestamp < oneDay) {
          onSuccess(savedEmail);
        }
      } catch (e) {
        localStorage.removeItem('an_hash_session');
      }
    }
  }, [onSuccess]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const checkLocalDatabase = (email: string): User | undefined => {
    const savedUsers = localStorage.getItem('an_hash_users');
    if (savedUsers) {
      const users: User[] = JSON.parse(savedUsers);
      return users.find(u => u.email === email);
    }
    return undefined;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    if (!validateEmail(identifier)) {
      setError('Insira um formato de e-mail válido.');
      return;
    }

    setLoading(true);
    setError(null);

    const emailInput = identifier.toLowerCase().trim();

    // 1. PRIORIDADE: Master Admin (Login direto)
    if (emailInput === MASTER_ADMIN_EMAIL) {
      saveSessionAndRedirect(emailInput);
      return;
    }

    // 2. CAMADA LOCAL (Whitelist manual via Admin Area)
    const localUser = checkLocalDatabase(emailInput);
    if (localUser) {
      const isExpired = new Date() > new Date(localUser.expiresAt);
      if (isExpired) {
        setError('Licença expirada. Renove seu acesso.');
        setLoading(false);
        return;
      }
      if (localUser.status === 'active') {
        saveSessionAndRedirect(emailInput);
        return;
      } else {
        setError('Acesso bloqueado pelo administrador.');
        setLoading(false);
        return;
      }
    }

    // 3. CAMADA REMOTA (API)
    try {
      const response = await fetch(VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CAKTO_WEBHOOK_KEY}`,
          'X-Client-Id': CAKTO_CLIENT_ID,
          'X-Client-Secret': CAKTO_CLIENT_SECRET
        },
        body: JSON.stringify({ email: emailInput })
      });

      if (response.ok) {
        const data = await response.json();
        // Assume que a API retorna active: true ou status: 'paid'
        if (data.active || data.status === 'paid' || data.status === 'approved') {
          saveSessionAndRedirect(emailInput);
          return;
        }
      }
      
      setError('E-mail não autorizado ou sem compra ativa no Cakto.');

    } catch (err: any) {
      console.warn("API Error (Possível CORS):", err);
      // Se falhar o fetch, explicamos que pode ser o servidor
      setError('ERRO DE REDE: Não foi possível conectar ao servidor de licenças (CORS/Offline). Use o e-mail Admin para entrar e liberar manualmente.');
    } finally {
      setLoading(false);
    }
  };

  const saveSessionAndRedirect = (email: string) => {
    const sessionData = { identifier: email, timestamp: new Date().getTime() };
    localStorage.setItem('an_hash_session', JSON.stringify(sessionData));
    onSuccess(email);
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center p-6 bg-black font-mono relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none"></div>
      <div className="scanline"></div>

      <header className="mb-12 text-center z-10">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#facc15]"></div>
          <h1 className="font-display text-xs tracking-[0.4em] text-primary uppercase font-black">Secure_Access_v7.0</h1>
        </div>
        <h2 className="text-4xl font-display font-black tracking-tighter text-white italic uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Analitycs Hash</h2>
      </header>

      <div className="w-full bg-panel-dark border border-white/5 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-xl">
        <form onSubmit={handleVerify} className="space-y-6 pt-4">
          <div>
            <label className="block text-[10px] text-primary/60 uppercase font-black mb-2 tracking-widest ml-1">E-mail de Acesso</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">alternate_email</span>
              <input 
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="seuemail@cakto.com"
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start space-x-3">
              <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">warning</span>
              <p className="text-[9px] text-red-400 uppercase font-bold leading-tight">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="group w-full h-14 bg-primary rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.2)] disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-black font-black">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-black font-black text-xl">verified_user</span>
                <span className="font-display font-black text-black text-xs uppercase italic tracking-widest">Validar Acesso</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
          <p className="text-[9px] text-white/20 uppercase font-bold mb-4">Assinatura Pendente?</p>
          <a 
            href={CAKTO_PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border border-primary/20 rounded-xl text-center text-[10px] text-primary hover:bg-primary hover:text-black font-black uppercase tracking-[0.2em] transition-all"
          >
            ADQUIRIR VIA CAKTO
          </a>
        </div>
      </div>

      <div className="mt-8 z-10 flex items-center space-x-2">
         <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
         <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">
           API_GATEWAY: {apiStatus.toUpperCase()}
         </span>
      </div>
    </div>
  );
};

export default AuthGate;
