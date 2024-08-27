const Notification = require('../models/Notification');

// Recupera tutte le notifiche dell'utente
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recupera una notifica specifica
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crea una nuova notifica
exports.addNotification = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId;

  const notification = new Notification({
    message,
    userId
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Aggiorna una notifica esistente
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.isRead = req.body.isRead !== undefined ? req.body.isRead : notification.isRead;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Elimina una notifica
exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
