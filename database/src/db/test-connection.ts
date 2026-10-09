import { prisma } from "./prisma";

async function main() {
  console.log("🔌 Testing database connection...");

  const result = await prisma.$queryRaw<
    { result: number }[]
  >`SELECT 1 AS result`;

  console.log("✅ Database connection successful!");
  console.log(result);
}

main()
  .catch((error) => {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });