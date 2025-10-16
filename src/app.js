const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { initializeDatabase } = require('./db');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure runtime directories exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Initialize database schema
initializeDatabase();

app.use('/', productRoutes);

// Basic health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
