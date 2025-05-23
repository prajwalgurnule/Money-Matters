import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
import { CSVLink } from 'react-csv';
import { format, parseISO } from 'date-fns';
import './TransactionList.css';

const TransactionList = ({ transactions, loading, onDelete }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

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
    const matchesSearch = transaction.transaction_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && isToday(new Date(transaction.date))) ||
                       (dateFilter === 'week' && isThisWeek(new Date(transaction.date))) ||
                       (dateFilter === 'month' && isThisMonth(new Date(transaction.date)));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Prepare CSV data - export ALL transactions, not just filtered ones
  const csvData = transactions.map(transaction => ({
    Name: transaction.transaction_name,
    Category: transaction.category,
    Date: format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a'),
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
    e.stopPropagation();
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await onDelete(id);
    }
  };

  if (loading) return <TransactionListSkeleton />;

  if (!transactions || transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }

  return (
    <div className="transaction-list-container">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.transaction_name}</td>
              <td>{transaction.category}</td>
              <td>{format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}</td>
              <td className={transaction.type}>
                {transaction.type === 'debit' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </td>
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