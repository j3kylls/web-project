const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  day: String, // e.g., "Monday"
  time: String, // e.g., "9:00 AM - 10:00 AM"
  subject: String,
  location: String
});

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entries: [entrySchema]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
