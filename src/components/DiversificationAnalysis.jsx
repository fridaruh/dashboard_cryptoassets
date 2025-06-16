import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Chip,
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const DiversificationAnalysis = ({ portfolioData, summary }) => {
  const theme = useTheme();

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Análisis de Diversificación
        </Typography>
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Cargando análisis...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Datos de concentración de riesgo
  const riskData = Object.entries(portfolioData).map(([symbol, asset]) => ({
    name: symbol.replace('USDT', ''),
    value: asset.percentage,
    risk: calculateRiskLevel(asset.percentage),
    volatility: Math.abs(asset.dailyReturn?.priceChangePercent || 0),
    color: getRiskColor(asset.percentage)
  }));

  // Datos para matriz de correlación simplificada (usando barras)
  const correlationData = [
    { pair: 'RENDER-SUI', correlation: 65 },
    { pair: 'RENDER-THETA', correlation: 45 },
    { pair: 'RENDER-RVN', correlation: 30 },
    { pair: 'SUI-THETA', correlation: 55 },
    { pair: 'SUI-RVN', correlation: 25 },
    { pair: 'THETA-RVN', correlation: 40 }
  ];

  // Métricas de diversificación
  const diversificationMetrics = calculateDiversificationMetrics(portfolioData);

  function calculateRiskLevel(percentage) {
    if (percentage > 40) return 'Alto';
    if (percentage > 25) return 'Medio';
    return 'Bajo';
  }

  function getRiskColor(percentage) {
    if (percentage > 40) return theme.palette.error.main;
    if (percentage > 25) return theme.palette.warning.main;
    return theme.palette.success.main;
  }

  function calculateDiversificationMetrics(data) {
    const assets = Object.values(data);
    const weights = assets.map(asset => asset.percentage / 100);
    
    // Índice Herfindahl-Hirschman (HHI)
    const hhi = weights.reduce((sum, weight) => sum + weight * weight, 0);
    const diversificationIndex = (1 - hhi) * 100;
    
    // Concentración del top activo
    const maxWeight = Math.max(...weights) * 100;
    
    // Número efectivo de activos
    const effectiveAssets = 1 / hhi;
    
    return {
      diversificationIndex: diversificationIndex.toFixed(1),
      concentration: maxWeight.toFixed(1),
      effectiveAssets: effectiveAssets.toFixed(1),
      riskLevel: maxWeight > 40 ? 'Alto' : maxWeight > 25 ? 'Medio' : 'Bajo'
    };
  }

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card elevation={3} sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            Porcentaje: {data.value.toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            Riesgo: {data.risk}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      boxSizing: 'border-box'
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Análisis de Diversificación
      </Typography>

      {/* SECCIÓN SUPERIOR: Métricas y Gráficos Principales - CORREGIDO */}
      <Grid container spacing={3} sx={{ width: '100%', mb: 4 }}>
        {/* Métricas de Diversificación */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Métricas de Diversificación
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    ÍNDICE DE DIVERSIFICACIÓN
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {diversificationMetrics.diversificationIndex}%
                  </Typography>
                  <Chip 
                    label={parseFloat(diversificationMetrics.diversificationIndex) > 60 ? 'Bien Diversificado' : 'Concentrado'}
                    size="small"
                    sx={{ 
                      bgcolor: parseFloat(diversificationMetrics.diversificationIndex) > 60 ? 'success.100' : 'warning.100',
                      color: parseFloat(diversificationMetrics.diversificationIndex) > 60 ? 'success.main' : 'warning.main',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    CONCENTRACIÓN MÁXIMA
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {diversificationMetrics.concentration}%
                  </Typography>
                  <Chip 
                    label={`Riesgo ${diversificationMetrics.riskLevel}`}
                    size="small"
                    sx={{ 
                      bgcolor: diversificationMetrics.riskLevel === 'Alto' ? 'error.100' : 
                               diversificationMetrics.riskLevel === 'Medio' ? 'warning.100' : 'success.100',
                      color: diversificationMetrics.riskLevel === 'Alto' ? 'error.main' : 
                             diversificationMetrics.riskLevel === 'Medio' ? 'warning.main' : 'success.main',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    ACTIVOS EFECTIVOS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {diversificationMetrics.effectiveAssets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    de {Object.keys(portfolioData).length} activos totales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribución de Riesgo - Gráfico de Dona Mejorado */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Distribución de Riesgo
              </Typography>
              <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Correlaciones - Gráfico de Barras Mejorado */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Correlaciones entre Activos
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correlationData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="pair" 
                      tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Correlación']}
                      labelStyle={{ color: theme.palette.text.primary }}
                    />
                    <Bar 
                      dataKey="correlation" 
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECCIÓN INFERIOR: Análisis de Concentración por Activo - MEJORADO */}
      <Card elevation={2} sx={{ width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Análisis de Concentración por Activo
          </Typography>
          
          <Grid container spacing={3} sx={{ width: '100%' }}>
            {riskData.map((asset) => (
              <Grid item xs={12} sm={6} md={3} key={asset.name} sx={{ display: 'flex' }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    textAlign: 'center',
                    border: `2px solid ${asset.color}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${asset.color}30`
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: '50%', 
                    bgcolor: asset.color,
                    margin: '0 auto 16px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {asset.name.substring(0, 2)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {asset.name}
                  </Typography>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, color: asset.color, mb: 1 }}>
                    {asset.value.toFixed(1)}%
                  </Typography>
                  
                  <Chip 
                    label={asset.risk}
                    size="small"
                    sx={{ 
                      bgcolor: asset.color + '20',
                      color: asset.color,
                      fontWeight: 600,
                      mb: 2
                    }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Volatilidad: {asset.volatility.toFixed(1)}%
                  </Typography>
                  
                  <Box sx={{ 
                    height: 8, 
                    bgcolor: 'grey.200', 
                    borderRadius: 4,
                    overflow: 'hidden',
                    width: '100%'
                  }}>
                    <Box sx={{ 
                      height: '100%', 
                      width: `${Math.min(asset.value * 4, 100)}%`, 
                      bgcolor: asset.color,
                      transition: 'width 0.3s ease',
                      borderRadius: 4
                    }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiversificationAnalysis;

