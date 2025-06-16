import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Star,
  Speed,
  BarChart
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const PortfolioMetrics = ({ portfolioData, summary, timeRange = '7D' }) => {
  const theme = useTheme();

  if (!portfolioData || Object.keys(portfolioData).length === 0 || !summary) {
    return (
      <Box sx={{ 
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Métricas Principales
        </Typography>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item} sx={{ display: 'flex' }}>
              <Card elevation={2} sx={{ width: '100%', height: 200, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Cargando...</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Calcular métricas basadas en el filtro de tiempo seleccionado
  const getTimeFilteredMetrics = () => {
    const baseMetrics = {
      totalValue: summary.totalCurrentValue,
      totalPnL: summary.totalPnL,
      totalPnLPercentage: summary.totalPnLPercentage,
      bestAsset: null,
      worstAsset: null,
      avgVolatility: 0
    };

    // Simular diferentes métricas según el período de tiempo
    const timeMultipliers = {
      '1D': { pnl: 0.2, volatility: 0.5 },
      '7D': { pnl: 1.0, volatility: 1.0 },
      '1M': { pnl: 1.8, volatility: 1.5 },
      '3M': { pnl: 2.5, volatility: 2.0 },
      '1A': { pnl: 4.2, volatility: 3.0 },
      'TODO': { pnl: 5.8, volatility: 4.0 }
    };

    const multiplier = timeMultipliers[timeRange] || timeMultipliers['7D'];

    // Calcular P&L ajustado por tiempo
    const adjustedPnL = baseMetrics.totalPnL * multiplier.pnl;
    const adjustedPnLPercentage = baseMetrics.totalPnLPercentage * multiplier.pnl;

    // Encontrar mejor y peor activo con ajustes por tiempo
    const assetsWithAdjustedPerformance = Object.entries(portfolioData).map(([symbol, asset]) => {
      const adjustedPerformance = asset.pnlPercentage * multiplier.pnl;
      const adjustedVolatility = Math.abs(asset.dailyReturn?.priceChangePercent || 0) * multiplier.volatility;
      
      return {
        symbol: symbol.replace('USDT', ''),
        performance: adjustedPerformance,
        volatility: adjustedVolatility,
        originalAsset: asset
      };
    });

    const sortedByPerformance = [...assetsWithAdjustedPerformance].sort((a, b) => b.performance - a.performance);
    
    return {
      totalValue: baseMetrics.totalValue,
      totalPnL: adjustedPnL,
      totalPnLPercentage: adjustedPnLPercentage,
      bestAsset: sortedByPerformance[0],
      worstAsset: sortedByPerformance[sortedByPerformance.length - 1],
      avgVolatility: assetsWithAdjustedPerformance.reduce((sum, asset) => sum + asset.volatility, 0) / assetsWithAdjustedPerformance.length
    };
  };

  const metrics = getTimeFilteredMetrics();

  const getTimeRangeLabel = () => {
    const labels = {
      '1D': 'últimas 24h',
      '7D': 'últimos 7 días',
      '1M': 'último mes',
      '3M': 'últimos 3 meses',
      '1A': 'último año',
      'TODO': 'desde inicio'
    };
    return labels[timeRange] || 'período seleccionado';
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'primary', 
    progress = null,
    chip = null,
    trend = null 
  }) => (
    <Card 
      elevation={2} 
      sx={{ 
        width: '100%', 
        height: 200, 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            <Icon />
          </Avatar>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: trend > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600 
                }}
              >
                {formatPercentage(Math.abs(trend))}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        {chip && (
          <Box sx={{ mb: 2 }}>
            {chip}
          </Box>
        )}

        {progress !== null && (
          <Box sx={{ mt: 'auto' }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(Math.abs(progress), 100)} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: `${color}.main`,
                  borderRadius: 3
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Métricas Principales
        </Typography>
        <Chip 
          label={`Período: ${getTimeRangeLabel()}`}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        {/* Valor Total */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="VALOR TOTAL"
            value={formatCurrency(metrics.totalValue)}
            subtitle="Portafolio completo"
            icon={AccountBalance}
            color="primary"
            progress={75}
            trend={metrics.totalPnLPercentage}
          />
        </Grid>

        {/* Ganancia/Pérdida */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="GANANCIA/PÉRDIDA"
            value={formatCurrency(metrics.totalPnL)}
            subtitle={`Total acumulado (${getTimeRangeLabel()})`}
            icon={metrics.totalPnL >= 0 ? TrendingUp : TrendingDown}
            color={metrics.totalPnL >= 0 ? "success" : "error"}
            progress={Math.abs(metrics.totalPnLPercentage) * 10}
            trend={metrics.totalPnLPercentage}
          />
        </Grid>

        {/* Rendimiento */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="RENDIMIENTO"
            value={formatPercentage(metrics.totalPnLPercentage)}
            subtitle={`Desde compra (${getTimeRangeLabel()})`}
            icon={BarChart}
            color={metrics.totalPnLPercentage >= 0 ? "success" : "error"}
            progress={Math.abs(metrics.totalPnLPercentage) * 5}
            chip={
              <Chip 
                label={metrics.totalPnLPercentage >= 0 ? 'Ganancia' : 'Pérdida'}
                size="small"
                sx={{ 
                  bgcolor: metrics.totalPnLPercentage >= 0 ? 'success.100' : 'error.100',
                  color: metrics.totalPnLPercentage >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600
                }}
              />
            }
          />
        </Grid>

        {/* Mejor Activo */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="MEJOR ACTIVO"
            value={metrics.bestAsset?.symbol || 'N/A'}
            subtitle={`${formatPercentage(metrics.bestAsset?.performance || 0)} (${getTimeRangeLabel()})`}
            icon={Star}
            color="warning"
            progress={Math.abs(metrics.bestAsset?.performance || 0) * 2}
            chip={
              <Chip 
                label={formatPercentage(metrics.bestAsset?.performance || 0)}
                size="small"
                sx={{ 
                  bgcolor: 'warning.100',
                  color: 'warning.main',
                  fontWeight: 600
                }}
              />
            }
          />
        </Grid>

        {/* Peor Activo */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="PEOR ACTIVO"
            value={metrics.worstAsset?.symbol || 'N/A'}
            subtitle={`${formatPercentage(metrics.worstAsset?.performance || 0)} (${getTimeRangeLabel()})`}
            icon={TrendingDown}
            color={metrics.worstAsset?.performance >= 0 ? "success" : "error"}
            progress={Math.abs(metrics.worstAsset?.performance || 0) * 2}
            chip={
              <Chip 
                label={formatPercentage(metrics.worstAsset?.performance || 0)}
                size="small"
                sx={{ 
                  bgcolor: metrics.worstAsset?.performance >= 0 ? 'success.100' : 'error.100',
                  color: metrics.worstAsset?.performance >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600
                }}
              />
            }
          />
        </Grid>

        {/* Volatilidad */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <MetricCard
            title="VOLATILIDAD"
            value={`${metrics.avgVolatility.toFixed(1)}%`}
            subtitle={`Promedio (${getTimeRangeLabel()})`}
            icon={Speed}
            color={metrics.avgVolatility > 10 ? "error" : metrics.avgVolatility > 5 ? "warning" : "success"}
            progress={Math.min(metrics.avgVolatility * 5, 100)}
            chip={
              <Chip 
                label={
                  metrics.avgVolatility > 10 ? 'Alta' : 
                  metrics.avgVolatility > 5 ? 'Media' : 'Baja'
                }
                size="small"
                sx={{ 
                  bgcolor: metrics.avgVolatility > 10 ? 'error.100' : 
                           metrics.avgVolatility > 5 ? 'warning.100' : 'success.100',
                  color: metrics.avgVolatility > 10 ? 'error.main' : 
                         metrics.avgVolatility > 5 ? 'warning.main' : 'success.main',
                  fontWeight: 600
                }}
              />
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioMetrics;

