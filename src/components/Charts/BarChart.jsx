// // BarChart.jsx
// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import './Charts.css';

// const BarChart = ({ data }) => {
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
//               style: 'currency',
//               currency: 'USD'
//             }).format(context.raw)}`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         ticks: {
//           callback: function(value) {
//             return new Intl.NumberFormat('en-US', {
//               style: 'currency',
//               currency: 'USD'
//             }).format(value);
//           }
//         }
//       }
//     }
//   };

//   return <Bar data={data} options={options} />;
// };

// export default BarChart;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './Charts.css';

const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;