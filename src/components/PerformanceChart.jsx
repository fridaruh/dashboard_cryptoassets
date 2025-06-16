import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const PerformanceChart = ({ portfolioData }) => {
  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <div className="apple-card apple-fade-in-delay-1">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="apple-headline">Rendimiento</h2>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="apple-skeleton w-full h-48 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Preparar datos para el gráfico de barras de rendimiento
  const performanceData = Object.entries(portfolioData).map(([symbol, asset]) => ({
    name: asset.name.split(' ')[0],
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
            day: `D${index + 1}`,
            date: new Date(dataPoint.closeTime).toLocaleDateString()
          };
        }
        acc[index][symbol.replace('USDT', '')] = dataPoint.close;
      });
    }
    return acc;
  }, []);

  const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="apple-card p-3 shadow-lg border-0">
          <p className="apple-caption mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              {entry.name !== 'date' && (entry.name.includes('%') || entry.dataKey.includes('daily') || entry.dataKey.includes('weekly') || entry.dataKey.includes('total') ? '%' : '')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Rendimientos Comparativos */}
      <div className="apple-card apple-fade-in-delay-1">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="apple-headline">Rendimientos</h2>
            <p className="apple-caption mt-1">COMPARATIVO POR PERÍODO</p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeWidth={0.5} />
              <XAxis 
                dataKey="symbol" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="daily" fill="#007AFF" name="24h" radius={[2, 2, 0, 0]} />
              <Bar dataKey="weekly" fill="#34C759" name="7d" radius={[2, 2, 0, 0]} />
              <Bar dataKey="total" fill="#FF9500" name="Total" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolución de Precios */}
      <div className="apple-card apple-fade-in-delay-2">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="apple-headline">Evolución de Precios</h2>
            <p className="apple-caption mt-1">ÚLTIMOS 7 DÍAS</p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeWidth={0.5} />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(portfolioData).map((symbol, index) => (
                <Line 
                  key={symbol}
                  type="monotone" 
                  dataKey={symbol.replace('USDT', '')} 
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          {Object.entries(portfolioData).map(([symbol, asset], index) => (
            <div key={symbol} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-muted-foreground">
                {symbol.replace('USDT', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

