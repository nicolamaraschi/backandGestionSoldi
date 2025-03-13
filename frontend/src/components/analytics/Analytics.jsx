import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import TrendsChart from './TrendsChart';
import CategoryBreakdown from './CategoryBreakdown';
import api from '../../services/api';
import { useAlert } from '../../contexts/AlertContext';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    trends: [],
    categoryStats: []
  });
  const [tabValue, setTabValue] = useState(0);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [overviewResponse, trendsResponse, categoryStatsResponse] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/trends'),
        api.get('/dashboard/category-stats')
      ]);

      setAnalyticsData({
        overview: overviewResponse.data,
        trends: trendsResponse.data,
        categoryStats: categoryStatsResponse.data
      });
    } catch (error) {
      showAlert('Failed to load analytics data', 'error');
      console.error('Analytics data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Financial Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              height: '100%'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Total Income
            </Typography>
            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {formatCurrency(analyticsData.overview?.totalIncome || 0)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              height: '100%'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Total Expenses
            </Typography>
            <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              {formatCurrency(analyticsData.overview?.totalExpense || 0)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              height: '100%'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Net Balance
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: (analyticsData.overview?.totalIncome || 0) - (analyticsData.overview?.totalExpense || 0) >= 0 
                  ? 'success.main' 
                  : 'error.main',
                fontWeight: 'bold'
              }}
            >
              {formatCurrency((analyticsData.overview?.totalIncome || 0) - (analyticsData.overview?.totalExpense || 0))}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          mb: 4
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ px: 2 }}
          >
            <Tab label="Monthly Trends" />
            <Tab label="Category Breakdown" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 ? (
            <TrendsChart trends={analyticsData.trends} />
          ) : (
            <CategoryBreakdown categories={analyticsData.categoryStats} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;