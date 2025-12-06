import React, { useState, useEffect } from "react";

export default function SearchBar({ value, onChange, onSearch }) {
  const [v, setV] = useState(value || "");

  useEffect(() => setV(value || ""), [value]);

  function submit(e) {
    e.preventDefault();
    onChange(v);
    if (onSearch) onSearch();
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Search customer name or phone"
        aria-label="search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
