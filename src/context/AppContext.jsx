import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllTransactions, 
  getCreditDebitTotals, 
  getLast7DaysTotals,
  getProfile
} from '../services/api';
import { isAuthenticated, getCurrentUser } from '../services/auth';
import { deleteTransaction as deleteTransactionApi } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ credit: 0, debit: 0 });
  const [last7Days, setLast7Days] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!isAuthenticated()) return;
    
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      
      const [transactionsData, totalsData, last7DaysData, profileData] = await Promise.all([
        getAllTransactions(),
        getCreditDebitTotals(),
        getLast7DaysTotals(),
        currentUser?.id ? getProfile(currentUser.id) : Promise.resolve(null)
      ]);

      const sortedTransactions = transactionsData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setTransactions(sortedTransactions);
      
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      setTotals({ credit: creditTotal, debit: debitTotal });
      
      setLast7Days(last7DaysData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshTransactions = async () => {
    try {
      const transactionsData = await getAllTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions. Please try again.');
    }
  };

  const addTransactionToState = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (newTransaction.type === 'credit') {
      setTotals(prev => ({
        ...prev,
        credit: prev.credit + parseFloat(newTransaction.amount)
      }));
    } else {
      setTotals(prev => ({
        ...prev,
        debit: prev.debit + parseFloat(newTransaction.amount)
      }));
    }
    
    const transactionDate = new Date(newTransaction.date);
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    
    if (transactionDate >= sevenDaysAgo) {
      const dateKey = formatDateKey(transactionDate);
      setLast7Days(prev => {
        const existingDay = prev.find(day => day.date === dateKey);
        if (existingDay) {
          return prev.map(day => 
            day.date === dateKey
              ? {
                  ...day,
                  sum: day.sum + parseFloat(newTransaction.amount),
                  [newTransaction.type]: day[newTransaction.type] + parseFloat(newTransaction.amount)
                }
              : day
          );
        }
        return [...prev, {
          date: dateKey,
          sum: parseFloat(newTransaction.amount),
          credit: newTransaction.type === 'credit' ? parseFloat(newTransaction.amount) : 0,
          debit: newTransaction.type === 'debit' ? parseFloat(newTransaction.amount) : 0
        }];
      });
    }
  };

  const updateTransactionInState = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
    refreshTotalsAndLast7Days();
  };

  const deleteTransactionFromState = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    refreshTotalsAndLast7Days();
  };

  const refreshTotalsAndLast7Days = async () => {
    try {
      const [totalsData, last7DaysData] = await Promise.all([
        getCreditDebitTotals(),
        getLast7DaysTotals()
      ]);

      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      setTotals({ credit: creditTotal, debit: debitTotal });
      
      setLast7Days(last7DaysData);
    } catch (err) {
      console.error('Error refreshing totals:', err);
    }
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const deleteTransaction = async (id) => {
    try {
      const transactionToDelete = transactions.find(tx => tx.id === id);
      
      // Optimistic update
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      
      if (transactionToDelete) {
        setTotals(prev => ({
          credit: transactionToDelete.type === 'credit' 
            ? prev.credit - transactionToDelete.amount 
            : prev.credit,
          debit: transactionToDelete.type === 'debit' 
            ? prev.debit - transactionToDelete.amount 
            : prev.debit
        }));
      }
      
      await deleteTransactionApi(id);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
      fetchData(); // Fallback to full refresh if error occurs
    }
  };

  return (
    <AppContext.Provider value={{
      transactions,
      setTransactions,
      totals,
      setTotals,
      last7Days,
      profile,
      loading,
      error,
      fetchData,
      refreshTransactions,
      addTransactionToState,
      updateTransactionInState,
      deleteTransactionFromState,
      deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);