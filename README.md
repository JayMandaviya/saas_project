# SaaS Admin Dashboard API

Production-ready backend API for a SaaS Admin Dashboard built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

### Authentication & Security

* JWT Authentication
* Refresh Token Support
* Role-Based Access Control (RBAC)
* Password Hashing with bcrypt
* Rate Limiting
* Helmet Security Middleware
* Input Validation using Zod

### User Management

* User Registration
* User Login
* User Profile Management
* Role Management
* Protected Routes

### API Features

* RESTful API Architecture
* Centralized Error Handling
* Request Validation
* Logging with Winston
* Pagination Support
* Search & Filtering
* File Upload Support

### Database

* PostgreSQL
* Prisma ORM
* Database Migrations
* Seed Support

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Zod
* Winston
* Multer
* Nodemailer

---

## Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── validators/
├── utils/
├── generated/
├── app.ts
└── server.ts

prisma/
├── schema.prisma
└── migrations/
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd saas-admin-api
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

FRONTEND_URL=http://localhost:5173

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npm run prisma:seed
```

---

## Running Locally

Development:

```bash
npm run dev
```

Type Check:

```bash
npm run typecheck
```

Production Build:

```bash
npm run build
```

Start Production Server:

```bash
npm start
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Users

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Dashboard

```http
GET /api/dashboard/stats
GET /api/dashboard/analytics
```

### Health Check

```http
GET /health
```

---

## Deployment

### Backend Hosting

* Render

### Database

* Neon PostgreSQL

### Environment

* Production Ready
* Prisma ORM
* Secure JWT Authentication

---

## Scripts

```bash
npm run dev
npm run build
npm run start

npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run prisma:seed

npm run typecheck
```

---

## Author

Jay Mandaviya

GitHub:
https://github.com/JayMandaviya

---

## License

MIT License
