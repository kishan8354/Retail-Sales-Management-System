import { useState, useEffect, useCallback } from "react";
import { fetchSales } from "../services/api";
import { buildQuery } from "../utils/queryBuilder";

const initialState = {
  search: "",
  region: [],
  gender: [],
  ageMin: undefined,
  ageMax: undefined,
  category: [],
  tags: [],
  payment: [],
  startDate: "",
  endDate: "",
  sortBy: "date",
  order: "desc",
  page: 1
};

export default function useSales() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (overrideState) => {
    setLoading(true);
    try {
      const s = overrideState || state;
      const q = buildQuery(s);
      const res = await fetchSales(q);
      setData(res.data || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  }, [state]);

  // fetch when page / sort / order changes or on mount
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page, state.sortBy, state.order]);

  return { state, setState, data, total, page, totalPages, loading, fetchData };
}
