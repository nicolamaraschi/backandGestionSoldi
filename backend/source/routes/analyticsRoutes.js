const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

// Rotte per il controller dell'analisi
router.get('/overview', authMiddleware, analyticsController.getOverview);
router.get('/trends', authMiddleware, analyticsController.getTrends);
router.get('/comparison', authMiddleware, analyticsController.getComparison);

module.exports = router;
