import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import MovementItem from './MovementItem';
import MovementForm from './MovementForm';
import { getMovements, deleteMovement } from '../../services/movementService';
import { useAlert } from '../../contexts/AlertContext';

const MovementList = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMovement, setEditingMovement] = useState(null);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchMovements();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovements(movements);
    } else {
      const filtered = movements.filter(movement => 
        movement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovements(filtered);
    }
  }, [searchTerm, movements]);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const data = await getMovements();
      setMovements(data);
      setFilteredMovements(data);
    } catch (error) {
      showAlert('Failed to load movements', 'error');
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingMovement(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingMovement(null);
  };

  const handleEdit = (movement) => {
    setEditingMovement(movement);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovement(id);
      setMovements(movements.filter(movement => movement._id !== id));
      showAlert('Movement deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete movement', 'error');
      console.error('Error deleting movement:', error);
    }
  };

  const handleFormSubmit = () => {
    fetchMovements();
    handleCloseForm();
    showAlert(editingMovement ? 'Movement updated successfully' : 'Movement added successfully', 'success');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Transaction
        </Button>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            sx={{ minWidth: '120px' }}
          >
            Filter
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredMovements.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No transactions found
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredMovements.map((movement) => (
              <React.Fragment key={movement._id}>
                <MovementItem
                  movement={movement}
                  onEdit={() => handleEdit(movement)}
                  onDelete={() => handleDelete(movement._id)}
                />
                <Divider />
              </React.Fragment>
            ))}
          </Box>
        )}
      </Paper>
      
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
      >
        <MovementForm 
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          movement={editingMovement}
        />
      </Dialog>
    </Box>
  );
};

export default MovementList;