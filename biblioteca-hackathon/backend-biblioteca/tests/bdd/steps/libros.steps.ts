import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

let catalogoLibros: { title: string; author: string }[] = [];
let resultadoBusqueda: { title: string; author: string }[] = [];

Given('existen libros registrados en el sistema', function () {
  catalogoLibros = [
    { title: 'Clean Code', author: 'Robert Martin' },
    { title: 'Design Patterns', author: 'Gang of Four' },
  ];
});

When('busco un libro por título', function () {
  resultadoBusqueda = catalogoLibros.filter(b => b.title.includes('Clean'));
});

Then('obtengo los libros que coinciden con el título', function () {
  assert.ok(resultadoBusqueda.length > 0);
  assert.ok(resultadoBusqueda.every(b => b.title.includes('Clean')));
});

When('busco un libro por autor', function () {
  resultadoBusqueda = catalogoLibros.filter(b => b.author.includes('Martin'));
});

Then('obtengo los libros que coinciden con el autor', function () {
  assert.ok(resultadoBusqueda.length > 0);
  assert.ok(resultadoBusqueda.every(b => b.author.includes('Martin')));
});
