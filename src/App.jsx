import React, { useState } from 'react';
import { 
  Box, 
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import DashboardHeader from './components/DashboardHeader.jsx';
import PortfolioMetrics from './components/PortfolioMetrics.jsx';
import PerformanceCharts from './components/PerformanceCharts.jsx';
import DiversificationAnalysis from './components/DiversificationAnalysis.jsx';
import AssetsTable from './components/AssetsTable.jsx';
import AlertsAnalysis from './components/AlertsAnalysis.jsx';
import { usePortfolioData } from './hooks/usePortfolioData.js';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
      100: '#c8e6c9',
    },
    error: {
      main: '#d32f2f',
      100: '#ffcdd2',
    },
    warning: {
      main: '#ed6c02',
      100: '#ffe0b2',
    },
    info: {
      main: '#0288d1',
      100: '#b3e5fc',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#e0e0e0',
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [timeRange, setTimeRange] = useState('7D');
  const { portfolioData, summary, loading, error, lastUpdated, refreshData } = usePortfolioData();

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          width: '100vw', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <h2>Error al cargar los datos</h2>
            <p>{error}</p>
            <button onClick={handleRefresh}>Reintentar</button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        boxSizing: 'border-box'
      }}>
        {/* Header Sticky */}
        <DashboardHeader 
          portfolioData={portfolioData}
          summary={summary}
          onRefresh={handleRefresh}
          lastUpdated={lastUpdated}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* Contenido Principal */}
        <Box sx={{ 
          flex: 1,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {loading ? (
            <Box sx={{ 
              height: '60vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <h2>Crypto Portfolio Dashboard</h2>
                <p>Cargando datos del portafolio...</p>
              </Box>
            </Box>
          ) : (
            <>
              {/* Sección 1: Métricas Principales */}
              <PortfolioMetrics 
                portfolioData={portfolioData} 
                summary={summary}
                timeRange={timeRange}
              />

              {/* Sección 2: Gráficos de Rendimiento */}
              <PerformanceCharts 
                portfolioData={portfolioData}
                timeRange={timeRange}
              />

              {/* Sección 3: Análisis de Diversificación */}
              <DiversificationAnalysis 
                portfolioData={portfolioData}
                summary={summary}
              />

              {/* Sección 4: Tabla Detallada de Activos */}
              <AssetsTable 
                portfolioData={portfolioData}
              />

              {/* Sección 5: Alertas y Análisis */}
              <AlertsAnalysis 
                portfolioData={portfolioData}
                summary={summary}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          width: '100%',
          py: 3,
          px: 3,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Datos proporcionados por Binance API • Actualización automática cada 5 segundos
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 1 }}>
            Última actualización: {lastUpdated}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

