// // // src/services/salesService.js (in-memory)
// // const { getSales } = require('../utils/dataLoader');

// // function ensureArray(val) {
// //   if (!val) return [];
// //   if (Array.isArray(val)) return val;
// //   if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
// //   return [val];
// // }

// // function applyFilters(data, params = {}) {
// //   let out = data || [];
// //   const {
// //     region, gender, ageMin, ageMax,
// //     category, tags, payment, startDate, endDate
// //   } = params;

// //   if (region && region.length) {
// //     out = out.filter(r => region.includes(r.customerRegion));
// //   }
// //   if (gender && gender.length) {
// //     out = out.filter(r => gender.includes((r.gender || '').toString()));
// //   }
// //   if (ageMin !== undefined || ageMax !== undefined) {
// //     out = out.filter(r => {
// //       const age = Number(r.age) || 0;
// //       if (ageMin !== undefined && age < ageMin) return false;
// //       if (ageMax !== undefined && age > ageMax) return false;
// //       return true;
// //     });
// //   }
// //   if (category && category.length) {
// //     out = out.filter(r => category.includes(r.productCategory));
// //   }
// //   if (tags && tags.length) {
// //     out = out.filter(r => {
// //       const t = r.tags;
// //       if (!t) return false;
// //       const tArr = Array.isArray(t) ? t : t.toString().split(',').map(x=>x.trim());
// //       return tArr.some(x => tags.includes(x));
// //     });
// //   }
// //   if (payment && payment.length) {
// //     out = out.filter(r => payment.includes(r.paymentMethod));
// //   }
// //   if (startDate) {
// //     const s = new Date(startDate);
// //     out = out.filter(r => new Date(r.date) >= s);
// //   }
// //   if (endDate) {
// //     const e = new Date(endDate);
// //     out = out.filter(r => new Date(r.date) <= e);
// //   }

// //   return out;
// // }

// // function applySearch(data, search) {
// //   if (!search) return data;
// //   const q = search.toString().toLowerCase();
// //   return data.filter(r => {
// //     const name = (r.customerName || r['Customer Name'] || '').toString().toLowerCase();
// //     const phone = (r.phone || r.phoneNumber || r['Phone Number'] || '').toString();
// //     return (name && name.includes(q)) || (phone && phone.includes(q));
// //   });
// // }

// // function applySort(data, sortBy, order) {
// //   if (!sortBy) return data;
// //   const dir = order === 'asc' ? 1 : -1;
// //   const copy = [...data];
// //   if (sortBy === 'date') {
// //     copy.sort((a, b) => dir * (new Date(a.date) - new Date(b.date)));
// //   } else if (sortBy === 'quantity') {
// //     copy.sort((a, b) => dir * ((Number(a.quantity) || 0) - (Number(b.quantity) || 0)));
// //   } else if (sortBy === 'name') {
// //     copy.sort((a, b) => dir * (String(a.customerName || '').localeCompare(String(b.customerName || ''))));
// //   }
// //   return copy;
// // }

// // function paginate(data, page = 1, limit = 10) {
// //   const total = data.length;
// //   const totalPages = Math.max(1, Math.ceil(total / limit));
// //   const p = Math.max(1, Math.min(page, totalPages));
// //   const start = (p - 1) * limit;
// //   const end = start + limit;
// //   return {
// //     results: data.slice(start, end),
// //     total,
// //     page: p,
// //     totalPages
// //   };
// // }

// // function querySales(params = {}) {
// //   const all = getSales() || [];
// //   const {
// //     search, region, gender, ageMin, ageMax,
// //     category, tags, payment, startDate, endDate,
// //     sortBy, order, page, limit
// //   } = params;

// //   const regionA = ensureArray(region);
// //   const genderA = ensureArray(gender);
// //   const categoryA = ensureArray(category);
// //   const tagsA = ensureArray(tags);
// //   const paymentA = ensureArray(payment);

// //   // Filters
// //   const filtered = applyFilters(all, {
// //     region: regionA, gender: genderA, ageMin, ageMax,
// //     category: categoryA, tags: tagsA, payment: paymentA, startDate, endDate
// //   });

