import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const PieChartComponent = ({ data, isDarkMode = true }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: [
        'rgba(100, 255, 218, 0.8)',
        'rgba(129, 161, 193, 0.8)',
        'rgba(235, 203, 139, 0.8)',
        'rgba(163, 190, 140, 0.8)',
        'rgba(180, 142, 173, 0.8)',
        'rgba(208, 135, 112, 0.8)'
      ],
      borderColor: '#112240',
      borderWidth: 2,
      hoverOffset: 15
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#8892b0',
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => ({
              text: `${label} (${datasets[0].data[i]})`,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].borderColor,
              lineWidth: 1,
              hidden: false
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: '#112240',
        titleColor: '#64ffda',
        bodyColor: '#ccd6f6',
        borderColor: '#64ffda',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return ` ${label}: ${value}`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChartComponent; 