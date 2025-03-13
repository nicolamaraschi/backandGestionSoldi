import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: EUR)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @param {object} options - Additional formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EUR', locale = 'en-US', options = {}) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options
  }).format(amount);
};

/**
 * Format a date to a specific format
 * @param {Date|string|number} date - Date to format
 * @param {string} formatString - Format string (default: 'dd MMM yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  return format(new Date(date), formatString);
};

/**
 * Format a date as relative time from now
 * @param {Date|string|number} date - Date to format
 * @param {object} options - Additional formatting options
 * @returns {string} Relative time string (e.g., "3 days ago")
 */
export const formatRelativeTime = (date, options = { addSuffix: true }) => {
  return formatDistanceToNow(new Date(date), options);
};

/**
 * Format a number to string with thousand separators
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 2, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format a percentage value
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Format a date range
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @param {string} formatString - Format string for dates (default: 'MMM d')
 * @param {string} endFormatString - Format string for end date (default: 'MMM d, yyyy')
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, formatString = 'MMM d', endFormatString = 'MMM d, yyyy') => {
  return `${format(new Date(startDate), formatString)} - ${format(new Date(endDate), endFormatString)}`;
};