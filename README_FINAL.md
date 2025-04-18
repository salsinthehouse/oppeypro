# 🧡 Oppy Prototype

Welcome to the official prototype of **Oppy** – an online marketplace connecting New Zealand op shops with local customers. This project enables vendors to list second-hand items and customers to browse, hold, and subscribe for extra features.

---

## 🚀 Features

### 👤 Customer Side
- Register/Login (Email & Google OAuth)
- Browse listed items
- Search by name, description, and quadrant
- Hold items for 24 hours with a view time
- Subscribe to reveal item locations via Stripe

### 🛍️ Vendor Side
- Register/Login
- Upload up to 30 items
- View their own inventory and see item hold status

### ⚙️ Admin & Backend
- AWS Cognito-based authentication with group roles
- MongoDB for vendor/customer/item/hold data
- Stripe webhook listener and subscription flow
- Role-based access control middleware

---

## 🧱 Tech Stack

| Layer        | Tech |
|--------------|------|
| Frontend     | React (Vite) |
| Backend      | Node.js (Express) |
| Auth         | AWS Cognito |
| Payments     | Stripe Subscriptions |
| Database     | MongoDB Atlas |
| Hosting (Prod) | S3/CloudFront & EC2 (planned) |

---

## 🧪 Local Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/salsinthehouse/oppeypro.git
   cd oppypro
   ```

2. **Set Environment Variables**
   Create a `.env` file in `oppy-backend/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   COGNITO_CLIENT_ID=your_cognito_client_id
   COGNITO_USER_POOL_ID=your_user_pool_id
   COGNITO_REGION=ap-southeast-2
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Run Backend**
   ```bash
   cd oppy-backend
   node server.js
   ```

4. **Run Frontend**
   ```bash
   cd oppy-frontend
   npm install
   npm run dev
   ```

5. **Listen to Stripe Webhooks**
   From:
   `C:\Users\sala_\Downloads\stripe_1.26.1_windows_x86_64`
   ```bash
   .\stripe.exe listen --forward-to localhost:5000/webhook
   ```

---

## ✅ Final TODOs

- [x] Confirm all routes protected with verifyToken
- [x] Test Stripe subscriptions and webhook
- [x] Confirm item hold logic (auto-expire)
- [x] Push latest code to GitHub
- [ ] Deploy (optional)
- [ ] Add customer review system (optional)

---

### 📅 Completed on: 18 April 2025

---

🧡 Built with care by Sala and Oppy Dev Support