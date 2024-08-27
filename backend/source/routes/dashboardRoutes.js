const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// Rotte esistenti del dashboard
router.get('/movements', authMiddleware, dashboardController.getMovements);
router.get('/stats', authMiddleware, dashboardController.getStats);
router.get('/category-stats', authMiddleware, dashboardController.getCategoryStats);
router.get('/balance', authMiddleware, dashboardController.getBalance);
router.get('/forecast', authMiddleware, dashboardController.getForecast);
router.get('/reports', authMiddleware, dashboardController.getReports);
router.get('/export', authMiddleware, dashboardController.exportData);

// Nuove rotte di analisi avanzata
router.get('/overview', authMiddleware, dashboardController.getOverview);
router.get('/trends', authMiddleware, dashboardController.getTrends);
router.get('/comparison', authMiddleware, dashboardController.getComparison);

// Nuove rotte per notifiche, obiettivi e budget
router.get('/notifications', authMiddleware, dashboardController.getNotifications);
router.get('/goals', authMiddleware, dashboardController.getGoals);
router.get('/budgets', authMiddleware, dashboardController.getBudgets);

module.exports = router;
