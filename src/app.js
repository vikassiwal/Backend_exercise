const express = require('express');
const path = require('path');
const fs = require('fs');
const { initializeDatabase } = require('./db');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());

// Ensure runtime directories exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Initialize database schema
initializeDatabase();

app.use('/', productRoutes);

module.exports = app;
