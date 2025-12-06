import axios from "axios";

// Use Vite env variable if provided, else default to localhost:4000
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000" });

export async function fetchSales(params) {
  const res = await API.get("/api/sales", { params });
  return res.data;
}

export default API;
