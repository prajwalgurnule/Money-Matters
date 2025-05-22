import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import StatsCards from '../../components/StatsCards/StatsCards';
import TransactionList from '../../components/TransactionList/TransactionList';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import LineChart from '../../components/Charts/LineChart';
import { formatCurrency } from '../../utils/formatters';
import { deleteTransaction as deleteTransactionApi } from '../../services/api'; // Import deleteTransaction API function
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
    last7Days,
    transactions,
    loading,
    error,
    fetchData // This function is crucial for refreshing data after a delete
  } = useAppContext();

  // Calculate weekly credit and debit totals
  const weeklyCredit = last7Days
    .filter(day => day.type === 'credit')
    .reduce((sum, day) => sum + day.sum, 0);

  const weeklyDebit = last7Days
    .filter(day => day.type === 'debit')
    .reduce((sum, day) => sum + day.sum, 0);

  // Prepare data for charts
  const barChartData = {
    labels: last7Days.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Credit',
        data: last7Days.filter(day => day.type === 'credit').map(day => day.sum),
        backgroundColor: '#4ade80',
      },
      {
        label: 'Debit',
        data: last7Days.filter(day => day.type === 'debit').map(day => day.sum),
        backgroundColor: '#f87171',
      }
    ]
  };

  const pieChartData = {
    labels: ['Credit', 'Debit'],
    datasets: [{
      data: [totals.credit, totals.debit],
      backgroundColor: ['#4ade80', '#f87171'],
      hoverBackgroundColor: ['#22c55e', '#ef4444']
    }]
  };

  // Prepare data for Line Chart (e.g., daily balance trend)
  const lineChartData = {
    labels: last7Days.map(day => new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Credit',
        data: last7Days.filter(day => day.type === 'credit').map(day => day.sum),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Daily Debit',
        data: last7Days.filter(day => day.type === 'debit').map(day => day.sum),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const handleRefresh = () => {
    fetchData(); // Calls the fetchData function from AppContext to refresh all data
  };

  // Function to handle transaction deletion
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        // Call the deleteTransaction API function
        await deleteTransactionApi(id);
        // After successful deletion, refresh all data in the context
        fetchData();
        alert('Transaction deleted successfully!');
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <motion.h1 variants={itemVariants}>Dashboard</motion.h1>
        <motion.button 
          onClick={handleRefresh} 
          disabled={loading} 
          className="refresh-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          {loading ? (
            <>
              <i className="fas fa-sync-alt spin"></i> Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i> Refresh Data
            </>
          )}
        </motion.button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <StatsCards
            creditTotal={totals.credit}
            debitTotal={totals.debit}
            last7Days={last7Days}
            loading={loading}
          />

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

          <div className="recent-transactions">
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
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;