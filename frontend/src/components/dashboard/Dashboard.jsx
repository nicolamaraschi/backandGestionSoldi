import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material';
import BalanceCard from './BalanceCard';
import ExpenseChart from './ExpenseChart';
import RecentMovements from './RecentMovements';
import StatsOverview from './StatsOverview';
import api from '../../services/api';
import { useAlert } from '../../contexts/AlertContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    stats: [],
    movements: [],
    categoryStats: []
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [balanceResponse, statsResponse, movementsResponse, categoryStatsResponse] = await Promise.all([
          api.get('/dashboard/balance'),
          api.get('/dashboard/stats'),
          api.get('/dashboard/movements'),
          api.get('/dashboard/category-stats')
        ]);

        setDashboardData({
          balance: balanceResponse.data.balance || 0,
          stats: statsResponse.data || [],
          movements: movementsResponse.data || [],
          categoryStats: categoryStatsResponse.data || []
        });
      } catch (error) {
        showAlert('Failed to load dashboard data', 'error');
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showAlert]);

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
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={6}>
          <BalanceCard balance={dashboardData.balance} />
        </Grid>
        
        {/* Stats Overview */}
        <Grid item xs={12} md={6}>
          <StatsOverview stats={dashboardData.stats} />
        </Grid>
        
        {/* Expense Chart */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Monthly Overview
            </Typography>
            <ExpenseChart stats={dashboardData.stats} />
          </Paper>
        </Grid>
        
        {/* Recent Movements */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <RecentMovements movements={dashboardData.movements.slice(0, 5)} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;