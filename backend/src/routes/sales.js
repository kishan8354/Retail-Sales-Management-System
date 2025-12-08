// const express = require('express');
// const router = express.Router();
// const { supabase } = require('../supabaseClient');

// // GET /sales?page=1&limit=20&search=term
// router.get('/', async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page || '1', 10), 1);
//     const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
//     const offset = (page - 1) * limit;
//     const search = req.query.search?.trim();

//     let query = supabase
//       .from('kishan')
//       .select('*')
//       .order('Date', { ascending: false }) // Column name EXACT as in Supabase
//       .range(offset, offset + limit - 1);

//     if (search) {
//       query = query.ilike('Product Name', `%${search}%`);
//     }

//     const { data, error } = await query;

//     if (error) return res.status(500).json({ error });

//     // total count
//     const { count: total } = await supabase
//       .from('kishan')
//       .select('*', { count: 'exact', head: true });

//     res.json({ page, limit, total, results: data || [] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Unexpected error' });
//   }
// });

// // GET /sales/:transaction_id
// router.get('/:transaction_id', async (req, res) => {
//   const { transaction_id } = req.params;

//   const { data, error } = await supabase
//     .from('kishan')
//     .select('*')
//     .eq('Transaction ID', transaction_id)
//     .single();

//   if (error) return res.status(404).json({ error: error.message });
//   res.json(data);
// });

// // POST /sales
// router.post('/', async (req, res) => {
//   const payload = req.body;

//   const { data, error } = await supabase
//     .from('kishan')
//     .insert([payload]);

//   if (error) return res.status(400).json({ error: error.message });

//   res.status(201).json(data[0]);
// });

// // PUT /sales/:transaction_id
// router.put('/:transaction_id', async (req, res) => {
//   const { transaction_id } = req.params;
//   const payload = req.body;

//   const { data, error } = await supabase
//     .from('kishan')
//     .update(payload)
//     .eq('Transaction ID', transaction_id);

//   if (error) return res.status(400).json({ error: error.message });

//   res.json(data);
// });

// // DELETE /sales/:transaction_id
// router.delete('/:transaction_id', async (req, res) => {
//   const { transaction_id } = req.params;

//   const { error } = await supabase
//     .from('kishan')
//     .delete()
//     .eq('Transaction ID', transaction_id);

//   if (error) return res.status(400).json({ error: error.message });

//   res.json({ ok: true });
// });

// module.exports = router;
// src/routes/sales.js
// backend/src/routes/sales.js
// backend/src/routes/sales.js
// backend/src/routes/sales.js
// backend/src/routes/sales.js  (DEBUG VERSION)
// code 2
// const express = require('express');
// const router = express.Router();
// const { supabase } = require('../supabaseClient');

// /** quick picker util */
// const pick = (row, ...keys) => {
//   for (const k of keys) if (k in row && row[k] !== undefined && row[k] !== null) return row[k];
//   return undefined;
// };

// function normalizeRow(row = {}) {
//   const rawTags = pick(row, 'Tags', 'tags') || '';
//   const tagsArr = typeof rawTags === 'string' ? rawTags.split(',').map(s => s.trim()).filter(Boolean) : Array.isArray(rawTags) ? rawTags : [];
//   return {
//     date: pick(row, 'Date', 'date') || null,
//     customerName: pick(row, 'Customer Name', 'customer_name', 'customerName') || '',
//     phone: pick(row, 'Phone Number', 'phone') || '',
//     customerRegion: pick(row, 'Customer Region', 'customer_region', 'customerRegion') || '',
//     productName: pick(row, 'Product Name', 'product_name', 'productName') || '',
//     productCategory: pick(row, 'Product Category', 'product_category', 'productCategory') || '',
//     quantity: Number(pick(row, 'Quantity', 'quantity') ?? 0),
//     finalAmount: Number(pick(row, 'Final Amount', 'final_amount', 'finalAmount') ?? 0),
//     paymentMethod: pick(row, 'Payment Method', 'payment_method', 'paymentMethod') || '',
//     tags: tagsArr,
//     _raw: row
//   };
// }

// /** Build OR clause for search using space names */
// function buildSearchOrClause(s) {
//   const esc = s.replace(/%/g, '\\%');
//   return `("Product Name".ilike.%${esc}%, "Customer Name".ilike.%${esc}%)`;
// }

// /** Map requested sort keys to DB column */
// function mapSortColumn(sortBy) {
//   const map = {
//     date: 'Date',
//     customerName: 'Customer Name',
//     productName: 'Product Name',
//     productCategory: 'Product Category',
//     finalAmount: 'Final Amount',
//     quantity: 'Quantity'
//   };
//   return map[sortBy] || null;
// }

