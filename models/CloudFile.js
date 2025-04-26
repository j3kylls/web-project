const mongoose = require('mongoose');

const cloudFileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: String,
    required: true
  },
  filename: String,
  mimetype: String,
  viewLink: String,
  downloadLink: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CloudFile', cloudFileSchema);
