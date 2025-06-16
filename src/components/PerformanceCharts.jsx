import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const PerformanceCharts = ({ portfolioData, timeRange = '7D' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Gráficos de Rendimiento
        </Typography>
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Cargando gráficos...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Generar datos simulados para el gráfico de evolución del portfolio
  const generatePortfolioEvolution = () => {
    const days = 7;
    const baseValue = 1239.73; // Valor inicial
    const currentValue = Object.values(portfolioData).reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return Array.from({ length: days }, (_, index) => {
      const progress = index / (days - 1);
      const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% variación
      const value = baseValue + (currentValue - baseValue) * progress + baseValue * randomVariation;
      
      return {
        day: `Día ${index + 1}`,
        date: new Date(Date.now() - (days - 1 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalValue: value,
        totalInvestment: baseValue,
        pnl: value - baseValue,
        pnlPercentage: ((value - baseValue) / baseValue) * 100
      };
    });
  };

  const portfolioEvolutionData = generatePortfolioEvolution();

  // Datos para gráfico de dona (distribución por activos)
  const pieData = Object.entries(portfolioData).map(([symbol, asset]) => ({
    name: symbol.replace('USDT', ''),
    value: asset.currentValue,
    percentage: asset.percentage,
    color: getAssetColor(symbol)
  }));

  // Datos para gráfico de barras (rendimiento individual)
  const performanceData = Object.entries(portfolioData)
    .map(([symbol, asset]) => ({
      name: symbol.replace('USDT', ''),
      performance: asset.pnlPercentage,
      pnl: asset.pnl,
      fill: asset.pnlPercentage >= 0 ? theme.palette.success.main : theme.palette.error.main
    }))
    .sort((a, b) => b.performance - a.performance);

  function getAssetColor(symbol) {
    const colors = {
      'RENDERUSDT': '#1f77b4',
      'SUIUSDT': '#ff7f0e', 
      'THETAUSDT': '#2ca02c',
      'RVNUSDT': '#d62728'
    };
    return colors[symbol] || '#8884d8';
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card elevation={3} sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? 
                (entry.name.includes('Value') || entry.name.includes('pnl') ? 
                  formatCurrency(entry.value) : 
                  entry.value.toFixed(2)
                ) : entry.value}
            </Typography>
          ))}
        </Card>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card elevation={3} sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            Valor: {formatCurrency(data.value)}
          </Typography>
          <Typography variant="body2">
            Porcentaje: {data.percentage.toFixed(1)}%
          </Typography>
        </Card>
      );
    }
    return null;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      boxSizing: 'border-box'
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Gráficos de Rendimiento
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          width: '100%',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            flex: 1
          }
        }}
      >
        <Tab label="Evolución del Portfolio" />
        <Tab label="Distribución de Activos" />
        <Tab label="Rendimiento Individual" />
      </Tabs>

      {/* Tab 1: Evolución del Portfolio */}
      {activeTab === 0 && (
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Evolución del Valor Total - {timeRange}
            </Typography>
            <Box sx={{ height: 450, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioEvolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="totalValue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Valor Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalInvestment"
                    stroke={theme.palette.text.secondary}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Inversión Inicial"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Distribución de Activos - CORREGIDO */}
      {activeTab === 1 && (
        <Box sx={{ width: '100%' }}>
          {/* Gráfico de Dona Centrado */}
          <Card elevation={2} sx={{ width: '100%', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Distribución por Activos
              </Typography>
              <Box sx={{ 
                height: 400, 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={150}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Detalles de Distribución en Grid */}
          <Grid container spacing={3} sx={{ width: '100%' }}>
            {pieData.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={item.name} sx={{ display: 'flex' }}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: `2px solid ${item.color}`,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: item.color,
                        margin: '0 auto 16px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} 
                    >
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {item.name.substring(0, 2)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: item.color, mb: 1 }}>
                      {item.percentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(item.value)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 3: Rendimiento Individual */}
      {activeTab === 2 && (
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Rendimiento por Activo
            </Typography>
            <Box sx={{ height: 450, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={performanceData} 
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    width={70}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Card elevation={3} sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              {label}
                            </Typography>
                            <Typography variant="body2">
                              Rendimiento: {formatPercentage(data.performance)}
                            </Typography>
                            <Typography variant="body2">
                              P&L: {formatCurrency(data.pnl)}
                            </Typography>
                          </Card>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="performance" 
                    radius={[0, 4, 4, 0]}
                    name="Rendimiento"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PerformanceCharts;

