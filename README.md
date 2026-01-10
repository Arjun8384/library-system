# Library Management System

A MERN stack library management system with admin and user roles.

## Project Structure

\`\`\`
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── index.js
│   └── package.json
\`\`\`

## Features

### Admin
- Add/Update Books (Book or Movie type)
- Add/Update Membership (6 months, 1 year, 2 years)
- User Management (New/Existing users)
- All Transaction features
- View all Reports

### User
- Book Available Search
- Book Issue
- Return Book
- Pay Fine
- View personal Reports

## Setup

### Prerequisites
- Node.js
- MongoDB

### Server Setup
\`\`\`bash
cd server
npm install
cp .env.example .env
npm run dev
\`\`\`

### Client Setup
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Default Credentials

After clicking "Initialize Sample Data" on admin dashboard:

- Admin: arjunsingh@gmail.com / admin123
- User: user@library.com / user123

## API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/seed

### Books
- GET /api/books
- GET /api/books/available
- POST /api/books
- PUT /api/books/:serialNo
- POST /api/books/seed

### Users
- GET /api/users
- POST /api/users
- PUT /api/users/:id

### Membership
- POST /api/membership
- GET /api/membership/:membershipNumber
- PUT /api/membership/:membershipNumber

### Transactions
- POST /api/transactions/issue
- GET /api/transactions/issued
- POST /api/transactions/return
- GET /api/transactions/pending-fines
- POST /api/transactions/pay-fine

### Reports
- GET /api/reports/transactions
- GET /api/reports/books
- GET /api/reports/memberships
