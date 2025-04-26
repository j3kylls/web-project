const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pomodoro', pomodoroSchema);
