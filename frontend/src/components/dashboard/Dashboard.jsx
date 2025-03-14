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
    categoryStats: [],
    totalIncome: 0,
    totalExpense: 0
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    (function() {
      let isMounted = true;
      setLoading(true);
      
      async function fetchData() {
        try {
          // Ottieni solo i dati delle transazioni
          const movementsResponse = await api.get('/movements');
          const movements = movementsResponse.data || [];

          if (isMounted) {
            // Calcola i totali dalle transazioni
            const totalIncome = movements
              .filter(m => m.type === 'income')
              .reduce((sum, m) => sum + m.amount, 0);
              
            const totalExpense = movements
              .filter(m => m.type === 'expense')
              .reduce((sum, m) => sum + m.amount, 0);
              
            const balance = totalIncome - totalExpense;
            
            // Costruisci stats raggruppando per mese
            const statsByMonth = {};
            movements.forEach(m => {
              const monthYear = new Date(m.date).toISOString().slice(0, 7);
              if (!statsByMonth[monthYear]) {
                statsByMonth[monthYear] = { 
                  _id: monthYear, 
                  totalIncome: 0, 
                  totalExpense: 0 
                };
              }
              
              if (m.type === 'income') {
                statsByMonth[monthYear].totalIncome += m.amount;
              } else {
                statsByMonth[monthYear].totalExpense += m.amount;
              }
            });
            
            const stats = Object.values(statsByMonth);
            
            // Costruisci le statistiche per categoria
            const categoryStats = [];
            const categoryMap = {};
            
            movements.forEach(m => {
              if (!categoryMap[m.category]) {
                categoryMap[m.category] = 0;
              }
              
              if (m.type === 'expense') {
                categoryMap[m.category] += m.amount;
              }
            });
            
            Object.entries(categoryMap).forEach(([category, amount]) => {
              categoryStats.push({ _id: category, totalAmount: amount });
            });
            
            setDashboardData({
              balance,
              stats,
              movements,
              categoryStats,
              totalIncome,
              totalExpense
            });
          }
        } catch (error) {
          if (isMounted) {
            console.error('Dashboard data fetch error:', error);
            showAlert('Problemi nel caricamento dei dati', 'error');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
      
      fetchData();
      
      return () => {
        isMounted = false;
      };
    })();
  }, [showAlert]);

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid item xs={12} md={6}>
            <BalanceCard 
              balance={dashboardData.balance} 
              totalIncome={dashboardData.totalIncome}
              totalExpense={dashboardData.totalExpense}
            />
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
                Panoramica Mensile
              </Typography>
              {dashboardData.stats.length > 0 ? (
                <ExpenseChart stats={dashboardData.stats} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Typography variant="body1" color="textSecondary">
                    Nessun dato disponibile per il grafico
                  </Typography>
                </Box>
              )}
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
                Transazioni Recenti
              </Typography>
              <RecentMovements movements={dashboardData.movements.slice(0, 5)} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;