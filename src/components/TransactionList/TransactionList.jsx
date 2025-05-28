// ------

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import { formatCurrency } from '../../utils/formatters';
// import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import { CSVLink } from 'react-csv';
// import { format, parseISO } from 'date-fns';
// import { deleteTransaction } from '../../services/api';
// import { isAdmin } from '../../services/auth';
// import './TransactionList.css';

// const TransactionList = ({ transactions, loading }) => {
//   const { deleteTransactionFromState } = useAppContext();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
//   const adminDisabled = isAdmin();

//   // Get unique categories for filter dropdown
//   const categories = ['all', ...new Set(transactions.map(t => t.category))];

//   // Apply sorting - newest first by default
//   const sortedTransactions = React.useMemo(() => {
//     let sortableItems = [...transactions];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         // Convert dates to timestamps for proper comparison
//         const dateA = new Date(a[sortConfig.key]).getTime();
//         const dateB = new Date(b[sortConfig.key]).getTime();
        
//         if (sortConfig.key === 'date') {
//           return sortConfig.direction === 'desc' ? dateB - dateA : dateA - dateB;
//         }
        
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [transactions, sortConfig]);

//   // Apply filters and search
//   const filteredTransactions = sortedTransactions.filter(transaction => {
//     const matchesSearch = transaction.transaction_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
//     const matchesDate = dateFilter === 'all' || 
//                        (dateFilter === 'today' && isToday(new Date(transaction.date))) ||
//                        (dateFilter === 'week' && isThisWeek(new Date(transaction.date))) ||
//                        (dateFilter === 'month' && isThisMonth(new Date(transaction.date)));
    
//     return matchesSearch && matchesCategory && matchesDate;
//   });

//   // Prepare CSV data - export ALL transactions, not just filtered ones
//   const csvData = transactions.map(transaction => ({
//     Name: transaction.transaction_name,
//     Category: transaction.category,
//     Date: format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a'),
//     Type: transaction.type,
//     Amount: transaction.amount
//   }));

//   const requestSort = (key) => {
//     let direction = 'desc'; // Default to descending (newest first)
//     if (sortConfig.key === key) {
//       direction = sortConfig.direction === 'desc' ? 'asc' : 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleEdit = (id, e) => {
//     if (adminDisabled) return;
//     e.stopPropagation();
//     navigate(`/edit-transaction/${id}`);
//   };

//   const handleDelete = async (id, e) => {
//     if (adminDisabled) return;
//     e.stopPropagation();
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       try {
//         await deleteTransaction(id);
//         deleteTransactionFromState(id);
//       } catch (err) {
//         console.error('Error deleting transaction:', err);
//         alert('Failed to delete transaction. Please try again.');
//       }
//     }
//   };

//   if (loading) return <TransactionListSkeleton />;

//   if (!transactions || transactions.length === 0) {
//     return <div className="no-transactions">No transactions found</div>;
//   }

//   return (
//     <div className="transaction-list-container">
//       {adminDisabled && (
//         <div className="admin-notice">
//           <p>Admin view only. Modifications are disabled.</p>
//         </div>
//       )}
      
//       <div className="transaction-controls">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search transactions..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <i className="search-icon">🔍</i>
//         </div>
        
//         <div className="filter-controls">
//           <select 
//             value={categoryFilter} 
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             {categories.filter(c => c !== 'all').map(category => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
          
//           <select
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="all">All Dates</option>
//             <option value="today">Today</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//           </select>
          
//           <CSVLink 
//             data={csvData} 
//             filename={"transactions.csv"}
//             className="export-btn"
//           >
//             Export to CSV
//           </CSVLink>
//         </div>
//       </div>

//       <table className="transaction-table">
//         <thead>
//           <tr>
//             <th onClick={() => requestSort('transaction_name')}>
//               Name {sortConfig.key === 'transaction_name' && (
//                 sortConfig.direction === 'asc' ? '↑' : '↓'
//               )}
//             </th>
//             <th onClick={() => requestSort('category')}>
//               Category {sortConfig.key === 'category' && (
//                 sortConfig.direction === 'asc' ? '↑' : '↓'
//               )}
//             </th>
//             <th onClick={() => requestSort('date')}>
//               Date {sortConfig.key === 'date' && (
//                 sortConfig.direction === 'asc' ? '↑' : '↓'
//               )}
//             </th>
//             <th onClick={() => requestSort('amount')}>
//               Amount {sortConfig.key === 'amount' && (
//                 sortConfig.direction === 'asc' ? '↑' : '↓'
//               )}
//             </th>
//             {!adminDisabled && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredTransactions.map((transaction) => (
//             <tr key={transaction.id}>
//               <td>{transaction.transaction_name}</td>
//               <td>{transaction.category}</td>
//               <td>{format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}</td>
//               <td className={transaction.type}>
//                 {transaction.type === 'debit' ? '-' : '+'}
//                 {formatCurrency(transaction.amount)}
//               </td>
//               {!adminDisabled && (
//                 <td className="actions">
//                   <button 
//                     onClick={(e) => handleEdit(transaction.id, e)}
//                     className="edit-btn"
//                   >
//                     Edit
//                   </button>
//                   <button 
//                     onClick={(e) => handleDelete(transaction.id, e)}
//                     className="delete-btn"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Helper functions for date filtering
// function isToday(date) {
//   const today = new Date();
//   return date.getDate() === today.getDate() &&
//          date.getMonth() === today.getMonth() &&
//          date.getFullYear() === today.getFullYear();
// }

// function isThisWeek(date) {
//   const today = new Date();
//   const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
//   const lastDayOfWeek = new Date(firstDayOfWeek);
//   lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
//   return date >= firstDayOfWeek && date <= lastDayOfWeek;
// }

// function isThisMonth(date) {
//   const today = new Date();
//   return date.getMonth() === today.getMonth() && 
//          date.getFullYear() === today.getFullYear();
// }

// export default TransactionList;

// ----------

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
import { CSVLink } from 'react-csv';
import { format, parseISO } from 'date-fns';
import { deleteTransaction, getProfile } from '../../services/api';
import { isAdmin } from '../../services/auth';
import './TransactionList.css';

const TransactionList = ({ transactions, loading }) => {
  const { deleteTransactionFromState } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [userProfiles, setUserProfiles] = useState({});
  const adminDisabled = isAdmin();

  // Fetch user profiles when component mounts and is admin
  useEffect(() => {
    if (isAdmin() && transactions.length > 0) {
      const fetchUserProfiles = async () => {
        const profiles = {};
        const userIds = [...new Set(transactions.map(t => t.user_id))];
        
        try {
          await Promise.all(userIds.map(async userId => {
            const profile = await getProfile(userId.toString());
            profiles[userId] = profile.name || `User ${userId}`;
          }));
          setUserProfiles(profiles);
        } catch (err) {
          console.error('Error fetching user profiles:', err);
          // Fallback to default user IDs if there's an error
          const defaultProfiles = {};
          userIds.forEach(id => {
            defaultProfiles[id] = `User ${id}`;
          });
          setUserProfiles(defaultProfiles);
        }
      };
      
      fetchUserProfiles();
    }
  }, [transactions]);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  // Apply sorting - newest first by default
  const sortedTransactions = React.useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Convert dates to timestamps for proper comparison
        const dateA = new Date(a[sortConfig.key]).getTime();
        const dateB = new Date(b[sortConfig.key]).getTime();
        
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'desc' ? dateB - dateA : dateA - dateB;
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  // Apply filters and search
  const filteredTransactions = sortedTransactions.filter(transaction => {
    const userName = userProfiles[transaction.user_id] || `User ${transaction.user_id}`;
    const matchesSearch = transaction.transaction_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && isToday(new Date(transaction.date))) ||
                       (dateFilter === 'week' && isThisWeek(new Date(transaction.date))) ||
                       (dateFilter === 'month' && isThisMonth(new Date(transaction.date)));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Prepare CSV data - export ALL transactions, not just filtered ones
  const csvData = transactions.map(transaction => ({
  User: userProfiles[transaction.user_id] || `User ${transaction.user_id}`,
  Name: transaction.transaction_name,
  Category: transaction.category,
  // Use compact format to avoid Excel overflow (e.g., "2025-05-28 14:30")
  Date: format(parseISO(transaction.date), 'yyyy-MM-dd HH:mm'),
  Type: transaction.type,
  Amount: transaction.amount
}));


  const requestSort = (key) => {
    let direction = 'desc'; // Default to descending (newest first)
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'desc' ? 'asc' : 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (id, e) => {
    if (adminDisabled) return;
    e.stopPropagation();
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id, e) => {
    if (adminDisabled) return;
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        deleteTransactionFromState(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  if (loading) return <TransactionListSkeleton />;

  if (!transactions || transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }

  return (
    <div className="transaction-list-container">
      {adminDisabled && (
        <div className="admin-notice">
          <p>Admin view only. Modifications are disabled.</p>
        </div>
      )}
      
      <div className="transaction-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="search-icon">🔍</i>
        </div>
        
        <div className="filter-controls">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <CSVLink 
            data={csvData} 
            filename={"transactions.csv"}
            className="export-btn"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            {adminDisabled && (
              <th onClick={() => requestSort('user_id')}>
                User {sortConfig.key === 'user_id' && (
                  sortConfig.direction === 'asc' ? '↑' : '↓'
                )}
              </th>
            )}
            <th onClick={() => requestSort('transaction_name')}>
              Name {sortConfig.key === 'transaction_name' && (
                sortConfig.direction === 'asc' ? '↑' : '↓'
              )}
            </th>
            <th onClick={() => requestSort('category')}>
              Category {sortConfig.key === 'category' && (
                sortConfig.direction === 'asc' ? '↑' : '↓'
              )}
            </th>
            <th onClick={() => requestSort('date')}>
              Date {sortConfig.key === 'date' && (
                sortConfig.direction === 'asc' ? '↑' : '↓'
              )}
            </th>
            <th onClick={() => requestSort('amount')}>
              Amount {sortConfig.key === 'amount' && (
                sortConfig.direction === 'asc' ? '↑' : '↓'
              )}
            </th>
            {!adminDisabled && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              {adminDisabled && (
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {userProfiles[transaction.user_id]?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">
                      {userProfiles[transaction.user_id] || `User ${transaction.user_id}`}
                    </span>
                  </div>
                </td>
              )}
              <td>{transaction.transaction_name}</td>
              <td>{transaction.category}</td>
              <td>{format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}</td>
              <td className={transaction.type}>
                {transaction.type === 'debit' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </td>
              {!adminDisabled && (
                <td className="actions">
                  <button 
                    onClick={(e) => handleEdit(transaction.id, e)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDelete(transaction.id, e)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper functions for date filtering
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function isThisWeek(date) {
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

function isThisMonth(date) {
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
}

export default TransactionList;