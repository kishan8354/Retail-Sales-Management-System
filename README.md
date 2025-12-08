# Retail Sales Management System
<img width="1916" height="799" alt="image" src="https://github.com/user-attachments/assets/f093bab0-b415-4f29-8a40-138be6140d08" />

## 1. Overview
The Retail Sales Management System is a full-stack application designed to search, filter, sort, and paginate large-scale retail sales data.  
It demonstrates production-grade architecture with a clean separation of concerns across backend, frontend, and database layers.  
The system uses a Supabase PostgreSQL database for real-time querying and Express.js for robust API logic.

---

## 2. Tech Stack

### **Frontend**
- React (Vite)
- JavaScript (or TypeScript-ready)
- Tailwind CSS
- Axios for API communication

### **Backend**
- Node.js + Express.js
- Supabase PostgreSQL
- Supabase JavaScript SDK

### **Tools & Utilities**
- CORS, Morgan Logger
- ESLint, Prettier (optional)
- Render / Vercel for deployment

---

## 3. Search Implementation Summary
- Full-text search implemented on **Customer Name** and **Phone Number**.  
- Search is **case-insensitive** using Supabase `.ilike()` queries.  
- Backend bundles search into OR conditions using Supabase `.or()` syntax.  
- Works alongside all filters, sorting, and pagination.  
- Frontend debounces user input before firing API calls.

---

## 4. Filter Implementation Summary
System supports the following filters:

- Customer Region (multi-select)  
- Gender  
- Product Category  
- Tags (multi-select, partial match)  
- Payment Method  
- Age Range  
- Date Range  

Backend applies filters using:
- `.in()` for multi-select  
- `.gte()` / `.lte()` for numeric or date ranges  
- `.or()` for tag matching and multi-field conditions  

All filters are combined using **AND logic**, ensuring accurate narrowing of records.

---

## 5. Sorting Implementation Summary
Sorting is supported for:

| Frontend Sort Key | Database Column |
|-------------------|------------------|
| `date`            | `Date` |
| `quantity`        | `Quantity` |
| `name`            | `Customer Name` |

Backend maps frontend sort keys to exact Supabase DB columns and performs:
### Sorting Compatibility
Sorting is fully compatible with:
- **Search**
- **All Filters**
- **Pagination**

Sorting does not break or reset active filters or search queries.  
Every sort request returns the correct page and maintains consistent ordering.

---

## 6. Pagination Implementation Summary

Pagination uses the **limit–offset model**, powered by Supabase:

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
## Live URLs

**Frontend:**  
https://retail-sales-management-system-uin1.onrender.com/

**Backend:**  
https://retail-sales-management-system1.onrender.com/

