const { getSales } = require('../utils/dataLoader');

function applyFilters(data, params) {
  let out = data;
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
      const age = r.age || 0;
      if (ageMin !== undefined && age < ageMin) return false;
      if (ageMax !== undefined && age > ageMax) return false;
      return true;
    });
  }
  if (category && category.length) {
    out = out.filter(r => category.includes(r.productCategory));
  }
  if (tags && tags.length) {
    out = out.filter(r => r.tags && r.tags.some(t => tags.includes(t)));
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
    const name = (r.customerName || '').toString().toLowerCase();
    const phone = (r.phone || '').toString();
    return name.includes(q) || phone.includes(q);
  });
}

function applySort(data, sortBy, order) {
  if (!sortBy) return data;
  const dir = order === 'asc' ? 1 : -1;
  const copy = [...data];
  if (sortBy === 'date') {
    // newest first = desc by date, but order handles asc/desc
    copy.sort((a, b) => dir * (new Date(a.date) - new Date(b.date)));
  } else if (sortBy === 'quantity') {
    copy.sort((a, b) => dir * (a.quantity - b.quantity));
  } else if (sortBy === 'name') {
    copy.sort((a, b) => dir * a.customerName.localeCompare(b.customerName));
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
    data: data.slice(start, end),
    total,
    page: p,
    totalPages
  };
}

function querySales(params) {
  const all = getSales() || [];
  const {
    search, region, gender, ageMin, ageMax,
    category, tags, payment, startDate, endDate,
    sortBy, order, page, limit
  } = params;

  // Filters
  const filtered = applyFilters(all, { region, gender, ageMin, ageMax, category, tags, payment, startDate, endDate });
  // Search
  const searched = applySearch(filtered, search);
  // Sort
  const sorted = applySort(searched, sortBy, order);
  // Paginate
  return paginate(sorted, page, limit);
}

module.exports = { querySales };

