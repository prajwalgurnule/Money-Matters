// import React, { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { motion } from 'framer-motion';
// import StatsCards from '../../components/StatsCards/StatsCards';
// import TransactionList from '../../components/TransactionList/TransactionList';
// import BarChart from '../../components/Charts/BarChart';
// import PieChart from '../../components/Charts/PieChart';
// import LineChart from '../../components/Charts/LineChart';
// import { formatCurrency } from '../../utils/formatters';
// import { deleteTransaction as deleteTransactionApi } from '../../services/api';
// import { subDays, format, parseISO } from 'date-fns';
// import './Dashboard.css';

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: 'spring',
//       stiffness: 100,
//       damping: 10
//     }
//   }
// };

// const Dashboard = () => {
//   const {
//     totals,
//     transactions,
//     loading,
//     error,
//     fetchData,
//     deleteTransactionFromState,
//     profile
//   } = useAppContext();

//   // Only fetch data if it's not already loaded
//   useEffect(() => {
//     if (!transactions.length && !loading) {
//       fetchData();
//     }
//   }, [transactions.length, loading, fetchData]);

//   // Memoized chart data calculations
//   const { weeklyCredit, weeklyDebit, barChartData, pieChartData, lineChartData } = React.useMemo(() => {
//     // Function to group transactions by day and type for the last 7 days including today
//     const groupTransactionsByDay = (transactions) => {
//       const now = new Date();
//       const days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();
      
//       // Initialize dayMap with all 7 days
//       const dayMap = days.reduce((acc, day) => {
//         const dateKey = format(day, 'yyyy-MM-dd');
//         acc[dateKey] = {
//           date: dateKey,
//           credit: 0,
//           debit: 0
//         };
//         return acc;
//       }, {});

//       // Process transactions
//       transactions.forEach(transaction => {
//         const transactionDate = parseISO(transaction.date);
//         const dateKey = format(transactionDate, 'yyyy-MM-dd');
        
//         // Only consider transactions from the last 7 days
//         if (dayMap[dateKey]) {
//           if (transaction.type === 'credit') {
//             dayMap[dateKey].credit += parseFloat(transaction.amount);
//           } else {
//             dayMap[dateKey].debit += parseFloat(transaction.amount);
//           }
//         }
//       });

//       // Convert to array and format for charts
//       return Object.values(dayMap).map(day => ({
//         date: day.date,
//         credit: day.credit,
//         debit: day.debit
//       }));
//     };

//     const chartData = groupTransactionsByDay(transactions);
//     const weeklyCredit = chartData.reduce((sum, day) => sum + day.credit, 0);
//     const weeklyDebit = chartData.reduce((sum, day) => sum + day.debit, 0);

//     const barChartData = {
//       labels: chartData.map(day => format(parseISO(day.date), 'EEE')),
//       datasets: [
//         {
//           label: 'Credit',
//           data: chartData.map(day => day.credit),
//           backgroundColor: '#4ade80',
//         },
//         {
//           label: 'Debit',
//           data: chartData.map(day => day.debit),
//           backgroundColor: '#f87171',
//         }
//       ]
//     };

//     const pieChartData = {
//       labels: ['Credit', 'Debit'],
//       datasets: [{
//         data: [totals.credit, totals.debit],
//         backgroundColor: ['#4ade80', '#f87171'],
//         hoverBackgroundColor: ['#22c55e', '#ef4444']
//       }]
//     };

//     const lineChartData = {
//       labels: chartData.map(day => format(parseISO(day.date), 'MMM dd')),
//       datasets: [
//         {
//           label: 'Daily Credit',
//           data: chartData.map(day => day.credit),
//           borderColor: '#22c55e',
//           backgroundColor: 'rgba(34, 197, 94, 0.2)',
//           tension: 0.4,
//           fill: true,
//         },
//         {
//           label: 'Daily Debit',
//           data: chartData.map(day => day.debit),
//           borderColor: '#ef4444',
//           backgroundColor: 'rgba(239, 68, 68, 0.2)',
//           tension: 0.4,
//           fill: true,
//         }
//       ]
//     };

//     return { chartData, weeklyCredit, weeklyDebit, barChartData, pieChartData, lineChartData };
//   }, [transactions, totals]);

//   const handleRefresh = () => {
//     fetchData();
//   };

