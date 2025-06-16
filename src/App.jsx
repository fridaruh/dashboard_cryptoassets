import React from 'react';
import { usePortfolioData } from './hooks/usePortfolioData.js';
import AssetCard from './components/AssetCard.jsx';
import PortfolioSummary from './components/PortfolioSummary.jsx';
import PerformanceChart from './components/PerformanceChart.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Loader2, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  const { 
    portfolioData, 
    portfolioSummary, 
    loading, 
    error, 
    lastUpdate, 
    refetch 
  } = usePortfolioData();

  if (loading && Object.keys(portfolioData).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Cargando datos del portafolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Dashboard de Criptomonedas</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor de portafolio en tiempo real
                </p>
              </div>
            </div>
            <Button 
              onClick={refetch} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los datos: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Portfolio Summary */}
        <PortfolioSummary summary={portfolioSummary} lastUpdate={lastUpdate} />

        {/* Performance Charts */}
        <PerformanceChart portfolioData={portfolioData} />

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(portfolioData).map(([symbol, asset]) => (
            <AssetCard 
              key={symbol} 
              asset={asset} 
              symbol={symbol.replace('USDT', '')} 
            />
          ))}
        </div>

        {/* Loading indicator for updates */}
        {loading && Object.keys(portfolioData).length > 0 && (
          <div className="fixed bottom-4 right-4">
            <div className="bg-card border rounded-lg p-3 shadow-lg flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Actualizando...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Datos proporcionados por Binance API • Actualización automática cada 5 segundos</p>
            {lastUpdate && (
              <p className="mt-1">
                Última actualización: {lastUpdate.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