// //   // Search
// //   const searched = applySearch(filtered, search);
// //   // Sort
// //   const sorted = applySort(searched, sortBy, order);
// //   // Paginate -> returns { results, total, page, totalPages }
// //   return paginate(sorted, page, limit);
// // }

// // module.exports = { querySales };
// // code 2----------------------------------------------
// // salesService.js
// // In-memory filtering / searching / sorting / pagination for sales dataset.
// // Assumes you have a loader that returns an array of records (objects) where
// // keys may include spaces like "Customer Name". Adjust loader import as needed.

// // backend/src/services/salesService.js
// // backend/src/services/salesService.js
// const safeStr = v => (v === null || v === undefined) ? '' : String(v).toLowerCase();

// function normalizeList(val) {
//   if (val === undefined || val === null) return undefined;
//   if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
//   if (typeof val === 'string') {
//     if (val.includes(',')) return val.split(',').map(s => s.trim()).filter(Boolean);
//     if (val.trim() === '') return undefined;
//     return [val.trim()];
//   }
//   return [String(val)];
// }

// function matchAny(rec, possibleKeys, wantedArr) {
//   if (!wantedArr || wantedArr.length === 0) return true;
//   const loweredWanted = wantedArr.map(w => String(w).toLowerCase());
//   for (const rk of possibleKeys) {
//     if (!(rk in rec)) continue;
//     const val = rec[rk];
//     if (Array.isArray(val)) {
//       if (val.map(v => String(v).toLowerCase()).some(v => loweredWanted.includes(v))) return true;
//     } else if (typeof val === 'string' && val.includes(',')) {
//       const parts = val.split(',').map(s => s.trim().toLowerCase());
//       if (parts.some(p => loweredWanted.includes(p))) return true;
//     } else {
//       if (loweredWanted.includes(safeStr(val))) return true;
//     }
//   }
//   return false;
// }

// /**
//  * filterSortPaginate
//  * data: array (from dataLoader.getSales())
//  * params: normalized query params (see controller.normalizeQuery)
//  */
// function filterSortPaginate(data = [], params = {}) {
//   let out = Array.isArray(data) ? data.slice() : [];

//   // SEARCH across important fields
//   if (params.search && String(params.search).trim() !== '') {
//     const q = String(params.search).trim().toLowerCase();
//     const searchable = ['Customer Name', 'Phone Number', 'Product Name', 'Product Category'];
//     out = out.filter(rec =>
//       searchable.some(key => key in rec && safeStr(rec[key]).includes(q))
//     );
//   }

//   // MULTI-FILTERS
//   const regionWanted = normalizeList(params.region);
//   const genderWanted = normalizeList(params.gender);
//   const categoryWanted = normalizeList(params.category);
//   const paymentWanted = normalizeList(params.payment);
//   const tagsWanted = normalizeList(params.tags);

//   out = out.filter(rec => {
//     if (!matchAny(rec, ['Region', 'customerRegion'], regionWanted)) return false;
//     if (!matchAny(rec, ['Gender', 'gender'], genderWanted)) return false;
//     if (!matchAny(rec, ['Product Category', 'productCategory'], categoryWanted)) return false;
//     if (!matchAny(rec, ['Payment Method', 'paymentMethod'], paymentWanted)) return false;
//     if (!matchAny(rec, ['Tags', 'tags'], tagsWanted)) return false;
//     return true;
//   });

//   // AGE RANGE
//   if (params.ageMin !== undefined || params.ageMax !== undefined) {
//     const min = params.ageMin !== undefined ? Number(params.ageMin) : -Infinity;
//     const max = params.ageMax !== undefined ? Number(params.ageMax) : Infinity;
//     out = out.filter(rec => {
//       const rawAge = rec['Age'];
//       const n = Number(rawAge);
//       if (Number.isNaN(n)) return false;
//       return n >= min && n <= max;
//     });
//   }

