const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/auth');

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all tasks for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a task
// router.put('/:id', verifyToken, async (req, res) => {
//     try {
//       const task = await Task.findById(req.params.id);
  
//       if (!task) return res.status(404).json({ error: 'Task not found' });
//       if (task.user.toString() !== req.userId)
//         return res.status(403).json({ error: 'Not authorized to update this task' });
  
//       const { title, description, dueDate, status } = req.body;
  
//       if (title) task.title = title;
//       if (description) task.description = description;
//       if (dueDate) task.dueDate = dueDate;
//       if (status) task.status = status;
  
//       const updatedTask = await task.save();
//       res.json(updatedTask);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (task.user.toString() !== req.userId)
      return res.status(403).json({ error: 'Not authorized to update this task' })

    task.title = req.body.title || task.title
    if (req.body.hasOwnProperty('completed')) {
      task.completed = req.body.completed
    }

    const updatedTask = await task.save()
    res.json(updatedTask)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



  // Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (task.user.toString() !== req.userId)
        return res.status(403).json({ error: 'Not authorized to delete this task' });
  
      await task.deleteOne();
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  

module.exports = router;
