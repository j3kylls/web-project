const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const verifyToken = require('../middleware/auth'); 


// Create blog post
router.post('/', verifyToken, async (req, res) => {
    try {
      const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.userId
      });
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// // Get all blogs
// router.get('/', async (req, res) => {
//   const blogs = await Blog.find().populate('author', 'username');
//   res.json(blogs);
// });

// GET blogs for logged-in user only
router.get('/', verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).populate('author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a blog post
router.put('/:id', verifyToken, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      if (blog.author.toString() !== req.userId)
        return res.status(403).json({ error: 'Not authorized to update this blog' });
  
      blog.title = req.body.title || blog.title;
      blog.content = req.body.content || blog.content;
  
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a blog post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      if (blog.author.toString() !== req.userId)
        return res.status(403).json({ error: 'Not authorized to delete this blog' });
  
      await blog.deleteOne();
      res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
