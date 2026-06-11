Feature: Búsqueda de libros en la biblioteca

  Scenario: Buscar libro por título
    Given existen libros registrados en el sistema
    When busco un libro por título
    Then obtengo los libros que coinciden con el título

  Scenario: Buscar libro por autor
    Given existen libros registrados en el sistema
    When busco un libro por autor
    Then obtengo los libros que coinciden con el autor
