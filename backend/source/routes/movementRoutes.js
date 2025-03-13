const express = require('express');
const router = express.Router();
const { getMovements, addMovement, deleteMovement, updateMovement } = require('../controllers/movementController');
const authMiddleware = require('../middleware/auth');

// Route per ottenere movimenti
router.get('/', authMiddleware, getMovements);

// Route per aggiungere un movimento
router.post('/', authMiddleware, addMovement);

// Route per eliminare un movimento
router.delete('/:id', authMiddleware, deleteMovement);

// Aggiorna un movimento
router.put('/:id', authMiddleware, updateMovement);

module.exports = router;