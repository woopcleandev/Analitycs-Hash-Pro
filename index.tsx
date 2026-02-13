
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Erro crítico: Elemento #root não encontrado no DOM.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Erro ao renderizar o React:", err);
    rootElement.innerHTML = `
      <div style="background:#050505;color:#ef4444;padding:20px;font-family:sans-serif;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;">
        <div>
          <h1 style="font-size:24px;margin-bottom:10px;">ERRO DE INICIALIZAÇÃO</h1>
          <p style="color:#666;font-size:14px;">Falha ao carregar o motor gráfico Analitycs Hash.</p>
          <button onclick="window.location.reload()" style="margin-top:20px;background:#ef4444;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">Tentar Novamente</button>
        </div>
      </div>
    `;
  }
};

mountApp();
