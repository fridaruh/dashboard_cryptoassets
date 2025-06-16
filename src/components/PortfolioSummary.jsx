import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Clock } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const PortfolioSummary = ({ summary, lastUpdate }) => {
  if (!summary || Object.keys(summary).length === 0) return null;

  const isProfitable = summary.totalPnL >= 0;

  return (
    <div className="apple-card-hero apple-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="apple-title text-foreground">Portafolio</h1>
          <p className="apple-caption mt-2 flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>
              {lastUpdate ? `Actualizado ${lastUpdate.toLocaleTimeString()}` : 'Cargando...'}
            </span>
          </p>
        </div>
        <div className={`apple-status-${isProfitable ? 'positive' : 'negative'} text-lg px-4 py-2`}>
          {formatPercentage(summary.totalPnLPercentage)}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Total Value */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="apple-caption mb-2">VALOR TOTAL</div>
          <div className="apple-number-large text-blue-600">
            {formatCurrency(summary.totalCurrentValue)}
          </div>
        </div>

        {/* Investment */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="apple-caption mb-2">INVERSIÓN</div>
          <div className="apple-number-large text-gray-600">
            {formatCurrency(summary.totalInvestment)}
          </div>
        </div>

        {/* P&L */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isProfitable ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isProfitable ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
          <div className="apple-caption mb-2">GANANCIA/PÉRDIDA</div>
          <div className={`apple-number-large ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.totalPnL)}
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="apple-caption">RENDIMIENTO DEL PORTAFOLIO</span>
          <span className={`apple-number ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(summary.totalPnLPercentage)}
          </span>
        </div>
        
        <div className="apple-progress h-3">
          <div 
            className={`apple-progress-fill h-3 ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ 
              width: `${Math.min(Math.abs(summary.totalPnLPercentage), 100)}%` 
            }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-3 text-sm text-muted-foreground">
          <span>0%</span>
          <span>{Math.abs(summary.totalPnLPercentage).toFixed(1)}%</span>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="text-center">
          <div className="apple-caption mb-2">ACTIVOS</div>
          <div className="apple-number-medium text-foreground">{summary.assetCount}</div>
        </div>
        <div className="text-center">
          <div className="apple-caption mb-2">DIVERSIFICACIÓN</div>
          <div className="apple-number-medium text-foreground">
            {(100 / summary.assetCount).toFixed(0)}% promedio
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;

