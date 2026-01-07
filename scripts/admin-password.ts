#!/usr/bin/env node

/**
 * Admin Password Management Script
 * 
 * Usage:
 *   Create admin: npm run admin-password create <email> <password>
 *   Change password: npm run admin-password change <email> <new-password>
 * 
 * Example:
 *   npm run admin-password create admin@example.com mypassword123
 *   npm run admin-password change admin@example.com newpassword123
 */

// Load environment variables from .env.local or .env FIRST
// This must happen before any imports that use process.env
import { config } from "dotenv";
import { resolve } from "path";

// Try to load .env.local first, then .env
const envPath = resolve(process.cwd(), ".env.local");
const envPathFallback = resolve(process.cwd(), ".env");
config({ path: envPath });
config({ path: envPathFallback });

// Verify environment variables are available
if (!process.env.TURSO_DB_URL || !process.env.TURSO_TOKEN) {
  console.error("✗ Error: TURSO_DB_URL and TURSO_TOKEN environment variables are required");
  console.error(`\nTURSO_DB_URL: ${process.env.TURSO_DB_URL ? "✓ Found" : "✗ Missing"}`);
  console.error(`TURSO_TOKEN: ${process.env.TURSO_TOKEN ? "✓ Found" : "✗ Missing"}`);
  console.error("\nPlease ensure:");
  console.error("  1. Variables are set in your PowerShell environment, OR");
  console.error("  2. Variables are in .env.local or .env file");
  console.error("\nTo set in PowerShell:");
  console.error('  $env:TURSO_DB_URL="your-url"');
  console.error('  $env:TURSO_TOKEN="your-token"');
  process.exit(1);
}

// Now import prisma after env vars are loaded
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth-utils";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const email = args[1];
  const password = args[2];

  if (!command || !email || !password) {
    console.error("Usage:");
    console.error("  Create admin: npm run admin-password create <email> <password>");
    console.error("  Change password: npm run admin-password change <email> <new-password>");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    if (command === "create") {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        // Update existing user to admin and change password
        const passwordHash = await hashPassword(password);
        const updated = await prisma.user.update({
          where: { email: normalizedEmail },
          data: {
            role: "ADMIN",
            passwordHash,
          },
        });
        console.log(`✓ Updated user ${updated.email} to ADMIN and changed password`);
      } else {
        // Create new admin user
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            role: "ADMIN",
            passwordHash,
            name: email.split("@")[0],
          },
        });
        console.log(`✓ Created admin user: ${user.email}`);
      }
    } else if (command === "change") {
      // Change password for existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingUser) {
        console.error(`✗ User with email ${normalizedEmail} not found`);
        process.exit(1);
      }

      const passwordHash = await hashPassword(password);
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { passwordHash },
      });
      console.log(`✓ Password changed for ${normalizedEmail}`);
    } else {
      console.error(`✗ Unknown command: ${command}`);
      console.error("Use 'create' or 'change'");
      process.exit(1);
    }
  } catch (error) {
    console.error("✗ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

