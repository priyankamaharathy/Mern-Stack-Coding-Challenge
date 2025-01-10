import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const BarChartComponent = ({ data, isDarkMode = true }) => {
  const chartData = {
    labels: data.map(item => item.range),
    datasets: [{
      label: 'Price Distribution',
      data: data.map(item => item.count),
      backgroundColor: 'rgba(100, 255, 218, 0.6)',
      borderColor: '#64ffda',
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(100, 255, 218, 0.8)',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#112240',
        titleColor: '#64ffda',
        bodyColor: '#ccd6f6',
        borderColor: '#64ffda',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#8892b0'
        }
      },
      y: {
        grid: {
          color: 'rgba(100, 255, 218, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#8892b0'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartComponent; 