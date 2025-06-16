// Configuración del portafolio del usuario
export const PORTFOLIO_CONFIG = {
  RENDERUSDT: {
    symbol: "RENDERUSDT",
    name: "Render Token",
    purchasePrice: 3.42,
    quantity: 92.89,
    investment: 317.70,
    percentage: 25.6
  },
  SUIUSDT: {
    symbol: "SUIUSDT", 
    name: "Sui",
    purchasePrice: 3.05,
    quantity: 101.31,
    investment: 309.01,
    percentage: 24.9
  },
  THETAUSDT: {
    symbol: "THETAUSDT",
    name: "Theta Network",
    purchasePrice: 0.71,
    quantity: 435.22,
    investment: 309.01,
    percentage: 24.9
  },
  RVNUSDT: {
    symbol: "RVNUSDT",
    name: "Ravencoin",
    purchasePrice: 0.019,
    quantity: 16002.37,
    investment: 304.05,
    percentage: 24.5
  }
};

// URLs de la API de Binance
export const BINANCE_API = {
  BASE_URL: 'https://data-api.binance.vision', // Usar endpoint público sin restricciones
  ENDPOINTS: {
    TICKER_PRICE: '/api/v3/ticker/price',
    TICKER_24HR: '/api/v3/ticker/24hr',
    KLINES: '/api/v3/klines'
  }
};

// Configuración de actualización
export const UPDATE_INTERVALS = {
  PRICE_UPDATE: 5000, // 5 segundos
  CHART_UPDATE: 30000 // 30 segundos
};

