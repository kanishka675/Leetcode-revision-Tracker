# 🧠 Smart LeetCode Revision Tracker

A full-stack MERN application to track LeetCode problems and schedule revisions using the **SM-2 spaced repetition algorithm**.

## ✨ Features

- 🔐 JWT authentication (register/login)
- ➕ Add & manage solved problems with topics, difficulty, and notes
- 🔁 Spaced repetition revision scheduler (SM-2 algorithm)
- 📊 Dashboard with topic distribution chart & difficulty breakdown
- 🔍 Filter problems by topic, difficulty, and search
- 📱 Fully responsive dark UI

---

## 🛠️ Tech Stack

| Layer     | Technology                      |
|-----------|----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS  |
| Backend   | Node.js + Express               |
| Database  | MongoDB + Mongoose              |
| Auth      | JWT + bcryptjs                  |
| Charts    | Recharts                        |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongodb://localhost:27017`)

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Environment

The backend `.env` is already set up:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leetcode-tracker
JWT_SECRET=supersecret_jwt_key_change_in_production
```
> ⚠️ **Change `JWT_SECRET`** to a strong secret in production!

---

### 3. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Structure

```
smart-leetcode-tracker/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # authController, problemController, dashboardController
│   ├── middleware/        # JWT authMiddleware
│   ├── models/            # User, Problem (with SM-2 fields)
│   ├── routes/            # authRoutes, problemRoutes, dashboardRoutes
│   ├── utils/             # spacedRepetition.js (SM-2 algorithm)
│   └── server.js
└── frontend/
    └── src/
        ├── api/           # axiosInstance.js
        ├── components/    # Navbar
        ├── context/       # AuthContext
        └── pages/         # Login, Register, Dashboard, Problems, AddProblem, Review
```

---

## 🔁 SM-2 Spaced Repetition

After reviewing a problem, rate your recall (0–5):

| Rating | Meaning         |
|--------|-----------------|
| 0-1    | Failed — reset  |
| 2-3    | Hard — shorter interval |
| 4-5    | Good/Perfect — longer interval |

The algorithm adjusts the `easeFactor` and `interval` to schedule the next revision date automatically.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/problems` | Get all problems (filter: topic, difficulty, search) |
| POST | `/api/problems` | Add problem |
| PUT | `/api/problems/:id` | Update problem |
| DELETE | `/api/problems/:id` | Delete problem |
| GET | `/api/problems/due` | Problems due for revision |
| POST | `/api/problems/:id/review` | Submit SM-2 rating |
| GET | `/api/dashboard` | Dashboard stats |
