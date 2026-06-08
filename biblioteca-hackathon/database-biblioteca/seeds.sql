USE biblioteca_db;

INSERT INTO User (name, email, phone) VALUES
('Ana Pérez', 'ana.perez@example.com', '3001234567'),
('Carlos Gómez', 'carlos.gomez@example.com', '3017654321')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO Book (title, author, isbn, totalQuantity, availableQuantity) VALUES
('Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 3, 3),
('El principito', 'Antoine de Saint-Exupéry', '9780156012195', 2, 2),
('Don Quijote de la Mancha', 'Miguel de Cervantes', '9788491050297', 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);
