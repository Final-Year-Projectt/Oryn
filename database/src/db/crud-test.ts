import { prisma } from "./prisma";

async function main() {
  console.log("🚀 Starting CRUD test...\n");

  const testSlug = `crud-test-${Date.now()}`;

  // CREATE
  console.log("1️⃣ CREATE — Creating test business...");

  const createdBusiness = await prisma.business.create({
    data: {
      name: "CRUD Test Business",
      slug: testSlug,
    },
  });

  console.log("✅ Created:", {
    id: createdBusiness.id,
    name: createdBusiness.name,
    slug: createdBusiness.slug,
  });

  // READ
  console.log("\n2️⃣ READ — Reading test business...");

  const foundBusiness = await prisma.business.findUnique({
    where: {
      id: createdBusiness.id,
    },
  });

  console.log("✅ Found:", foundBusiness);

  // UPDATE
  console.log("\n3️⃣ UPDATE — Updating test business...");

  const updatedBusiness = await prisma.business.update({
    where: {
      id: createdBusiness.id,
    },
    data: {
      name: "CRUD Test Business Updated",
    },
  });

  console.log("✅ Updated:", {
    id: updatedBusiness.id,
    name: updatedBusiness.name,
  });

  // DELETE
  console.log("\n4️⃣ DELETE — Deleting test business...");

  await prisma.business.delete({
    where: {
      id: createdBusiness.id,
    },
  });

  console.log("✅ Deleted successfully.");

  // VERIFY DELETE
  console.log("\n5️⃣ VERIFY — Confirming deletion...");

  const deletedBusiness = await prisma.business.findUnique({
    where: {
      id: createdBusiness.id,
    },
  });

  if (deletedBusiness === null) {
    console.log("✅ Confirmed: test business no longer exists.");
  } else {
    throw new Error("❌ Delete verification failed.");
  }

  console.log("\n🎉 CRUD TEST PASSED SUCCESSFULLY!");
}

main()
  .catch((error) => {
    console.error("\n❌ CRUD TEST FAILED:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });