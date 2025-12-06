import React from "react";

export default function SortingDropdown({ value, order, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select value={value} onChange={(e) => onChange(e.target.value, order)}>
        <option value="date">Date (Newest)</option>
        <option value="quantity">Quantity</option>
        <option value="name">Customer Name (A–Z)</option>
      </select>
      <button onClick={() => onChange(value, order === "asc" ? "desc" : "asc")}>{order === "asc" ? "Asc" : "Desc"}</button>
    </div>
  );
}
