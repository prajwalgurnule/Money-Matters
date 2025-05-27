// // Transactions.jsx
// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import TransactionList from '../../components/TransactionList/TransactionList';
// import { Link } from 'react-router-dom';
// import { FiPlus } from 'react-icons/fi';
// import { PAGE_SIZE } from '../../utils/constants';
// import { deleteTransaction as deleteTransactionApi } from '../../services/api'; // Import deleteTransaction API
// import './Transactions.css';

// const Transactions = () => {
//   const { 
//     transactions, 
//     loading, 
//     error,
//     fetchData // fetchData is crucial for refreshing after delete
//   } = useAppContext();
//   const [activeTab, setActiveTab] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredTransactions = transactions.filter(tx => {
//     if (activeTab === 'all') return true;
//     return tx.type === activeTab;
//   });

//   const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab]);

//   const handleRefresh = () => {
//     fetchData();
//   };

//   // Define the onDelete function to be passed to TransactionList
//   const handleDeleteTransaction = async (id) => {
//     try {
//       await deleteTransactionApi(id);
//       fetchData(); // Refresh data after successful deletion
//       alert('Transaction deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//       alert('Failed to delete transaction. Please try again.');
//     }
//   };

//   return (
//     <div className="transactions-page">
//       <div className="transactions-header">
//         <h1>Transactions</h1>
//         <div>
//           <button onClick={handleRefresh} disabled={loading} className="refresh-button">
//             Refresh
//           </button>
//           <Link to="/add-transaction" className="add-button">
//             <FiPlus className="mr-2" />
//             Add Transaction
//           </Link>
//         </div>
//       </div>

//       <div className="transactions-tabs">
//         <button 
//           className={activeTab === 'all' ? 'active' : ''}
//           onClick={() => setActiveTab('all')}
//         >
//           All Transactions
//         </button>
//         <button 
//           className={activeTab === 'debit' ? 'active' : ''}
//           onClick={() => setActiveTab('debit')}
//         >
//           Debit
//         </button>
//         <button 
//           className={activeTab === 'credit' ? 'active' : ''}
//           onClick={() => setActiveTab('credit')}
//         >
//           Credit
//         </button>
//       </div>

//       {error ? (
//         <div className="error-message">{error}</div>
//       ) : (
//         <>
//           <TransactionList 
//             transactions={paginatedTransactions} 
//             showCheckbox={false}
//             loading={loading}
//             onDelete={handleDeleteTransaction}
//           />
          
//           {totalPages > 1 && (
//             <div className="pagination">
//               <button 
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <span>Page {currentPage} of {totalPages}</span>
//               <button 
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Transactions;


