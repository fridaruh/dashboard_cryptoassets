import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const AssetCard = ({ asset, symbol }) => {
  if (!asset) return null;

  const isProfitable = asset.pnl >= 0;
  const isDailyPositive = asset.dailyReturn?.priceChangePercent >= 0;
  const isWeeklyPositive = asset.weeklyReturn?.weeklyChangePercent >= 0;

  return (
    <div className="apple-card apple-fade-in group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="apple-headline text-foreground">{asset.name}</h3>
          <p className="apple-caption mt-1">{symbol}</p>
        </div>
        <div className={`apple-status-${isProfitable ? 'positive' : 'negative'}`}>
          {isProfitable ? '+' : ''}{formatPercentage(asset.pnlPercentage, 1)}
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-8">
        <div className="apple-number-large text-foreground">
          {formatCurrency(asset.currentPrice, 4)}
        </div>
        <div className="flex items-center mt-2 space-x-4">
          <div className={`flex items-center space-x-1 ${isDailyPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isDailyPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(asset.dailyReturn?.priceChangePercent || 0, 1)} 24h
            </span>
          </div>
          <div className={`flex items-center space-x-1 ${isWeeklyPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isWeeklyPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(asset.weeklyReturn?.weeklyChangePercent || 0, 1)} 7d
            </span>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="apple-caption">CANTIDAD</span>
          <span className="apple-number text-foreground">{asset.quantity.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="apple-caption">PRECIO DE COMPRA</span>
          <span className="apple-number text-muted-foreground">{formatCurrency(asset.purchasePrice, 4)}</span>
        </div>
        
        <div className="h-px bg-border my-4"></div>
        
        <div className="flex justify-between items-center">
          <span className="apple-caption">VALOR ACTUAL</span>
          <span className="apple-number-medium text-foreground">{formatCurrency(asset.currentValue)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="apple-caption">INVERSIÓN INICIAL</span>
          <span className="apple-number text-muted-foreground">{formatCurrency(asset.purchaseValue)}</span>
        </div>
        
        <div className="h-px bg-border my-4"></div>
        
        <div className="flex justify-between items-center">
          <span className="apple-caption">GANANCIA/PÉRDIDA</span>
          <div className="text-right">
            <div className={`apple-number-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(asset.pnl)}
            </div>
            <div className={`text-sm ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(asset.pnlPercentage)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="apple-progress">
          <div 
            className={`apple-progress-fill ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ 
              width: `${Math.min(Math.abs(asset.pnlPercentage), 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;

