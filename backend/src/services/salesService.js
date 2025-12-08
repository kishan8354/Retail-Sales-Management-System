// src/services/salesService.js (in-memory)
const { getSales } = require('../utils/dataLoader');

function ensureArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [val];
}

function applyFilters(data, params = {}) {
  let out = data || [];
  const {
    region, gender, ageMin, ageMax,
    category, tags, payment, startDate, endDate
  } = params;

  if (region && region.length) {
    out = out.filter(r => region.includes(r.customerRegion));
  }
  if (gender && gender.length) {
    out = out.filter(r => gender.includes((r.gender || '').toString()));
  }
  if (ageMin !== undefined || ageMax !== undefined) {
    out = out.filter(r => {
      const age = Number(r.age) || 0;
      if (ageMin !== undefined && age < ageMin) return false;
      if (ageMax !== undefined && age > ageMax) return false;
      return true;
    });
  }
  if (category && category.length) {
    out = out.filter(r => category.includes(r.productCategory));
  }
  if (tags && tags.length) {
    out = out.filter(r => {
      const t = r.tags;
      if (!t) return false;
      const tArr = Array.isArray(t) ? t : t.toString().split(',').map(x=>x.trim());
      return tArr.some(x => tags.includes(x));
    });
  }
  if (payment && payment.length) {
    out = out.filter(r => payment.includes(r.paymentMethod));
  }
  if (startDate) {
    const s = new Date(startDate);
    out = out.filter(r => new Date(r.date) >= s);
  }
  if (endDate) {
    const e = new Date(endDate);
    out = out.filter(r => new Date(r.date) <= e);
  }

  return out;
}

function applySearch(data, search) {
  if (!search) return data;
  const q = search.toString().toLowerCase();
  return data.filter(r => {
    const name = (r.customerName || r['Customer Name'] || '').toString().toLowerCase();
    const phone = (r.phone || r.phoneNumber || r['Phone Number'] || '').toString();
    return (name && name.includes(q)) || (phone && phone.includes(q));
  });
}

function applySort(data, sortBy, order) {
  if (!sortBy) return data;
  const dir = order === 'asc' ? 1 : -1;
  const copy = [...data];
  if (sortBy === 'date') {
    copy.sort((a, b) => dir * (new Date(a.date) - new Date(b.date)));
  } else if (sortBy === 'quantity') {
    copy.sort((a, b) => dir * ((Number(a.quantity) || 0) - (Number(b.quantity) || 0)));
  } else if (sortBy === 'name') {
    copy.sort((a, b) => dir * (String(a.customerName || '').localeCompare(String(b.customerName || ''))));
  }
  return copy;
}

function paginate(data, page = 1, limit = 10) {
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * limit;
  const end = start + limit;
  return {
    results: data.slice(start, end),
    total,
    page: p,
    totalPages
  };
}

function querySales(params = {}) {
  const all = getSales() || [];
  const {
    search, region, gender, ageMin, ageMax,
    category, tags, payment, startDate, endDate,
    sortBy, order, page, limit
  } = params;

  const regionA = ensureArray(region);
  const genderA = ensureArray(gender);
  const categoryA = ensureArray(category);
  const tagsA = ensureArray(tags);
  const paymentA = ensureArray(payment);

  // Filters
  const filtered = applyFilters(all, {
    region: regionA, gender: genderA, ageMin, ageMax,
    category: categoryA, tags: tagsA, payment: paymentA, startDate, endDate
  });

  // Search
  const searched = applySearch(filtered, search);
  // Sort
  const sorted = applySort(searched, sortBy, order);
  // Paginate -> returns { results, total, page, totalPages }
  return paginate(sorted, page, limit);
}

module.exports = { querySales };
