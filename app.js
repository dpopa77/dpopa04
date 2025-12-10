// app.js

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');

// Create express app
const app = express();

// Import routes
const authRoutes = require('./src/routes/auth');

// Middleware
app.use(express.json());
const verifyToken = require('./src/middleware/verifyToken');

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}. Your token is valid.` });
});


// Mount routes
app.use('/api/auth', authRoutes);
// Test protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.name}. Your token is valid.`
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log(' Server running on port 3000');
      console.log(' Connected to MongoDB');
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });


