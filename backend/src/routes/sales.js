const express = require('express');
const router = express.Router();
const { getSalesHandler } = require('../controllers/salesController');

// GET /api/sales
router.get('/', getSalesHandler);

module.exports = router;
