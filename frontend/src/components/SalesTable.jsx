// frontend/components/Salestable.jsx
import React from "react";

export default function SalesTable({ data = [], loading }) {
  if (loading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No results</div>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Phone</th>
          <th>Region</th>
          <th>Product</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Final Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, idx) => (
          <tr key={idx}>
            <td>{r.date}</td>
            <td>{r.customerName}</td>
            <td>{r.phone}</td>
            <td>{r.customerRegion}</td>
            <td>{r.productName}</td>
            <td>{r.productCategory}</td>
            <td>{r.quantity}</td>
            <td>{r.finalAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
