const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const verifyToken = require('../middleware/auth');
const Timetable = require('../models/Timetable');

const router = express.Router();

// File upload setup (memory storage for easy parsing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload and parse Excel/CSV
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Format: [{ Day, Time, Subject, Location }]
    const entries = data.map(row => ({
      day: row.Day,
      time: row.Time,
      subject: row.Subject,
      location: row.Location
    }));

    const newTimetable = new Timetable({
      user: req.userId,
      entries
    });

    await newTimetable.save();
    res.status(201).json({ message: 'Timetable uploaded successfully', entries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process file: ' + err.message });
  }
});

// Get logged-in user's timetable
router.get('/', verifyToken, async (req, res) => {
    try {
      const timetable = await Timetable.findOne({ user: req.userId });
  
      if (!timetable) return res.status(404).json({ message: 'No timetable found' });
  
      res.json(timetable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Delete the user's timetable
router.delete('/', verifyToken, async (req, res) => {
    try {
      const result = await Timetable.findOneAndDelete({ user: req.userId });
      if (!result) return res.status(404).json({ message: 'No timetable found to delete' });
  
      res.json({ message: 'Timetable deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Get timetable entries by day
router.get('/day/:day', verifyToken, async (req, res) => {
    try {
      const timetable = await Timetable.findOne({ user: req.userId });
      if (!timetable) return res.status(404).json({ message: 'No timetable found' });
  
      const filtered = timetable.entries.filter(entry =>
        entry.day.toLowerCase() === req.params.day.toLowerCase()
      );
  
      res.json(filtered);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Update a specific timetable entry by index
router.patch('/:index', verifyToken, async (req, res) => {
    try {
      const { index } = req.params;
      const { day, time, subject, location } = req.body;
  
      const timetable = await Timetable.findOne({ user: req.userId });
      if (!timetable) return res.status(404).json({ message: 'No timetable found' });
  
      if (index < 0 || index >= timetable.entries.length) {
        return res.status(400).json({ message: 'Invalid entry index' });
      }
  
      const entry = timetable.entries[index];
      if (day) entry.day = day;
      if (time) entry.time = time;
      if (subject) entry.subject = subject;
      if (location) entry.location = location;
  
      await timetable.save();
      res.json({ message: 'Timetable entry updated', entry });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
