# STM Shop Management

A full-stack shop management system built for a real family retail business. It replaces paper records with one app that tracks products, sales, purchases, and customer and supplier credit.

Built as both a working tool and a hands-on project to learn the React, Node.js, Express, and MySQL stack.

**Live:** [stm-shop.vercel.app](https://stm-shop.vercel.app)

---

## Features

- **Products / Inventory**: full CRUD with search, sort, filter, and modal forms
- **Customers and Suppliers**: add, edit, and manage records
- **Sales**: multi-item sales form with validation and walk-in customer support
- **Purchases**: record stock purchases, with inline creation of new products and suppliers
- **Customer Credits**: track credit sales, record payments, view payment history and remaining balance
- **Transactions**: sales and purchases run inside database transactions so data stays consistent

---

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Frontend   | React (Vite), CSS Modules, React Router      |
| Backend    | Node.js, Express                             |
| Database   | MySQL 8 (via `mysql2`)                       |
| Validation | express-validator                            |
| Tooling    | dotenv, cors, Postman, Git, Figma, Notion    |

---

## Project Structure

```
stm_shop/
├── Backend/
│   ├── DataBase/
│   │   ├── create_db.sql
│   │   └── schema.sql
│   ├── Src/
│   │   ├── Config/        # db.js (MySQL connection)
│   │   ├── Controllers/   # product, customer, supplier, sale, purchase, credit logic
│   │   ├── Routes/        # Express route files
│   │   └── server.js      # API entry point
│   └── package.json
└── Frontend/
    ├── public/            # logos
    ├── src/
    │   ├── components/    # Header, SideBar
    │   ├── pages/         # Products, Customers, Suppliers, Sales, Purchases,
    │   │                  # Credits, CustomerCredits, SupplierCredits, Dashboard, Report
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.x
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the database

Run the SQL files in `Backend/DataBase/` in MySQL: first `create_db.sql` (creates the `stm_shop` database), then `schema.sql` (creates the tables).

### 3. Run the backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=stm_shop
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

### 4. Run the frontend

```bash
cd Frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## API Overview

| Resource         | Description                               |
| ---------------- | ----------------------------------------- |
| `/products`      | Product CRUD                              |
| `/customers`     | Customer CRUD                             |
| `/suppliers`     | Supplier CRUD                             |
| `/sales`         | Create and view sales                     |
| `/purchases`     | Create and view purchases                 |
| `/sale-credits`  | Customer credit records and payments      |
| `/purchase-credits` | Supplier credit records and payments   |

> Adjust route names to match your actual endpoints.

---

## Design

The UI was designed in Figma with a gold and black theme.

| Use               | Color     |
| ----------------- | --------- |
| Primary accent    | `#F5A623` |
| Sidebar           | `#0D0D0D` |
| Cards             | `#FFFFFF` |
| Background        | `#F5F5F5` |
| Secondary text    | `#A0A0A0` |
| Danger / delete   | `#E53935` |

---

## Lessons Learned

- MySQL rejects ISO dates with a `Z` suffix, so dates are formatted with `.toISOString().split('T')[0]`
- In Express, specific routes (like `/:creditId/payments`) must be registered before generic `/:id` routes
- Inside transactions, use `connection.query`, not `db.query`
- Number vs. string comparisons caused repeated bugs, fixed with `parseFloat()`

---

## Author

**Kirubel**
Computer Science student, Hilcoe School of Computer Science

---

## License

This project is for personal and educational use. Add a license (for example MIT) if you plan to share it publicly.
