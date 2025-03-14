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
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const BudgetItem = ({ budget, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Gestisci il caso in cui budget.category è null o non ha la proprietà name
  const categoryName = budget.category && budget.category.name ? budget.category.name : 'Categoria non disponibile';
  
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

  // Per demo purposes, calculate a random spent amount
  // In a real app, this would come from the sum of expenses in this category
  const getRandomSpent = () => {
    return Math.random() * budget.amount;
  };
  
  const spent = getRandomSpent();
  const progress = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDateRange = () => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  // Determine status color
  const getStatusColor = () => {
    if (progress >= 100) return 'error';
    if (progress >= 80) return 'warning';
    return 'success';
  };

  const statusColor = getStatusColor();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {categoryName}
        </Typography>
        <IconButton
          aria-label="more"
          aria-controls="budget-menu"
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          {formatDateRange()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CategoryIcon fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          Budget: {formatCurrency(budget.amount)}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Spent: {formatCurrency(spent)}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              color: `${statusColor}.main`
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
        
        <Tooltip title={`${formatCurrency(spent)} of ${formatCurrency(budget.amount)}`}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            color={statusColor}
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.08)'
            }} 
          />
        </Tooltip>
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            color: remaining >= 0 ? 'success.main' : 'error.main'
          }}
        >
          {remaining >= 0 
            ? `${formatCurrency(remaining)} remaining` 
            : `${formatCurrency(Math.abs(remaining))} over budget`}
        </Typography>
      </Box>
      
      <Menu
        id="budget-menu"
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

export default BudgetItem;