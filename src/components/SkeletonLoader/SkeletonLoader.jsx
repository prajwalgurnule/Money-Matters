import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', width = '100%', height = '1rem', count = 1 }) => {
  const elements = Array.from({ length: count }, (_, i) => i);
  
  return (
    <>
      {elements.map((_, index) => (
        <div 
          key={index}
          className={`skeleton ${type}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};

export const TransactionListSkeleton = () => {
  return (
    <div className="skeleton-transaction-list">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-transaction-item">
          <SkeletonLoader type="circle" width="1.5rem" height="1.5rem" />
          <div className="skeleton-transaction-details">
            <SkeletonLoader width="60%" height="1rem" />
            <SkeletonLoader width="40%" height="0.75rem" />
            <SkeletonLoader width="30%" height="0.75rem" />
          </div>
          <SkeletonLoader width="20%" height="1rem" />
        </div>
      ))}
    </div>
  );
};

export const StatsCardsSkeleton = () => {
  return (
    <div className="skeleton-stats-container">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <SkeletonLoader width="60%" height="1rem" />
          <SkeletonLoader width="40%" height="1.5rem" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;