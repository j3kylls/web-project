const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const taskRoutes = require('./routes/taskRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const cloudRoutes = require('./routes/cloudRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/cloud', cloudRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
})
.catch((err) => console.error('❌ MongoDB connection failed:', err));

