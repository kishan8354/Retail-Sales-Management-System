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
<img width="459" height="591" alt="image" src="https://github.com/user-attachments/assets/e8cdd7b6-6f61-480a-aaf3-8fc6c64c27de" />

---

## 4. Folder Structure

### Backend Folder Structure
<img width="458" height="464" alt="Screenshot 2025-12-06 223055" src="https://github.com/user-attachments/assets/59c29ea9-eb73-4664-b374-f5576819b665" />

### Frontend Folder Structure
<img width="418" height="554" alt="Screenshot 2025-12-06 223119" src="https://github.com/user-attachments/assets/24148e40-50aa-4f30-8e3e-55538192a23f" />

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