//   // DATE RANGE
//   if (params.startDate || params.endDate) {
//     const start = params.startDate ? new Date(params.startDate) : new Date('1970-01-01');
//     const end = params.endDate ? new Date(params.endDate) : new Date('9999-12-31');
//     const dateKeys = ['Date', 'date'];
//     out = out.filter(rec => {
//       const raw = dateKeys.map(k => rec[k]).find(v => v);
//       if (!raw) return false;
//       const d = new Date(raw);
//       if (isNaN(d)) return false;
//       return d >= start && d <= end;
//     });
//   }

//   // GENERIC exact filters from _raw (if front-end sends keys matching record keys)
//   if (params._raw) {
//     const ignored = new Set(['page','limit','sortBy','order','search','startDate','endDate','ageMin','ageMax','region','gender','payment','category','tags']);
//     Object.entries(params._raw).forEach(([k, v]) => {
//       if (ignored.has(k)) return;
//       if (!out.length) return;
//       // if key present on record sample, filter equality (or in array)
//       if (!(k in out[0])) return;
//       if (v === undefined || v === null) return;
//       const wanted = Array.isArray(v) ? v.map(String) : [String(v)];
//       out = out.filter(rec => wanted.map(String).includes(String(rec[k])));
//     });
//   }

//   // SORT
//   const sortBy = params.sortBy;
//   const order = (params.order || 'desc').toLowerCase();
//   if (sortBy) {
//     out.sort((a, b) => {
//       const va = a[sortBy], vb = b[sortBy];
//       // try date
//       const da = va && !isNaN(Date.parse(va)) ? new Date(va) : null;
//       const db = vb && !isNaN(Date.parse(vb)) ? new Date(vb) : null;
//       if (da && db) return da - db;
//       // numeric
//       const na = Number(va), nb = Number(vb);
//       if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
//       const sa = safeStr(va || ''), sb = safeStr(vb || '');
//       if (sa < sb) return -1;
//       if (sa > sb) return 1;
//       return 0;
//     });
//     if (order === 'desc') out.reverse();
//   }

//   // PAGINATE
//   const page = Math.max(1, Number(params.page) || 1);
//   const limit = Math.max(1, Number(params.limit) || 10);
//   const total = out.length;
//   const totalPages = Math.max(1, Math.ceil(total / limit));
//   const startIndex = (page - 1) * limit;
//   const pageData = out.slice(startIndex, startIndex + limit);

//   return {
//     data: pageData,
//     total,
//     page,
//     limit,
//     totalPages
//   };
// }

// module.exports = { filterSortPaginate };
// code 2---------------------------------
// backend/src/services/salesService.js
// backend/src/services/salesService.js
const safeStr = v => (v === null || v === undefined) ? '' : String(v).toLowerCase();

/** Normalize query param list values (supports string, array, object) */
function normalizeList(val) {
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof val === 'object') {
    return Object.values(val).map(String).map(s => s.trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    if (val.includes(',')) return val.split(',').map(s => s.trim()).filter(Boolean);
    if (val.trim() === '') return undefined;
    return [val.trim()];
  }
  return [String(val)];
}

/** Case‑insensitive, trim‑aware match for Region/Gender/Category/Payment/Tags */
function matchAny(rec, possibleKeys, wantedArr) {
  if (!wantedArr || wantedArr.length === 0) return true;
  const loweredWanted = wantedArr.map(w => String(w).toLowerCase());

  for (const rk of possibleKeys) {
    if (!(rk in rec)) continue;
    const val = rec[rk];

    if (Array.isArray(val)) {
      const parts = val.map(v => String(v).toLowerCase());
      if (parts.some(p => loweredWanted.includes(p))) return true;
      continue;
    }

    if (typeof val === 'string') {
      const parts = val.split(',').map(s => s.trim().toLowerCase());
      if (parts.some(p => loweredWanted.includes(p))) return true;

      const raw = val.trim().toLowerCase();
      if (loweredWanted.some(w => raw === w || raw.includes(w))) return true;
      continue;
    }

    const primitive = String(val).toLowerCase();
    if (loweredWanted.includes(primitive)) return true;
  }

  return false;
}

