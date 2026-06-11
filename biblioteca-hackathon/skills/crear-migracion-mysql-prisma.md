# Skill: crear migración MySQL con Prisma

## Objetivo
Modificar el modelo de datos de forma controlada.

## Pasos
1. Editar `prisma/schema.prisma`.
2. Validar relaciones e índices.
3. Ejecutar `npx prisma migrate dev --name descripcion_cambio`.
4. Ejecutar `npx prisma generate`.
5. Actualizar `database-biblioteca/init.sql` si aplica.
6. Actualizar documentación del modelo.
