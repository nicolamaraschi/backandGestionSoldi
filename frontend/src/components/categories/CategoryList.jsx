// Modifica completa per src/components/categories/CategoryList.jsx

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
  Tab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CategoryItem from './CategoryItem';
import CategoryForm from './CategoryForm';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { useAlert } from '../../contexts/AlertContext';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  
  const { showAlert } = useAlert();

  useEffect(() => {
    // Utilizziamo un IIFE come abbiamo fatto per Dashboard per evitare di restituire una Promise
    (function() {
      let isMounted = true;
      setLoading(true);
      
      // Funzione asincrona interna
      async function fetchData() {
        try {
          const data = await getCategories();
          if (isMounted) {
            setCategories(data);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching categories:', error);
            showAlert('Failed to load categories', 'error');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
      
      fetchData();
      
      // Funzione di pulizia corretta
      return () => {
        isMounted = false;
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      showAlert('Category deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete category', 'error');
      console.error('Error deleting category:', error);
    }
  };

  const handleFormSubmit = () => {
    // Qui utilizziamo una funzione IIFE immediatamente eseguita per gestire 
    // la chiamata asincrona senza ritornare una Promise
    (function() {
      let isMounted = true;
      
      async function refetchCategories() {
        try {
          if (isMounted) {
            const data = await getCategories();
            setCategories(data);
            handleCloseForm();
            showAlert(editingCategory ? 'Category updated successfully' : 'Category added successfully', 'success');
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching categories:', error);
          }
        }
      }
      
      refetchCategories();
      
      // Non è necessario ritornare una funzione di pulizia in questo caso
      // perché non è un effetto, ma per sicurezza lo facciamo comunque
      return () => {
        isMounted = false;
      };
    })();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredCategories = tabValue === 'all'
    ? categories
    : categories.filter(category => category.type === tabValue);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Category
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label="All Categories" />
          <Tab value="income" label="Income" />
          <Tab value="expense" label="Expense" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No categories found
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