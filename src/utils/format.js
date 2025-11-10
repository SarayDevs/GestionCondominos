// Utilidades de formato para números y moneda

/**
 * Formatea un número sin decimales y con separadores de miles
 * Ejemplo: 500000 -> "500.000"
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  // Redondear a entero y formatear con puntos como separadores de miles
  return Math.round(num).toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Formatea un número como moneda colombiana sin decimales
 * Ejemplo: 500000 -> "$500.000"
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0';
  
  return `$${formatNumber(num)}`;
};

/**
 * Formatea un número con decimales opcionales
 */
export const formatCurrencyWithDecimals = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

