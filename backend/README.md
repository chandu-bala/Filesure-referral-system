# FileSure Referral & Credit System — Backend

This is the **backend API** for the FileSure Referral & Credit System assignment.  
It provides all core server-side logic required for:

- User Registration & Login  
- Referral tracking  
- Credit reward system  
- Purchase simulation  
- Dashboard metrics  
- Secure authentication  
- Data integrity using MongoDB transactions  
- Idempotency for safe purchase requests  

The backend is built with **Node.js (Express) + TypeScript + MongoDB** and follows a modular, scalable architecture.

---

## 🚀 Core Features

### 🔐 User Authentication
- Register & Login using email + password  
- Password hashing using bcrypt  
- JWT-based authentication  
- Protected routes

### 🧩 Referral System
- Each user gets a unique `referralCode`  
- Users may register with `?r=CODE`  
- Referral relationships stored in database  
- Status tracked as:  
  - `pending`  
  - `converted`  
- Prevents self-referrals  

### 💰 Credit Reward System
- A referred user's **first purchase** triggers:  
  - +2 credits to the referrer  
  - +2 credits to the referred user  
- No double-crediting  
- Uses MongoDB **transactions** for reliability  

### 🛒 Purchase Simulation
- Simulated “Buy Product” action  
- First purchase triggers referral credit if applicable  
- Uses **idempotency keys** to prevent duplicate purchases  

### 📊 Dashboard API
Returns:

- Total referred users  
- Converted users  
- Total credits  
- Referral code  
- Referred users list (email + status)  

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + Mongoose ODM
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT auth
- **MongoDB Transactions** for credit safety
- **cors**, **helmet** for security middleware

---


# ⚙️ Environment Variables

Create a file:

📁 **backend/.env**

Below are the required fields:
```bash
PORT=5000

#MongoDB Atlas or local instance
MONGO_URI=YOUR_MONGODB_URL_HERE

#JWT secret for signing user tokens
JWT_SECRET=YOUR_RANDOM_SECRET_KEY

#Token expiry duration
JWT_EXPIRES_IN=7d

#Frontend origin for CORS
CORS_ORIGIN=http://localhost:3000

#Credits rewarded for referrals
CREDIT_AMOUNT=2
```


---

# ▶️ Installation & Running the Backend

### 1. Install dependencies
```bash
npm install
```
2. Create .env file
(Follow the environment variables listed above.)

3. Start development server
```bash
npm run dev
```
Backend runs at:

👉 http://localhost:5000

---
# 📡 API Routes Overview
## 🧠 How Referral + Credit Logic Works
1️⃣ User A signs up → gets referral code

2️⃣ User B registers using User A’s referral code

→ A Referral { status: "pending" } is created

3️⃣ User B makes their first purchase


Backend:

- Starts a MongoDB transaction

- Checks referral (must be uncredited)

  - Credits:

    - +2 to User A

    - +2 to User B

- Marks referral as converted

- Stores purchase

- Prevents duplicates via idempotency

4️⃣ Dashboard immediately reflects updated metrics

---
## ✔️ Notes

- You must create your own .env file using the values shown above

- Works with MongoDB Atlas or local MongoDB

- Frontend interacts with this backend using:

  - /api/auth

  - /api/dashboard

  - /api/purchases
