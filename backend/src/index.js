const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const salesRoutes = require('./routes/sales');
const { loadData } = require('./utils/dataLoader');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Load dataset into memory
(async () => {
  try {
    await loadData();
    console.log('Dataset loaded');
  } catch (err) {
    console.error('Failed to load dataset', err);
    process.exit(1);
  }
})();

app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => res.send({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
