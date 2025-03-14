import React from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const BalanceCard = ({ balance, loading, totalIncome, totalExpense }) => {
  // Formattazione della valuta
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
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
        <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Saldo Attuale
        </Typography>
      </Box>
      
      <Typography variant="h3" sx={{ fontWeight: 'bold', my: 3, color: balance >= 0 ? 'success.main' : 'error.main' }}>
        {formatCurrency(balance)}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Entrate</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
            {formatCurrency(totalIncome)}
          </Typography>
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Uscite</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
            {formatCurrency(totalExpense)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default BalanceCard;