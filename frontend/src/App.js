import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

// Layout Component
import Layout from './components/common/Layout';

// Main Components
import Dashboard from './components/dashboard/Dashboard';
import MovementList from './components/movements/MovementList';
import CategoryList from './components/categories/CategoryList';
import BudgetList from './components/budgets/BudgetList';
import GoalList from './components/goals/GoalList';
import Analytics from './components/analytics/Analytics';
import NotificationList from './components/notifications/NotificationList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AlertProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<PrivateRoute />}>
                <Route path="/" element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } />
                <Route path="/movements" element={
                  <Layout>
                    <MovementList />
                  </Layout>
                } />
                <Route path="/categories" element={
                  <Layout>
                    <CategoryList />
                  </Layout>
                } />
                <Route path="/budgets" element={
                  <Layout>
                    <BudgetList />
                  </Layout>
                } />
                <Route path="/goals" element={
                  <Layout>
                    <GoalList />
                  </Layout>
                } />
                <Route path="/analytics" element={
                  <Layout>
                    <Analytics />
                  </Layout>
                } />
                <Route path="/notifications" element={
                  <Layout>
                    <NotificationList />
                  </Layout>
                } />
                <Route path="/settings" element={
                  <Layout>
                    <div>Settings Page (Coming Soon)</div>
                  </Layout>
                } />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;