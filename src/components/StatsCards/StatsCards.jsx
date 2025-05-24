import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import { StatsCardsSkeleton } from '../SkeletonLoader/SkeletonLoader';
import './StatsCards.css';
// import TrendUpIcon from '../../assets/trend-up.svg';
// import TrendDownIcon from '../../assets/trend-down.svg';

const StatsCards = ({ creditTotal, debitTotal, last7Days, loading }) => {
  if (loading) return <StatsCardsSkeleton />;

  // Calculate weekly change
  const weeklyChange = creditTotal - debitTotal;
  const weeklyChangePercentage = debitTotal > 0 
    ? Math.abs(Math.round(((creditTotal - debitTotal) / debitTotal) * 100))
    : 100;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="stats-container">
      <motion.div 
        className="stat-card balance-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        whileHover={{ y: -5 }}
      >
        <div className="stat-header">
          <h3>Total Balance</h3>
          <div className={`trend-indicator ${weeklyChange >= 0 ? 'positive' : 'negative'}`}>
            {weeklyChange >= 0 ? (
              <svg
                viewBox="0 0 24 24"
                style={{ height: '32px', width: '32px', marginRight: '4px' }}
                fill="currentColor"
              >
                <path d="M12 4L4 12h5v8h6v-8h5L12 4z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                style={{ height: '32px', width: '32px', marginRight: '4px' }}
                fill="currentColor"
              >
                <path d="M12 20l8-8h-5V4h-6v8H4l8 8z" />
              </svg>
            )}
            <span>{weeklyChangePercentage}%</span>
          </div>
        </div>
        <p className="amount">
          {formatCurrency(creditTotal - debitTotal)}
        </p>
        <div className="stat-footer">
          <span>Weekly change</span>
          <span className={weeklyChange >= 0 ? 'positive' : 'negative'}>
            {weeklyChange >= 0 ? '+' : ''}{formatCurrency(weeklyChange)}
          </span>
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card credit-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={1}
        whileHover={{ y: -5 }}
      >
        <div className="stat-header">
          <h3>Total Credit</h3>
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
            </svg>
          </div>
        </div>
        <p className="amount">{formatCurrency(creditTotal)}</p>
        <div className="stat-footer">
          <span>Last 7 days</span>
          <span>+{formatCurrency(creditTotal / 4)}</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card debit-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        whileHover={{ y: -5 }}
      >
        <div className="stat-header">
          <h3>Total Debit</h3>
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,14V20H5V14H19M19,10H5V4H19V10M14,17H17V15H14V17M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.89,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z" />
            </svg>
          </div>
        </div>
        <p className="amount">{formatCurrency(debitTotal)}</p>
        <div className="stat-footer">
          <span>Last 7 days</span>
          <span>-{formatCurrency(debitTotal / 4)}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsCards;