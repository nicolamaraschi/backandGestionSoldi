const express = require('express');
const router = express.Router();
const { getMovements, addMovement, deleteMovement } = require('../controllers/movementController');


// Route per ottenere movimenti
router.get('/', getMovements);

// Route per aggiungere un movimento
router.post('/', addMovement);

// Route per eliminare un movimento
router.delete('/:id', deleteMovement);

// Aggiorna un movimento
router.put('/:id', auth, updateMovement);

module.exports = router;
