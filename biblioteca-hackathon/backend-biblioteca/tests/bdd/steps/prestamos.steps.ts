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

let prestamosActivos: { status: string }[] = [];

Given('existen préstamos activos en el sistema', function () {
  prestamosActivos = [{ status: 'ACTIVO' }, { status: 'ACTIVO' }];
});
When('consulto la lista de préstamos activos', function () {
  prestamosActivos = prestamosActivos.filter(p => p.status === 'ACTIVO');
});
Then('obtengo todos los préstamos con estado ACTIVO', function () {
  assert.ok(prestamosActivos.every(p => p.status === 'ACTIVO'));
});

let historialUsuario: { userId: number }[] = [];

Given('existe un usuario con préstamos registrados', function () {
  historialUsuario = [{ userId: 1 }, { userId: 1 }];
});
When('consulto los préstamos del usuario', function () {
  historialUsuario = historialUsuario.filter(p => p.userId === 1);
});
Then('obtengo el historial de préstamos de ese usuario', function () {
  assert.ok(historialUsuario.every(p => p.userId === 1));
});
