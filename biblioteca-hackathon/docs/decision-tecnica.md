# Decisión técnica para explicar en la demo

Se eligió una arquitectura simple por capas en el backend porque permite separar responsabilidades:

- Controller: maneja HTTP.
- Service: contiene reglas de negocio.
- Repository: consulta la base de datos.

Esta decisión facilita probar reglas como cálculo de multa, disponibilidad de libros y devolución de préstamos sin depender directamente de la capa HTTP.
