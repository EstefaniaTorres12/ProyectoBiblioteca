Feature: Gestión de préstamos de biblioteca

  Scenario: Registrar préstamo exitoso
    Given existe un usuario registrado
    And existe un libro disponible
    When registro el préstamo del libro al usuario
    Then el préstamo queda activo
    And el libro reduce su cantidad disponible

  Scenario: Calcular multa por devolución tardía
    Given existe un préstamo vencido hace 3 días
    When registro la devolución
    Then la multa debe ser de 3000
