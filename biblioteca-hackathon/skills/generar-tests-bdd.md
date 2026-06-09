# Skill: generar tests BDD

## Objetivo
Crear escenarios BDD claros para funcionalidades del negocio.

## Formato
Usar Given / When / Then.

## Reglas
- Cada escenario debe validar una regla de negocio.
- Evitar pasos ambiguos.
- Mantener lenguaje cercano al usuario final.

## Ejemplo
Feature: Gestión de préstamos
Scenario: No prestar libro sin disponibilidad
Given existe un libro sin ejemplares disponibles
When intento registrar un préstamo
Then el sistema rechaza la operación
