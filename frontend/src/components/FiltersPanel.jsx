// import React from "react";

// function CheckboxList({ label, options = [], value = [], onChange }) {
//   return (
//     <div style={{ marginBottom: 12 }}>
//       <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
//       {options.map((opt) => (
//         <label key={opt} style={{ display: "block", fontSize: 14 }}>
//           <input
//             type="checkbox"
//             checked={value.includes(opt)}
//             onChange={(e) => {
//               if (e.target.checked) onChange([...value, opt]);
//               else onChange(value.filter((v) => v !== opt));
//             }}
//           />{" "}
//           {opt}
//         </label>
//       ))}
//     </div>
//   );
// }

// export default function FiltersPanel({ state, setState, onApply }) {
//   const regions = ["North", "South", "East", "West"];
//   const genders = ["Male", "Female", "Other"];
//   const categories = ["Electronics", "Clothing", "Grocery", "Home", "Beauty"];
//   const payments = ["UPI", "Card", "Cash", "Netbanking"];

//   return (
//     <div className="filter-panel">
//       <CheckboxList label="Region" options={regions} value={state.region} onChange={(v) => setState((s) => ({ ...s, region: v }))} />
//       <CheckboxList label="Gender" options={genders} value={state.gender} onChange={(v) => setState((s) => ({ ...s, gender: v }))} />

//       <div style={{ marginBottom: 12 }}>
//         <div style={{ fontWeight: 600 }}>Age Range</div>
//         <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
//           <input type="number" placeholder="Min" value={state.ageMin ?? ""} onChange={(e) => setState((s) => ({ ...s, ageMin: e.target.value ? Number(e.target.value) : undefined }))} />
//           <input type="number" placeholder="Max" value={state.ageMax ?? ""} onChange={(e) => setState((s) => ({ ...s, ageMax: e.target.value ? Number(e.target.value) : undefined }))} />
//         </div>
//       </div>

//       <CheckboxList label="Category" options={categories} value={state.category} onChange={(v) => setState((s) => ({ ...s, category: v }))} />
//       <CheckboxList label="Payment" options={payments} value={state.payment} onChange={(v) => setState((s) => ({ ...s, payment: v }))} />

//       <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
//         <button onClick={() => onApply()}>Apply</button>
//         <button onClick={() => setState(() => ({
//           search: "", region: [], gender: [], ageMin: undefined, ageMax: undefined, category: [], tags: [], payment: [], startDate: "", endDate: "", sortBy: "date", order: "desc", page: 1
//         }))}>Reset</button>
//       </div>
//     </div>
//   );
// }
// code 2-------------------------
// frontend/src/components/FiltersPanel.jsx
import React from "react";
function CheckboxGrid({ options = [], value = [], onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
      {options.map((opt) => (
        <label key={opt} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 8px", borderRadius: 6 }}>
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={(e) => {
              if (e.target.checked) onChange([...value, opt]);
              else onChange(value.filter((v) => v !== opt));
            }}
          />
          <span style={{ fontSize: 14 }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function FiltersPanel({ state, setState, onApply }) {
  const regions = ["North", "South", "East", "West"];
  const genders = ["Male", "Female", "Other"];
  const categories = ["Electronics", "Clothing", "Grocery", "Home", "Beauty"];
  const payments = ["UPI", "Card", "Cash", "Netbanking"];

  return (
    <div style={{ padding: 4 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "6px 0 10px", color: "#0b66b1" }}>Region</h3>
        <CheckboxGrid options={regions} value={state.region} onChange={(v) => setState((s) => ({ ...s, region: v }))} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "6px 0 10px", color: "#0b66b1" }}>Gender</h3>
        <CheckboxGrid options={genders} value={state.gender} onChange={(v) => setState((s) => ({ ...s, gender: v }))} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "6px 0 10px", color: "#0b66b1" }}>Category</h3>
        <CheckboxGrid options={categories} value={state.category} onChange={(v) => setState((s) => ({ ...s, category: v }))} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "6px 0 10px", color: "#0b66b1" }}>Payment</h3>
        <CheckboxGrid options={payments} value={state.payment} onChange={(v) => setState((s) => ({ ...s, payment: v }))} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button onClick={() => onApply()}>Apply</button>
        <button
          onClick={() =>
            setState(() => ({
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
            }))
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}
