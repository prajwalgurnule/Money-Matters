// AddEditTransaction.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext'; // Import useAppContext
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { CATEGORIES } from '../../utils/constants';
import './AddEditTransaction.css';

const AddEditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, loading, fetchData } = useAppContext(); // Destructure fetchData

  const isEdit = !!id;
  const transaction = isEdit
    ? transactions.find(tx => tx.id === parseInt(id))
    : null;

  if (loading) return <div>Loading...</div>;
  if (isEdit && !transaction) {
    navigate('/transactions');
    return null;
  }

  // Define the success handler for the form
  const handleTransactionSuccess = () => {
    fetchData(); // This will re-fetch all data, including totals and last 7 days
    navigate('/transactions'); // Then navigate to the transactions page
  };

  return (
    <div className="add-edit-transaction">
      <TransactionForm
        transaction={transaction}
        isEdit={isEdit}
        categories={CATEGORIES} // Assuming you still use this for validation or dropdowns
        onSuccess={handleTransactionSuccess} // Pass the success handler
      />
    </div>
  );
};

export default AddEditTransaction;