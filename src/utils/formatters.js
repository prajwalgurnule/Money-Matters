// formatters.js
import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd MMM, hh:mm a');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

export const formatShortDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd MMM');
  } catch (e) {
    console.error('Error formatting short date:', e);
    return dateString;
  }
};

export const formatDateTimeForDisplay = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy hh:mm a');
  } catch (e) {
    console.error('Error formatting date for display:', e);
    return dateString;
  }
};

export const formatTransactionDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, hh:mm a');
  } catch (e) {
    console.error('Error formatting transaction date:', e);
    return dateString;
  }
};

export const formatChartDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd');
  } catch (e) {
    console.error('Error formatting chart date:', e);
    return dateString;
  }
};