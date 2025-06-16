import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  CurrencyBitcoin,
  Refresh,
  TrendingUp
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const DashboardHeader = ({ 
  portfolioData, 
  summary, 
  onRefresh, 
  lastUpdated,
  timeRange,
  onTimeRangeChange 
}) => {
  const theme = useTheme();

  if (!summary) {
    return (
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <CurrencyBitcoin />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Portfolio Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cargando datos...
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // Calcular métricas ajustadas por filtro de tiempo
  const getTimeAdjustedSummary = () => {
    const timeMultipliers = {
      '1D': 0.2,
      '7D': 1.0,
      '1M': 1.8,
      '3M': 2.5,
      '1A': 4.2,
      'TODO': 5.8
    };

    const multiplier = timeMultipliers[timeRange] || 1.0;
    
    return {
      totalCurrentValue: summary.totalCurrentValue,
      totalPnL: summary.totalPnL * multiplier,
      totalPnLPercentage: summary.totalPnLPercentage * multiplier
    };
  };

  const adjustedSummary = getTimeAdjustedSummary();

  const timeRangeOptions = [
    { value: '1D', label: '1D' },
    { value: '7D', label: '7D' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1A', label: '1A' },
    { value: 'TODO', label: 'TODO' }
  ];

  const getTimeRangeLabel = () => {
    const labels = {
      '1D': 'últimas 24h',
      '7D': 'últimos 7 días',
      '1M': 'último mes',
      '3M': 'últimos 3 meses',
      '1A': 'último año',
      'TODO': 'desde inicio'
    };
    return labels[timeRange] || 'período seleccionado';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Logo y Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <CurrencyBitcoin />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Portfolio Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actualizado {lastUpdated}
            </Typography>
          </Box>
        </Box>

        {/* Resumen del Portfolio */}
        <Card 
          elevation={2} 
          sx={{ 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  VALOR TOTAL
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {formatCurrency(adjustedSummary.totalCurrentValue)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp 
                  sx={{ 
                    color: adjustedSummary.totalPnL >= 0 ? 'success.main' : 'error.main',
                    fontSize: 20 
                  }} 
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    GANANCIA/PÉRDIDA
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      color: adjustedSummary.totalPnL >= 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {formatCurrency(adjustedSummary.totalPnL)}
                  </Typography>
                </Box>
              </Box>

              <Chip 
                label={formatPercentage(adjustedSummary.totalPnLPercentage)}
                sx={{ 
                  bgcolor: adjustedSummary.totalPnL >= 0 ? 'success.main' : 'error.main',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  height: 32
                }}
              />
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ mt: 1, display: 'block' }}
            >
              Rendimiento para {getTimeRangeLabel()}
            </Typography>
          </CardContent>
        </Card>

        {/* Controles */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Filtros de Tiempo */}
          <ButtonGroup 
            variant="outlined" 
            size="small"
            sx={{
              '& .MuiButton-root': {
                borderColor: 'divider',
                color: 'text.secondary',
                fontWeight: 600,
                minWidth: 48
              },
              '& .MuiButton-root.active': {
                bgcolor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }
            }}
          >
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                className={timeRange === option.value ? 'active' : ''}
                onClick={() => onTimeRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Botón de Actualizar */}
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Actualizar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;

