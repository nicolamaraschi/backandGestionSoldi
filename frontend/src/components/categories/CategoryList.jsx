import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  RestartAlt as RestartAltIcon 
} from '@mui/icons-material';
import CategoryItem from './CategoryItem';
import CategoryForm from './CategoryForm';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { useAlert } from '../../contexts/AlertContext';
import api from '../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [resetting, setResetting] = useState(false);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showAlert('Impossibile caricare le categorie', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingCategory(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category._id !== id));
      showAlert('Categoria eliminata con successo', 'success');
    } catch (error) {
      showAlert('Impossibile eliminare la categoria', 'error');
      console.error('Error deleting category:', error);
    }
  };

  const handleFormSubmit = () => {
    fetchCategories();
    handleCloseForm();
    showAlert(editingCategory ? 'Categoria aggiornata con successo' : 'Categoria aggiunta con successo', 'success');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResetCategories = async () => {
    if (window.confirm('Questa azione sostituirà tutte le tue categorie con quelle predefinite. Continuare?')) {
      try {
        setResetting(true);
        await api.post('/categories/reset-defaults');
        await fetchCategories();
        showAlert('Categorie ripristinate con successo', 'success');
      } catch (error) {
        showAlert('Impossibile ripristinare le categorie', 'error');
        console.error('Error resetting categories:', error);
      } finally {
        setResetting(false);
      }
    }
  };

  const filteredCategories = tabValue === 'all'
    ? categories
    : categories.filter(category => category.type === tabValue);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Categorie
        </Typography>
        <Box>
          <Tooltip title="Ripristina le categorie predefinite">
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetCategories}
              disabled={resetting}
              sx={{ mr: 2 }}
            >
              {resetting ? <CircularProgress size={24} /> : 'Ripristina Predefinite'}
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Aggiungi Categoria
          </Button>
        </Box>
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label="Tutte le Categorie" />
          <Tab value="income" label="Entrate" />
          <Tab value="expense" label="Uscite" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              Nessuna categoria trovata
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <CategoryItem
                  category={category}
                  onEdit={() => handleEdit(category)}
                  onDelete={() => handleDelete(category._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        fullWidth
        maxWidth="xs"
      >
        {openForm && (
          <CategoryForm 
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            category={editingCategory}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default CategoryList;