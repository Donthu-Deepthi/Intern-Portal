const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
const dataPath = path.join(__dirname, 'data.json');
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

// Routes
app.get('/api/user', (req, res) => {
  const user = data.users[0]; // For demo, we'll just return the first user
  res.json(user);
});

app.get('/api/rewards', (req, res) => {
  res.json(data.rewards);
});

app.get('/api/leaderboard', (req, res) => {
  res.json(data.leaderboard);
});

app.get('/api/stats', (req, res) => {
  res.json(data.stats);
});

// Static files (for frontend in production)
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});