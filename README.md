# Kharcha Paani — React Admin Portal

A modern, responsive, production-ready admin panel for **Kharcha Paani**, the shared household expense, group, and settlement mobile application.

The admin panel provides administrative monitoring, user account inspection, household group auditing, and financial transaction analytics without modifying the Flutter mobile app's underlying business logic.

---

## 🛠️ Technology Stack

- **Frontend Core:** React 19, JavaScript (ES6+), Vite 8
- **Routing:** React Router DOM v7 (protected routes & SPA navigation)
- **Styling:** Tailwind CSS v4, custom theme tokens & micro-interactions
- **Icons & Visuals:** Lucide React, Google Fonts (`Inter` & `Plus Jakarta Sans`)
- **Data Visualizations:** Recharts (responsive theme-adaptive area & line trends)
- **Forms & Validation:** React Hook Form + Zod validation
- **Backend:** Firebase Authentication & Cloud Firestore (Client SDK + Admin SDK scripts)
- **Hosting:** Firebase Hosting with SPA rewrite rules

---

## 🏛️ Firestore Database Architecture

The admin panel connects directly to the companion Flutter app's Firestore database:

1. **`users` (Collection):**
   - Fields: `name`, `email`, `photoUrl`, `createdAt` (Timestamp), `isAdmin` (boolean)
2. **`households` (Collection — groups):**
   - Fields: `name`, `category`, `inviteCode`, `memberCount`, `memberIds` (array of UIDs), `createdBy` (UID), `createdAt` (Timestamp), `isActive`
   - Subcollections:
     - **`members/{memberId}`**: `name`, `email`, `role` (`owner` | `member`), `joinedAt`
     - **`expenses/{expenseId}`**: `title`, `amount`, `category`, `splitType`, `date`, `createdAt`, `paidBy` (UID), `participants` (array of UIDs), `notes`
     - **`settlements/{settlementId}`**: `amount`, `fromUser`, `toUser`, `status` (`completed`), `createdAt`
3. **`collectionGroup('expenses')`**:
   - Cross-household expense querying for global financial auditing.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=kharchapaani-890b8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kharchapaani-890b8
VITE_FIREBASE_STORAGE_BUCKET=kharchapaani-890b8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1089147910214
VITE_FIREBASE_APP_ID=1:1089147910214:web:...
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

---

## 🔐 Administrator Authentication & Custom Claims

To protect sensitive user and household data, access requires the Firebase custom claim:
```json
{ "admin": true }
```

### Assigning Admin Privileges
1. Download your service account key from **Firebase Console > Project Settings > Service accounts > Generate new private key**.
2. Save it as `service-account.json` in the root folder *(already in `.gitignore`)*.
3. Run the bootstrap script:
```bash
npm run set-admin your-admin-email@gmail.com
```

### Existing Verified Admin Account:
- **Email:** `rahul77478@gmail.com`
- **Password:** `RahulKP@123`

---

## 📱 Features Overview

- **Dashboard (`/dashboard`):** Real-time aggregation cards for registered users, active households, total expense transactions, and cumulative recorded volume. Includes Recharts area charts with date trends and quick feeds.
- **User Management (`/users`):** Paginated user table, real-time search, UID lookup, active/admin badges, and profile detail views with associated household links.
- **Household Management (`/groups`):** Inspect shared expense groups, invite codes, member counts, and a tabbed inspector for:
  - Household expense ledgers
  - Member directories with roles
  - Settlement payment history
- **Expense Audit (`/expenses`):** Global transaction feed with INR (`₹`) formatting, category filters (`Grocery`, `Other`, etc.), search, and split participant audit badges.
- **Dark Obsidian & Light Mode:** One-click toggle in the header and persistent appearance cards in Settings.
- **Smooth Animations:** Page entry animations (`animate-page-enter`), card hover lifts, button presses, and ambient loading pulses.

---

## 🔒 Security Rules (`firestore.rules`)

Deploy or paste [`firestore.rules`](file:///c:/Users/rahul/kharcha-paani-admin/firestore.rules) into the Firebase Console. The rules ensure:
- Normal mobile app users can only access households they belong to.
- Only users with verified `request.auth.token.admin == true` can audit global data and run collection group queries.
- Destructive admin operations are blocked on the client side.

---

## 🌐 Production Deployment

### 1. Build Production Bundle
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```
*(SPA URL rewrites and caching headers are pre-configured in `firebase.json`).*
