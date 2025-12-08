// backend/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const salesRoutes = require('./routes/sales');

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Mount routes (these should use Supabase or in-memory loader)
app.use('/api/sales', salesRoutes);

// Simple health route
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Backend running', env: NODE_ENV });
});

// Start server
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (env=${NODE_ENV})`);
      if (NODE_ENV === 'development') {
        console.log('Dev mode: local dataset (if present) may be loaded.');
      } else {
        console.log('Production mode: not loading local dataset; using Supabase.');
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
start();
