// backend/src/utils/dataLoader.js
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync'); // or 'csv-parse' if you prefer async

let SALES = [];

function normalizeRow(row) {
  // map fields as needed; keep _raw for debug
  return {
    Date: row['Date'] || row.date || '',
    'Customer Name': row['Customer Name'] || row.customerName || '',
    'Phone Number': row['Phone Number'] || row.phone || '',
    Age: row['Age'] || row.age || '',
    Region: row['Region'] || row.customerRegion || '',
    Gender: row['Gender'] || row.gender || '',
    'Product Name': row['Product Name'] || row.productName || '',
    'Product Category': row['Product Category'] || row.productCategory || '',
    Quantity: row['Quantity'] || row.quantity || 0,
    'Final Amount': row['Final Amount'] || row.finalAmount || 0,
    Tags: row['Tags'] || row.tags || '',
    _raw: row
  };
}

function loadLocalData() {
  try {
    const csvPath = path.join(__dirname, '..', '..', 'data', 'sales.csv');
    const jsonPath = path.join(__dirname, '..', '..', 'data', 'sales.json');

    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf8');
      const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true });
      SALES = rows.map(normalizeRow);
      console.log(`[dataLoader] Loaded ${SALES.length} rows from sales.csv`);
      return SALES;
    }

    if (fs.existsSync(jsonPath)) {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      SALES = raw.map(normalizeRow);
      console.log(`[dataLoader] Loaded ${SALES.length} rows from sales.json`);
      return SALES;
    }

    console.warn('[dataLoader] No local dataset found; continuing with empty dataset.');
    SALES = [];
    return SALES;
  } catch (err) {
    console.warn('[dataLoader] Error loading local dataset (continuing with empty dataset):', err.message || err);
    SALES = [];
    return SALES;
  }
}

function getSales() {
  return SALES;
}

module.exports = { loadLocalData, getSales };
