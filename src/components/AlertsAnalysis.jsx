import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  Warning,
  Info,
  CheckCircle,
  Error,
  TrendingUp,
  TrendingDown,
  Speed,
  Security
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../utils/calculations.js';

const AlertsAnalysis = ({ portfolioData, summary }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Alertas y Análisis
        </Typography>
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Cargando análisis...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Generar alertas basadas en los datos del portfolio
  const generateAlerts = () => {
    const alerts = {
      critical: [],
      warning: [],
      info: [],
      success: []
    };

    // Análisis de concentración
    Object.entries(portfolioData).forEach(([symbol, asset]) => {
      if (asset.percentage > 30) {
        alerts.critical.push({
          type: 'concentration',
          title: `Alta concentración en ${symbol.replace('USDT', '')}`,
          description: `${asset.percentage.toFixed(1)}% del portfolio está concentrado en un solo activo`,
          icon: Warning,
          value: asset.percentage
        });
      } else if (asset.percentage > 25) {
        alerts.warning.push({
          type: 'concentration',
          title: `Concentración moderada en ${symbol.replace('USDT', '')}`,
          description: `${asset.percentage.toFixed(1)}% del portfolio en un activo`,
          icon: Info,
          value: asset.percentage
        });
      }

      // Análisis de rendimiento
      if (asset.pnlPercentage > 10) {
        alerts.success.push({
          type: 'performance',
          title: `Excelente rendimiento en ${symbol.replace('USDT', '')}`,
          description: `Ganancia del ${asset.pnlPercentage.toFixed(1)}% (${formatCurrency(asset.pnl)})`,
          icon: TrendingUp,
          value: asset.pnlPercentage
        });
      } else if (asset.pnlPercentage < -5) {
        alerts.warning.push({
          type: 'performance',
          title: `Pérdida en ${symbol.replace('USDT', '')}`,
          description: `Pérdida del ${Math.abs(asset.pnlPercentage).toFixed(1)}% (${formatCurrency(asset.pnl)})`,
          icon: TrendingDown,
          value: asset.pnlPercentage
        });
      }

      // Análisis de volatilidad
      const volatility = Math.abs(asset.dailyReturn?.priceChangePercent || 0);
      if (volatility > 10) {
        alerts.warning.push({
          type: 'volatility',
          title: `Alta volatilidad en ${symbol.replace('USDT', '')}`,
          description: `Cambio del ${volatility.toFixed(1)}% en las últimas 24h`,
          icon: Speed,
          value: volatility
        });
      }
    });

    // Análisis general del portfolio
    if (summary.totalPnLPercentage > 5) {
      alerts.success.push({
        type: 'portfolio',
        title: 'Portfolio con excelente rendimiento',
        description: `Ganancia total del ${summary.totalPnLPercentage.toFixed(1)}% (${formatCurrency(summary.totalPnL)})`,
        icon: CheckCircle,
        value: summary.totalPnLPercentage
      });
    }

    // Diversificación
    const assetCount = Object.keys(portfolioData).length;
    if (assetCount < 3) {
      alerts.warning.push({
        type: 'diversification',
        title: 'Portfolio poco diversificado',
        description: `Solo ${assetCount} activos en el portfolio. Considera diversificar más.`,
        icon: Security,
        value: assetCount
      });
    } else {
      alerts.info.push({
        type: 'diversification',
        title: 'Diversificación adecuada',
        description: `Portfolio diversificado con ${assetCount} activos diferentes`,
        icon: Security,
        value: assetCount
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  // Recomendaciones basadas en el análisis
  const generateRecommendations = () => {
    const recommendations = [];

    // Recomendaciones de rebalanceo
    const maxAsset = Object.entries(portfolioData).reduce((max, [symbol, asset]) => 
      asset.percentage > (max?.asset?.percentage || 0) ? { symbol, asset } : max, null);

    if (maxAsset && maxAsset.asset.percentage > 30) {
      recommendations.push({
        type: 'rebalance',
        priority: 'high',
        title: 'Rebalancear portfolio',
        description: `Considera reducir la posición en ${maxAsset.symbol.replace('USDT', '')} y diversificar`,
        action: 'Vender parcialmente y redistribuir'
      });
    }

    // Recomendaciones de toma de ganancias
    Object.entries(portfolioData).forEach(([symbol, asset]) => {
      if (asset.pnlPercentage > 15) {
        recommendations.push({
          type: 'profit',
          priority: 'medium',
          title: `Considerar toma de ganancias en ${symbol.replace('USDT', '')}`,
          description: `Ganancia del ${asset.pnlPercentage.toFixed(1)}% - considera asegurar beneficios`,
          action: 'Vender parcialmente'
        });
      }
    });

    // Recomendaciones de diversificación
    if (Object.keys(portfolioData).length < 5) {
      recommendations.push({
        type: 'diversify',
        priority: 'medium',
        title: 'Aumentar diversificación',
        description: 'Considera añadir más activos para reducir el riesgo',
        action: 'Investigar nuevos activos'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getAlertColor = (type) => {
    const colors = {
      critical: 'error',
      warning: 'warning',
      info: 'info',
      success: 'success'
    };
    return colors[type] || 'info';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'info';
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      boxSizing: 'border-box'
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Alertas y Análisis
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          width: '100%',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            flex: 1
          }
        }}
      >
        <Tab label="Alertas del Sistema" />
        <Tab label="Recomendaciones" />
        <Tab label="Análisis de Riesgo" />
      </Tabs>

      {/* Tab 1: Alertas del Sistema */}
      {activeTab === 0 && (
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {/* Alertas Críticas */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}>
                  Alertas Críticas ({alerts.critical.length})
                </Typography>
                {alerts.critical.length === 0 ? (
                  <Alert severity="success">
                    <AlertTitle>Sin alertas críticas</AlertTitle>
                    Tu portfolio no presenta riesgos críticos en este momento.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {alerts.critical.map((alert, index) => (
                      <Alert key={index} severity="error">
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.description}
                      </Alert>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Alertas de Advertencia */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'warning.main' }}>
                  Advertencias ({alerts.warning.length})
                </Typography>
                {alerts.warning.length === 0 ? (
                  <Alert severity="info">
                    <AlertTitle>Sin advertencias</AlertTitle>
                    No hay advertencias importantes en este momento.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {alerts.warning.map((alert, index) => (
                      <Alert key={index} severity="warning">
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.description}
                      </Alert>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Información y Éxitos */}
          <Grid item xs={12}>
            <Card elevation={2} sx={{ width: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
                  Información Positiva ({alerts.success.length + alerts.info.length})
                </Typography>
                <Grid container spacing={2}>
                  {[...alerts.success, ...alerts.info].map((alert, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Alert severity={alert.type === 'success' ? 'success' : 'info'}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.description}
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Recomendaciones */}
      {activeTab === 1 && (
        <Card elevation={2} sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recomendaciones Personalizadas
            </Typography>
            {recommendations.length === 0 ? (
              <Alert severity="info">
                <AlertTitle>Sin recomendaciones</AlertTitle>
                Tu portfolio está bien balanceado en este momento.
              </Alert>
            ) : (
              <List sx={{ width: '100%' }}>
                {recommendations.map((rec, index) => (
                  <ListItem key={index} sx={{ mb: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(rec.priority)}.main` }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {rec.title}
                          </Typography>
                          <Chip 
                            label={rec.priority.toUpperCase()} 
                            size="small"
                            color={getPriorityColor(rec.priority)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {rec.description}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Acción sugerida: {rec.action}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Análisis de Riesgo */}
      {activeTab === 2 && (
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Nivel de Riesgo General
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    MEDIO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Basado en diversificación y volatilidad
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Factores de Riesgo
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Concentración" 
                      secondary="Distribución de activos"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Volatilidad" 
                      secondary="Fluctuaciones de precio"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Diversificación" 
                      secondary="Número de activos"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Card elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Métricas de Riesgo
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      VaR (95%)
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatCurrency(summary.totalCurrentValue * 0.05)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      1.24
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Beta del Portfolio
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      0.87
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AlertsAnalysis;

