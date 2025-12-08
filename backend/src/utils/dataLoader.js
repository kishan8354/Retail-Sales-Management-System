// backend/src/utils/dataLoader.js
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync'); // sync parser for simplicity

let SALES = [];

/**
 * normalizeRow: convert CSV row to consistent object shape.
 * Edit keys if your CSV headers differ.
 */
function normalizeRow(row = {}) {
  const get = (...keys) => {
    for (const k of keys) if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== undefined && row[k] !== null) return row[k];
    return undefined;
  };

  const tagsRaw = get('Tags', 'tags') || '';
  const tagsArr = Array.isArray(tagsRaw) ? tagsRaw : String(tagsRaw || '').split(',').map(s => s.trim()).filter(Boolean);

  return {
    Date: get('Date', 'date') || '',
    'Customer Name': get('Customer Name', 'customerName', 'customer_name') || '',
    'Phone Number': get('Phone Number', 'phone', 'phone_number') || '',
    Age: get('Age', 'age') ? Number(get('Age', 'age')) : null,
    Region: get('Customer Region', 'Region', 'region', 'customerRegion') || '',
    Gender: get('Gender', 'gender') || '',
    'Product Name': get('Product Name', 'productName') || '',
    'Product Category': get('Product Category', 'productCategory') || '',
    'Quantity': get('Quantity') ? Number(get('Quantity')) : 0,
    'Final Amount': get('Final Amount') ? Number(get('Final Amount')) : 0,
    'Payment Method': get('Payment Method', 'paymentMethod') || '',
    Tags: tagsArr,
    _raw: row
  };
}

/**
 * loadData: loads CSV at backend/data/sales.csv into memory
 * returns number of rows loaded
 */
async function loadData() {
  const pCsv = path.join(__dirname, '..', '..', 'data', 'sales.csv');
  const pJson = path.join(__dirname, '..', '..', 'data', 'sales.json');

  // prefer CSV if present
  if (fs.existsSync(pCsv)) {
    const content = fs.readFileSync(pCsv, 'utf8');
    const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true });
    SALES = rows.map(normalizeRow);
    return SALES.length;
  }

  // fallback to JSON
  if (fs.existsSync(pJson)) {
    const raw = fs.readFileSync(pJson, 'utf8');
    const arr = JSON.parse(raw);
    SALES = arr.map(r => normalizeRow(r));
    return SALES.length;
  }

  throw new Error(`No dataset found. Put sales.csv or sales.json into /data`);
}

function getSales() {
  return SALES.slice(); // return shallow copy to avoid accidental mutability
}

module.exports = { loadData, getSales };
