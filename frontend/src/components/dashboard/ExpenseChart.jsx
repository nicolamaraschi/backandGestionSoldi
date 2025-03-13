import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpenseChart = ({ stats }) => {
  const theme = useTheme();

  // Extract labels (months) and data from stats
  const labels = stats.map(item => item._id);
  const incomeData = stats.map(item => item.totalIncome);
  const expenseData = stats.map(item => item.totalExpense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: theme.palette.success.main,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: theme.palette.success.main,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: theme.palette.error.main,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: theme.palette.error.main,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          labelColor: (context) => {
            return {
              backgroundColor: context.dataset.borderColor,
              borderColor: context.dataset.borderColor
            };
          },
          label: (context) => {
            return ` ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EUR'
            }).format(context.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          callback: (value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            notation: 'compact'
          }).format(value)
        }
      }
    }
  };

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default ExpenseChart;