// router.get('/', async (req, res) => {
//   try {
//     // parse basic params
//     const page = Math.max(parseInt(req.query.page || '1', 10), 1);
//     let limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
//     if (limit < 1) limit = 10;
//     const offset = (page - 1) * limit;
//     const search = (req.query.search || '').trim();
//     const debug = String(req.query.debug || 'false').toLowerCase() === 'true';

//     // Build base queries
//     let rowsQuery = supabase.from('kishan').select('*');
//     let countQuery = supabase.from('kishan').select('*', { head: true, count: 'exact' });

//     // Keep a record of applied filters for logging
//     const appliedFilters = [];

//     // Helper to apply equality filters supporting arrays or comma-strings
//     const addEqFilter = (query, col, val) => {
//       if (!val) return query;
//       const arr = Array.isArray(val) ? val : String(val).split(',').map(x => x.trim()).filter(Boolean);
//       if (!arr.length) return query;
//       appliedFilters.push({ column: col, values: arr });
//       return query.in(col, arr);
//     };

//     // Apply filters sent by frontend (region, gender, category, payment)
//     rowsQuery = addEqFilter(rowsQuery, 'Customer Region', req.query.region || req.query.customerRegion);
//     countQuery = addEqFilter(countQuery, 'Customer Region', req.query.region || req.query.customerRegion);

//     rowsQuery = addEqFilter(rowsQuery, 'Gender', req.query.gender);
//     countQuery = addEqFilter(countQuery, 'Gender', req.query.gender);

//     rowsQuery = addEqFilter(rowsQuery, 'Product Category', req.query.category);
//     countQuery = addEqFilter(countQuery, 'Product Category', req.query.category);

//     rowsQuery = addEqFilter(rowsQuery, 'Payment Method', req.query.payment);
//     countQuery = addEqFilter(countQuery, 'Payment Method', req.query.payment);

//     // Date range
//     if (req.query.startDate) {
//       rowsQuery = rowsQuery.gte('Date', req.query.startDate);
//       countQuery = countQuery.gte('Date', req.query.startDate);
//       appliedFilters.push({ column: 'Date', op: 'gte', value: req.query.startDate });
//     }
//     if (req.query.endDate) {
//       rowsQuery = rowsQuery.lte('Date', req.query.endDate);
//       countQuery = countQuery.lte('Date', req.query.endDate);
//       appliedFilters.push({ column: 'Date', op: 'lte', value: req.query.endDate });
//     }

//     // Search .or()
//     if (search) {
//       const orClause = buildSearchOrClause(search);
//       rowsQuery = rowsQuery.or(orClause);
//       countQuery = countQuery.or(orClause);
//       appliedFilters.push({ column: 'or', clause: orClause });
//     }

//     // Sorting mapping
//     const requestedSort = (req.query.sortBy || '').toString();
//     const dbSortCol = mapSortColumn(requestedSort) || 'Date';
//     const ascending = (req.query.order || 'desc').toLowerCase() === 'asc';
//     try { rowsQuery = rowsQuery.order(dbSortCol, { ascending }); } catch (e) { /* ignore */ }

//     // Apply pagination range to rows query
//     rowsQuery = rowsQuery.range(offset, offset + limit - 1);

//     // Immediately fetch an unfiltered sample and unfiltered count for comparison (debug only)
//     const [unfilteredResp, unfilteredCountResp] = await Promise.all([
//       supabase.from('kishan').select('*').limit(5),
//       supabase.from('kishan').select('*', { head: true, count: 'exact' })
//     ]);

//     // Execute filtered queries
//     const [rowsResp, countResp] = await Promise.all([rowsQuery, countQuery]);

//     // Prepare debug info
//     const debugInfo = {
//       requestQuery: req.query,
//       appliedFilters,
//       unfilteredSampleCount: (unfilteredResp && unfilteredResp.data) ? (unfilteredResp.data.length) : 0,
//       unfilteredTotal: (unfilteredCountResp && typeof unfilteredCountResp.count === 'number') ? unfilteredCountResp.count : null,
//       rowsError: rowsResp?.error || null,
//       countError: countResp?.error || null
//     };

//     // Log to server console
//     console.log('[sales debug]', JSON.stringify(debugInfo));

//     // If rows query errored, return error with debug info
//     if (rowsResp.error) {
//       return res.status(500).json({ success: false, error: rowsResp.error.message || rowsResp.error, debug: debugInfo });
//     }

