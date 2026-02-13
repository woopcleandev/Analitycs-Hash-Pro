
export enum AppScreen {
  AUTH = 'AUTH',
  SELECTION = 'SELECTION',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ADMIN = 'ADMIN'
}

export enum MarketStatus {
  PAYING = 'PAYING',
  COLLECTING = 'COLLECTING'
}

export interface User {
  email: string;
  name: string;
  cpf: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  plan: 'VIP' | 'Standard';
  createdAt: string;
  expiresAt: string; // ISO string da data de expiração
  lastLogin?: string;
}

export type CrazyTimeSymbol = {
  id: string;
  name: string;
  type: 'number' | 'bonus';
  image: string;
};

export type RouletteType = {
  id: string;
  name: string;
  image: string;
  type: 'roulette' | 'gameshow';
  videoUrl?: string;
  videoUrls?: string[];
};

export type Prediction = {
  mainResult: string | number;
  neighbors: (string | number)[];
  accuracy: number;
  marketStatus: MarketStatus;
};
