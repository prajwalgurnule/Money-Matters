// Transactions.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionList from '../../components/TransactionList/TransactionList';
import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { deleteTransaction as deleteTransactionApi } from '../../services/api'; // Import deleteTransaction API
import './Transactions.css';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    error,
    fetchData // fetchData is crucial for refreshing after delete
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleRefresh = () => {
    fetchData();
  };

  // Define the onDelete function to be passed to TransactionList
  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransactionApi(id);
      fetchData(); // Refresh data after successful deletion
      alert('Transaction deleted successfully!');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <div>
          <button onClick={handleRefresh} disabled={loading} className="refresh-button">
            Refresh
          </button>
          <Link to="/add-transaction" className="add-button">
            Add Transaction
          </Link>
        </div>
      </div>

      <div className="transactions-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Transactions
        </button>
        <button 
          className={activeTab === 'debit' ? 'active' : ''}
          onClick={() => setActiveTab('debit')}
        >
          Debit
        </button>
        <button 
          className={activeTab === 'credit' ? 'active' : ''}
          onClick={() => setActiveTab('credit')}
        >
          Credit
        </button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <TransactionList 
            transactions={paginatedTransactions} 
            showCheckbox={false}
            loading={loading}
            onDelete={handleDeleteTransaction}
          />
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;