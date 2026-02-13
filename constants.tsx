
import { RouletteType, CrazyTimeSymbol } from './types';

// Link de compra da Cakto
export const CAKTO_PURCHASE_URL = "https://pay.cakto.com.br/i4si7p8_767197";

/**
 * CREDENCIAIS CAKTO (Extraídas exatamente da imagem fornecida)
 */
export const CAKTO_CLIENT_ID = "RBvF6kxjQq72Jm3694dYOEE2P2SOzgP7gGZNQyoa";
export const CAKTO_CLIENT_SECRET = "9sbTUouiGwy7YmdKDXfzFgyWneZqJaK5PSj1XRfQJ0dMYdDhdg74134xVF3E3uAuQZCtGunGyKkpKHprlk6rAR2PuVPWjBCfKu3HdoAJb4wSSLWqNAMl9shWV3elKnda";
export const CAKTO_WEBHOOK_KEY = "6a91d5b5-59ea-4934-83f1-0b60371de4f9";

// Email do Administrador Master
export const MASTER_ADMIN_EMAIL = "pedroigoralves@outlook.com";

/**
 * ENDPOINT DE VALIDAÇÃO
 * Se este endpoint não possuir CORS habilitado no servidor, o erro 'Failed to fetch' persistirá.
 */
export const VALIDATION_ENDPOINT = "https://api.analitycshash.com/v1/verify"; 

export const WHEEL_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const CRAZY_TIME_SYMBOLS: CrazyTimeSymbol[] = [
  { 
    id: '1', name: '1', type: 'number',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/one-card.png' 
  },
  { 
    id: '2', name: '2', type: 'number',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/two-card.png' 
  },
  { 
    id: '5', name: '5', type: 'number',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/five-card.png' 
  },
  { 
    id: '10', name: '10', type: 'number',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/ten-card.png' 
  },
  { 
    id: 'cash_hunt', name: 'Cash Hunt', type: 'bonus',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/cash-hunt-card.png' 
  },
  { 
    id: 'pachinko', name: 'Pachinko', type: 'bonus',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/pachiko-card.png' 
  },
  { 
    id: 'coin_flip', name: 'Coin Flip', type: 'bonus',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/coin-flip-card.png' 
  },
  { 
    id: 'crazy_time', name: 'Crazy Time', type: 'bonus',
    image: 'https://res.cloudinary.com/casinogrounds/image/upload/f_auto,q_auto,w_0.45,c_scale/gameshows/evolution-gaming/crazy-time/crazy-time-card.png' 
  }
];

export const ROULETTE_OPTIONS: RouletteType[] = [
  { 
    id: 'fortune', 
    name: 'Fortune Roulette', 
    type: 'roulette',
    image: 'https://img.mrq.com/flicker-prod/public_logo_fortune_roulette_88d3f7c081.png',
    videoUrl: 'https://h9hvz5.egress.fd2vxr.mediapackagev2.eu-west-1.amazonaws.com/out/v1/rtmpstreams-1/MR-A91-FortuneRoulette/MR-A91-FortuneRoulette/index.m3u8'
  },
  { 
    id: 'brasileira', 
    name: 'Roleta Brasileira', 
    type: 'roulette',
    image: 'https://img.rationalcdn.com/starsweb/prod/41416_0.png',
    videoUrl: 'https://live101.egprom.com/ezs/61/ezugi_581000_auto/playlist.m3u8'
  },
  { 
    id: 'lightning', 
    name: 'Lightning Roulette', 
    type: 'roulette',
    image: 'https://livecasinomate.com/wp-content/uploads/2023/04/lightning-roulette-logo.jpg',
    videoUrl: 'https://live101.egprom.com/app/10/amlst:lightr1_imr_auto/playlist.m3u8'
  },
  { 
    id: 'crazy_time_main', 
    name: 'Crazy Time Official', 
    type: 'gameshow',
    image: 'https://www.hardrock.bet/wp-content/uploads/2025/12/crazy_time_logo_2020_05-1.png',
    videoUrls: [
      'https://live101.egprom.com/app/43/amlst:dc3_ct_auto/playlist.m3u8',
      'https://live101.egprom.com/app/10/amlst:crazytime1_imr_auto/playlist.m3u8'
    ]
  },
  { 
    id: 'blaze_double', 
    name: 'Blaze Double', 
    type: 'roulette',
    image: 'https://blaze.bet.br/images/logo.svg',
  },
  { 
    id: 'aviator_betbr', 
    name: 'Aviator - Bet.br', 
    type: 'gameshow',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5ZWtODCML9t8w04BESGIriXQ8wJ_x5u_Cg&s'
  }
];

export const TERMINAL_MESSAGES = [
  "BOOT: Analitycs_Core v6.5.0 [MULTI_EXTRACTOR]",
  "INIT: Mapping game-specific logic units...",
  "SYNC: Bypassing RNG pattern buffers...",
  "CAKTO: Client credentials verified locally",
  "SHA256: Local Analysis Hash validation active",
  "NEURAL_MAP: Extracting procedural weights...",
  "AUTH: Session global_0xFA88 verified",
  "TELEMETRY: Recv live game stream [100%]",
  "LOGIC: Running 100M Game Simulations",
  "STATE: ANALYZING_PATTERN_DYNAMICS",
  "FINAL: Logic gates primed for Prediction"
];
