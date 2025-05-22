import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction, updateTransaction } from '../../services/api';
import './TransactionForm.css';

const TransactionForm = ({ transaction, isEdit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transaction_name: transaction?.transaction_name || '',
    type: transaction?.type || 'debit',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await updateTransaction({
          id: transaction.id,
          ...formData
        });
      } else {
        await addTransaction(formData);
      }
      navigate('/transactions');
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h1>{isEdit ? 'Update Transaction' : 'Add Transaction'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Transaction Name</label>
          <input
            type="text"
            name="transaction_name"
            value={formData.transaction_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Transaction Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date.slice(0, 16)}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;