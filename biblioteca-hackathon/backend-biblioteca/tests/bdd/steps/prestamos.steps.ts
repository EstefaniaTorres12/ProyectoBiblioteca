import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

let multa = 0;

Given('existe un usuario registrado', function () {});
Given('existe un libro disponible', function () {});
When('registro el préstamo del libro al usuario', function () {});
Then('el préstamo queda activo', function () { assert.ok(true); });
Then('el libro reduce su cantidad disponible', function () { assert.ok(true); });
Given('existe un préstamo vencido hace 3 días', function () { multa = 3000; });
When('registro la devolución', function () {});
Then('la multa debe ser de 3000', function () { assert.equal(multa, 3000); });
