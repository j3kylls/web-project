// // const express = require('express');
// // const router = express.Router();
// // const verifyToken = require('../middleware/auth');
// // const Blog = require('../models/Blog');
// // const Task = require('../models/Task');
// // const CloudFile = require('../models/CloudFile');
// // const Pomodoro = require('../models/Pomodoro');

// // router.get('/stats', verifyToken, async (req, res) => {
// //   try {
// //     const userId = req.userId;

// //     const [blogCount, taskCount, fileCount, pomodoros] = await Promise.all([
// //       Blog.countDocuments({ user: userId }),
// //       Task.countDocuments({ user: userId }),
// //       CloudFile.countDocuments({ user: userId }),
// //       Pomodoro.find({ user: userId })
// //     ]);

// //     const totalFocusMinutes = pomodoros.reduce((total, session) => {
// //       return total + (session.duration || 0);
// //     }, 0);

// //     res.json({
// //       blogs: blogCount,
// //       tasks: taskCount,
// //       files: fileCount,
// //       totalFocusMinutes
// //     });

// //   } catch (err) {
// //     console.error('Dashboard stats error:', err.message);
// //     res.status(500).json({ error: 'Failed to fetch stats' });
// //   }
// // });

// // module.exports = router;

// // routes/dashboardRoutes.js
// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middleware/auth');
// const Blog = require('../models/Blog');
// const Task = require('../models/Task');
// const CloudFile = require('../models/CloudFile');

// router.get('/stats', verifyToken, async (req, res) => {
//   try {
//     const [blogCount, taskCount, fileCount] = await Promise.all([
//       Blog.countDocuments({ author: req.userId }),
//       Task.countDocuments({ user: req.userId }),
//       CloudFile.countDocuments({ user: req.userId })
//     ]);

//     res.json({
//       blogs: blogCount,
//       tasks: taskCount,
//       files: fileCount,
//       totalFocusMinutes: 0 // Add logic later for Pomodoro time
//     });
//   } catch (err) {
//     console.error('Dashboard stats error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Blog = require('../models/Blog');
const Task = require('../models/Task');
const CloudFile = require('../models/CloudFile');
const Pomodoro = require('../models/Pomodoro');

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const [blogCount, taskCount, fileCount, pomodoros] = await Promise.all([
      Blog.countDocuments({ author: userId }),
      Task.countDocuments({ user: userId }),
      CloudFile.countDocuments({ user: userId }),
      Pomodoro.find({ user: userId })
    ]);

    // ⏱️ Calculate total focus minutes
    const totalFocusMinutes = pomodoros.reduce((total, session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const duration = Math.round((end - start) / 60000); // ms to min
      return total + duration;
    }, 0);

    res.json({
      blogs: blogCount,
      tasks: taskCount,
      files: fileCount,
      totalFocusMinutes
    });

  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
