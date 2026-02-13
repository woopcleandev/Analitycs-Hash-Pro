export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Navegador não suporta síntese de voz.");
    return;
  }

  // Função interna para executar a fala
  const doSpeak = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05; 
    utterance.pitch = 0.95;

    // Busca vozes disponíveis
    const voices = window.speechSynthesis.getVoices();
    
    // Tenta encontrar uma voz em Português do Brasil de qualidade
    const preferredVoice = voices.find(v => v.lang === 'pt-BR' && v.name.toLowerCase().includes('google')) || 
                           voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Alguns navegadores carregam as vozes de forma assíncrona
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      doSpeak();
      // Remove o listener para não disparar múltiplas vezes
      window.speechSynthesis.onvoiceschanged = null;
    };
  } else {
    doSpeak();
  }
};