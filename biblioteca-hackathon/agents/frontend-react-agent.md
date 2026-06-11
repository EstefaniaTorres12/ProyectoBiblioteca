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

## Dashboard / Pantallas de inicio

La pantalla Home usa un layout de tarjetas (`Card`) con:
- Icono grande de `@mui/icons-material` centrado
- Título (`Typography h5`) y descripción (`body2`)
- Botón `contained` que navega con `useNavigate`
- Hover con `transform: translateY(-6px)` y `boxShadow` mayor
- Layout responsive con `Box display:flex flexWrap:wrap` y `width: { xs: '100%', sm: 260 }`

Importar íconos de `@mui/icons-material` (ya instalado). Nunca usar `fontWeight` como prop directo de `Typography` — va dentro de `sx`.

## Tipografía MUI v6 — reglas

- `fontWeight` va en `sx`: `<Typography sx={{ fontWeight: 700 }}>` ✅  NO como prop directo ❌
- `inputProps` está deprecado en MUI v6 → usar `slotProps={{ htmlInput: {...} }}`
- `InputLabelProps` está deprecado en MUI v6 → usar `slotProps={{ inputLabel: {...} }}`

## Checklist antes de terminar
- La pantalla compila.
- No hay imports rotos.
- El consumo de API está aislado en archivo `.api.ts`.
- Los nombres visibles están en español.
- Formularios de registro tienen `autoComplete="off"` / `autoComplete="new-password"`.
