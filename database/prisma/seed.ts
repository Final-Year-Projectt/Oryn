import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // -------------------------
  // ROLES
  // -------------------------

  const roles = [
    {
      name: "ADMIN",
      description: "Full access to the business system",
    },
    {
      name: "MANAGER",
      description: "Business management and approval access",
    },
    {
      name: "ACCOUNTANT",
      description: "Accounting, invoices, expenses and payments",
    },
    {
      name: "STAFF",
      description: "Standard operational access",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  // -------------------------
  // PERMISSIONS
  // -------------------------

  const permissions = [
    "USER_READ",
    "USER_WRITE",

    "BUSINESS_READ",
    "BUSINESS_WRITE",

    "CUSTOMER_READ",
    "CUSTOMER_WRITE",

    "SUPPLIER_READ",
    "SUPPLIER_WRITE",

    "PRODUCT_READ",
    "PRODUCT_WRITE",

    "INVENTORY_READ",
    "INVENTORY_WRITE",

    "INVOICE_READ",
    "INVOICE_CREATE",
    "INVOICE_UPDATE",
    "INVOICE_APPROVE",

    "PAYMENT_READ",
    "PAYMENT_CREATE",

    "EXPENSE_READ",
    "EXPENSE_CREATE",
    "EXPENSE_APPROVE",

    "PURCHASE_ORDER_READ",
    "PURCHASE_ORDER_CREATE",
    "PURCHASE_ORDER_APPROVE",

    "DOCUMENT_READ",
    "DOCUMENT_UPLOAD",
    "DOCUMENT_PROCESS",

    "AGENT_TASK_READ",
    "AGENT_TASK_CREATE",
    "AGENT_TASK_APPROVE",

    "AUDIT_LOG_READ",
  ];

  for (const key of permissions) {
    await prisma.permission.upsert({
      where: {
        key,
      },
      update: {},
      create: {
        key,
        description: key
          .toLowerCase()
          .replace(/_/g, " "),
      },
    });
  }

  // -------------------------
  // ROLE PERMISSIONS
  // -------------------------

  const allPermissions = await prisma.permission.findMany();

  const admin = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  const manager = await prisma.role.findUnique({
    where: { name: "MANAGER" },
  });

  const accountant = await prisma.role.findUnique({
    where: { name: "ACCOUNTANT" },
  });

  const staff = await prisma.role.findUnique({
    where: { name: "STAFF" },
  });

  if (!admin || !manager || !accountant || !staff) {
    throw new Error("Required roles were not created.");
  }

  // ADMIN gets everything
  await prisma.role.update({
    where: { id: admin.id },
    data: {
      permissions: {
        connect: allPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  // MANAGER permissions
  const managerPermissionKeys = allPermissions.filter((permission) =>
    [
      "USER_READ",
      "BUSINESS_READ",
      "BUSINESS_WRITE",
      "CUSTOMER_READ",
      "CUSTOMER_WRITE",
      "SUPPLIER_READ",
      "SUPPLIER_WRITE",
      "PRODUCT_READ",
      "PRODUCT_WRITE",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "INVOICE_READ",
      "INVOICE_CREATE",
      "INVOICE_UPDATE",
      "INVOICE_APPROVE",
      "PAYMENT_READ",
      "PAYMENT_CREATE",
      "EXPENSE_READ",
      "EXPENSE_CREATE",
      "EXPENSE_APPROVE",
      "PURCHASE_ORDER_READ",
      "PURCHASE_ORDER_CREATE",
      "PURCHASE_ORDER_APPROVE",
      "DOCUMENT_READ",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_PROCESS",
      "AGENT_TASK_READ",
      "AGENT_TASK_CREATE",
      "AGENT_TASK_APPROVE",
      "AUDIT_LOG_READ",
    ].includes(permission.key),
  );

  await prisma.role.update({
    where: { id: manager.id },
    data: {
      permissions: {
        connect: managerPermissionKeys.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  // ACCOUNTANT permissions
  const accountantPermissionKeys = allPermissions.filter((permission) =>
    [
      "BUSINESS_READ",
      "CUSTOMER_READ",
      "CUSTOMER_WRITE",
      "SUPPLIER_READ",
      "SUPPLIER_WRITE",
      "INVOICE_READ",
      "INVOICE_CREATE",
      "INVOICE_UPDATE",
      "PAYMENT_READ",
      "PAYMENT_CREATE",
      "EXPENSE_READ",
      "EXPENSE_CREATE",
      "PURCHASE_ORDER_READ",
      "PURCHASE_ORDER_CREATE",
      "DOCUMENT_READ",
      "DOCUMENT_UPLOAD",
      "AUDIT_LOG_READ",
    ].includes(permission.key),
  );

  await prisma.role.update({
    where: { id: accountant.id },
    data: {
      permissions: {
        connect: accountantPermissionKeys.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  // STAFF permissions
  const staffPermissionKeys = allPermissions.filter((permission) =>
    [
      "BUSINESS_READ",
      "CUSTOMER_READ",
      "CUSTOMER_WRITE",
      "SUPPLIER_READ",
      "SUPPLIER_WRITE",
      "PRODUCT_READ",
      "PRODUCT_WRITE",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "INVOICE_READ",
      "INVOICE_CREATE",
      "EXPENSE_READ",
      "EXPENSE_CREATE",
      "PURCHASE_ORDER_READ",
      "PURCHASE_ORDER_CREATE",
      "DOCUMENT_READ",
      "DOCUMENT_UPLOAD",
      "AGENT_TASK_READ",
      "AGENT_TASK_CREATE",
    ].includes(permission.key),
  );

  await prisma.role.update({
    where: { id: staff.id },
    data: {
      permissions: {
        connect: staffPermissionKeys.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  console.log("✅ Roles created.");
  console.log("✅ Permissions created.");
  console.log("✅ Role permissions assigned.");
  console.log("🌱 Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });