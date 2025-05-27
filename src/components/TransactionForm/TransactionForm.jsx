// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { addTransaction, updateTransaction } from '../../services/api';
// import './TransactionForm.css';

// const TransactionForm = ({ transaction, isEdit, onSuccess }) => {
//   const navigate = useNavigate();
  
//   // Helper function to format date for datetime-local input
//   const formatDateForInput = (dateString) => {
//     if (!dateString) {
//       // For new transactions, use current date/time
//       const now = new Date();
//       // Convert to local datetime string in the correct format
//       const offset = now.getTimezoneOffset() * 60000; // offset in milliseconds
//       return new Date(now - offset).toISOString().slice(0, 16);
//     }
    
//     const date = new Date(dateString);
//     // Handle invalid dates
//     if (isNaN(date.getTime())) {
//       const now = new Date();
//       const offset = now.getTimezoneOffset() * 60000;
//       return new Date(now - offset).toISOString().slice(0, 16);
//     }
    
//     // Convert to local datetime string in the correct format
//     const offset = date.getTimezoneOffset() * 60000;
//     return new Date(date - offset).toISOString().slice(0, 16);
//   };

//   const [formData, setFormData] = useState({
//     transaction_name: '',
//     type: 'debit',
//     category: '',
//     amount: '',
//     date: formatDateForInput() // Initialize with current date/time
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Initialize form data when transaction prop changes (for edit mode)
//   useEffect(() => {
//     if (isEdit && transaction) {
//       setFormData({
//         transaction_name: transaction.transaction_name || '',
//         type: transaction.type || 'debit',
//         category: transaction.category || '',
//         amount: transaction.amount || '',
//         date: formatDateForInput(transaction.date)
//       });
//     }
//   }, [isEdit, transaction]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       let response;
//       if (isEdit) {
//         response = await updateTransaction({
//           id: transaction.id,
//           ...formData
//         });
//       } else {
//         response = await addTransaction(formData);
//       }
      
//       onSuccess({
//         id: response.id || transaction.id,
//         transaction_name: formData.transaction_name,
//         type: formData.type,
//         category: formData.category,
//         amount: formData.amount,
//         date: formData.date,
//         user_id: response.user_id
//       });
//     } catch (err) {
//       console.error('Error saving transaction:', err);
//       setError('Failed to save transaction. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="transaction-form-container">
//       <div className="form-header">
//         <h2>
//           <span className="form-icon">{isEdit ? '✏️' : '➕'}</span>
//           {isEdit ? 'Update Transaction' : 'Add New Transaction'}
//         </h2>
//         <p className="form-subtitle">Track your financial activity</p>
//       </div>
      
//       {error && (
//         <div className="error-message">
//           ⚠️ {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="transaction-form">
//         <div className="form-row">
//           <div className="form-group floating">
//             <input
//               type="text"
//               name="transaction_name"
//               id="transaction_name"
//               value={formData.transaction_name}
//               onChange={handleChange}
//               required
//               placeholder=" "
//             />
//             <label htmlFor="transaction_name">Transaction Name</label>
//             <span className="input-icon">🛒</span>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group floating select-wrapper">
//             <select
//               name="type"
//               id="type"
//               value={formData.type}
//               onChange={handleChange}
//               required
//             >
//               <option value="debit">Debit (Expense)</option>
//               <option value="credit">Credit (Income)</option>
//             </select>
//             <label htmlFor="type">Transaction Type</label>
//             <span className="input-icon">🔄</span>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group floating">
//             <input
//               type="text"
//               name="category"
//               id="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               placeholder=" "
//             />
//             <label htmlFor="category">Category</label>
//             <span className="input-icon">🏷️</span>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group floating currency-input">
//             <input
//               type="number"
//               name="amount"
//               id="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               required
//               placeholder=" "
//               step="0.01"
//               min="0"
//             />
//             <label htmlFor="amount">Amount</label>
//             <span className="currency-symbol">$</span>
//             <span className="input-icon">💰</span>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group floating">
//             <input
//               type="datetime-local"
//               name="date"
//               id="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="date">Date & Time</label>
//             <span className="input-icon">📅</span>
//           </div>
//         </div>

//         <div className="form-actions">
//           <button
//             type="button"
//             className="cancel-btn"
//             onClick={() => navigate('/transactions')}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="spinner"></span>
//             ) : isEdit ? (
//               'Update Transaction'
//             ) : (
//               'Add Transaction'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TransactionForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction, updateTransaction } from '../../services/api';
import './TransactionForm.css';
import { isAdmin } from '../../services/auth';

const TransactionForm = ({ transaction, isEdit, onSuccess }) => {
  const navigate = useNavigate();
  const adminDisabled = isAdmin();
  
  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) {
      // For new transactions, use current date/time
      const now = new Date();
      // Convert to local datetime string without timezone adjustment
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // If dateString is already in ISO format (from server)
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // For existing transactions, parse the date string
    const date = new Date(dateString);
    // Handle invalid dates
    if (isNaN(date.getTime())) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Convert to local datetime string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    transaction_name: '',
    type: 'debit',
    category: '',
    amount: '',
    date: formatDateForInput() // Initialize with current date/time
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when transaction prop changes (for edit mode)
  useEffect(() => {
    if (isEdit && transaction) {
      setFormData({
        transaction_name: transaction.transaction_name || '',
        type: transaction.type || 'debit',
        category: transaction.category || '',
        amount: transaction.amount || '',
        date: formatDateForInput(transaction.date)
      });
    }
  }, [isEdit, transaction]);

  const handleChange = (e) => {
    if (adminDisabled) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (adminDisabled) {
      setError('Admin users cannot modify transactions');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Create a proper Date object from the form data
      const transactionDate = new Date(formData.date);
      
      // Prepare the data to send to the server
      const transactionData = {
        transaction_name: formData.transaction_name,
        type: formData.type,
        category: formData.category,
        amount: formData.amount,
        date: transactionDate.toISOString() // Store as ISO string
      };

      let response;
      if (isEdit) {
        response = await updateTransaction({
          id: transaction.id,
          ...transactionData
        });
      } else {
        response = await addTransaction(transactionData);
      }
      
      // Call onSuccess with the updated/created transaction data
      onSuccess({
        id: response.id || transaction.id,
        ...transactionData,
        user_id: response.user_id || transaction.user_id
      });
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h2>
          <span className="form-icon">{isEdit ? '✏️' : '➕'}</span>
          {isEdit ? 'Update Transaction' : 'Add New Transaction'}
        </h2>
        <p className="form-subtitle">Track your financial activity</p>
      </div>
      
      {adminDisabled && (
        <div className="admin-notice">
          <p>Admin view only. Modifications are disabled.</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group floating">
            <input
              type="text"
              name="transaction_name"
              id="transaction_name"
              value={formData.transaction_name}
              onChange={handleChange}
              required
              placeholder=" "
              disabled={adminDisabled}
            />
            <label htmlFor="transaction_name">Transaction Name</label>
            <span className="input-icon">🛒</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating select-wrapper">
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={adminDisabled}
            >
              <option value="debit">Debit (Expense)</option>
              <option value="credit">Credit (Income)</option>
            </select>
            <label htmlFor="type">Transaction Type</label>
            <span className="input-icon">🔄</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder=" "
              disabled={adminDisabled}
            />
            <label htmlFor="category">Category</label>
            <span className="input-icon">🏷️</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating currency-input">
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder=" "
              step="0.01"
              min="0"
              disabled={adminDisabled}
            />
            <label htmlFor="amount">Amount</label>
            <span className="currency-symbol">$</span>
            <span className="input-icon">💰</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <input
              type="datetime-local"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={adminDisabled}
            />
            <label htmlFor="date">Date & Time</label>
            <span className="input-icon">📅</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/transactions')}
            disabled={loading}
          >
            Cancel
          </button>
          
          {!adminDisabled && (
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : isEdit ? (
                'Update Transaction'
              ) : (
                'Add Transaction'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;