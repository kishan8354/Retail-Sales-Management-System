# Architecture Document — Retail Sales Management System

## 1. Backend Architecture

### Overview
The backend is built using **Node.js + Express.js** and connects to a **Supabase PostgreSQL** database.  
It exposes a single REST endpoint `/api/sales` that supports:

- Full-text search (case-insensitive)
- Multi-select filters (region, gender, category, payment)
- Range filters (age range, date range)
- Sorting (date, quantity, customerName)
- Server-side pagination (page, limit)

The backend follows a **modular, service-based architecture** ensuring clarity, testability, and clean separation of concerns.

---

### Key Components

#### **1. `index.js` (Application Entry Point)**
- Initializes Express server  
- Loads middleware (`cors`, JSON parser, logger)
- Registers all `/api/sales` routes
- Starts server on `process.env.PORT`
- Loads environment variables (Supabase keys)

#### **2. `supabaseClient.js`**
- Creates a secure Supabase client using:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Ensures all DB operations happen through a validated interface  
- Prevents exposing database credentials on the frontend

#### **3. `routes/`**
- Defines HTTP endpoints  
- Example: `GET /api/sales`  
- Routes are kept thin — only forward requests to controllers

#### **4. `controllers/`**
Responsibilities:
- Parse and validate query parameters (page, limit, filters, search)
- Convert frontend filters into backend-friendly structures
- Map `sortBy` → actual DB column names
- Call the service layer  
- Return structured API responses with correct HTTP status codes  
- Example validated inputs:
  ```text
  search=abc
  region=North,South
  sortBy=date
  order=desc
  page=1 & limit=10
### 5. services/
The **service layer** contains the complete backend business logic.

#### Responsibilities:
- Build Supabase/PostgreSQL queries based on:
  - **search**
  - **filters**
  - **sorting**
  - **pagination**
- Apply the **same filters** to both:
  - data query  
  - count query (to ensure accurate `total` & `totalPages`)
- Normalize DB rows (map Supabase column names → camelCase keys)
- Return a clean structured result object:

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
### UI Logic
- Search input is debounced (300 ms)  
- Filters update query parameters in state  
- Sorting triggers re-fetch with new params  
- Pagination buttons load specific pages  

---

## 3. Data Flow

### Overall System Data Flow
<img width="587" height="703" alt="image" src="https://github.com/user-attachments/assets/5307c8ef-9776-4485-8dbb-5d0104761ea1" />


---

## 4. Folder Structure

### Backend Folder Structure
<img width="699" height="587" alt="image" src="https://github.com/user-attachments/assets/f8340f02-df80-4a1d-b61a-4c37c4f7a5a3" />


### Frontend Folder Structure
<img width="418" height="554" alt="Screenshot 2025-12-06 223119" src="https://github.com/user-attachments/assets/24148e40-50aa-4f30-8e3e-55538192a23f" />

---

## 5. Module Responsibilities

### Backend
| Module | Responsibility |
|-------|----------------|
| **controllers** | Parse & validate request parameters, call services, return API responses |
| **services** | Core business logic: build filters, apply search, sorting, and pagination |
| **routes** | Defines API endpoints (e.g., `/api/sales`) and maps them to controllers |
| **utils** | Helper utilities for parsing arrays, normalizing DB rows, mapping Supabase fields |
| **supabaseClient.js** | Creates and configures Supabase PostgreSQL client with Service Role key |
| **index.js** | Express app setup: middleware (CORS, JSON), route mounting, server startup |

---

### Frontend
| Module | Responsibility |
|--------|----------------|
| **components** | UI building blocks (Tables, Filter Panel, Pagination, Sort Dropdown, etc.) |
| **hooks** | Handles state + API logic (e.g., `useSales()` manages fetch, search, filters, pagination) |
| **services** | Axios API wrapper (`api.js`) that calls backend using environment variable |
| **utils** | Build query parameters and transform UI state into backend-compatible format |
| **styles** | Tailwind or custom CSS for layout and design |
| **App / Pages** | High-level layout + binds components to hooks & data |

---

### Additional (Optional High-Quality Modules)
| Module | Purpose |
|--------|---------|
| **middlewares/** | Security, logging, validation layers (optional) |
| **constants/** | Centralized mappings (DB column → frontend field), filter options |
| **validators/** | Strict validation using Zod/Joi |
| **context/** (frontend) | Global UI states (drawer open, sort, theme, etc.) |

---

## End of Architecture Document
