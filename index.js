const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 
const todoRoutes = require('./routes/todo');


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/google-keep'; 

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
