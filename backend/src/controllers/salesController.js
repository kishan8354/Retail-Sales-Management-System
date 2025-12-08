// const { querySales } = require('../services/salesService');

// function parseArrayParam(value) {
//   if (!value) return [];
//   if (Array.isArray(value)) return value;
//   // if comma separated string -> split
//   if (typeof value === 'string' && value.includes(',')) return value.split(',').map(v => v.trim()).filter(Boolean);
//   return [value];
// }

// function parseNumber(value) {
//   if (value === undefined) return undefined;
//   const n = Number(value);
//   return Number.isNaN(n) ? undefined : n;
// }

// async function getSales(req, res) {
//   try {
//     const {
//       search,
//       sortBy,
//       order = 'desc'
//     } = req.query;

//     const region = parseArrayParam(req.query.region);
//     const gender = parseArrayParam(req.query.gender);
//     const category = parseArrayParam(req.query.category);
//     const tags = parseArrayParam(req.query.tags);
//     const payment = parseArrayParam(req.query.payment);

//     const ageMin = parseNumber(req.query.ageMin);
//     const ageMax = parseNumber(req.query.ageMax);
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const page = parseInt(req.query.page || '1', 10) || 1;
//     const limit = parseInt(req.query.limit || '10', 10) || 10;

//     const result = querySales({ search, region, gender, ageMin, ageMax, category, tags, payment, startDate, endDate, sortBy, order, page, limit });

//     return res.json(result);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// module.exports = { getSales };

// code 2---------
const { querySales } = require('../services/salesService');

function parseArrayParam(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }
  return [value];
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

/**
 * GET /sales
 * Accepts query:
 *  - search, region, gender, category, tags, payment
 *  - ageMin, ageMax
 *  - startDate, endDate (YYYY-MM-DD)
 *  - sortBy, order
 *  - page, limit
 *
 * Returns JSON:
 * { page, limit, total, results: [...] }
 */
// controllers/salesController.js
// Example: replace your existing controller with this.
// Assumes you have a getSalesData() util that returns an array of sale objects
// Each sale object should at least include: date (ISO string), customerRegion, gender, age, category, tags (array), paymentMethod

const { getSalesData } = require('../utils/dataLoader'); // adjust path as needed

function normalizeArrayFilter(arr) {
  if (!arr) return null;
  if (typeof arr === 'string') arr = [arr];
  // remove empty strings, whitespace-only items
  const clean = arr.map(x => String(x).trim()).filter(x => x !== '');
  return clean.length ? clean : null;
}

function parseIntSafe(v, fallback = null) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

