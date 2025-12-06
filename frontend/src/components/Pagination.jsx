import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
      <div>Page {page} of {totalPages}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}
