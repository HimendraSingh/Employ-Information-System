# IFFCO Phulpur - Employee Information System (EIS)

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to manage employee directory records, plant analytics, workforce shifts, and monthly payroll slips for industrial plants (styled after IFFCO Phulpur Unit). Built with clean, student-friendly, maintainable code.

---

## 🌟 Key Features

- **Admin Authentication**: Secure registration and login using salted password hashing (`bcryptjs`) and stateless token verification (`jsonwebtoken`).
- **Protected Client Routes**: React Router `ProtectedRoute` component preventing unauthenticated access to system pages.
- **Full Employee CRUD**:
  - View employee directory with plant department badges and assigned plant shifts.
  - Add new workers/engineers with custom joining date, department, shift, and salary.
  - Edit existing records with pre-filled forms.
  - Delete records with client-side confirmation dialogs.
- **📊 Plant Analytics & Workforce Insights**:
  - Live summary cards: Total Workforce, Monthly Payroll Budget (₹), Average Salary (₹), and Operating Plant Divisions.
  - Department-wise workforce distribution progress bars with live percentages.
  - Plant shift distribution summary (Shift A Morning, Shift B Evening, Shift C Night, General Shift).
- **📥 1-Click Excel / CSV Export**:
  - Download full plant employee roster as a UTF-8 formatted CSV file (`IFFCO_Phulpur_Employees_Report.csv`) compatible with Microsoft Excel and Google Sheets.
- **📄 Monthly Salary Slip (Pay Slip) Generator & PDF Print**:
  - Official IFFCO Phulpur Unit salary certificate modal.
  - Detailed breakdown of Basic Pay (50%), HRA (20%), DA (20%), Conveyance Allowance (10%), PF Deductions (12%), Professional Tax, Gross Earnings, and Net Take-Home Pay.
  - Native print and PDF export with print-optimized CSS layout.
- **Search & Department Filtering**:
  - Real-time case-insensitive search by employee name.
  - Department dropdown filter (`Production`, `Systems`, `HR`, `Finance`, `Safety`, `Store`).
- **Server-Side Pagination**:
  - MongoDB `skip()` and `limit()` implementation with total records and page calculations.
- **Robust 4-State UI Handling**:
  - **Loading**: Clean CSS spinner during async network fetches.
  - **Error**: Informative error banner with a one-click **Retry** button.
  - **Empty**: Contextual notice when no records match filter criteria.
  - **Success**: Data table formatted with Indian currency (₹) and localized dates (`DD/MM/YYYY`).
- **Dual-Layer Validation**:
  - Frontend: 10-digit phone number check, email regex, required fields, and non-negative salary.
  - Backend: Mongoose schema constraints, unique email check, and HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`).
- **Self-Contained Local Persistent Database**:
  - Integrated local MongoDB engine storing data on disk (`backend/data/`). Zero external Atlas account or network configuration required for local running.
- **Automated Backend Testing**: 5 integration test cases covering auth, validation, protected routes, and CRUD with `Jest` and `Supertest`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, React Router DOM v6, Plain CSS.
- **Backend**: Node.js, Express.js, CORS, Dotenv.
- **Database**: Local Persistent MongoDB engine (with optional MongoDB Atlas cloud support) with Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT), bcryptjs.
- **Testing**: Jest, Supertest.
- **Deployment Ready**: Render (Backend), Netlify (Frontend), MongoDB Atlas (Database).

---

## 📁 Project Structure

```text
Employ Information System/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Admin registration and login
│   │   └── employeeController.js   # Employee CRUD, stats, export & pagination
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── models/
│   │   ├── Admin.js                # Admin schema (name, email, password)
│   │   └── Employee.js             # Employee schema with enums & shifts
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   └── employeeRoutes.js       # /api/employees routes (with /stats & /export)
│   ├── tests/
│   │   └── api.test.js             # 5 Jest + Supertest integration tests
│   ├── app.js                      # Express configuration (for test & server)
│   ├── db.js                       # Local persistent MongoDB + Atlas connector
│   ├── package.json
│   ├── server.js                   # Application server entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── _redirects              # Netlify client-side routing redirect
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx    # Shared form for Add and Edit (with shifts)
│   │   │   ├── EmployeeTable.jsx   # Directory table with Pay Slip & action buttons
│   │   │   ├── PaySlipModal.jsx    # IFFCO Monthly Salary Certificate modal with print
│   │   │   ├── PlantAnalytics.jsx  # Visual cards & department distribution progress bars
│   │   │   └── ProtectedRoute.jsx  # Auth route guard
│   │   ├── pages/
│   │   │   ├── AddEmployee.jsx     # Add employee screen
│   │   │   ├── Dashboard.jsx       # Main directory with analytics, export & table
│   │   │   ├── EditEmployee.jsx    # Pre-filled edit screen
│   │   │   └── Login.jsx           # Admin login screen
│   │   ├── App.css                 # Plain CSS styling with print media support
│   │   ├── App.jsx                 # Routes definition
│   │   ├── config.js               # Environment-aware API URL
│   │   └── main.jsx
│   ├── netlify.toml                # Netlify build configuration
│   ├── package.json
│   └── vite.config.js              # Dev proxy configuration
└── README.md
```

---

## 🚀 Running Locally on Windows

### 1. Default Admin Login
- **Email:** `admin@iffco.in`
- **Password:** `plantpassword123`

### 2. Start Backend
```powershell
cd "backend"
npm run dev
```

### 3. Start Frontend
```powershell
cd "frontend"
npm run dev
```
Open **`http://localhost:5173`** in your browser!

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Diagnostic server health check | No |
| `POST` | `/api/auth/register` | Register new Admin | No |
| `POST` | `/api/auth/login` | Login Admin and receive JWT | No |
| `GET` | `/api/employees/stats` | Workforce metrics, payroll budget & distribution | **Yes (Bearer Token)** |
| `GET` | `/api/employees/export`| Fetch all employee records for CSV generation | **Yes (Bearer Token)** |
| `GET` | `/api/employees` | Get paginated/filtered employee list | **Yes (Bearer Token)** |
| `GET` | `/api/employees/:id` | Get single employee by ID | **Yes (Bearer Token)** |
| `POST` | `/api/employees` | Add a new employee | **Yes (Bearer Token)** |
| `PUT` | `/api/employees/:id` | Update employee by ID | **Yes (Bearer Token)** |
| `DELETE`| `/api/employees/:id` | Delete employee by ID | **Yes (Bearer Token)** |

---

## 📄 License
ISC License — Created for educational purpose (B.Tech CSE Project) .
