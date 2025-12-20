import bcrypt from "bcryptjs";

async function generateInsert() {
  const hash = await bcrypt.hash("admin123", 10);
  const sql = `
-- Insert admin user
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") 
VALUES ('cm52gx1yz0000', 'admin@hangarfilmowy.pl', '${hash}', 'Admin', 'admin', NOW(), NOW());

-- Insert default setting
INSERT INTO settings (key, value, "updatedAt", "updatedBy") 
VALUES ('site_name', '{"name": "Hangar Filmowy"}', NOW(), 'cm52gx1yz0000');
`;
  console.log(sql);
}

generateInsert();