function parseDateSafe(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * applyFilters(data, params)
 * - data: array of objects
 * - params: { region, gender, ageMin, ageMax, category, tags, payment, startDate, endDate, search }
 */
function applyFilters(data, params) {
  let out = Array.isArray(data) ? data.slice() : [];

  // normalize filters
  const region = normalizeArrayFilter(params.region);
  const gender = normalizeArrayFilter(params.gender);
  const category = normalizeArrayFilter(params.category);
  const tags = normalizeArrayFilter(params.tags);
  const payment = normalizeArrayFilter(params.payment);
  const search = params.search ? String(params.search).trim() : null;

  const ageMin = parseIntSafe(params.ageMin, null);
  const ageMax = parseIntSafe(params.ageMax, null);
  const startDate = parseDateSafe(params.startDate);
  const endDate = parseDateSafe(params.endDate);

  // Filter by region
  if (region) {
    out = out.filter(item => region.includes(String(item.customerRegion)));
  }

  // Filter by gender
  if (gender) {
    out = out.filter(item => gender.includes(String(item.gender)));
  }

  // Filter by category
  if (category) {
    out = out.filter(item => category.includes(String(item.category)));
  }

  // Filter by payment method
  if (payment) {
    out = out.filter(item => payment.includes(String(item.paymentMethod || item.payment)));
  }

  // Age range
  if (ageMin !== null) {
    out = out.filter(item => {
      const a = parseIntSafe(item.age, null);
      return a !== null && a >= ageMin;
    });
  }
  if (ageMax !== null) {
    out = out.filter(item => {
      const a = parseIntSafe(item.age, null);
      return a !== null && a <= ageMax;
    });
  }

  // Date range (assume item.date is ISO string)
  if (startDate) {
    out = out.filter(item => {
      const d = parseDateSafe(item.date);
      return d && d.getTime() >= startDate.getTime();
    });
  }
  if (endDate) {
    out = out.filter(item => {
      const d = parseDateSafe(item.date);
      return d && d.getTime() <= endDate.getTime();
    });
  }

  // Tags filter: require that item.tags (array) contains ANY of the requested tags.
  if (tags) {
    out = out.filter(item => {
      const itags = Array.isArray(item.tags) ? item.tags.map(t => String(t)) : [];
      return tags.some(t => itags.includes(t));
    });
  }

  // Simple text search (optional)
  if (search) {
    const s = search.toLowerCase();
    out = out.filter(item => {
      // Customize searchable fields as required
      const fields = [
        item.title, item.description,
        item.customerName, item.category
      ].filter(Boolean).map(f => String(f).toLowerCase());
      return fields.some(f => f.includes(s));
    });
  }

  return out;
}

/**
 * GET /api/sales
 * Query params:
 *  - page, limit, sortBy, order
 *  - region (string or array)
 *  - gender, category, tags, payment (string or array)
 *  - ageMin, ageMax
 *  - startDate, endDate (ISO date strings)
 *  - search
 */
// async function getSalesHandler(req, res) {
//   try {
//     // Load data (ensure this returns full dataset, not paginated)
//     const allData = await getSalesData(); // should be an array

//     // Pull raw params
//     const raw = {
//       region: req.query.region,
//       gender: req.query.gender,
//       category: req.query.category,
//       tags: req.query.tags,
//       payment: req.query.payment,
//       ageMin: req.query.ageMin,
//       ageMax: req.query.ageMax,
//       startDate: req.query.startDate,
//       endDate: req.query.endDate,
//       search: req.query.search
//     };

//     // Apply filters
//     const filtered = applyFilters(allData, raw);

//     // Sorting
//     const sortBy = String(req.query.sortBy || 'date');
//     const order = String((req.query.order || 'desc')).toLowerCase() === 'asc' ? 'asc' : 'desc';

//     const sorted = filtered.sort((a, b) => {
//       const A = a[sortBy];
//       const B = b[sortBy];

//       // handle dates
//       if (sortBy.toLowerCase().includes('date')) {
//         const da = new Date(A).getTime() || 0;
//         const db = new Date(B).getTime() || 0;
//         return order === 'asc' ? da - db : db - da;
//       }

//       // numeric
//       if (!isNaN(Number(A)) && !isNaN(Number(B))) {
//         return order === 'asc' ? Number(A) - Number(B) : Number(B) - Number(A);
//       }

//       // fallback string compare
//       const sa = String(A || '').toLowerCase();
//       const sb = String(B || '').toLowerCase();
//       if (sa < sb) return order === 'asc' ? -1 : 1;
//       if (sa > sb) return order === 'asc' ? 1 : -1;
//       return 0;
//     });

//     // Pagination
//     const page = Math.max(parseIntSafe(req.query.page, 1) || 1, 1);
//     const limit = Math.max(parseIntSafe(req.query.limit, 10) || 10, 1);
//     const total = sorted.length;
//     const totalPages = Math.max(Math.ceil(total / limit), 1);
//     const start = (page - 1) * limit;
//     const end = start + limit;
//     const pageData = sorted.slice(start, end);

//     // debug logging to help figure out the "No results" situation
//     console.log(`[sales] rawQuery=${JSON.stringify(req.query)}, filteredCount=${total}, returnedCount=${pageData.length}, page=${page}, limit=${limit}`);

//     // Proper API response
//     return res.json({
//       success: true,
//       total,
//       totalPages,
//       page,
//       limit,
//       data: pageData
//     });
//   } catch (err) {
//     console.error('Error in getSalesHandler:', err);
//     return res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// }

// module.exports = {
//   getSalesHandler
// };
// code --------------------------------------------
// backend/src/controllers/salesController.js
// backend/src/controllers/salesController.js
const { getSales } = require('../utils/dataLoader');
const { filterSortPaginate } = require('../services/salesService');

function parseIntSafe(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/** Map frontend sort keys -> dataset keys */
function mapSortKey(frontendKey) {
  const map = {
    date: 'Date',
    quantity: 'Quantity',
    name: 'Customer Name',
    customerName: 'Customer Name',
    finalAmount: 'Final Amount',
    productName: 'Product Name',
    productCategory: 'Product Category'
  };
  return map[frontendKey] || frontendKey;
}

function normalizeQuery(q = {}) {
  const out = {};
  out.search = q.search || q.q || '';
  out.sortBy = mapSortKey(q.sortBy || q.sort || 'date');
  out.order = (String(q.order || 'desc')).toLowerCase() === 'asc' ? 'asc' : 'desc';
  out.page = parseIntSafe(q.page, 1) || 1;
  out.limit = parseIntSafe(q.limit, 10) || 10;
  out.ageMin = q.ageMin !== undefined ? parseIntSafe(q.ageMin, undefined) : undefined;
  out.ageMax = q.ageMax !== undefined ? parseIntSafe(q.ageMax, undefined) : undefined;
  out.startDate = q.startDate || q.from || null;
  out.endDate = q.endDate || q.to || null;

  const normList = (val) => {
    if (val === undefined || val === null) return undefined;
    if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
    if (typeof val === 'string') {
      if (val.includes(',')) return val.split(',').map(s => s.trim()).filter(Boolean);
      if (val.trim() === '') return undefined;
      return [val.trim()];
    }
    return [String(val)];
  };

  out.region = normList(q.region || q.customerRegion);
  out.gender = normList(q.gender);
  out.category = normList(q.category);
  out.tags = normList(q.tags);
  out.payment = normList(q.payment);

  out._raw = q;
  return out;
}

/** Map dataset record (many possible key names) -> frontend shape */
function mapToFrontend(rec = {}) {
  const get = (...keys) => {
    for (const k of keys) {
      if (k === undefined) continue;
      if (Object.prototype.hasOwnProperty.call(rec, k) && rec[k] !== undefined && rec[k] !== null) return rec[k];
    }
    return undefined;
  };

  const tagsRaw = get('tags', 'Tags', (rec._raw && rec._raw.Tags));
  const tags = Array.isArray(tagsRaw) ? tagsRaw : String(tagsRaw || '').split(',').map(s => s.trim()).filter(Boolean);

  const quantityRaw = get('quantity', 'Quantity', (rec._raw && rec._raw.Quantity));
  const finalAmountRaw = get('finalAmount', 'Final Amount', (rec._raw && rec._raw['Final Amount']));

  return {
    date: get('date', 'Date') || '',
    customerName: get('customerName', 'Customer Name') || '',
    phone: get('phone', 'Phone Number', 'phone_number') || '',
    customerRegion: get('customerRegion', 'Region', 'Customer Region') || '',
    gender: get('gender', 'Gender') || '',
    age: (() => {
      const v = get('age', 'Age', (rec._raw && rec._raw.Age));
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    })(),
    productName: get('productName', 'Product Name') || '',
    productCategory: get('productCategory', 'Product Category') || '',
    quantity: (() => {
      const n = Number(quantityRaw);
      return Number.isFinite(n) ? n : 0;
    })(),
    finalAmount: (() => {
      const n = Number(finalAmountRaw);
      return Number.isFinite(n) ? n : 0;
    })(),
    paymentMethod: get('paymentMethod', 'Payment Method') || '',
    tags,
    _raw: rec._raw || rec
  };
}

async function getSalesHandler(req, res) {
  try {
    const params = normalizeQuery(req.query);

    // load the in-memory dataset and apply filters/sort/pagination
    const dataset = getSales();
    const result = filterSortPaginate(dataset, params);

    // map each record to frontend-friendly keys
    const mapped = (result.data || []).map(mapToFrontend);

    console.log(`[sales] query=${JSON.stringify(req.query)}, filtered=${result.total}, returned=${mapped.length}, page=${result.page}, limit=${result.limit}`);

    return res.json({
      success: true,
      data: mapped,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  } catch (err) {
    console.error('getSalesHandler error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: err.message });
  }
}

module.exports = { getSalesHandler };
