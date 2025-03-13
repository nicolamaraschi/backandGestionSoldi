import React, { useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CategoryBreakdown = ({ categories }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('expense');

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Filter categories based on selected type
  const filteredCategories = categories.filter(category => {
    // If we don't have category type info in the stats (from dashboard/category-stats),
    // we can guess based on the data structure or use all categories
    return true;
  });

  // Generate color palette
  const generateColors = (count) => {
    const baseColors = [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      '#9c27b0', // purple
      '#ff9800', // orange
      '#795548', // brown
      '#607d8b', // blueGrey
      '#e91e63', // pink
    ];
    
    const colors = [];
    const backgroundColors = [];
    
    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      colors.push(baseColors[colorIndex]);
      backgroundColors.push(baseColors[colorIndex] + '99'); // Add alpha
    }
    
    return { colors, backgroundColors };
  };

  const { colors, backgroundColors } = generateColors(filteredCategories.length);

  const chartData = {
    labels: filteredCategories.map(cat => cat._id),
    datasets: [
      {
        data: filteredCategories.map(cat => Math.abs(cat.totalAmount)),
        backgroundColor: backgroundColors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const { labels, datasets } = data;
              const total = datasets[0].data.reduce((sum, value) => sum + value, 0);
              
              return labels.map((label, i) => {
                const value = datasets[0].data[i];
                const percentage = Math.round((value / total) * 100);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: datasets[0].borderColor[i],
                  lineWidth: datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Spending by Category
        </Typography>
        
        <ToggleButtonGroup
          color="primary"
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="expense">Expenses</ToggleButton>
          <ToggleButton value="income">Income</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {filteredCategories.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No category data available yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
          <Pie data={chartData} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default CategoryBreakdown;