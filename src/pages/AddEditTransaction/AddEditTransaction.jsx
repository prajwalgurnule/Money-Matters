import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { CATEGORIES } from '../../utils/constants';
import './AddEditTransaction.css';

const AddEditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, loading } = useAppContext();
  
  const isEdit = !!id;
  const transaction = isEdit 
    ? transactions.find(tx => tx.id === parseInt(id)) 
    : null;

  if (loading) return <div>Loading...</div>;
  if (isEdit && !transaction) {
    navigate('/transactions');
    return null;
  }

  return (
    <div className="add-edit-transaction">
      <TransactionForm 
        transaction={transaction} 
        isEdit={isEdit} 
        categories={CATEGORIES} 
      />
    </div>
  );
};

export default AddEditTransaction;