//     const rawRows = rowsResp.data || [];
//     const total = (countResp && typeof countResp.count === 'number') ? countResp.count : rawRows.length;
//     const totalPages = Math.max(1, Math.ceil(total / limit));
//     const normalized = rawRows.map(normalizeRow);

//     // If debug flag on, return extended info
//     if (debug) {
//       return res.json({
//         success: true,
//         data: normalized,
//         rawSample: rawRows.slice(0, 5),
//         total,
//         page,
//         limit,
//         totalPages,
//         debug: debugInfo
//       });
//     }

//     // Normal (non-debug) response
//     return res.json({
//       success: true,
//       data: normalized,
//       total,
//       page,
//       limit,
//       totalPages
//     });
//   } catch (err) {
//     console.error('GET /api/sales unexpected error:', err);
//     return res.status(500).json({ success: false, error: 'Unexpected server error', details: err.message });
//   }
// });

// module.exports = router;
// code ------2
// backend/src/routes/sales.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

/** Normalize a Supabase row into frontend-friendly shape */
function normalizeRow(row = {}) {
  const pick = (...keys) => {
    for (const k of keys) if (k in row && row[k] !== undefined && row[k] !== null) return row[k];
    return undefined;
  };

  // tags may be comma string in DB
  const rawTags = pick('Tags', 'tags') || '';
  const tagsArr = typeof rawTags === 'string'
    ? rawTags.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(rawTags) ? rawTags : [];

  return {
    date: pick('Date', 'date') || null,
    customerId: pick('Customer ID', 'customer_id', 'customerId') || '',
    customerName: pick('Customer Name', 'customer_name', 'customerName') || '',
    phone: pick('Phone Number', 'phone') || '',
    gender: pick('Gender', 'gender') || '',
    age: Number(pick('Age', 'age') ?? 0),
    customerRegion: pick('Customer Region', 'customer_region', 'customerRegion') || '',
    customerType: pick('Customer Type', 'customer_type', 'customerType') || '',
    productId: pick('Product ID', 'product_id', 'productId') || '',
    productName: pick('Product Name', 'product_name', 'productName') || '',
    brand: pick('Brand', 'brand') || '',
    productCategory: pick('Product Category', 'product_category', 'productCategory') || '',
    tags: tagsArr,
    quantity: Number(pick('Quantity', 'quantity') ?? 0),
    pricePerUnit: Number(pick('Price per Unit', 'pricePerUnit', 'price_per_unit') ?? 0),
    discountPercentage: Number(pick('Discount Percentage', 'discountPercentage') ?? 0),
    totalAmount: Number(pick('Total Amount', 'totalAmount') ?? 0),
    finalAmount: Number(pick('Final Amount', 'finalAmount') ?? 0),
    paymentMethod: pick('Payment Method', 'payment_method', 'paymentMethod') || '',
    orderStatus: pick('Order Status', 'orderStatus') || '',
    deliveryType: pick('Delivery Type', 'deliveryType') || '',
    storeId: pick('Store ID', 'storeId') || '',
    storeLocation: pick('Store Location', 'storeLocation') || '',
    salespersonId: pick('Salesperson ID', 'salespersonId') || '',
    employeeName: pick('Employee Name', 'employeeName') || '',
    _raw: row
  };
}

/** Build an OR clause for customer name OR phone search (PostgREST .or syntax) */
function buildSearchOrClause(search) {
  // escape % if any
  const esc = String(search).replace(/%/g, '\\%');
  // Note: column names with spaces require quoting in .or clauses
  // We include both space and snake_case variants to be robust.
  const spaceVariant = `("Customer Name".ilike.%${esc}%, "Phone Number".ilike.%${esc}%)`;
  const snakeVariant = `(customer_name.ilike.%${esc}%, phone_number.ilike.%${esc}%)`;
  // Try spaceVariant first (your Supabase columns show spaces)
  return { spaceVariant, snakeVariant };
}

/** Map frontend sortBy to DB column names */
function mapSortColumn(sortBy) {
  const map = {
    date: 'Date',
    quantity: 'Quantity',
    customerName: 'Customer Name',
    finalAmount: 'Final Amount',
    productName: 'Product Name',
    productCategory: 'Product Category'
  };
  return map[sortBy] || null;
}

/** Helper: normalize param into array (accept arrays or comma-strings) */
function ensureArray(val) {
  if (val == null) return [];
  if (Array.isArray(val)) return val.map(String);
  return String(val).split(',').map(s => s.trim()).filter(Boolean);
}

