# FileSure – Referral & Credit System (Frontend)

This is the **frontend application** for the FileSure Referral & Credit System assignment.  
The goal of this project is to provide a clean, modern, responsive user interface that allows users to:

- Register with or without a referral link  
- Login securely  
- Access a personalized dashboard  
- Copy/share referral links  
- Simulate purchases  
- View referral conversions and earned credits  
- Logout and switch accounts easily

The frontend is built using **Next.js + TypeScript + Tailwind CSS**, ensuring a scalable, maintainable, and clean codebase.

---

## 🚀 Core Features

### 🔐 Authentication UI
- Register and Login pages
- Captures referral code automatically (`?r=CODE`)
- Handles errors and validation
- Stores authenticated user state using Zustand

### 🧭 Dashboard
- Shows user credits
- Shows total referred users
- Shows converted users (successful purchase)
- Displays referral link with “Copy” feature
- Simulate purchase action (communicates with backend)
- Animated UI using Framer Motion
- Protected route (redirects to Login if not logged in)

### 📱 Responsive UI
- Fully mobile-friendly  
- Simple, modern Tailwind design  
- No UI libraries used (as per assignment requirement)

### 🔄 State Management
- Zustand store for user session (token + user data)
- Auto-redirect on logout or token missing

---

## 🛠️ Tech Stack

**Framework:**  
- Next.js 14 (App Router)

**Language:**  
- TypeScript

**Styling:**  
- Tailwind CSS v4  
- Framer Motion (basic animations)

**State Management:**  
- Zustand

**Build Tools:**  
- ESLint (strict rules)  
- Next.js built-in dev tools  

---



## ⚙️ Environment Variables

The frontend uses **1 required environment variable**:

|        Variable           |                    Description                          |
|---------------------------|---------------------------------------------------------|
| `NEXT_PUBLIC_BACKEND_URL` | URL of your backend server (e.g. http://localhost:5000) |


## To configure Create:

- frontend/.env.local
ADD:

```bash 
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```


---

## 🧪 Running the Frontend Locally

Install dependencies:

```bash
npm install 
```
Run the dev server:

```bash
npm run dev
```

---

The app will be available at:

👉 http://localhost:3000

Make sure your backend is running as well.