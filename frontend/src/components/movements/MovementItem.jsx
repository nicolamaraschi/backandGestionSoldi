import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const MovementItem = ({ movement, onEdit, onDelete }) => {
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
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  return (
    <Box sx={{ 
      py: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            bgcolor: movement.type === 'income' ? 'success.light' : 'error.light',
            color: movement.type === 'income' ? 'success.contrastText' : 'error.contrastText',
            mr: 2
          }}
        >
          {movement.type === 'income' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </Avatar>
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {movement.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {movement.category} • {formatDate(movement.date)}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: movement.type === 'income' ? 'success.main' : 'error.main',
            mr: 1
          }}
        >
          {movement.type === 'income' ? '+' : '-'}{formatCurrency(movement.amount)}
        </Typography>
        
        <IconButton
          aria-label="more"
          aria-controls="movement-menu"
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
        
        <Menu
          id="movement-menu"
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
      </Box>
    </Box>
  );
};

export default MovementItem;