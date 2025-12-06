const { querySales } = require('../services/salesService');

function parseArrayParam(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  // if comma separated string -> split
  if (typeof value === 'string' && value.includes(',')) return value.split(',').map(v => v.trim()).filter(Boolean);
  return [value];
}

function parseNumber(value) {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

async function getSales(req, res) {
  try {
    const {
      search,
      sortBy,
      order = 'desc'
    } = req.query;

    const region = parseArrayParam(req.query.region);
    const gender = parseArrayParam(req.query.gender);
    const category = parseArrayParam(req.query.category);
    const tags = parseArrayParam(req.query.tags);
    const payment = parseArrayParam(req.query.payment);

    const ageMin = parseNumber(req.query.ageMin);
    const ageMax = parseNumber(req.query.ageMax);
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;

    const result = querySales({ search, region, gender, ageMin, ageMax, category, tags, payment, startDate, endDate, sortBy, order, page, limit });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getSales };

