const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Task = require('../models/Task');
const Pomodoro = require('../models/Pomodoro');
const Timetable = require('../models/Timetable');
const CloudFile = require('../models/CloudFile');
const drive = require('../utils/drive');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/auth');

// Create new user (signup)
router.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users (optional)
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// User Sign In
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete a user by email (for testing only)
router.delete('/delete/:email', async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Change password
// router.post('/change-password', verifyToken, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const user = await User.findById(req.userId);

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//     user.password = hashedNewPassword;
//     await user.save();

//     res.json({ message: 'Password changed successfully' });
//   } catch (err) {
//     console.error('Password change error:', err.message);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    // ✅ Just assign directly, schema will hash it
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// Clear account data
router.delete('/clear-account', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Delete files from Drive
    const files = await CloudFile.find({ user: userId });
    for (const file of files) {
      try {
        await drive.deleteFile(file.fileId);
      } catch (err) {
        console.warn(`Failed to delete Drive file ${file.fileId}:`, err.message);
      }
    }

    // Delete user data from DB
    await Blog.deleteMany({ author: userId });
    await Task.deleteMany({ user: userId });
    await Pomodoro.deleteMany({ user: userId });
    await Timetable.deleteMany({ user: userId });
    await CloudFile.deleteMany({ user: userId });

    res.json({ message: 'Account data cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear account', detail: err.message });
  }
});

module.exports = router;
