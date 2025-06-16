import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const AssetCard = ({ asset, symbol }) => {
  if (!asset) return null;

  const isProfitable = asset.pnl >= 0;
  const isDailyPositive = asset.dailyReturn?.priceChangePercent >= 0;
  const isWeeklyPositive = asset.weeklyReturn?.weeklyChangePercent >= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{asset.name}</CardTitle>
          <Badge variant={isProfitable ? "default" : "destructive"}>
            {symbol}
          </Badge>
        </div>
        <div className="text-2xl font-bold">
          {formatCurrency(asset.currentPrice, 4)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información de la inversión */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Cantidad</p>
            <p className="font-medium">{asset.quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Precio de compra</p>
            <p className="font-medium">{formatCurrency(asset.purchasePrice, 4)}</p>
          </div>
        </div>

        {/* Valor actual vs inversión */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Valor actual</p>
            <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Inversión inicial</p>
            <p className="font-medium">{formatCurrency(asset.purchaseValue)}</p>
          </div>
        </div>

        {/* Ganancia/Pérdida total */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">P&L Total</span>
            <div className="flex items-center space-x-1">
              {isProfitable ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(asset.pnl)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(asset.pnlPercentage)}
            </span>
          </div>
        </div>

        {/* Rendimientos */}
        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
          <div>
            <p className="text-muted-foreground mb-1">24h</p>
            <div className="flex items-center space-x-1">
              {isDailyPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${isDailyPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(asset.dailyReturn?.priceChangePercent || 0)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">7d</p>
            <div className="flex items-center space-x-1">
              {isWeeklyPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${isWeeklyPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(asset.weeklyReturn?.weeklyChangePercent || 0)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;

