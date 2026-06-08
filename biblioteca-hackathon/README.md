# Biblioteca Hackathon Académico

Sistema de gestión de préstamos para una biblioteca comunitaria.

## Stack propuesto

- Frontend: React + Vite + TypeScript + Material UI
- Backend: Node.js + Express + TypeScript + Prisma
- Base de datos: MySQL 8
- Testing: Jest + Supertest + Cucumber/Gherkin
- DevOps: Docker Compose
- IA: Claude Code con CLAUDE.md, agentes y skills especializados

## Estructura

```bash
biblioteca-hackathon/
├── frontend-biblioteca/
├── backend-biblioteca/
├── database-biblioteca/
├── docs/
├── agents/
├── skills/
├── docker-compose.yml
└── CLAUDE.md
```

## Levantar todo con Docker

```bash
cp .env.example .env
docker compose up --build
```

Servicios:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- MySQL: localhost:3306

## Ejecutar backend local

```bash
cd backend-biblioteca
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Ejecutar frontend local

```bash
cd frontend-biblioteca
npm install
npm run dev
```

## Tests backend

```bash
cd backend-biblioteca
npm test
```

## Requisitos cubiertos

- Registrar préstamo de libro a usuario
- Registrar devolución de libro
- Consultar libros prestados actualmente
- Consultar préstamos por usuario
- Alertar préstamos vencidos
- Historial de préstamos de un libro
- Calcular multa por días de retraso
- Buscar libro por título o autor
