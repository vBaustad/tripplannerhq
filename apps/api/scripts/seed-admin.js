import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PASSWORD_SALT_ROUNDS = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS ?? "10", 10);

async function main() {
  const email = (process.env.DEV_ADMIN_EMAIL ?? "admin@tripplannerhq.dev").trim().toLowerCase();
  const password = process.env.DEV_ADMIN_PASSWORD ?? "admin1234";
  const name = process.env.DEV_ADMIN_NAME ?? "TripPlanner Admin";

  if (!email || !password) {
    throw new Error("DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD must be provided");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const existing = await prisma.user.findUnique({ where: { email } });
  let user;
  let created = false;

  if (existing) {
    user = await prisma.user.update({
      where: { email },
      data: {
        displayName: name,
        passwordHash,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        displayName: name,
        passwordHash,
      },
    });
    created = true;
  }

  console.log("[seed:admin] Admin user ready:");
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log(created ? "  (New account created)" : "  (Existing account updated)");
}

main()
  .catch((error) => {
    console.error("[seed:admin] Failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
