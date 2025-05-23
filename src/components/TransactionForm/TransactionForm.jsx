import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction, updateTransaction } from '../../services/api';
import './TransactionForm.css';

const TransactionForm = ({ transaction, isEdit, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transaction_name: transaction?.transaction_name || '',
    type: transaction?.type || 'debit',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString().slice(0, 16)
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
      if (onSuccess) onSuccess();
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
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;