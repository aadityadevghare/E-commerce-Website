# AURA — Modern E-Commerce Platform

AURA is a high-performance, full-stack e-commerce web application built using **HTML5**, **Vanilla CSS3**, **Vanilla JavaScript**, **Node.js**, **Express.js**, and **SQLite**. It features a modern design system, real-time product discovery, persistent shopping cart management, user authentication with password hashing, and server-side validated order processing.

---

## 🌟 Key Features

- **Product Discovery & Listings**: Live search, category filtering (Electronics, Fashion, Accessories, Home & Lifestyle), price filtering, and sorting (Featured, Price Low/High, Rating, Newest).
- **Product Details**: Dynamic product views with stock indicators, quantity selectors, specs, and related product recommendations.
- **Shopping Cart**: Real-time quantity adjustments, price calculations, free shipping thresholds, and cart badge updates.
- **User Authentication**: Secure registration and login using `bcryptjs` password hashing and JWT token authentication.
- **Order Processing & Server Calculation**: Server-side total calculation, stock reduction, order receipt generation, and persistent SQLite database storage.
- **User Account Dashboard**: Order history tracking, status badges (Confirmed, Processing, Shipped, Delivered), and profile management.
- **Responsive Design System**: Custom Vanilla CSS framework supporting desktop, tablet, and mobile screens (1440px down to 375px).
- **Toast Notifications & Empty States**: Polished UI feedback for user interactions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3 (Custom Design System), Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 (Persistent file database in `database/store.db`) |
| **Auth & Security** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), Cookie Parser |

---

## 📁 Directory Structure

```
E-Commerce Website/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── package.json              # Dependencies and scripts
├── README.md                 # Documentation
├── database/                 # SQLite database files
│   └── store.db              # SQLite Database (Generated on seed)
├── server/                   # Backend Express codebase
│   ├── app.js                # Server entry point & static middleware
│   ├── database/
│   │   ├── db.js             # SQLite driver connection & async helpers
│   │   └── seed.js           # Database initialization & 16 seed products
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── errorHandler.js   # Centralized error handler
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── products.js       # Products routes
│   │   ├── cart.js           # Cart routes
│   │   └── orders.js         # Orders routes
│   └── controllers/
│       ├── authController.js # Authentication logic
│       ├── productsController.js # Product catalog logic
│       ├── cartController.js # Cart state logic
│       └── ordersController.js # Order checkout & stock logic
└── public/                   # Frontend static site assets
    ├── css/
    │   └── main.css          # Design system, CSS variables & layouts
    ├── js/
    │   ├── api.js            # Fetch API client helper
    │   ├── toast.js          # Toast notifications library
    │   ├── nav.js            # Header & auth state manager
    │   ├── home.js           # Home page logic
    │   ├── shop.js           # Shop page logic
    │   ├── product-details.js# Product detail logic
    │   ├── cart.js           # Cart page logic
    │   ├── checkout.js       # Checkout form logic
    │   ├── auth.js           # Login & registration logic
    │   └── account.js        # Account dashboard logic
    ├── index.html            # Home page
    ├── shop.html             # Shop / Product discovery page
    ├── product-details.html  # Product details page
    ├── cart.html             # Shopping cart page
    ├── checkout.html         # Checkout page
    ├── login.html            # User login page
    ├── register.html         # User registration page
    ├── account.html          # My account & order history page
    ├── order-confirmation.html # Order confirmation receipt page
    └── 404.html              # 404 page
```

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Run the seed script to create SQLite database tables and seed 16 realistic products and a demo user:
```bash
node server/database/seed.js
```

### 3. Start Server
Run the application server:
```bash
node server/app.js
```

Access the website in your browser at:
**`http://localhost:3000`**

---

## 🔑 Demo Account Credentials

For quick evaluation:
- **Email**: `demo@aura.com`
- **Password**: `Password123`

*(Alternatively, use the "Auto-fill Demo Account" button on `login.html` or register a new user account!)*

---

## 📡 API Endpoint Documentation

### Authentication
- `POST /api/auth/register` — Create new user account.
- `POST /api/auth/login` — Log in user & issue JWT.
- `POST /api/auth/logout` — Clear auth cookie.
- `GET /api/auth/me` — Fetch current user profile.

### Products
- `GET /api/products` — List products with search, category, sort, price filter.
- `GET /api/products/:id` — Fetch single product by ID with related items.

### Cart
- `GET /api/cart` — Get cart items for logged in user.
- `POST /api/cart` — Add product to cart.
- `PUT /api/cart/:id` — Update cart item quantity.
- `DELETE /api/cart/:id` — Remove item from cart.
- `DELETE /api/cart` — Clear all cart items.

### Orders
- `POST /api/orders` — Create new order (verifies stock & computes total on server).
- `GET /api/orders` — List user's order history.
- `GET /api/orders/:id` — Fetch specific order details.

---

## 🔒 Security & Data Integrity

- **Password Security**: Passwords are standard salted and hashed with `bcryptjs`.
- **SQL Injection Prevention**: All queries use parameterized statements (`?`).
- **Server-Side Total Validation**: Cart totals, item prices, and stock checks are strictly computed on the backend server before creating an order.

---

## 🎨 Color System & Palette

- **Primary Charcoal**: `#111827`
- **Primary Action (Royal Blue)**: `#2563EB`
- **Accent (Warm Amber)**: `#F59E0B`
- **Background (Off-White)**: `#F8FAFC`
- **Surface**: `#FFFFFF`
- **Success / Error**: `#16A34A` / `#DC2626`
