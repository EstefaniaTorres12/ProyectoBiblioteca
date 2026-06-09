# Backend Biblioteca

API REST con Node.js, Express, TypeScript, Prisma y MySQL.

## Instalación

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Endpoints principales

```text
GET    /health
POST   /api/users
GET    /api/users
POST   /api/books
GET    /api/books?search=texto
POST   /api/loans
PATCH  /api/loans/:id/return
GET    /api/loans/active
GET    /api/loans/overdue
GET    /api/loans/user/:userId
GET    /api/loans/book/:bookId/history
```

## Tests

```bash
npm test
npm run test:bdd
```
