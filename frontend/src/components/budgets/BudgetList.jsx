import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Dialog
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BudgetItem from './BudgetItem';
import BudgetForm from './BudgetForm';
import { getBudgets, deleteBudget } from '../../services/budgetService';
import { useAlert } from '../../contexts/AlertContext';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      showAlert('Failed to load budgets', 'error');
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingBudget(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter(budget => budget._id !== id));
      showAlert('Budget deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete budget', 'error');
      console.error('Error deleting budget:', error);
    }
  };

  const handleFormSubmit = () => {
    fetchBudgets();
    handleCloseForm();
    showAlert(editingBudget ? 'Budget updated successfully' : 'Budget added successfully', 'success');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Budget Planning
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Budget
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : budgets.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No budgets set yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Create a budget to start tracking your spending in different categories and stay on top of your finances.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Create Your First Budget
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {budgets.map((budget) => (
            <Grid item xs={12} md={6} key={budget._id}>
              <BudgetItem
                budget={budget}
                onEdit={() => handleEdit(budget)}
                onDelete={() => handleDelete(budget._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
      >
        <BudgetForm 
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          budget={editingBudget}
        />
      </Dialog>
    </Box>
  );
};

export default BudgetList;