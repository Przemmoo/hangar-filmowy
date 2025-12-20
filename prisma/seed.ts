import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@hangarfilmowy.pl" },
    update: {},
    create: {
      email: "admin@hangarfilmowy.pl",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create default settings
  const setting = await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: {
      key: "site_name",
      value: { name: "Hangar Filmowy" },
      updatedBy: admin.id,
    },
  });

  console.log("✅ Created default setting:", setting.key);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