//   const handleDeleteTransaction = async (id) => {
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       try {
//         await deleteTransactionApi(id);
//         deleteTransactionFromState(id);
//         alert('Transaction deleted successfully!');
//       } catch (err) {
//         console.error('Error deleting transaction:', err);
//         alert('Failed to delete transaction. Please try again.');
//       }
//     }
//   };

//   // Welcome message with user's name
//   const welcomeMessage = profile 
//     ? `Welcome back, ${profile.name || 'User'}!`
//     : 'Welcome to your dashboard';

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <motion.h1 variants={itemVariants}>{welcomeMessage}</motion.h1>
//           <motion.p variants={itemVariants} className="dashboard-subtitle">
//             Here's your financial overview
//           </motion.p>
//         </div>
//         <motion.button 
//           onClick={handleRefresh} 
//           disabled={loading} 
//           className="refresh-btn"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           variants={itemVariants}
//         >
//           {loading ? (
//             <>
//               <i className="fas fa-sync-alt spin"></i> Refreshing...
//             </>
//           ) : (
//             <>
//               <i className="fas fa-sync-alt"></i> Refresh Data
//             </>
//           )}
//         </motion.button>
//       </div>

//       {error ? (
//         <div className="error-message">{error}</div>
//       ) : (
//         <>
//           <StatsCards
//             creditTotal={totals.credit}
//             debitTotal={totals.debit}
//             weeklyCredit={weeklyCredit}
//             weeklyDebit={weeklyDebit}
//             loading={loading}
//           />

//           <div className="charts-section">
//             <div className="chart-card large-chart-card">
//               <h2>Debit & Credit Overview</h2>
//               <BarChart data={barChartData} />
//               <div className="chart-summary">
//                 <div className="summary-item">
//                   <span>Weekly Credit</span>
//                   <span className="credit-value">{formatCurrency(weeklyCredit)}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span>Weekly Debit</span>
//                   <span className="debit-value">{formatCurrency(weeklyDebit)}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="chart-card">
//               <h2>Balance Distribution</h2>
//               <PieChart data={pieChartData} />
//               <div className="chart-summary">
//                 <div className="summary-item">
//                   <span>Credit</span>
//                   <span className="credit-value">{Math.round((totals.credit / (totals.credit + totals.debit)) * 100)}%</span>
//                 </div>
//                 <div className="summary-item">
//                   <span>Debit</span>
//                   <span className="debit-value">{Math.round((totals.debit / (totals.credit + totals.debit)) * 100)}%</span>
//                 </div>
//               </div>
//             </div>
//             <div className="chart-card">
//               <h2>Daily Trends</h2>
//               <LineChart data={lineChartData} />
//               <div className="chart-summary">
//                 <div className="summary-item">
//                   <span>Avg. Daily Credit</span>
//                   <span className="credit-value">{formatCurrency(weeklyCredit / 7)}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span>Avg. Daily Debit</span>
//                   <span className="debit-value">{formatCurrency(weeklyDebit / 7)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="recent-transactions">
//             <div className="section-header">
//               <h2>Recent Transactions</h2>
//               <div className="view-all">
//                 <a href="/transactions">View All</a>
//               </div>
//             </div>
//             <TransactionList
//               transactions={transactions.slice(0, 5)}
//               loading={loading}
//               onDelete={handleDeleteTransaction}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// ----

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import StatsCards from '../../components/StatsCards/StatsCards';
import TransactionList from '../../components/TransactionList/TransactionList';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import LineChart from '../../components/Charts/LineChart';
import { formatCurrency } from '../../utils/formatters';
import { deleteTransaction as deleteTransactionApi } from '../../services/api';
import { subDays, format, parseISO } from 'date-fns';
import { FiRefreshCw } from 'react-icons/fi';
import { isAdmin } from '../../services/auth';
import './Dashboard.css';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const Dashboard = () => {
  const {
    totals,
    transactions,
    last7Days,
    loading,
    error,
    fetchData,
    profile
  } = useAppContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const adminView = isAdmin();

  // Only fetch data if it's not already loaded
  useEffect(() => {
    if (!transactions.length && !loading) {
      fetchData();
    }
  }, [transactions.length, loading, fetchData]);

  // Memoized chart data calculations
  const { weeklyCredit, weeklyDebit, barChartData, pieChartData, lineChartData } = React.useMemo(() => {
    // Function to group transactions by day and type for the last 7 days including today
    const groupTransactionsByDay = (transactions) => {
      const now = new Date();
      const days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();
      
      // Initialize dayMap with all 7 days
      const dayMap = days.reduce((acc, day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        acc[dateKey] = {
          date: dateKey,
          credit: 0,
          debit: 0
        };
        return acc;
      }, {});

      // Process transactions
      transactions.forEach(transaction => {
        const transactionDate = parseISO(transaction.date);
        const dateKey = format(transactionDate, 'yyyy-MM-dd');
        
        // Only consider transactions from the last 7 days
        if (dayMap[dateKey]) {
          if (transaction.type === 'credit') {
            dayMap[dateKey].credit += parseFloat(transaction.amount);
          } else {
            dayMap[dateKey].debit += parseFloat(transaction.amount);
          }
        }
      });

      // Convert to array and format for charts
      return Object.values(dayMap).map(day => ({
        date: day.date,
        credit: day.credit,
        debit: day.debit
      }));
    };

    const chartData = groupTransactionsByDay(transactions);
    const weeklyCredit = chartData.reduce((sum, day) => sum + day.credit, 0);
    const weeklyDebit = chartData.reduce((sum, day) => sum + day.debit, 0);

    const barChartData = {
      labels: chartData.map(day => format(parseISO(day.date), 'EEE')),
      datasets: [
        {
          label: 'Credit',
          data: chartData.map(day => day.credit),
          backgroundColor: 'rgba(74, 222, 128, 0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Debit',
          data: chartData.map(day => day.debit),
          backgroundColor: 'rgba(248, 113, 113, 0.8)',
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 2,
          borderRadius: 6,
        }
      ]
    };

    const pieChartData = {
      labels: ['Credit', 'Debit'],
      datasets: [{
        data: [totals.credit, totals.debit],
        backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(248, 113, 113, 0.8)'],
        borderColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
        borderWidth: 2,
      }]
    };

    const lineChartData = {
      labels: chartData.map(day => format(parseISO(day.date), 'MMM dd')),
      datasets: [
        {
          label: 'Daily Credit',
          data: chartData.map(day => day.credit),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        },
        {
          label: 'Daily Debit',
          data: chartData.map(day => day.debit),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        }
      ]
    };

    return { weeklyCredit, weeklyDebit, barChartData, pieChartData, lineChartData };
  }, [transactions, totals]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDeleteTransaction = async (id) => {
    if (adminView) return;
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransactionApi(id);
        await fetchData();
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  // Welcome message with user's name
  const welcomeMessage = profile 
    ? `Welcome back, ${profile.name || 'User'}!`
    : 'Welcome to your dashboard';

  return (
    <motion.div className="dashboard">
      <div className="dashboard-header">
        <div>
          <motion.h1 variants={itemVariants}>
            {adminView ? 'Admin Dashboard' : welcomeMessage}
          </motion.h1>
          <motion.p variants={itemVariants} className="dashboard-subtitle">
            {adminView ? 'View all transaction data' : 'Here\'s your financial overview'}
          </motion.p>
        </div>
        
        {adminView && (
          <div className="admin-badge">
            ADMIN VIEW
          </div>
        )}
        
        <div className="header-actions">
          <motion.button 
            onClick={handleRefresh} 
            disabled={loading || isRefreshing}
            className="refresh-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            <FiRefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <StatsCards
            creditTotal={totals.credit}
            debitTotal={totals.debit}
            weeklyCredit={weeklyCredit}
            weeklyDebit={weeklyDebit}
            last7Days={last7Days}
            loading={loading}
          />

          {/* {adminView && (
            <div className="dashboard-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>
          )} */}

          {(!adminView || activeTab === 'overview') ? (
            <>
            <div className="charts-section">
            <div className="chart-card large-chart-card">
              <h2>Debit & Credit Overview</h2>
              <BarChart data={barChartData} />
              <div className="chart-summary">
                <div className="summary-item">
                 <span>Weekly Credit</span>
                <span className="credit-value">{formatCurrency(weeklyCredit)}</span>
              </div>
              <div className="summary-item">
                <span>Weekly Debit</span>
                <span className="debit-value">{formatCurrency(weeklyDebit)}</span>
              </div>
              </div>
            </div>
            <div className="chart-card">
              <h2>Balance Distribution</h2>
              <PieChart data={pieChartData} />
              <div className="chart-summary">
                <div className="summary-item">
                  <span>Credit</span>
                  <span className="credit-value">{Math.round((totals.credit / (totals.credit + totals.debit)) * 100)}%</span>
                </div>
                <div className="summary-item">
                  <span>Debit</span>
                  <span className="debit-value">{Math.round((totals.debit / (totals.credit + totals.debit)) * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="chart-card">
              <h2>Daily Trends</h2>
              <LineChart data={lineChartData} />
              <div className="chart-summary">
                <div className="summary-item">
                  <span>Avg. Daily Credit</span>
                  <span className="credit-value">{formatCurrency(weeklyCredit / 7)}</span>
                </div>
                <div className="summary-item">
                  <span>Avg. Daily Debit</span>
                  <span className="debit-value">{formatCurrency(weeklyDebit / 7)}</span>
                </div>
              </div>
            </div>
          </div>
            </>
          ) : (
            <motion.div 
              className="analytics-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* <div className="analytics-illustration">
                <img src='/finance.svg' alt="Financial analytics" style={{height: '40px', width: '40px'}}/>
                <h3>Advanced Analytics Coming Soon</h3>
                <p>We're working on more detailed financial insights for you</p>
              </div> */}
            </motion.div>
          )}

          <motion.div 
            className="recent-transactions"
            variants={itemVariants}
          >
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <div className="view-all">
                <a href="/transactions">View All</a>
              </div>
            </div>
            <TransactionList
              transactions={transactions.slice(0, 5)}
              loading={loading}
              onDelete={handleDeleteTransaction}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;