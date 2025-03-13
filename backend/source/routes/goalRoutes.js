const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const goalController = require('../controllers/goalController');

router.get('/', authMiddleware, goalController.getGoals);
router.get('/:id', authMiddleware, goalController.getGoal);
router.post('/', authMiddleware, goalController.addGoal);
router.put('/:id', authMiddleware, goalController.updateGoal);
router.delete('/:id', authMiddleware, goalController.deleteGoal);

module.exports = router;