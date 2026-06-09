# Requisitos funcionales

## Core

1. Registrar préstamo de libro a usuario.
2. Registrar devolución de libro.
3. Consultar libros prestados actualmente.
4. Consultar préstamos por usuario.

## Adicionales

1. Alertar libros con devolución vencida.
2. Historial de préstamos de un libro.
3. Calcular multa por días de retraso.
4. Buscar libro por título o autor.

## Reglas de negocio propuestas

- Un libro solo puede prestarse si `availableQuantity > 0`.
- Al prestar un libro, se reduce `availableQuantity` en 1.
- Al devolver un libro, se incrementa `availableQuantity` en 1.
- El préstamo por defecto dura 7 días.
- La multa por defecto es de 1000 por día de retraso.
- Un préstamo devuelto no puede devolverse nuevamente.
