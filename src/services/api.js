import axios from 'axios';
import { getAuthHeaders, isAdmin, getCurrentUser } from './auth';

const API_BASE_URL = 'https://bursting-gelding-24.hasura.app/api/rest';

const api = axios.create({
  baseURL: API_BASE_URL
});

const authRequest = async (method, url, data = null, customHeaders = {}) => {
  const config = {
    method,
    url,
    headers: {
      ...getAuthHeaders(), // Get default headers
      ...customHeaders     // Apply custom headers, overriding if necessary
    }
  };

  if (method === 'get' && data) {
    config.params = data;
  } else if (data) {
    config.data = data;
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};

// Admin specific APIs
export const getAdminCreditDebitTotals = async () => {
  if (!isAdmin()) throw new Error('Admin access required');
  const data = await authRequest('get', '/transaction-totals-admin');
  return data.transaction_totals_admin;
};

export const getAdminLast7DaysTotals = async () => {
  if (!isAdmin()) throw new Error('Admin access required');
  const data = await authRequest('get', '/daywise-totals-last-7-days-admin');
  return data.last_7_days_transactions_totals_admin;
};

// Regular user APIs
export const getAllTransactions = async (limit = 10000, offset = 0) => {
  const data = await authRequest('get', '/all-transactions', { 
    limit, 
    offset,
    order_by: { date: 'desc' }
  });
  return data.transactions || [];
};

export const getCreditDebitTotals = async () => {
  if (isAdmin()) {
    return getAdminCreditDebitTotals();
  }
  const data = await authRequest('get', '/credit-debit-totals');
  return data.totals_credit_debit_transactions;
};

export const getLast7DaysTotals = async () => {
  if (isAdmin()) {
    return getAdminLast7DaysTotals();
  }
  const data = await authRequest('get', '/daywise-totals-7-days');
  return data.last_7_days_transactions_credit_debit_totals;
};

export const addTransaction = async (transaction) => {
  if (isAdmin()) throw new Error('Admin cannot add transactions');
  
  const currentUser = getCurrentUser();
  if (!currentUser?.id) throw new Error('User not authenticated');

  const payload = {
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: parseFloat(transaction.amount),
    date: transaction.date,
    user_id: parseInt(currentUser.id)
  };

  const data = await authRequest('post', '/add-transaction', payload);
  return {
    id: data.insert_transactions_one.id,
    ...payload
  };
};

export const updateTransaction = async (transaction) => {
  if (isAdmin()) throw new Error('Admin cannot update transactions');

  const currentUser = getCurrentUser();
  if (!currentUser?.id) throw new Error('User not authenticated');

  const payload = {
    id: transaction.id,
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: parseFloat(transaction.amount),
    date: transaction.date
  };

  const data = await authRequest('post', '/update-transaction', payload);
  return {
    ...payload,
    ...data.update_transactions_by_pk
  };
};

export const deleteTransaction = async (id) => {
  if (isAdmin()) throw new Error('Admin cannot delete transactions');
  
  await authRequest('delete', '/delete-transaction', { id });
  return id;
};

export const getProfile = async () => {
  // Always fetch profile with 'user' role, regardless of logged-in role
  const data = await authRequest('get', '/profile', null, { 'x-hasura-role': 'user' });
  return data.users[0];
};