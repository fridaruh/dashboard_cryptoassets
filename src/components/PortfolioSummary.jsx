import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const PortfolioSummary = ({ summary, lastUpdate }) => {
  if (!summary || Object.keys(summary).length === 0) return null;

  const isProfitable = summary.totalPnL >= 0;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <PieChart className="h-6 w-6" />
            <span>Resumen del Portafolio</span>
          </CardTitle>
          <Badge variant="outline">
            {summary.assetCount} Activos
          </Badge>
        </div>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Valor total actual */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Valor Actual</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary.totalCurrentValue)}
            </div>
          </div>

          {/* Inversión total */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-muted-foreground">Inversión Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {formatCurrency(summary.totalInvestment)}
            </div>
          </div>

          {/* P&L en dinero */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {isProfitable ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">P&L Total</span>
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.totalPnL)}
            </div>
          </div>

          {/* P&L en porcentaje */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {isProfitable ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">Rendimiento</span>
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(summary.totalPnLPercentage)}
            </div>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Rendimiento del portafolio</span>
            <span>{formatPercentage(summary.totalPnLPercentage)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isProfitable ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(Math.abs(summary.totalPnLPercentage), 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;

