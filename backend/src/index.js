// backend/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const salesRoutes = require('./routes/sales');
const { loadRemoteData } = require('./utils/dataLoader');

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Backend running', env: NODE_ENV });
});

app.use('/api/sales', salesRoutes);

async function start() {
  try {
    await loadRemoteData(); // load Supabase data into memory
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (env=${NODE_ENV})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
