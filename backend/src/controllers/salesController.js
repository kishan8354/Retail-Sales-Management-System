const { getSales } = require('../utils/dataLoader');
const { filterSortPaginate, normalizeList } = require('../services/salesService');

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

  out.region = normalizeList(q.region || q.customerRegion);
  out.gender = normalizeList(q.gender);
  out.category = normalizeList(q.category);
  out.tags = normalizeList(q.tags);
  out.payment = normalizeList(q.payment);

  out._raw = q;
  return out;
}

/** Map internal record -> frontend shape */
function mapToFrontend(rec = {}) {
  const get = (...keys) => {
    for (const k of keys) {
      if (k === undefined) continue;
      if (Object.prototype.hasOwnProperty.call(rec, k) &&
          rec[k] !== undefined &&
          rec[k] !== null) {
        return rec[k];
      }
    }
    return undefined;
  };

  const tagsRaw = get('tags', 'Tags', (rec._raw && rec._raw.Tags));
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
    : String(tagsRaw || '').split(',').map(s => s.trim()).filter(Boolean);

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
    console.log('RAW QUERY:', JSON.stringify(req.query));
    const params = normalizeQuery(req.query);
    const dataset = getSales();
    const result = filterSortPaginate(dataset, params);
    const mapped = (result.data || []).map(mapToFrontend);

    console.log(
      `[sales] query=${JSON.stringify(req.query)}, ` +
      `filtered=${result.total}, returned=${mapped.length}, ` +
      `page=${result.page}, limit=${result.limit}`
    );

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
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err.message
    });
  }
}

module.exports = { getSalesHandler };
