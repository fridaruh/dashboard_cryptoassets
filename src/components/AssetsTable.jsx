import React, { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown 
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

// Componente para sparkline SVG
const SparklineRenderer = ({ value }) => {
  if (!value || !Array.isArray(value)) return null;
  
  const width = 80;
  const height = 30;
  const padding = 2;
  
  const min = Math.min(...value);
  const max = Math.max(...value);
  const range = max - min || 1;
  
  const points = value.map((val, index) => {
    const x = padding + (index / (value.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  const isPositive = value[value.length - 1] > value[0];
  const color = isPositive ? '#2e7d32' : '#d32f2f';
  
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Componente para el símbolo del activo
const AssetSymbolRenderer = ({ value, data }) => {
  const getAssetIcon = (symbol) => {
    const colors = {
      'RENDER': '#1f77b4',
      'SUI': '#ff7f0e',
      'THETA': '#2ca02c',
      'RVN': '#d62728'
    };
    return colors[symbol] || '#8884d8';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar 
        sx={{ 
          width: 32, 
          height: 32, 
          bgcolor: getAssetIcon(value),
          fontSize: '0.75rem',
          fontWeight: 600
        }}
      >
        {value.substring(0, 2)}
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.fullName}
        </Typography>
      </Box>
    </Box>
  );
};

// Componente para cambio de precio
const PriceChangeRenderer = ({ value, data }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon 
        sx={{ 
          fontSize: 16, 
          color: isPositive ? 'success.main' : 'error.main' 
        }} 
      />
      <Box>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: isPositive ? 'success.main' : 'error.main'
          }}
        >
          {formatPercentage(value)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(data.priceChange24hAbs)}
        </Typography>
      </Box>
    </Box>
  );
};

// Componente para P&L
const PnLRenderer = ({ value, data }) => {
  const isPositive = value >= 0;
  
  return (
    <Box>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600,
          color: isPositive ? 'success.main' : 'error.main'
        }}
      >
        {formatCurrency(value)}
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: isPositive ? 'success.main' : 'error.main'
        }}
      >
        {formatPercentage(data.pnlPercentage)}
      </Typography>
    </Box>
  );
};

// Componente para porcentaje del portfolio
const PortfolioPercentageRenderer = ({ value }) => {
  const getColor = (percentage) => {
    if (percentage > 30) return 'error';
    if (percentage > 20) return 'warning';
    return 'success';
  };

  const color = getColor(value);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value.toFixed(1)}%
      </Typography>
      <Box sx={{ 
        width: 60, 
        height: 6, 
        bgcolor: 'grey.200', 
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          height: '100%', 
          width: `${Math.min(value * 3, 100)}%`, 
          bgcolor: `${color}.main`,
          borderRadius: 3
        }} />
      </Box>
    </Box>
  );
};

const AssetsTable = ({ portfolioData }) => {
  const theme = useTheme();
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  // Generar datos simulados de sparkline para cada activo
  const generateSparklineData = () => {
    return Array.from({ length: 7 }, () => 
      Math.random() * 0.1 - 0.05 // ±5% variación diaria
    );
  };

  const rowData = useMemo(() => {
    if (!portfolioData || Object.keys(portfolioData).length === 0) {
      return [];
    }

    return Object.entries(portfolioData).map(([symbol, asset]) => {
      const cleanSymbol = symbol.replace('USDT', '');
      const sparklineData = generateSparklineData();
      
      return {
        symbol: cleanSymbol,
        fullName: getFullName(cleanSymbol),
        currentPrice: asset.currentPrice,
        priceChange24h: asset.dailyReturn?.priceChangePercent || 0,
        priceChange24hAbs: asset.dailyReturn?.priceChange || 0,
        quantity: asset.quantity,
        totalValue: asset.currentValue,
        pnl: asset.pnl,
        pnlPercentage: asset.pnlPercentage,
        portfolioPercentage: asset.percentage,
        avgBuyPrice: asset.avgBuyPrice,
        sparkline: sparklineData
      };
    });
  }, [portfolioData]);

  function getFullName(symbol) {
    const names = {
      'RENDER': 'Render Token',
      'SUI': 'Sui Network',
      'THETA': 'Theta Network',
      'RVN': 'Ravencoin'
    };
    return names[symbol] || symbol;
  }

  const columnDefs = useMemo(() => [
    {
      headerName: 'Activo',
      field: 'symbol',
      cellRenderer: AssetSymbolRenderer,
      width: 150,
      pinned: 'left',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Precio Actual',
      field: 'currentPrice',
      valueFormatter: ({ value }) => formatCurrency(value),
      width: 120,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'Cambio 24h',
      field: 'priceChange24h',
      cellRenderer: PriceChangeRenderer,
      width: 130,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'Cantidad',
      field: 'quantity',
      valueFormatter: ({ value }) => value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 6 
      }),
      width: 120,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'Valor Total',
      field: 'totalValue',
      valueFormatter: ({ value }) => formatCurrency(value),
      width: 120,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'P&L',
      field: 'pnl',
      cellRenderer: PnLRenderer,
      width: 130,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: '% Portfolio',
      field: 'portfolioPercentage',
      cellRenderer: PortfolioPercentageRenderer,
      width: 130,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'Precio Promedio',
      field: 'avgBuyPrice',
      valueFormatter: ({ value }) => formatCurrency(value),
      width: 140,
      sortable: true,
      type: 'numericColumn'
    },
    {
      headerName: 'Tendencia 7D',
      field: 'sparkline',
      cellRenderer: SparklineRenderer,
      width: 100,
      sortable: false,
      filter: false
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: false,
    flex: 1,
    minWidth: 100
  }), []);

  const gridOptions = useMemo(() => ({
    animateRows: true,
    enableRangeSelection: true,
    suppressMovableColumns: true,
    suppressColumnVirtualisation: true,
    rowHeight: 60,
    headerHeight: 50
  }), []);

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Tabla Detallada de Activos
        </Typography>
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Cargando datos de activos...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      boxSizing: 'border-box'
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Tabla Detallada de Activos
      </Typography>
      
      <Card elevation={2} sx={{ width: '100%' }}>
        <CardContent sx={{ p: 0 }}>
          <Box 
            className="ag-theme-material" 
            sx={{ 
              height: 500, 
              width: '100%',
              '& .ag-header': {
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`
              },
              '& .ag-row': {
                borderBottom: `1px solid ${theme.palette.divider}`
              },
              '& .ag-cell': {
                display: 'flex',
                alignItems: 'center',
                borderRight: `1px solid ${theme.palette.divider}`
              }
            }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              onGridReady={onGridReady}
              suppressMenuHide={true}
              suppressRowClickSelection={true}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssetsTable;