import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionList from '../../components/TransactionList/TransactionList';
import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { deleteTransaction as deleteTransactionApi, getCreditDebitTotals, getLast7DaysTotals } from '../../services/api';
import { FiRefreshCw, FiPlus, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../../utils/constants';
import { isAdmin } from '../../services/auth';
import './Transactions.css';

const Transactions = () => {
  const {
    transactions,
    setTransactions,
    totals,
    setTotals,
    loading,
    error,
    fetchData
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [last7Days, setLast7Days] = useState([]);
  const adminDisabled = isAdmin();
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredTransactions = transactions.filter(tx => {
    // Search filter
    if (filters.search && 
        !tx.transaction_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !tx.category.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && tx.category !== filters.category) return false;
    
    // Type filter based on activeTab
    if (activeTab !== 'all' && tx.type !== activeTab) {
      return false;
    }

    // Amount range filters
    if (filters.amountMin && tx.amount < Number(filters.amountMin)) return false;
    if (filters.amountMax && tx.amount > Number(filters.amountMax)) return false;
    
    // Date range filters
    const txDate = new Date(tx.date);
    if (filters.dateFrom && txDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && txDate > new Date(filters.dateTo + 'T23:59:59')) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to first page whenever filters or activeTab change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const newTransactions = transactions.filter(tx => tx.id !== id);
      setTransactions(newTransactions);
      
      await deleteTransactionApi(id);
      
      const [totalsData, last7DaysData] = await Promise.all([
        getCreditDebitTotals(),
        getLast7DaysTotals()
      ]);
      
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      
      setTotals({ credit: creditTotal, debit: debitTotal });
      setLast7Days(last7DaysData);
      
    } catch (err) {
      console.error('Error deleting transaction:', err);
      fetchData(); // Fallback to full refresh on error
    }
  };

  // Admin functionality for bulk selection
  const toggleSelectTransaction = (id) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(txId => txId !== id) 
        : [...prev, id]
    );
  };

  const selectAllTransactions = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map(tx => tx.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedTransactions.length) return;
    
    try {
      // Perform bulk delete
      await Promise.all(selectedTransactions.map(id => deleteTransactionApi(id)));
      
      // Refresh data
      await fetchData();
      
      // Clear selection
      setSelectedTransactions([]);
      
      // Update totals
      const [totalsData, last7DaysData] = await Promise.all([
        getCreditDebitTotals(),
        getLast7DaysTotals()
      ]);
      
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      
      setTotals({ credit: creditTotal, debit: debitTotal });
      setLast7Days(last7DaysData);
      
    } catch (err) {
      console.error('Error in bulk delete:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      amountMin: '',
      amountMax: '',
      dateFrom: '',
      dateTo: ''
    });
    setActiveTab('all');
  };

  return (
    <motion.div 
      className="transactions-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="">
        <div className="transactions-header">
          <motion.h1 
            className="page-title"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Transaction History
          </motion.h1>
          
          <div className="header-actions">
            <motion.button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="refresh-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            {!adminDisabled && (
              // <motion.div
              //   whileHover={{ scale: 1.05 }}
              //   whileTap={{ scale: 0.95 }}
              // > 
                <Link to="/add-transaction" className="add-button">
                  <FiPlus className="mr-2" />
                  Add Transaction
                </Link>
              // </motion.div>
            )}
          </div>
        </div>

        {/* Admin bulk actions */}
        {!adminDisabled && selectedTransactions.length > 0 && (
          <motion.div 
            className="admin-bulk-actions"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <span>{selectedTransactions.length} selected</span>
            <motion.button
              onClick={handleBulkDelete}
              className="bulk-delete-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Selected
            </motion.button>
          </motion.div>
        )}

        {/* <div className="search-bar-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>

        <div className="filters-container">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Amount Range</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => setFilters({...filters, amountMin: e.target.value})}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => setFilters({...filters, amountMax: e.target.value})}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div> */}

        <motion.div 
          className="transactions-tabs"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            variants={itemVariants}
          >
            All Transactions
          </motion.button>
          <motion.button
            className={`tab ${activeTab === 'debit' ? 'active' : ''}`}
            onClick={() => setActiveTab('debit')}
            variants={itemVariants}
          >
            Debit
          </motion.button>
          <motion.button
            className={`tab ${activeTab === 'credit' ? 'active' : ''}`}
            onClick={() => setActiveTab('credit')}
            variants={itemVariants}
          >
            Credit
          </motion.button>
        </motion.div>

        {error ? (
          <motion.div 
            className="error-message"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <TransactionList
                transactions={paginatedTransactions}
                loading={loading}
                onDelete={handleDeleteTransaction}
                showCheckbox={!adminDisabled}
                selectedTransactions={selectedTransactions}
                onSelectTransaction={toggleSelectTransaction}
                onSelectAllTransactions={selectAllTransactions}
                allSelected={selectedTransactions.length === paginatedTransactions.length}
              />
            </AnimatePresence>

            {totalPages > 1 && (
              <motion.div 
                className="pagination"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiChevronLeft />
                </motion.button>
                
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                
                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiChevronRight />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Transactions;