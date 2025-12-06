# Architecture Document — Retail Sales Management System

## 1. Backend Architecture

### Overview
The backend is built using **Node.js + Express.js**, exposing REST APIs for search, filtering, sorting, and pagination. It uses a modular service-layer architecture to ensure clean separation of concerns and testability.

### Key Components
- **server.js** — Main entry point, loads routes and middleware.
- **routes/** — Defines all API endpoints.
- **controllers/** — Validates incoming request parameters and delegates logic.
- **services/** — Business logic for search, filter, sorting, pagination.
- **data/** — JSON dataset representing sales records.
- **utils/** — Helper functions (date parser, validation, sorting utilities).

### Request Processing Flow
Client → Controller → Service → Dataset → Response → Client

markdown
Copy code

### Backend Features
- Debounced search handling  
- Filter merging logic  
- Stable sorting implementation  
- Efficient pagination (constant-time slicing)  
- Structured error handling  

---

## 2. Frontend Architecture

### Overview
The frontend is developed using **React + Vite**, following a component-based architecture with strong state and data-flow management.

### Key Components
- **App.jsx** — Root application shell  
- **components/**
  - `SearchBar`
  - `FilterPanel`
  - `SortDropdown`
  - `PaginatedTable`
  - `Loader`, `ErrorBanner`
- **pages/**
  - `Dashboard.jsx`
- **hooks/**
  - `useSalesData.js` for API fetching & caching
- **services/**
  - `api.js` wrapper using Axios
- **styles/**
  - Tailwind utility classes
- **context/**
  - Global UI state (optional)

### Frontend Data Flow
User Input → UI Components → API Request → Backend → Response → Render Table

yaml
Copy code

### UI Logic
- Search input is debounced (300 ms)  
- Filters update query parameters in state  
- Sorting triggers re-fetch with new params  
- Pagination buttons load specific pages  

---

## 3. Data Flow

### Overall System Data Flow
powershell
Copy code
              ┌─────────────────────────┐
              │        Frontend          │
              │  (React Components)      │
              └────────────┬─────────────┘
                           │ API Request
                           ▼
              ┌─────────────────────────┐
              │         Backend          │
              │  Controller → Service    │
              └────────────┬─────────────┘
                           │ Filter/Search/Sort
                           ▼
              ┌─────────────────────────┐
              │     Dataset / JSON       │
              └────────────┬─────────────┘
                           │ Processed Data
                           ▼
              ┌─────────────────────────┐
              │        Frontend          │
              │   Render Paginated UI    │
              └─────────────────────────┘
yaml
Copy code

---

## 4. Folder Structure

### Backend Folder Structure
backend/
│── data/
│ └── sales.json
│── src/
│ ├── controllers/
│ │ └── salesController.js
│ ├── services/
│ │ └── salesService.js
│ ├── routes/
│ │ └── salesRoutes.js
│ ├── utils/
│ │ ├── filtering.js
│ │ ├── sorting.js
│ │ └── pagination.js
│ └── server.js
└── package.json

shell
Copy code

### Frontend Folder Structure
frontend/
│── src/
│ ├── components/
│ │ ├── SearchBar.jsx
│ │ ├── FilterPanel.jsx
│ │ ├── SortDropdown.jsx
│ │ └── PaginatedTable.jsx
│ ├── pages/
│ │ └── Dashboard.jsx
│ ├── hooks/
│ │ └── useSalesData.js
│ ├── services/
│ │ └── api.js
│ ├── assets/
│ └── main.jsx
│── public/
└── package.json

yaml
Copy code

---

## 5. Module Responsibilities

### Backend
| Module | Responsibility |
|-------|----------------|
| **controllers** | Parse request params, return responses |
| **services** | Core logic: search, filter, sort, paginate |
| **routes** | Define API endpoints |
| **utils** | Common helper functions |
| **data** | Sales dataset |

### Frontend
| Module | Responsibility |
|--------|----------------|
| **components** | UI building blocks |
| **pages** | High-level views/layouts |
| **hooks** | API logic & state management |
| **services** | Axios wrapper for backend requests |
| **context** | Shared state management |
| **styles** | Tailwind utility classes |

---

## End of Architecture Document