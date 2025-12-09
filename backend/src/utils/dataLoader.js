// backend/src/utils/dataLoader.js
const { supabase } = require('../supabaseClient');

let SALES = [];

/** Map Supabase row -> normalized record used by filters */
function normalizeRow(row) {
  return {
    // core fields (match your Supabase columns)
    Date: row.Date || row.date || '',
    'Customer Name': row['Customer Name'] || row.CustomerName || '',
    'Phone Number': row['Phone Number'] || row.PhoneNumber || '',
    Age: row.Age || row.age || '',
    Region: row.Region || row['Customer Region'] || row.CustomerRegion || '',
    Gender: row.Gender || row.gender || '',
    'Product Name': row['Product Name'] || row.ProductName || '',
    'Product Category': row['Product Category'] || row.ProductCategory || '',
    Quantity: row.Quantity || row.quantity || 0,
    'Final Amount': row['Final Amount'] || row.FinalAmount || 0,
    'Payment Method': row['Payment Method'] || row.PaymentMethod || '',
    Tags: row.Tags || row.tags || '',

    // keep raw row for debugging
    _raw: row
  };
}

/** Load all rows from Supabase table `kishan` into memory */
async function loadRemoteData() {
  try {
    const { data, error } = await supabase
      .from('kishan')
      .select('*')
      .order('Date', { ascending: false });

    if (error) {
      console.error('[dataLoader] Supabase fetch error:', error.message);
      SALES = [];
      return SALES;
    }

    SALES = (data || []).map(normalizeRow);
    console.log(`[dataLoader] Loaded ${SALES.length} rows from Supabase table "kishan"`);
    return SALES;
  } catch (err) {
    console.error('[dataLoader] Unexpected error loading Supabase data:', err.message);
    SALES = [];
    return SALES;
  }
}

function getSales() {
  return SALES;
}

module.exports = { loadRemoteData, getSales };
