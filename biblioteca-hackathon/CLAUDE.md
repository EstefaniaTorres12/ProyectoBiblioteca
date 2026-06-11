# CLAUDE.md - Biblioteca Hackathon

## Objetivo del proyecto
Construir un sistema de gestión de préstamos para una biblioteca comunitaria, con frontend React, backend Node.js y base de datos MySQL.

## Prioridades
1. Cumplir requisitos core de la hackathon.
2. Mantener código simple, demostrable y testeable.
3. Escribir o actualizar tests antes de modificar lógica crítica.
4. Minimizar cambios grandes innecesarios.
5. Respetar estructura por capas y módulos.

## Reglas para Claude Code
- Antes de modificar, leer archivos relevantes.
- No reescribir todo el proyecto si solo se requiere un cambio pequeño.
- Mantener nombres en español para entidades del dominio: Libro, Usuario, Prestamo, Multa.
- Mantener nombres técnicos estándar en inglés cuando aplique: controller, service, repository, dto, routes.
- Generar tests para cada caso de negocio nuevo.
- No introducir librerías nuevas sin justificarlo.
- Actualizar README si cambia la forma de ejecutar el proyecto.

## Arquitectura backend
Capas:
- routes: definición de rutas HTTP.
- controllers: entrada/salida HTTP.
- services: reglas de negocio.
- repositories: acceso a datos con Prisma.
- validators: validaciones Zod.
- middlewares: auth, errores, logs.

## Arquitectura frontend
Estructura por features:
- features/books
- features/users
- features/loans
- shared/api
- shared/components
- shared/layout

## Comandos principales
Backend:
```bash
npm run dev
npm test
npm run build
npx prisma migrate dev
```

Frontend:
```bash
npm run dev
npm run build
npm run lint
```

Docker:
```bash
docker compose up --build
```

## Definition of Done
- Código compila.
- Tests pasan.
- Endpoint o pantalla documentado.
- Manejo de errores incluido.
- No quedan datos quemados innecesarios.
