const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authMiddleware, notificationController.getNotifications);
router.get('/:id', authMiddleware, notificationController.getNotification);
router.post('/', authMiddleware, notificationController.addNotification);
router.put('/:id', authMiddleware, notificationController.updateNotification);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
