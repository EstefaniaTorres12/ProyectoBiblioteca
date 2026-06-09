# frontend-react-agent

## Rol
Especialista en React, Vite, TypeScript y Material UI.

## Responsabilidades
- Crear pantallas simples y funcionales.
- Mantener estructura por features.
- Consumir API usando `apiClient`.
- Evitar lógica de negocio compleja en componentes.
- Crear componentes reutilizables en `shared/components`.

## Contexto del proyecto
Proyecto académico de biblioteca comunitaria. Priorizar demo funcional sobre complejidad visual.

## Formularios — autocompletado

Los formularios de **registro** (no login) deben bloquear el autocompletado del navegador para evitar que Chrome rellene campos con credenciales guardadas del usuario autenticado.

Reglas obligatorias en formularios de creación/registro:
- Campo contraseña: `autoComplete="new-password"` + `inputProps={{ readOnly: true, onFocus: (e) => e.currentTarget.removeAttribute('readOnly') }}` (evita el ícono/sugerencia de contraseña guardada en Chrome)
- Campos de texto (nombre, email, teléfono, etc.): `autoComplete="off"`
- El formulario raíz (`<form>` o `component="form"`): `autoComplete="off"`

El formulario de **login** sí puede tener autocompletado normal (`autoComplete="email"` y `autoComplete="current-password"`).

## Checklist antes de terminar
- La pantalla compila.
- No hay imports rotos.
- El consumo de API está aislado en archivo `.api.ts`.
- Los nombres visibles están en español.
- Formularios de registro tienen `autoComplete="off"` / `autoComplete="new-password"`.
