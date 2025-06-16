import { useState, useEffect } from 'react';
import { getCurrentPrices, get24hrStats, getHistoricalData } from '../services/binanceApi.js';
import { 
  calculateAssetPnL, 
  calculateDailyReturn, 
  calculateWeeklyReturn,
  calculatePortfolioSummary,
  getAssetConfig,
  getPortfolioSymbols 
} from '../utils/calculations.js';
import { UPDATE_INTERVALS } from '../config/portfolio.js';

export const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState({});
  const [portfolioSummary, setPortfolioSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const symbols = getPortfolioSymbols();

  const fetchPortfolioData = async () => {
    try {
      setError(null);
      
      // Obtener precios actuales
      const currentPrices = await getCurrentPrices(symbols);
      
      // Obtener estadísticas de 24hr
      const stats24hr = await get24hrStats(symbols);
      
      // Procesar datos para cada activo
      const newPortfolioData = {};
      
      for (const symbol of symbols) {
        const config = getAssetConfig(symbol);
        const currentPrice = currentPrices[symbol];
        const stats = stats24hr[symbol];
        
        if (currentPrice && stats && config) {
          // Calcular PnL
          const pnlData = calculateAssetPnL(
            currentPrice, 
            config.purchasePrice, 
            config.quantity
          );
          
          // Calcular rendimiento diario
          const dailyReturn = calculateDailyReturn(stats);
          
          // Obtener datos históricos para rendimiento semanal
          try {
            const historicalData = await getHistoricalData(symbol, '1d', 7);
            const weeklyReturn = calculateWeeklyReturn(historicalData);
            
            newPortfolioData[symbol] = {
              ...config,
              currentPrice,
              ...pnlData,
              dailyReturn,
              weeklyReturn,
              stats24hr: stats,
              historicalData
            };
          } catch (histError) {
            console.warn(`Error fetching historical data for ${symbol}:`, histError);
            // Continuar sin datos históricos
            newPortfolioData[symbol] = {
              ...config,
              currentPrice,
              ...pnlData,
              dailyReturn,
              weeklyReturn: { weeklyChange: 0, weeklyChangePercent: 0 },
              stats24hr: stats
            };
          }
        }
      }
      
      setPortfolioData(newPortfolioData);
      
      // Calcular resumen del portafolio
      const summary = calculatePortfolioSummary(newPortfolioData);
      setPortfolioSummary(summary);
      
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Efecto para actualización automática
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolioData();
    }, UPDATE_INTERVALS.PRICE_UPDATE);

    return () => clearInterval(interval);
  }, []);

  return {
    portfolioData,
    portfolioSummary,
    loading,
    error,
    lastUpdate,
    refetch: fetchPortfolioData
  };
};

