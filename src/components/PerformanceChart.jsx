import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

const PerformanceChart = ({ portfolioData }) => {
  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Rendimiento por Activo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Cargando datos...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar datos para el gráfico de barras de rendimiento
  const performanceData = Object.entries(portfolioData).map(([symbol, asset]) => ({
    name: asset.name.split(' ')[0], // Usar solo la primera palabra del nombre
    symbol: symbol.replace('USDT', ''),
    daily: asset.dailyReturn?.priceChangePercent || 0,
    weekly: asset.weeklyReturn?.weeklyChangePercent || 0,
    total: asset.pnlPercentage || 0
  }));

  // Preparar datos para el gráfico de líneas de precios históricos
  const priceData = Object.entries(portfolioData).reduce((acc, [symbol, asset]) => {
    if (asset.historicalData && asset.historicalData.length > 0) {
      asset.historicalData.forEach((dataPoint, index) => {
        if (!acc[index]) {
          acc[index] = {
            day: `Día ${index + 1}`,
            date: new Date(dataPoint.closeTime).toLocaleDateString()
          };
        }
        acc[index][symbol.replace('USDT', '')] = dataPoint.close;
      });
    }
    return acc;
  }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de rendimientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Rendimientos Comparativos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
                labelFormatter={(label) => `Activo: ${label}`}
              />
              <Bar dataKey="daily" fill="#8884d8" name="24h" />
              <Bar dataKey="weekly" fill="#82ca9d" name="7d" />
              <Bar dataKey="total" fill="#ffc658" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de precios históricos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Evolución de Precios (7 días)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${value?.toFixed(4)}`, name]}
                labelFormatter={(label) => label}
              />
              {Object.keys(portfolioData).map((symbol, index) => (
                <Line 
                  key={symbol}
                  type="monotone" 
                  dataKey={symbol.replace('USDT', '')} 
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;

