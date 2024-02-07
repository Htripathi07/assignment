const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const { generateToken, comparePasswords } = require('./auth');
const User = require('./models/User');
require("dotenv").config()
const bcrypt = require('bcryptjs');
const Task = require('./models/Task');
const authenticateUser = require('./middleware/authenticateUser');
require('./reminderScheduler');

connectDB();

const app = express();

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.send({ message: 'Registered Successfully!' })
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


// Add task endpoint
app.post('/tasks', authenticateUser, async (req, res) => {
    try {
      const { title, description, dueDate, status } = req.body;
      // Convert dueDate string to Date object
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ error: 'Invalid dueDate format. Please provide a valid date.' });
      }
      const task = new Task({
        title,
        description,
        dueDate: parsedDueDate,
        status,
        user: req.user._id
      });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Update task endpoint
  app.put('/tasks/:id', authenticateUser, async (req, res) => {
    try {
      const { title, description, dueDate, status } = req.body;
      // Convert dueDate string to Date object
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ error: 'Invalid dueDate format. Please provide a valid date.' });
      }
      const task = await Task.findByIdAndUpdate(req.params.id, {
        title,
        description,
        dueDate: parsedDueDate,
        status
      }, { new: true });
      res.json(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Delete task endpoint
  app.delete('/tasks/:id', authenticateUser, async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Retrieve tasks endpoint
  app.get('/tasks', authenticateUser, async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user._id });
      res.json(tasks);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
