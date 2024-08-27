const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// Ottieni tutte le categorie (richiede autenticazione)
router.get('/', authMiddleware, categoryController.getCategories);

// Aggiungi una categoria (richiede autenticazione)
router.post('/', authMiddleware, categoryController.addCategory);

// Elimina una categoria (richiede autenticazione)
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

// Aggiorna una categoria
router.put('/:id', auth, updateCategory);

module.exports = router;
