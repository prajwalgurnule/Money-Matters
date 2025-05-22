import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM, hh:mm a');
};

export const formatShortDate = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM');
};