import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendsChart = ({ trends }) => {
  const theme = useTheme();

  const labels = trends.map(month => month._id);
  const incomeData = trends.map(month => month.totalIncome);
  const expenseData = trends.map(month => month.totalExpense);
  const netData = trends.map(month => month.totalIncome - month.totalExpense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: theme.palette.success.main,
        borderColor: theme.palette.success.dark,
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: theme.palette.error.main,
        borderColor: theme.palette.error.dark,
        borderWidth: 1,
      },
      {
        label: 'Net Balance',
        data: netData,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
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
          boxWidth: 10,
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
              backgroundColor: context.dataset.backgroundColor,
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
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Monthly Financial Trends
      </Typography>
      {trends.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No trend data available yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400 }}>
          <Bar data={data} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default TrendsChart;