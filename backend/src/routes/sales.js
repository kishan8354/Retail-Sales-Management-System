// const express = require('express');
// const router = express.Router();
// const { supabase } = require('../supabaseClient');

// /** Normalize a Supabase row into frontend-friendly shape */
// function normalizeRow(row = {}) {
//   const pick = (...keys) => {
//     for (const k of keys) if (k in row && row[k] !== undefined && row[k] !== null) return row[k];
//     return undefined;
//   };

//   // tags may be comma string in DB
//   const rawTags = pick('Tags', 'tags') || '';
//   const tagsArr = typeof rawTags === 'string'
//     ? rawTags.split(',').map(s => s.trim()).filter(Boolean)
//     : Array.isArray(rawTags) ? rawTags : [];

//   return {
//     date: pick('Date', 'date') || null,
//     customerId: pick('Customer ID', 'customer_id', 'customerId') || '',
//     customerName: pick('Customer Name', 'customer_name', 'customerName') || '',
//     phone: pick('Phone Number', 'phone') || '',
//     gender: pick('Gender', 'gender') || '',
//     age: Number(pick('Age', 'age') ?? 0),
//     customerRegion: pick('Customer Region', 'customer_region', 'customerRegion') || '',
//     customerType: pick('Customer Type', 'customer_type', 'customerType') || '',
//     productId: pick('Product ID', 'product_id', 'productId') || '',
//     productName: pick('Product Name', 'product_name', 'productName') || '',
//     brand: pick('Brand', 'brand') || '',
//     productCategory: pick('Product Category', 'product_category', 'productCategory') || '',
//     tags: tagsArr,
//     quantity: Number(pick('Quantity', 'quantity') ?? 0),
//     pricePerUnit: Number(pick('Price per Unit', 'pricePerUnit', 'price_per_unit') ?? 0),
//     discountPercentage: Number(pick('Discount Percentage', 'discountPercentage') ?? 0),
//     totalAmount: Number(pick('Total Amount', 'totalAmount') ?? 0),
//     finalAmount: Number(pick('Final Amount', 'finalAmount') ?? 0),
//     paymentMethod: pick('Payment Method', 'payment_method', 'paymentMethod') || '',
//     orderStatus: pick('Order Status', 'orderStatus') || '',
//     deliveryType: pick('Delivery Type', 'deliveryType') || '',
//     storeId: pick('Store ID', 'storeId') || '',
//     storeLocation: pick('Store Location', 'storeLocation') || '',
//     salespersonId: pick('Salesperson ID', 'salespersonId') || '',
//     employeeName: pick('Employee Name', 'employeeName') || '',
//     _raw: row
//   };
// }

// /** Build an OR clause for customer name OR phone search (PostgREST .or syntax) */
// function buildSearchOrClause(search) {
//   // escape % if any
//   const esc = String(search).replace(/%/g, '\\%');
//   // Note: column names with spaces require quoting in .or clauses
//   // We include both space and snake_case variants to be robust.
//   const spaceVariant = `("Customer Name".ilike.%${esc}%, "Phone Number".ilike.%${esc}%)`;
//   const snakeVariant = `(customer_name.ilike.%${esc}%, phone_number.ilike.%${esc}%)`;
//   // Try spaceVariant first (your Supabase columns show spaces)
//   return { spaceVariant, snakeVariant };
// }

// /** Map frontend sortBy to DB column names */
// function mapSortColumn(sortBy) {
//   const map = {
//     date: 'Date',
//     quantity: 'Quantity',
//     customerName: 'Customer Name',
//     finalAmount: 'Final Amount',
//     productName: 'Product Name',
//     productCategory: 'Product Category'
//   };
//   return map[sortBy] || null;
// }

// /** Helper: normalize param into array (accept arrays or comma-strings) */
// function ensureArray(val) {
//   if (val == null) return [];
//   if (Array.isArray(val)) return val.map(String);
//   return String(val).split(',').map(s => s.trim()).filter(Boolean);
// }

// router.get('/', async (req, res) => {
//   try {
//     // Parse params
//     const page = Math.max(parseInt(req.query.page || '1', 10), 1);
//     let limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
//     if (limit < 1) limit = 10;
//     const offset = (page - 1) * limit;
//     const search = (req.query.search || '').trim();
//     const sortBy = (req.query.sortBy || 'date').toString();
//     const order = (req.query.order || 'desc').toString().toLowerCase() === 'asc' ? { ascending: true } : { ascending: false };

//     // Build base queries (rows & count) with identical filters
//     let rowsQuery = supabase.from('kishan').select('*');
//     let countQuery = supabase.from('kishan').select('*', { head: true, count: 'exact' });

