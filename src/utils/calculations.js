import { PORTFOLIO_CONFIG } from '../config/portfolio.js';

// Calcular ganancia/pérdida para un activo
export const calculateAssetPnL = (currentPrice, purchasePrice, quantity) => {
  const currentValue = currentPrice * quantity;
  const purchaseValue = purchasePrice * quantity;
  const pnl = currentValue - purchaseValue;
  const pnlPercentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
  
  return {
    currentValue,
    purchaseValue,
    pnl,
    pnlPercentage
  };
};

// Calcular rendimiento diario basado en estadísticas de 24hr
export const calculateDailyReturn = (stats) => {
  return {
    priceChange: stats.priceChange,
    priceChangePercent: stats.priceChangePercent,
    dailyHigh: stats.highPrice,
    dailyLow: stats.lowPrice
  };
};

// Calcular rendimiento semanal basado en datos históricos
export const calculateWeeklyReturn = (historicalData) => {
  if (!historicalData || historicalData.length < 2) {
    return { weeklyChange: 0, weeklyChangePercent: 0 };
  }
  
  const oldestPrice = historicalData[0].open;
  const latestPrice = historicalData[historicalData.length - 1].close;
  const weeklyChange = latestPrice - oldestPrice;
  const weeklyChangePercent = ((latestPrice - oldestPrice) / oldestPrice) * 100;
  
  return {
    weeklyChange,
    weeklyChangePercent,
    weeklyHigh: Math.max(...historicalData.map(d => d.high)),
    weeklyLow: Math.min(...historicalData.map(d => d.low))
  };
};

// Calcular resumen del portafolio completo
export const calculatePortfolioSummary = (assetData) => {
  let totalCurrentValue = 0;
  let totalInvestment = 0;
  let totalPnL = 0;
  
  Object.values(assetData).forEach(asset => {
    totalCurrentValue += asset.currentValue;
    totalInvestment += asset.purchaseValue;
    totalPnL += asset.pnl;
  });
  
  const totalPnLPercentage = ((totalCurrentValue - totalInvestment) / totalInvestment) * 100;
  
  return {
    totalCurrentValue,
    totalInvestment,
    totalPnL,
    totalPnLPercentage,
    assetCount: Object.keys(assetData).length
  };
};

// Obtener configuración de un activo
export const getAssetConfig = (symbol) => {
  return PORTFOLIO_CONFIG[symbol];
};

// Obtener todos los símbolos del portafolio
export const getPortfolioSymbols = () => {
  return Object.keys(PORTFOLIO_CONFIG);
};

// Formatear números para mostrar
export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

