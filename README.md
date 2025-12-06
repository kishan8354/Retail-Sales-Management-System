# Retail Sales Management System

## 1. Overview (3–5 lines)
The Retail Sales Management System is a full-stack web application designed to manage, browse, and analyze structured sales data. It provides advanced search, filtering, sorting, and pagination capabilities with a clean, modular architecture. The system is built to demonstrate scalable engineering practices, maintainability, and optimal user experience.

## 2. Tech Stack
**Frontend:** React, Vite, TypeScript, TailwindCSS  
**Backend:** Node.js, Express.js  
**Database:** Static JSON dataset / mock DB layer  
**Tools & Libraries:** Axios, React Query (optional), ESLint, Prettier  

## 3. Search Implementation Summary
Search is implemented as a **full-text match across key fields** such as product name, category, region, and customer.  
The frontend debounces user input and sends the query to the backend.  
The backend filters the dataset by checking whether the search term exists in any searchable field (case-insensitive) and returns paginated results.

## 4. Filter Implementation Summary
Filtering supports multiple attributes such as category, region, date range, quantity range, and price range.  
Filters are combined using **AND logic**, ensuring accurate narrowing of results.  
The backend receives all active filters and applies them sequentially to produce the final dataset.

## 5. Sorting Implementation Summary
Sorting is supported for fields like date, price, quantity sold, and product name.  
The backend applies a stable sort function and returns results in ascending or descending order based on query parameters.  
Sorting integrates seamlessly with search, filter, and pagination logic.

## 6. Pagination Implementation Summary
Pagination uses a **limit–offset model** where the frontend requests specific slices of data.  
The backend computes total records, total pages, and returns metadata (currentPage, pageSize, totalCount).  
This ensures minimal payload and high performance even for large datasets.

## 7. Setup Instructions
### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure dataset in `/data/sales.json`
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Update API base URL in `.env`
4. `npm run dev`

The application will now run locally with full search, filter, sorting, and pagination support.
