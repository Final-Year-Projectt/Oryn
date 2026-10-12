# ORYN Backend API

Backend REST API service for **ORYN** — AI-Based Business Problem Identification and Solution Recommendation System.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express 5
- **Database**: PostgreSQL via `pg` connection pool (connecting to hosted PostgreSQL / Prisma schema)
- **Authentication**: JWT (`jsonwebtoken`) with `bcryptjs` password hashing
- **File Parsing**: `multer`, `csv-parser`, `xlsx`
- **HTTP Client**: `axios` (ML Bridge integration)
- **Security & Utilities**: `helmet`, `cors`, `morgan`

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure Node.js (v18+) and PostgreSQL are installed or you have access to the hosted database connection string.

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Configuration
Copy the `.env.example` template:
```bash
cp .env.example .env
```
Update `.env` with your actual database connection string and secret keys:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
JWT_SECRET="your_secure_jwt_secret"
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Run the Server
```bash
# Development mode (auto-reload with nodemon)
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` — Service health and timestamp check

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new user (`{ name, email, password }`)
- `POST /api/v1/auth/login` — Login with credentials, returns JWT token (`{ email, password }`)

### Business Workspace (`/api/v1/business`)
*(Requires Bearer JWT in `Authorization` header)*
- `POST /api/v1/business` — Create a business profile and automatically link user as `ADMIN` (`{ name / businessName }`)
- `GET /api/v1/business/me` — Retrieve the authenticated user's own business profile
- `GET /api/v1/business/:id` — Retrieve business details by UUID (membership required)

### Data Ingestion (`/api/v1/data`)
*(Requires Bearer JWT in `Authorization` header)*
- `POST /api/v1/data/upload` — Upload CSV/XLS/XLSX business dataset (`file`, `business_id`)
- `GET /api/v1/data/:businessId` — Paginated data records for a business
- `GET /api/v1/data/:businessId/summary` — Summary statistics of ingested business data

### Analysis & Recommendations (`/api/v1`)
*(Requires Bearer JWT in `Authorization` header)*
- `POST /api/v1/analysis/:businessId/run` — Run KPI calculations, ML bridge inference, and rule-based problem detection
- `GET /api/v1/analysis/:businessId` — Get full analysis report, latest KPIs, and ML model status
- `GET /api/v1/problems/:businessId` — Fetch detected problems ordered by severity
- `GET /api/v1/recommendations/:businessId` — Fetch actionable recommendations ordered by priority
- `POST /api/v1/analysis/:businessId/chat` — Context-aware AI assistant consultation

---

## 📌 Status & Current Roadmap

- **Authentication & User Management**: ✅ **Migrated**. Fully aligned with the Prisma schema (`"User"` table with UUID primary keys, camelCase columns, and bcrypt password hashing).
- **Business Profile & Membership**: ✅ **Migrated**. Fully aligned with the Prisma schema (`"Business"`, `"BusinessMember"`, and `"Role"` tables with transactional workspace and role creation).
- **Data Ingestion, KPI Engine & Analysis Pipelines**: ⚠️ **Pending Schema Expansion**. The controllers, models, and service logic are fully implemented and tested, but currently target legacy flat tables (`business_data`, `problems`, `recommendations`). These endpoints require corresponding tables (e.g. `BusinessData`, `Problem`, `Recommendation`) to be added to the shared Prisma schema by the database owner before they can operate on the live hosted database.
