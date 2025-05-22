import axios from 'axios';
import { getAuthHeaders, getCurrentUser } from './auth'; // Import getCurrentUser

const API_BASE_URL = 'https://bursting-gelding-24.hasura.app/api/rest';

const api = axios.create({
  baseURL: API_BASE_URL
});

const authRequest = async (method, url, data = null) => {
  const config = {
    method,
    url,
    headers: getAuthHeaders()
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

// Fetch all transactions for current user
export const getAllTransactions = async (limit = 10000, offset = 0) => {
  const data = await authRequest('get', '/all-transactions', { 
    limit, 
    offset
    // user_id is now handled by Hasura through the x-hasura-user-id header
  });
  return data.transactions;
};

// Fetch credit and debit totals for current user
export const getCreditDebitTotals = async () => {
  const data = await authRequest('get', '/credit-debit-totals');
  return data.totals_credit_debit_transactions;
};

// Fetch daywise totals for the last 7 days for current user
export const getLast7DaysTotals = async () => {
  const data = await authRequest('get', '/daywise-totals-7-days');
  return data.last_7_days_transactions_credit_debit_totals;
};

// Add a new transaction for current user
export const addTransaction = async (transaction) => {
  const currentUser = getCurrentUser(); // Get current user details
  if (!currentUser || !currentUser.id) {
    throw new Error('User not authenticated. Please log in.');
  }

  const data = await authRequest('post', '/add-transaction', {
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    user_id: parseInt(currentUser.id) // Add user_id to the payload
  });
  return data.insert_transactions_one;
};

// Update an existing transaction
export const updateTransaction = async (transaction) => {
  const currentUser = getCurrentUser(); // Get current user details
  if (!currentUser || !currentUser.id) {
    throw new Error('User not authenticated. Please log in.');
  }

  const data = await authRequest('post', '/update-transaction', {
    id: transaction.id,
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    // user_id: parseInt(currentUser.id) // Add user_id to the payload
  });
  return data.update_transactions_by_pk;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const data = await authRequest('delete', '/delete-transaction', { id });
  return data.delete_transactions_by_pk;
};

// Fetch profile for current user
export const getProfile = async () => {
  const data = await authRequest('get', '/profile');
  return data.users[0];
};