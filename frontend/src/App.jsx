// import React from "react";
// import SearchBar from "./components/SearchBar";
// import FiltersPanel from "./components/FiltersPanel";
// import SortingDropdown from "./components/SortingDropdown";
// import SalesTable from "./components/SalesTable";
// import Pagination from "./components/Pagination";
// import useSales from "./hooks/useSales";

// export default function App() {
//   const { state, setState, data, total, page, totalPages, loading, fetchData } = useSales();

//   return (
//     <div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
//       <h2>Retail Sales Management</h2>

//       <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
//         <div style={{ flex: 1 }}>
//           <SearchBar
//             value={state.search}
//             onChange={(v) => setState((s) => ({ ...s, search: v, page: 1 }))}
//             onSearch={fetchData}
//           />
//         </div>

//         <div>
//           <SortingDropdown
//             value={state.sortBy}
//             order={state.order}
//             onChange={(sortBy, order) => setState((s) => ({ ...s, sortBy, order, page: 1 }))}
//           />
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: 20 }}>
//         <div style={{ width: 300 }}>
//           <FiltersPanel state={state} setState={setState} onApply={fetchData} />
//         </div>

//         <div style={{ flex: 1 }}>
//           <SalesTable data={data} loading={loading} />
//           <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setState((s) => ({ ...s, page: p }))} />
//         </div>
//       </div>
//     </div>
//   );
// }
// code 2-----------------------------
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import FiltersPanel from "./components/FiltersPanel";
import SortingDropdown from "./components/SortingDropdown";
import SalesTable from "./components/SalesTable";
import Pagination from "./components/Pagination";
import useSales from "./hooks/useSales";

/* Background image - replace URL if you want your own */
const BACKGROUND_URL =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";

export default function App() {
  const { state, setState, data, total, page, totalPages, loading, fetchData } = useSales();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app" style={{ backgroundImage: `url(${BACKGROUND_URL})` }}>
      <div className="topbar">
        <div className="topbar-left">
          <button
            className="hamburger"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="20" height="2" rx="1" fill="white" />
              <rect y="6" width="20" height="2" rx="1" fill="white" />
              <rect y="12" width="20" height="2" rx="1" fill="white" />
            </svg>
          </button>
        </div>

        <div className="topbar-center">
          <div className="topbar-title">Retail Sales Management</div>
        </div>

        <div className="topbar-right">
          <div className="top-search">
            <SearchBar
              value={state.search}
              onChange={(v) => setState((s) => ({ ...s, search: v, page: 1 }))}
              onSearch={() => {
                setState((s) => ({ ...s, page: 1 }));
                fetchData();
              }}
            />
          </div>
        </div>
      </div>

      <div className="content">
        <aside className={`sidebar panel ${sidebarOpen ? "open" : "closed"}`}>
          <div className="nav-header">Navigation</div>

          <FiltersPanel
            state={state}
            setState={setState}
            onApply={() => {
              setState((s) => ({ ...s, page: 1 }));
              fetchData();
            }}
          />
        </aside>

        <main className="main-panel">
          <div className="panel toolbar-actions">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="small-info">Showing <strong>{total ?? 0}</strong> results</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <SortingDropdown
                  value={state.sortBy}
                  order={state.order}
                  onChange={(sortBy, order) => setState((s) => ({ ...s, sortBy, order, page: 1 }))}
                />
              </div>
            </div>
          </div>

          <div className="panel table-panel">
            <div className="table-wrap">
              <SalesTable data={data} loading={loading} />
            </div>
            <div className="pagination-wrap">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setState((s) => ({ ...s, page: p }))}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


