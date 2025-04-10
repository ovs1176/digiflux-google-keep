// routes/todo.js
const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all todos for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new todo
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTodo = new Todo({
      title,
      description,
        completed: false,
      user: req.user.id
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update a todo
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
