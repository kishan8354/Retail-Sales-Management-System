// backend/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const salesRouter = require('./routes/sales');
const { loadData } = require('./utils/dataLoader');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// mount router at /api/sales
app.use('/api/sales', salesRouter);

// health
app.get('/', (req, res) => res.send({ status: 'ok', message: 'Local Node backend running' }));

// Load dataset first, then start server
loadData()
  .then(count => {
    console.log(`Loaded dataset with ${count} rows`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to load dataset, exiting.', err);
    process.exit(1);
  });
