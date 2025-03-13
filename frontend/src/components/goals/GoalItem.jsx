import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const GoalItem = ({ goal, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleClose();
    onEdit();
  };
  
  const handleDelete = () => {
    handleClose();
    onDelete();
  };

  const calculateProgress = () => {
    if (!goal.targetAmount) return 0;
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const progress = calculateProgress();
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {goal.title}
        </Typography>
        <IconButton
          aria-label="more"
          aria-controls="goal-menu"
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      
      {goal.dueDate && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Target date: {format(new Date(goal.dueDate), 'dd MMM yyyy')}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">
            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
          </Typography>
          <Chip 
            label={`${Math.round(progress)}%`} 
            size="small" 
            color={progress >= 100 ? 'success' : 'primary'} 
            variant={progress >= 100 ? 'filled' : 'outlined'}
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.08)',
            mb: 2
          }} 
        />
        
        <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
          {remainingAmount <= 0 
            ? 'Goal Achieved! 🎉' 
            : `${formatCurrency(remainingAmount)} remaining`}
        </Typography>
      </Box>
      
      <Menu
        id="goal-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default GoalItem;