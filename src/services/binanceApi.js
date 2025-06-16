import axios from 'axios';
import { BINANCE_API } from '../config/portfolio.js';

// Crear instancia de axios para Binance API
const binanceApi = axios.create({
  baseURL: BINANCE_API.BASE_URL,
  timeout: 10000,
});

// Obtener precios actuales de múltiples símbolos
export const getCurrentPrices = async (symbols) => {
  try {
    const symbolsParam = symbols.map(s => `"${s}"`).join(',');
    const response = await binanceApi.get(BINANCE_API.ENDPOINTS.TICKER_PRICE, {
      params: {
        symbols: `[${symbolsParam}]`
      }
    });
    
    // Convertir array a objeto para fácil acceso
    const pricesMap = {};
    response.data.forEach(item => {
      pricesMap[item.symbol] = parseFloat(item.price);
    });
    
    return pricesMap;
  } catch (error) {
    console.error('Error fetching current prices:', error);
    throw error;
  }
};

// Obtener estadísticas de 24 horas
export const get24hrStats = async (symbols) => {
  try {
    const symbolsParam = symbols.map(s => `"${s}"`).join(',');
    const response = await binanceApi.get(BINANCE_API.ENDPOINTS.TICKER_24HR, {
      params: {
        symbols: `[${symbolsParam}]`
      }
    });
    
    // Convertir array a objeto para fácil acceso
    const statsMap = {};
    response.data.forEach(item => {
      statsMap[item.symbol] = {
        priceChange: parseFloat(item.priceChange),
        priceChangePercent: parseFloat(item.priceChangePercent),
        highPrice: parseFloat(item.highPrice),
        lowPrice: parseFloat(item.lowPrice),
        volume: parseFloat(item.volume),
        openPrice: parseFloat(item.openPrice),
        prevClosePrice: parseFloat(item.prevClosePrice)
      };
    });
    
    return statsMap;
  } catch (error) {
    console.error('Error fetching 24hr stats:', error);
    throw error;
  }
};

// Obtener datos históricos (klines) para cálculos semanales
export const getHistoricalData = async (symbol, interval = '1d', limit = 7) => {
  try {
    const response = await binanceApi.get(BINANCE_API.ENDPOINTS.KLINES, {
      params: {
        symbol,
        interval,
        limit
      }
    });
    
    // Procesar datos de klines
    return response.data.map(kline => ({
      openTime: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6]
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

