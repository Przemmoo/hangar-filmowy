-- Update admin user password hash to SHA-256 (Edge Runtime compatible)
-- Old bcrypt hash: $2a$10$vS5CRif71fj3bTafrXbAjO.ndf5azDWU6LK467SGr8wdP/kOAz.9q
-- New SHA-256 hash for "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

UPDATE users
SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE email = 'admin@hangarfilmowy.pl';

-- Verify the update
SELECT id, email, name, role, password
FROM users 
WHERE email = 'admin@hangarfilmowy.pl';
