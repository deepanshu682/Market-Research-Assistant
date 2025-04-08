const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const insightsRoutes = require('./routes/insights');
const trendsRoutes = require('./routes/trends');
const analysisRoutes = require('./routes/analysis');
const marketRoutes = require('./routes/market');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/insights', insightsRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/market', marketRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 