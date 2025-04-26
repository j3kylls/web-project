const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/auth');

// Create a new notification
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message, type } = req.body;

    const notification = new Notification({
      user: req.userId,
      message,
      type
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get all notifications for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.userId });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
