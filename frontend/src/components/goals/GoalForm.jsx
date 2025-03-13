import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography  // Aggiungi questa riga
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createGoal, updateGoal } from '../../services/goalService';
import { useAlert } from '../../contexts/AlertContext';

const GoalForm = ({ onClose, onSubmit, goal }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { showAlert } = useAlert();

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        dueDate: goal.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }
    if (formData.currentAmount && (isNaN(formData.currentAmount) || parseFloat(formData.currentAmount) < 0)) {
      newErrors.currentAmount = 'Current amount must be a non-negative number';
    }
    if (formData.currentAmount && parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0)
      };
      
      if (goal) {
        await updateGoal(goal._id, data);
      } else {
        await createGoal(data);
      }
      
      onSubmit();
    } catch (error) {
      showAlert('Failed to save goal', 'error');
      console.error('Error saving goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {goal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            fullWidth
            label="Goal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Target Amount"
            name="targetAmount"
            type="number"
            value={formData.targetAmount}
            onChange={handleChange}
            error={!!errors.targetAmount}
            helperText={errors.targetAmount}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Current Amount (Optional)"
            name="currentAmount"
            type="number"
            value={formData.currentAmount}
            onChange={handleChange}
            error={!!errors.currentAmount}
            helperText={errors.currentAmount}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Target Date (Optional)"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          {formData.targetAmount && formData.currentAmount ? (
            <Box sx={{ mt: 2, bgcolor: 'primary.light', p: 2, borderRadius: 1 }}>
              <FormHelperText sx={{ color: 'primary.contrastText', fontSize: '0.9rem', mb: 1 }}>
                Goal Progress
              </FormHelperText>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'primary.contrastText' }}>
                <Typography variant="body2">
                  {((parseFloat(formData.currentAmount) / parseFloat(formData.targetAmount)) * 100).toFixed(1)}% Complete
                </Typography>
                <Typography variant="body2">
                  €{(parseFloat(formData.targetAmount) - parseFloat(formData.currentAmount)).toFixed(2)} Remaining
                </Typography>
              </Box>
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {goal ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </>
  );
};

export default GoalForm;