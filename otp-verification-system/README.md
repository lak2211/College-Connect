# Email OTP Verification System (Node.js + Express)

A fully functional Email OTP Verification system with Gmail SMTP and a modern HTML/CSS/JS frontend.

## 🚀 Setup Guide

### 1. Gmail SMTP Setup (VERY IMPORTANT)
To send emails from your Gmail account, you must create an **App Password**.
1.  Go to your [Google Account Settings](https://myaccount.google.com/).
2.  Enable **2-Step Verification** (if not already enabled).
3.  Search for **"App Passwords"** in the search bar.
4.  Enter a name for the app (e.g., "NodeOTP") and click **Create**.
5.  Copy the **16-digit code** provided. This is your `EMAIL_PASS`.

### 2. Configure Backend
1.  Open the `backend/.env` file.
2.  Update the following fields:
    ```env
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="your-16-digit-app-password"
    ```
3.  Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/otp_demo_db`.

### 3. Run the Project
1.  Open a terminal in the `backend/` directory.
2.  Run `npm install` (if not already done).
3.  Run `npm start` (starts the server with nodemon).
4.  Open `frontend/index.html` in your browser. (You can use Live Server or just open the file).

### 4. Testing
1.  **Test Email Connection:** Open `http://localhost:5000/api/test-email` in your browser.
2.  Check the terminal: If you see "Gmail SMTP Server is ready", the setup is correct.
3.  Enter your email in the UI and click **Send OTP**.
4.  Check your inbox (and spam folder) for the 6-digit code.

---

## 🛠 Tech Stack & Logic
- **Backend:** Node.js, Express, Mongoose, Nodemailer, Bcryptjs.
- **Frontend:** Vanilla HTML, CSS, JavaScript (Inter Font, Responsive Design).
- **OTP Logic:**
  - 6-digit random code generation.
  - 5-minute expiry (MongoDB TTL index).
  - Max 5 verification attempts before blocking.
  - 30-second cooldown for resend.
- **Security:**
  - Environment variables for secrets.
  - Brute force protection through attempt limits.
  - Rate limiting logic on resend.

## 📂 Folder Structure
```text
otp-verification-system/
├── backend/
│   ├── config/          # DB and SMTP config
│   ├── controllers/     # OTP logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── .env             # Secrets
│   └── server.js        # Entry point
└── frontend/
    ├── index.html       # UI
    ├── style.css        # Styling
    └── script.js        # Logic
```

## ⚠️ Troubleshooting
- **Error: "Invalid Login"**: Ensure you are using an **App Password**, NOT your regular Gmail password.
- **Error: "Connection Refused"**: Ensure MongoDB is running.
- **Error: "CORS"**: Ensure the backend server is running; CORS is enabled by default in `server.js`.
