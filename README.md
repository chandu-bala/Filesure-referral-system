# FileSure – Referral & Credit System (Full Stack)

This is a full-stack implementation of the **FileSure Referral & Credit System**, built as part of a technical assignment.  
The platform allows users to register, share referral links, earn credits when referrals make their first purchase, and track all activity in a clean dashboard.

The system is split into:

- 🎨 **Frontend:** Next.js + TypeScript + Tailwind CSS  
- ⚙️ **Backend:** Node.js + Express + TypeScript + MongoDB  
- 🗄️ **Database:** MongoDB Atlas (or local MongoDB)

---

# 🚀 Project Features

## 🌐 Frontend Features (Next.js)
- Register & Login pages  
- Automatic referral code capture (`?r=CODE`)  
- Protected Dashboard route  
- Display:
  - Credits earned  
  - Referred users count  
  - Converted users count  
  - Referral link with “Copy” button  
- Purchase simulation button  
- Logout functionality  
- Zustand store for session management  
- Built with Tailwind CSS v4

---

## 🔧 Backend Features (Node.js)
- Auth: Register/Login with hashed passwords  
- User referral code generation  
- Referral tracking (pending → converted)  
- MongoDB transactions to credit users safely   
- Idempotency keys to prevent duplicate purchase processing  
- Dashboard API providing metrics and referral list  
- JWT-protected routes  
- Modular & scalable architecture  

---

# 🧱 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand


### **Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- MongoDB Transactions


---


# ⚙️ Environment Setup
Each folder contains its own README with detailed instructions.


You must create **two environment files**:

---

# ▶️ Running the App Locally

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/chandu-bala/Filesure-referral-system
```
```bash
cd FileSure-Referral-System
```

## 2️⃣ Setup Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs at:
👉 http://localhost:5000

## 3️⃣ Setup Frontend

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
👉 http://localhost:3000

---

# 🛰️ API Overview 
🔐 AUTH

POST /api/auth/register — Register user

POST /api/auth/login — Login user

📊 DASHBOARD : 

GET /api/dashboard

