# Dashboard de Criptomonedas - Guía de Usuario

## 📊 Descripción

Este dashboard te permite monitorear en tiempo real tus inversiones en criptomonedas (RENDER, SUI, THETA, RVN) con datos actualizados de Binance. Muestra ganancias/pérdidas, rendimientos diarios y semanales tanto por activo individual como del portafolio completo.

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- pnpm (incluido en el proyecto)

### Pasos de Instalación

1. **Navegar al directorio del proyecto**:
   ```bash
   cd crypto-dashboard
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   pnpm run dev --host
   ```

4. **Abrir en el navegador**:
   - Accede a `http://localhost:5173`
   - El dashboard se cargará automáticamente

## 📱 Características Principales

### 🏠 Resumen del Portafolio
- **Valor Total Actual**: Suma de todos los activos a precios actuales
- **Inversión Total**: Capital inicial invertido
- **P&L Total**: Ganancia o pérdida total en USD y porcentaje
- **Número de Activos**: Cantidad de criptomonedas en el portafolio

### 📈 Gráficos Interactivos

#### Rendimientos Comparativos
- Gráfico de barras que compara rendimientos de 24h, 7d y total
- Colores diferenciados para cada período
- Tooltips informativos al pasar el mouse

#### Evolución de Precios (7 días)
- Gráfico de líneas mostrando la evolución de precios
- Una línea por cada activo con colores únicos
- Datos históricos de los últimos 7 días

### 💰 Tarjetas de Activos Individuales

Cada activo muestra:
- **Precio Actual**: Precio en tiempo real de Binance
- **Cantidad**: Tokens/monedas que posees
- **Precio de Compra**: Tu precio de entrada
- **Valor Actual vs Inversión Inicial**
- **P&L Total**: Ganancia/pérdida en USD y porcentaje
- **Rendimientos**: 24h y 7d con indicadores visuales

### 🔄 Actualización en Tiempo Real

- **Automática**: Cada 5 segundos
- **Manual**: Botón "Actualizar" en la esquina superior derecha
- **Indicador**: Muestra la última actualización y estado de carga

## 🎨 Interfaz de Usuario

### Colores y Indicadores
- **Verde**: Ganancias positivas
- **Rojo**: Pérdidas
- **Azul**: Información neutral
- **Iconos**: Flechas hacia arriba/abajo para tendencias

### Diseño Responsivo
- Compatible con desktop y móvil
- Layout adaptativo según el tamaño de pantalla
- Componentes optimizados para touch

## 📊 Datos Mostrados

### Por Activo
- Precio actual en tiempo real
- Cantidad de tokens/monedas
- Precio de compra original
- Valor actual de la posición
- Inversión inicial
- Ganancia/pérdida total (USD y %)
- Rendimiento 24h
- Rendimiento 7d

### Portafolio Completo
- Valor total actual
- Inversión total
- P&L total (USD y %)
- Rendimiento general
- Número de activos

## 🔧 Configuración del Portafolio

Los datos de tu portafolio están configurados en `src/config/portfolio.js`:

```javascript
export const PORTFOLIO_CONFIG = {
  RENDERUSDT: {
    symbol: "RENDERUSDT",
    name: "Render Token",
    purchasePrice: 3.42,
    quantity: 92.89,
    investment: 317.70,
    percentage: 25.6
  },
  // ... otros activos
};
```

Para modificar tu portafolio:
1. Edita los valores en este archivo
2. Reinicia el servidor de desarrollo
3. Los cambios se reflejarán automáticamente

## 🌐 Fuente de Datos

- **API**: Binance Public API (`https://data-api.binance.vision`)
- **Endpoints utilizados**:
  - `/api/v3/ticker/price` - Precios actuales
  - `/api/v3/ticker/24hr` - Estadísticas 24h
  - `/api/v3/klines` - Datos históricos

## 🚨 Manejo de Errores

El dashboard maneja automáticamente:
- Errores de conexión a la API
- Timeouts de red
- Datos faltantes o incorrectos
- Muestra alertas visuales cuando hay problemas

## 💡 Consejos de Uso

1. **Mantén la pestaña abierta** para actualizaciones automáticas
2. **Usa el botón actualizar** si necesitas datos inmediatos
3. **Revisa los gráficos** para entender tendencias
4. **Observa los indicadores de color** para identificar rápidamente ganancias/pérdidas

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm run dev --host

# Construcción para producción
pnpm run build

# Vista previa de producción
pnpm run preview

# Linting
pnpm run lint
```

## 📞 Soporte

Si encuentras algún problema:
1. Verifica tu conexión a internet
2. Revisa la consola del navegador (F12)
3. Reinicia el servidor de desarrollo
4. Verifica que Binance API esté disponible

---

**¡Disfruta monitoreando tus inversiones en tiempo real! 🚀📈**

