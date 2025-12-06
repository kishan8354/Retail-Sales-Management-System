const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

// In-memory dataset
let SALES = [];

function normalizeRow(row) {
  // adapt field names according to csv header
  // assume CSV contains headers matching assignment
  return {
    customerId: row['Customer ID'] || row['CustomerID'] || row.customerId,
    customerName: row['Customer Name'] || row.customerName || '',
    phone: row['Phone Number'] || row.phone || '',
    gender: row['Gender'] || row.gender || '',
    age: parseInt(row['Age'] || row.age || '0', 10) || null,
    customerRegion: row['Customer Region'] || row.customerRegion || '',

    productId: row['Product ID'] || row.productId || '',
    productName: row['Product Name'] || row.productName || '',
    brand: row['Brand'] || row.brand || '',
    productCategory: row['Product Category'] || row.productCategory || '',
    tags: (row['Tags'] || row.tags || '').toString().split(',').map(t => t.trim()).filter(Boolean),

    quantity: parseFloat(row['Quantity'] || row.quantity || '0') || 0,
    pricePerUnit: parseFloat(row['Price per Unit'] || row.pricePerUnit || '0') || 0,
    discountPercentage: parseFloat(row['Discount Percentage'] || row.discountPercentage || '0') || 0,
    totalAmount: parseFloat(row['Total Amount'] || row.totalAmount || '0') || 0,
    finalAmount: parseFloat(row['Final Amount'] || row.finalAmount || '0') || 0,

    date: row['Date'] || row.date || '',
    paymentMethod: row['Payment Method'] || row.paymentMethod || '',
    orderStatus: row['Order Status'] || row.orderStatus || '',
    deliveryType: row['Delivery Type'] || row.deliveryType || '',
    storeId: row['Store ID'] || row.storeId || '',
    storeLocation: row['Store Location'] || row.storeLocation || '',
    salespersonId: row['Salesperson ID'] || row.salespersonId || '',
    employeeName: row['Employee Name'] || row.employeeName || ''
  };
}

async function loadData() {
  const filePath = path.join(__dirname, '..', '..', 'data', 'sales.csv');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset not found at ${filePath}. Please put sales.csv there.`);
  }
  const content = fs.readFileSync(filePath);
  return new Promise((resolve, reject) => {
    parse(content, { columns: true, skip_empty_lines: true, trim: true }, (err, rows) => {
      if (err) return reject(err);
      SALES = rows.map(normalizeRow);
      resolve(SALES);
    });
  });
}

function getSales() {
  return SALES;
}

module.exports = { loadData, getSales };
