// src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const salesRoutes = require('./routes/sales');

const PORT = process.env.PORT || 4000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// ⭐ NO MORE loadData() — Supabase provides all data now.

app.use('/api/sales', salesRoutes);

// Test route
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Supabase backend running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
