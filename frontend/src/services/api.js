// frontend/src/service/api.js
import axios from "axios";

// Use Vite env variable if provided, else default to localhost:4000
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"||4000 });

/**
 * normalizeRecord(row)
 * Converts server row (which may use "Date", "Customer Name", "Phone Number", etc.)
 * into frontend-friendly camelCase keys used by the UI.
 */
function normalizeRecord(rec = {}) {
  // helper to pick the first present key from candidates
  const pick = (...cands) => {
    for (const c of cands) {
      if (c === undefined) continue;
      if (Object.prototype.hasOwnProperty.call(rec, c) && rec[c] !== undefined && rec[c] !== null) return rec[c];
      // check nested _raw too (some controllers put original in _raw)
      if (rec._raw && Object.prototype.hasOwnProperty.call(rec._raw, c) && rec._raw[c] !== undefined && rec._raw[c] !== null) return rec._raw[c];
    }
    return undefined;
  };

  const tagsRaw = pick("tags", "Tags", (rec._raw && rec._raw.Tags));
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
    : String(tagsRaw || "").split(",").map(s => s.trim()).filter(Boolean);

  const quantityRaw = pick("quantity", "Quantity", (rec._raw && rec._raw.Quantity));
  const finalAmountRaw = pick("finalAmount", "Final Amount", (rec._raw && rec._raw["Final Amount"]));

  // return object the frontend expects
  return {
    date: pick("date", "Date") || "",
    customerName: pick("customerName", "Customer Name") || "",
    phone: pick("phone", "Phone Number", "phone_number") || "",
    customerRegion: pick("customerRegion", "Region", "Customer Region") || "",
    gender: pick("gender", "Gender") || "",
    age: (() => {
      const v = pick("age", "Age", (rec._raw && rec._raw.Age));
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    })(),
    productName: pick("productName", "Product Name") || "",
    productCategory: pick("productCategory", "Product Category") || "",
    quantity: (() => {
      const n = Number(quantityRaw);
      return Number.isFinite(n) ? n : 0;
    })(),
    finalAmount: (() => {
      const n = Number(finalAmountRaw);
      return Number.isFinite(n) ? n : 0;
    })(),
    paymentMethod: pick("paymentMethod", "Payment Method") || "",
    tags,
    _raw: rec // keep raw for debugging if needed
  };
}

/**
 * fetchSales(params)
 * Calls backend, normalizes data array to frontend shape, and returns the same
 * pagination fields the app expects.
 */
export async function fetchSales(params) {
  const res = await API.get("/api/sales", { params });
  const payload = res.data || {};

  // if debug payload used, return as-is (helps debugging)
  if (payload.debug) return payload;

  const mapped = (payload.data || []).map(normalizeRecord);

  // return same shape as before but with normalized data
  return {
    ...payload,
    data: mapped
  };
}

export default API;
