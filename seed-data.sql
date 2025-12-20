
-- Insert admin user
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") 
VALUES ('cm52gx1yz0000', 'admin@hangarfilmowy.pl', '$2a$10$vS5CRif71fj3bTafrXbAjO.ndf5azDWU6LK467SGr8wdP/kOAz.9q', 'Admin', 'admin', NOW(), NOW());

-- Insert default setting
INSERT INTO settings (key, value, "updatedAt", "updatedBy") 
VALUES ('site_name', '{"name": "Hangar Filmowy"}', NOW(), 'cm52gx1yz0000');

