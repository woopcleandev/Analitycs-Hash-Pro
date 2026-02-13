
import { WHEEL_SEQUENCE, CRAZY_TIME_SYMBOLS } from '../constants';
import { Prediction, MarketStatus, RouletteType } from '../types';

const getRouletteSeed = (id: string): number => {
  return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

export const getMarketStatus = (rouletteId: string): MarketStatus => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
  const seed = getRouletteSeed(rouletteId);
  const cycleLength = 45 + (seed % 15); 
  const offset = (seed * 7) % cycleLength;
  const positionInCycle = (minutesSinceMidnight + offset) % cycleLength;
  const collectingDuration = 10 + (seed % 8);

  if (positionInCycle < collectingDuration) {
    return MarketStatus.COLLECTING;
  }
  return MarketStatus.PAYING;
};

export const getNeighbors = (num: number, count: number): number[] => {
  const index = WHEEL_SEQUENCE.indexOf(num);
  if (index === -1) return [];
  const neighbors: number[] = [];
  const len = WHEEL_SEQUENCE.length;
  for (let i = 1; i <= count; i++) {
    let leftIdx = (index - i + len) % len;
    neighbors.unshift(WHEEL_SEQUENCE[leftIdx]);
    let rightIdx = (index + i) % len;
    neighbors.push(WHEEL_SEQUENCE[rightIdx]);
  }
  return neighbors;
};

export const generatePrediction = (roulette: RouletteType): Prediction => {
  const marketStatus = getMarketStatus(roulette.id);
  let mainResult: string | number;
  let neighbors: (string | number)[] = [];

  if (roulette.type === 'gameshow') {
    const rand = Math.random();
    if (rand < 0.40) mainResult = "1";
    else if (rand < 0.65) mainResult = "2";
    else if (rand < 0.80) mainResult = "5";
    else if (rand < 0.90) mainResult = "10";
    else if (rand < 0.94) mainResult = "coin_flip";
    else if (rand < 0.97) mainResult = "pachinko";
    else if (rand < 0.99) mainResult = "cash_hunt";
    else mainResult = "crazy_time";

    neighbors = mainResult === "1" || mainResult === "2" ? ["coin_flip", "5"] : ["1", "2"];
  } else {
    const num = Math.floor(Math.random() * 37);
    mainResult = num;
    neighbors = getNeighbors(num, 3);
  }
  
  const min = marketStatus === MarketStatus.COLLECTING ? 88.0 : 95.0;
  const max = marketStatus === MarketStatus.COLLECTING ? 94.0 : 99.0;
  const accuracy = Math.floor(Math.random() * (max - min) + min);
  
  return { mainResult, neighbors, accuracy, marketStatus };
};

export const generateBlazePrediction = (): any => {
  const now = new Date();
  const min = now.getMinutes();
  
  // Janela de horário chave: minutos terminando em 9, 0 ou 1
  const isKeyWindow = (min % 10 === 9) || (min % 10 === 0) || (min % 10 === 1);
  
  // Escolha aleatória da cor principal (Vermelho ou Preto)
  const colors = ['red', 'black'];
  const mainColor = colors[Math.floor(Math.random() * colors.length)];
  
  // A acurácia é sempre alta, mas maior em janelas chave
  const accuracy = isKeyWindow 
    ? (Math.random() * (99.8 - 97.5) + 97.5).toFixed(1)
    : (Math.random() * (96.0 - 92.0) + 92.0).toFixed(1);

  return {
    mainColor,
    protection: 'white',
    isKeyWindow,
    accuracy,
    timestamp: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};

export const generateAviatorPrediction = (): any => {
  const exitPoint = (Math.random() * (2.99 - 1.5) + 1.5).toFixed(2);
  const risk = (Math.random() * (99.8 - 49.8) + 49.8).toFixed(1);
  const maxVela = (Math.random() * (99.8 - 1.99) + 1.99).toFixed(2);
  
  return {
    exitPoint: `${exitPoint}x`,
    risk: `${risk}%`,
    maxVela: `${maxVela}x`,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};

export const generateCrazyTimePredictions = (roulette: RouletteType): Prediction[] => {
  const predictions: Prediction[] = [];
  const numbersAvailable = ["1", "2", "5", "10"];
  const bonusesAvailable = ["coin_flip", "pachinko", "cash_hunt", "crazy_time"];
  
  const numCount = Math.floor(Math.random() * 2) + 2; 
  const bonusCount = Math.floor(Math.random() * 3) + 1; 
  
  const finalResults = [
    ...[...numbersAvailable].sort(() => Math.random() - 0.5).slice(0, numCount),
    ...[...bonusesAvailable].sort(() => Math.random() - 0.5).slice(0, bonusCount)
  ];
  
  finalResults.forEach(res => {
    const p = generatePrediction(roulette);
    p.mainResult = res;
    p.accuracy = Math.floor(Math.random() * (99 - 97 + 1)) + 97;
    predictions.push(p);
  });
  
  return predictions;
};
