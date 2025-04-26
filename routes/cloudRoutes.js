const express = require('express');
const router = express.Router();
const multer = require('multer');
const drive = require('../utils/drive');
const verifyToken = require('../middleware/auth');
const CloudFile = require('../models/CloudFile');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Track each user's Drive folder by userId
const userFolders = {};

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create folder for userId if not already created
    if (!userFolders[userId]) {
      const folderId = await drive.createUserFolder(userId); // ← Folder named by ID
      userFolders[userId] = folderId;
    }

    const uploaded = await drive.uploadFileToFolder(
      userFolders[userId],
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Save metadata in DB
    const cloudFile = new CloudFile({
      user: userId,
      fileId: uploaded.id,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      viewLink: uploaded.viewLink,
      downloadLink: uploaded.downloadLink
    });

    await cloudFile.save();

    res.status(201).json({
      message: 'File uploaded to Drive and DB successfully',
      file: cloudFile
    });
  } catch (err) {
    console.error('Drive upload error:', err.message);
    res.status(500).json({ error: 'File upload failed', detail: err.message });
  }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const fileId = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const cloudFile = await CloudFile.findOne({ _id: fileId, user: req.userId });

    if (!cloudFile) return res.status(404).json({ error: 'File not found' });

    // Remove from Google Drive
    await drive.deleteFile(cloudFile.fileId);

    // Remove from DB
    await cloudFile.deleteOne();

    res.json({ message: 'File deleted from Drive and DB' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete file', detail: err.message });
  }
});

router.get('/myfiles', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const files = await CloudFile.find({ user: userId }).sort({ uploadedAt: -1 });

    res.json({ files });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch files', detail: err.message });
  }
});

module.exports = router;
