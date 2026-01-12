/**
 * Localización para España
 * Centraliza formato de fechas, moneda y números
 */

export const LOCALE = 'es-ES';
export const CURRENCY = 'EUR';
export const TIMEZONE = 'Europe/Madrid';

/**
 * Formatea una fecha al formato español
 * @param date - Timestamp o Date object
 * @returns Fecha formateada (ej: "15/03/2024")
 */
export function formatDate(date: number | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea una fecha con hora al formato español
 * @param date - Timestamp o Date object
 * @returns Fecha y hora formateada (ej: "15/03/2024, 14:30")
 */
export function formatDateTime(date: number | Date): string {
  return new Date(date).toLocaleString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea un precio en euros
 * @param amount - Cantidad en euros
 * @returns Precio formateado (ej: "4,99 €")
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea un número al formato español
 * @param value - Número a formatear
 * @returns Número formateado (ej: "1.234,56")
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

/**
 * Formatea una fecha relativa (ej: "hace 2 días")
 * @param date - Timestamp o Date object
 * @returns Fecha relativa en español
 */
export function formatRelativeTime(date: number | Date): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'hace unos segundos';
  } else if (diffMin < 60) {
    return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHour < 24) {
    return `hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
  } else if (diffDay < 7) {
    return `hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
  } else if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(diffDay / 365);
    return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}
