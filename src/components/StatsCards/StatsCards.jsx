// import React from 'react';
// import { formatCurrency } from '../../utils/formatters';
// import { SkeletonLoader, StatsCardsSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import './StatsCards.css';

// const StatsCards = ({ creditTotal, debitTotal, last7Days, loading }) => {
//   if (loading) return <StatsCardsSkeleton />;

//   return (
//     <>
//       <div className="stats-container">
//         <div className="stat-card">
//           <h3>Total Balance</h3>
//           <p className="amount">
//             {formatCurrency(creditTotal - debitTotal)}
//           </p>
//         </div>
        
//         <div className="stat-card credit">
//           <h3>Credit</h3>
//           <p className="amount">{formatCurrency(creditTotal)}</p>
//         </div>
        
//         <div className="stat-card debit">
//           <h3>Debit</h3>
//           <p className="amount">{formatCurrency(debitTotal)}</p>
//         </div>
//       </div>
      
//       <div className="week-overview">
//         <h2>Debit & Credit Overview</h2>
//         <p>
//           {formatCurrency(debitTotal)} Debited & {formatCurrency(creditTotal)} 
//           Credited in this Week
//         </p>
        
//         <div className="week-days">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="day">
//               {day}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default StatsCards;

import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { SkeletonLoader, StatsCardsSkeleton } from '../SkeletonLoader/SkeletonLoader';
import BarChart from '../Charts/BarChart'; // Import BarChart component
import './StatsCards.css';

const StatsCards = ({ creditTotal, debitTotal, last7Days, loading }) => {
  if (loading) return <StatsCardsSkeleton />;

  // Prepare data for the Bar Chart for weekly overview
  const weeklyOverviewBarChartData = {
    labels: last7Days.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Credit',
        data: last7Days.filter(day => day.type === 'credit').map(day => day.sum),
        backgroundColor: '#4ade80', // Green color for credit
        barThickness: 20, // Adjust bar thickness as needed
      },
      {
        label: 'Debit',
        data: last7Days.filter(day => day.type === 'debit').map(day => day.sum),
        backgroundColor: '#f87171', // Red color for debit
        barThickness: 20, // Adjust bar thickness as needed
      }
    ]
  };

  return (
    <>
      <div className="stats-container">
        {/* <div className="stat-card">
          <h3>Total Balance</h3>
          <p className="amount">
            {formatCurrency(creditTotal - debitTotal)}
          </p>
        </div> */}
        
        <div className="stat-card credit">
          <h3>Credit</h3>
          <p className="amount">{formatCurrency(creditTotal)}</p>
        </div>
        
        <div className="stat-card debit">
          <h3>Debit</h3>
          <p className="amount">{formatCurrency(debitTotal)}</p>
        </div>
      </div>
      
      {/* <div className="week-overview">
        <h2>Debit & Credit Overview</h2>
  
        <div className="overview-chart-container">
          <BarChart data={weeklyOverviewBarChartData} />
        </div>
        <p className="summary-text">
          {formatCurrency(debitTotal)} Debited & {formatCurrency(creditTotal)} 
          Credited in this Week
        </p>
      </div> */}
    </>
  );
};

export default StatsCards;