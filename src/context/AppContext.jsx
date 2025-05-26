import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllTransactions, 
  getCreditDebitTotals, 
  getLast7DaysTotals,
  getProfile
} from '../services/api';
import { isAuthenticated } from '../services/auth';

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
      
      const [transactionsData, totalsData, last7DaysData, profileData] = await Promise.all([
        getAllTransactions(),
        getCreditDebitTotals(),
        getLast7DaysTotals(),
        getProfile()
      ]);

      setTransactions(transactionsData);
      
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

  // Add transaction to state locally
  const addTransactionToState = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update totals
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
    
    // Update last 7 days if needed
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

  // Update transaction in state locally
  const updateTransactionInState = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
    
    // Note: For proper totals and last7Days updates, we'd need the previous values
    // This is more complex and might warrant a full refresh in this case
    // For simplicity, we'll just refresh totals and last7Days
    refreshTotalsAndLast7Days();
  };

  // Delete transaction from state locally
  const deleteTransactionFromState = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    // Similar to update, we'd need more info to update totals properly
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

  return (
    <AppContext.Provider value={{
      transactions,
      totals,
      last7Days,
      profile,
      loading,
      error,
      fetchData,
      addTransactionToState,
      updateTransactionInState,
      deleteTransactionFromState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);