//     // Multi-select filters: region, gender, category, tags, payment
//     const regions = ensureArray(req.query.region || req.query.customerRegion);
//     if (regions.length) {
//       rowsQuery = rowsQuery.in('Customer Region', regions);
//       countQuery = countQuery.in('Customer Region', regions);
//     }

//     const genders = ensureArray(req.query.gender);
//     if (genders.length) {
//       rowsQuery = rowsQuery.in('Gender', genders);
//       countQuery = countQuery.in('Gender', genders);
//     }

//     const categories = ensureArray(req.query.category);
//     if (categories.length) {
//       rowsQuery = rowsQuery.in('Product Category', categories);
//       countQuery = countQuery.in('Product Category', categories);
//     }

//     const payments = ensureArray(req.query.payment);
//     if (payments.length) {
//       rowsQuery = rowsQuery.in('Payment Method', payments);
//       countQuery = countQuery.in('Payment Method', payments);
//     }

//     // Tags: we will filter rows where Tags ilike any of the requested tags (partial match)
//     // Supabase doesn't have an "array contains any" for comma-string field; so use OR of ilike
//     const tags = ensureArray(req.query.tags);
//     if (tags.length) {
//       // Build OR clause like: Tags.ilike.%tag1%,Tags.ilike.%tag2%
//       const tagsClause = tags.map(t => `Tags.ilike.%${t}%`).join(',');
//       rowsQuery = rowsQuery.or(tagsClause);
//       countQuery = countQuery.or(tagsClause);
//     }

//     // Age range
//     const ageMin = req.query.ageMin ? Number(req.query.ageMin) : null;
//     const ageMax = req.query.ageMax ? Number(req.query.ageMax) : null;
//     if (!Number.isNaN(ageMin) && ageMin !== null) {
//       rowsQuery = rowsQuery.gte('Age', ageMin);
//       countQuery = countQuery.gte('Age', ageMin);
//     }
//     if (!Number.isNaN(ageMax) && ageMax !== null) {
//       rowsQuery = rowsQuery.lte('Age', ageMax);
//       countQuery = countQuery.lte('Age', ageMax);
//     }

//     // Date range: StartDate and EndDate expected as ISO strings
//     if (req.query.startDate) {
//       rowsQuery = rowsQuery.gte('Date', req.query.startDate);
//       countQuery = countQuery.gte('Date', req.query.startDate);
//     }
//     if (req.query.endDate) {
//       rowsQuery = rowsQuery.lte('Date', req.query.endDate);
//       countQuery = countQuery.lte('Date', req.query.endDate);
//     }

//     // SEARCH across Customer Name and Phone Number (case-insensitive)
//     if (search) {
//       const { spaceVariant, snakeVariant } = buildSearchOrClause(search);
//       // try spaceVariant; if it errors, fallback to snakeVariant
//       try {
//         rowsQuery = rowsQuery.or(spaceVariant);
//         countQuery = countQuery.or(spaceVariant);
//       } catch (err) {
//         rowsQuery = rowsQuery.or(snakeVariant);
//         countQuery = countQuery.or(snakeVariant);
//       }
//     }

//     // SORT mapping to DB column
//     const dbSortCol = mapSortColumn(sortBy) || 'Date';
//     try {
//       rowsQuery = rowsQuery.order(dbSortCol, order);
//     } catch (err) {
//       // fallback to Date
//       rowsQuery = rowsQuery.order('Date', order);
//     }

//     // PAGINATION - apply range to rowsQuery only
//     rowsQuery = rowsQuery.range(offset, offset + limit - 1);

//     // Execute both queries in parallel
//     const [rowsResp, countResp] = await Promise.all([rowsQuery, countQuery]);

//     if (rowsResp.error) {
//       console.error('rows error', rowsResp.error);
//       return res.status(500).json({ success: false, error: rowsResp.error.message || rowsResp.error });
//     }
//     if (countResp && countResp.error) {
//       console.warn('count error', countResp.error);
//     }

//     const rawRows = rowsResp.data || [];
//     const total = (countResp && typeof countResp.count === 'number') ? countResp.count : rawRows.length;
//     const totalPages = Math.max(1, Math.ceil(total / limit));

//     const data = rawRows.map(normalizeRow);

//     return res.json({
//       success: true,
//       data,
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
// code 2---------------------------------------
// backend/src/routes/sales.js
// Node-only route for /api/sales — uses in-memory dataset and JS filtering.
// This file intentionally does NOT use Supabase/PostgREST.

const express = require("express");
const router = express.Router();
const { getSalesHandler } = require("../controllers/salesController");

// CSV-based filtering only — NO SUPABASE ANYWHERE
router.get("/", getSalesHandler);

module.exports = router;
