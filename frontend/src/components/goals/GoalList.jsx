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
import GoalItem from './GoalItem';
import GoalForm from './GoalForm';
import { getGoals, deleteGoal } from '../../services/goalService';
import { useAlert } from '../../contexts/AlertContext';

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      showAlert('Failed to load goals', 'error');
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingGoal(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      setGoals(goals.filter(goal => goal._id !== id));
      showAlert('Goal deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete goal', 'error');
      console.error('Error deleting goal:', error);
    }
  };

  const handleFormSubmit = () => {
    fetchGoals();
    handleCloseForm();
    showAlert(editingGoal ? 'Goal updated successfully' : 'Goal added successfully', 'success');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Savings Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Goal
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : goals.length === 0 ? (
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
            No savings goals yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Create your first savings goal to start tracking your progress towards your financial targets.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Create Your First Goal
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => (
            <Grid item xs={12} md={6} lg={4} key={goal._id}>
              <GoalItem
                goal={goal}
                onEdit={() => handleEdit(goal)}
                onDelete={() => handleDelete(goal._id)}
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
        <GoalForm 
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          goal={editingGoal}
        />
      </Dialog>
    </Box>
  );
};

export default GoalList;