router.get('/', async (req, res) => {
  try {
    // Parse params
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    let limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
    if (limit < 1) limit = 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const sortBy = (req.query.sortBy || 'date').toString();
    const order = (req.query.order || 'desc').toString().toLowerCase() === 'asc' ? { ascending: true } : { ascending: false };

    // Build base queries (rows & count) with identical filters
    let rowsQuery = supabase.from('kishan').select('*');
    let countQuery = supabase.from('kishan').select('*', { head: true, count: 'exact' });

    // Multi-select filters: region, gender, category, tags, payment
    const regions = ensureArray(req.query.region || req.query.customerRegion);
    if (regions.length) {
      rowsQuery = rowsQuery.in('Customer Region', regions);
      countQuery = countQuery.in('Customer Region', regions);
    }

    const genders = ensureArray(req.query.gender);
    if (genders.length) {
      rowsQuery = rowsQuery.in('Gender', genders);
      countQuery = countQuery.in('Gender', genders);
    }

    const categories = ensureArray(req.query.category);
    if (categories.length) {
      rowsQuery = rowsQuery.in('Product Category', categories);
      countQuery = countQuery.in('Product Category', categories);
    }

    const payments = ensureArray(req.query.payment);
    if (payments.length) {
      rowsQuery = rowsQuery.in('Payment Method', payments);
      countQuery = countQuery.in('Payment Method', payments);
    }

    // Tags: we will filter rows where Tags ilike any of the requested tags (partial match)
    // Supabase doesn't have an "array contains any" for comma-string field; so use OR of ilike
    const tags = ensureArray(req.query.tags);
    if (tags.length) {
      // Build OR clause like: Tags.ilike.%tag1%,Tags.ilike.%tag2%
      const tagsClause = tags.map(t => `Tags.ilike.%${t}%`).join(',');
      rowsQuery = rowsQuery.or(tagsClause);
      countQuery = countQuery.or(tagsClause);
    }

    // Age range
    const ageMin = req.query.ageMin ? Number(req.query.ageMin) : null;
    const ageMax = req.query.ageMax ? Number(req.query.ageMax) : null;
    if (!Number.isNaN(ageMin) && ageMin !== null) {
      rowsQuery = rowsQuery.gte('Age', ageMin);
      countQuery = countQuery.gte('Age', ageMin);
    }
    if (!Number.isNaN(ageMax) && ageMax !== null) {
      rowsQuery = rowsQuery.lte('Age', ageMax);
      countQuery = countQuery.lte('Age', ageMax);
    }

    // Date range: StartDate and EndDate expected as ISO strings
    if (req.query.startDate) {
      rowsQuery = rowsQuery.gte('Date', req.query.startDate);
      countQuery = countQuery.gte('Date', req.query.startDate);
    }
    if (req.query.endDate) {
      rowsQuery = rowsQuery.lte('Date', req.query.endDate);
      countQuery = countQuery.lte('Date', req.query.endDate);
    }

    // SEARCH across Customer Name and Phone Number (case-insensitive)
    if (search) {
      const { spaceVariant, snakeVariant } = buildSearchOrClause(search);
      // try spaceVariant; if it errors, fallback to snakeVariant
      try {
        rowsQuery = rowsQuery.or(spaceVariant);
        countQuery = countQuery.or(spaceVariant);
      } catch (err) {
        rowsQuery = rowsQuery.or(snakeVariant);
        countQuery = countQuery.or(snakeVariant);
      }
    }

    // SORT mapping to DB column
    const dbSortCol = mapSortColumn(sortBy) || 'Date';
    try {
      rowsQuery = rowsQuery.order(dbSortCol, order);
    } catch (err) {
      // fallback to Date
      rowsQuery = rowsQuery.order('Date', order);
    }

    // PAGINATION - apply range to rowsQuery only
    rowsQuery = rowsQuery.range(offset, offset + limit - 1);

    // Execute both queries in parallel
    const [rowsResp, countResp] = await Promise.all([rowsQuery, countQuery]);

    if (rowsResp.error) {
      console.error('rows error', rowsResp.error);
      return res.status(500).json({ success: false, error: rowsResp.error.message || rowsResp.error });
    }
    if (countResp && countResp.error) {
      console.warn('count error', countResp.error);
    }

    const rawRows = rowsResp.data || [];
    const total = (countResp && typeof countResp.count === 'number') ? countResp.count : rawRows.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const data = rawRows.map(normalizeRow);

    return res.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err) {
    console.error('GET /api/sales unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Unexpected server error', details: err.message });
  }
});

module.exports = router;
