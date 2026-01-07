import { prisma } from "../lib/prisma";

async function applyMigration() {
  try {
    console.log("Applying payment fields migration...");

    // SQLite/Turso uses TEXT for strings
    const migrations = [
      `ALTER TABLE Booking ADD COLUMN razorpayOrderId TEXT;`,
      `ALTER TABLE Booking ADD COLUMN razorpayPaymentId TEXT;`,
      `ALTER TABLE Booking ADD COLUMN razorpaySignature TEXT;`,
      `ALTER TABLE Booking ADD COLUMN paymentStatus TEXT;`,
    ];

    // Execute each migration
    for (const sql of migrations) {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✓ Executed: ${sql}`);
      } catch (error: unknown) {
        // Ignore "duplicate column" errors (column already exists)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("duplicate column") || errorMessage.includes("already exists")) {
          console.log(`⚠ Skipped (already exists): ${sql}`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✅ Migration applied successfully!");
    console.log("Payment fields added to Booking table:");
    console.log("  - razorpayOrderId");
    console.log("  - razorpayPaymentId");
    console.log("  - razorpaySignature");
    console.log("  - paymentStatus");
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();

