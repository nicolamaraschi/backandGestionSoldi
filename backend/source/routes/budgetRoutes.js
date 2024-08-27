const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const budgetController = require('../controllers/budgetController');

router.get('/', authMiddleware, budgetController.getBudgets);
router.get('/:id', authMiddleware, budgetController.getBudget);
router.post('/', authMiddleware, budgetController.addBudget);
router.put('/:id', authMiddleware, budgetController.updateBudget);
router.delete('/:id', authMiddleware, budgetController.deleteBudget);

module.exports = router;