/**
 * Main filtering/sorting/pagination pipeline
 * data: array (from getSales())
 * params: normalized query params
 */
function filterSortPaginate(data = [], params = {}) {
  let out = Array.isArray(data) ? data.slice() : [];

  // SEARCH across important fields
  if (params.search && String(params.search).trim() !== '') {
    const q = String(params.search).trim().toLowerCase();
    const searchable = ['Customer Name', 'Phone Number', 'Product Name', 'Product Category'];
    out = out.filter(rec =>
      searchable.some(key => key in rec && safeStr(rec[key]).includes(q))
    );
  }

  // MULTI-FILTERS
  const regionWanted = normalizeList(params.region);
  const genderWanted = normalizeList(params.gender);
  const categoryWanted = normalizeList(params.category);
  const paymentWanted = normalizeList(params.payment);
  const tagsWanted = normalizeList(params.tags);

  out = out.filter(rec => {
    if (!matchAny(rec, ['Region', 'Customer Region', 'customerRegion'], regionWanted)) return false;
    if (!matchAny(rec, ['Gender', 'gender'], genderWanted)) return false;
    if (!matchAny(rec, ['Product Category', 'productCategory'], categoryWanted)) return false;
    if (!matchAny(rec, ['Payment Method', 'paymentMethod'], paymentWanted)) return false;
    if (!matchAny(rec, ['Tags', 'tags'], tagsWanted)) return false;
    return true;
  });

  // AGE RANGE
  if (params.ageMin !== undefined || params.ageMax !== undefined) {
    const min = params.ageMin !== undefined ? Number(params.ageMin) : -Infinity;
    const max = params.ageMax !== undefined ? Number(params.ageMax) : Infinity;
    out = out.filter(rec => {
      const rawAge = rec['Age'];
      const n = Number(rawAge);
      if (Number.isNaN(n)) return false;
      return n >= min && n <= max;
    });
  }

  // DATE RANGE
  if (params.startDate || params.endDate) {
    const start = params.startDate ? new Date(params.startDate) : new Date('1970-01-01');
    const end = params.endDate ? new Date(params.endDate) : new Date('9999-12-31');
    const dateKeys = ['Date', 'date'];
    out = out.filter(rec => {
      const raw = dateKeys.map(k => rec[k]).find(v => v);
      if (!raw) return false;
      const d = new Date(raw);
      if (isNaN(d)) return false;
      return d >= start && d <= end;
    });
  }

  // GENERIC exact filters from _raw (if UI sends extra keys)
  if (params._raw) {
    const ignored = new Set([
      'page','limit','sortBy','order','search',
      'startDate','endDate','ageMin','ageMax',
      'region','gender','payment','category','tags'
    ]);
    Object.entries(params._raw).forEach(([k, v]) => {
      if (ignored.has(k)) return;
      if (!out.length) return;
      if (!(k in out[0])) return;
      if (v === undefined || v === null) return;
      const wanted = Array.isArray(v) ? v.map(String) : [String(v)];
      out = out.filter(rec => wanted.map(String).includes(String(rec[k])));
    });
  }

  // SORT
  const sortBy = params.sortBy;
  const order = (params.order || 'desc').toLowerCase();
  if (sortBy) {
    out.sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy];
      const da = va && !isNaN(Date.parse(va)) ? new Date(va) : null;
      const db = vb && !isNaN(Date.parse(vb)) ? new Date(vb) : null;
      if (da && db) return da - db;
      const na = Number(va), nb = Number(vb);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      const sa = safeStr(va || ''), sb = safeStr(vb || '');
      if (sa < sb) return -1;
      if (sa > sb) return 1;
      return 0;
    });
    if (order === 'desc') out.reverse();
  }

  // PAGINATE
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 10);
  const total = out.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const pageData = out.slice(startIndex, startIndex + limit);

  return {
    data: pageData,
    total,
    page,
    limit,
    totalPages
  };
}

module.exports = { filterSortPaginate, normalizeList };
