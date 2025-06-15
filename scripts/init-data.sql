-- Insertion d'utilisateurs de test
INSERT INTO users (first_name, last_name, email, created_at) VALUES
('Jean', 'Dupont', 'jean.dupont@email.com', NOW()),
('Marie', 'Martin', 'marie.martin@email.com', NOW()),
('Pierre', 'Durand', 'pierre.durand@email.com', NOW()),
('Sophie', 'Leroy', 'sophie.leroy@email.com', NOW()),
('Thomas', 'Moreau', 'thomas.moreau@email.com', NOW());

-- Insertion d'événements de test
INSERT INTO events (name, description, event_date, total_seats, available_seats, price, created_at, version) VALUES
('Concert Rock Festival', 'Grand concert de rock avec plusieurs groupes internationaux', '2024-07-15 20:00:00', 1000, 1000, 75.00, NOW(), 0),
('Séminaire Tech 2024', 'Conférence sur les nouvelles technologies et l''intelligence artificielle', '2024-06-20 09:00:00', 200, 200, 150.00, NOW(), 0),
('Spectacle de Danse', 'Représentation de danse contemporaine par la troupe nationale', '2024-08-10 19:30:00', 300, 300, 45.00, NOW(), 0),
('Concert Jazz', 'Soirée jazz avec des musiciens renommés', '2024-07-05 21:00:00', 150, 150, 60.00, NOW(), 0),
('Conférence Business', 'Stratégies d''entreprise et leadership', '2024-06-25 14:00:00', 500, 500, 200.00, NOW(), 0);
