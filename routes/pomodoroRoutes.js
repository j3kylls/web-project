const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro');
const verifyToken = require('../middleware/auth');

// Log a pomodoro session
router.post('/', verifyToken, async (req, res) => {
  try {
    const { startTime, endTime, task } = req.body;

    const newSession = new Pomodoro({
      user: req.userId,
      startTime,
      endTime,
      task: task || null
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all pomodoro sessions for logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
      const sessions = await Pomodoro.find({ user: req.userId })
        .populate('task', 'title status')  // optional: show linked task info
        .sort({ createdAt: -1 });
  
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get pomodoro logs for a specific date
router.get('/date/:date', verifyToken, async (req, res) => {
    try {
      const targetDate = new Date(req.params.date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);
  
      const logs = await Pomodoro.find({
        user: req.userId,
        startTime: { $gte: targetDate, $lt: nextDate }
      }).populate('task', 'title');
  
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Get total focus time in minutes for the logged-in user
router.get('/analytics/summary', verifyToken, async (req, res) => {
    try {
      const logs = await Pomodoro.find({ user: req.userId });
  
      const daily = {};
      const weekly = {};
  
      logs.forEach(log => {
        const start = new Date(log.startTime);
        const end = new Date(log.endTime);
        const durationMin = Math.round((end - start) / 60000); // ms to min
  
        // Daily summary (YYYY-MM-DD)
        const dateKey = start.toISOString().split('T')[0];
        daily[dateKey] = (daily[dateKey] || 0) + durationMin;
  
        // Weekly summary (YYYY-WW)
        const weekKey = `${start.getFullYear()}-W${Math.ceil(
          (start.getDate() - start.getDay() + 1) / 7
        )}`;
        weekly[weekKey] = (weekly[weekKey] || 0) + durationMin;
      });
  
      res.json({ daily, weekly });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

module.exports = router;
