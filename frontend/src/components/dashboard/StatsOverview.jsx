import React from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarMonth as CalendarMonthIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';

const StatsOverview = ({ stats, loading }) => {
  // Calcola le statistiche del mese corrente
  const currentMonth = new Date().toISOString().slice(0, 7); // Formato: "YYYY-MM"
  const currentMonthStats = stats.find(stat => stat._id === currentMonth) || 
    { totalIncome: 0, totalExpense: 0 };
  
  const monthlySavings = currentMonthStats.totalIncome - currentMonthStats.totalExpense;
  const savingsRate = currentMonthStats.totalIncome > 0 
    ? (monthlySavings / currentMonthStats.totalIncome) * 100 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          height: '100%',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Questo Mese
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Entrate</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
              {formatCurrency(currentMonthStats.totalIncome)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
              <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Uscite</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
              {formatCurrency(currentMonthStats.totalExpense)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SavingsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Risparmio Mensile
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: monthlySavings >= 0 ? 'success.main' : 'error.main'
          }}>
            {formatCurrency(monthlySavings)}
          </Typography>
          
          {currentMonthStats.totalIncome > 0 && (
            <Box sx={{ 
              borderRadius: 1,
              px: 1,
              py: 0.5,
              bgcolor: monthlySavings >= 0 ? 'success.light' : 'error.light',
              color: monthlySavings >= 0 ? 'success.contrastText' : 'error.contrastText'
            }}>
              <Typography variant="body2" fontWeight="bold">
                {savingsRate.toFixed(0)}% delle entrate
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsOverview;