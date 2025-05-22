import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { StatsCardsSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import BarChart from '../Charts/BarChart'; // Import BarChart component
import './StatsCards.css';

const StatsCards = ({ creditTotal, debitTotal, last7Days, loading }) => {
  if (loading) return <StatsCardsSkeleton />;

  // Prepare data for the Bar Chart for weekly overview


  return (
    <>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p className="amount">
            {formatCurrency(creditTotal - debitTotal)}
          </p>
        </div>
        
        <div className="stat-card credit">
          <h3>Credit</h3>
          <p className="amount">{formatCurrency(creditTotal)}</p>
        </div>
        
        <div className="stat-card debit">
          <h3>Debit</h3>
          <p className="amount">{formatCurrency(debitTotal)}</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;