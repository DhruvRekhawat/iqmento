#!/usr/bin/env node

/**
 * Seed Educator Users Script
 * 
 * Creates educator user accounts in Prisma database from alumni data.
 * These users can then be used for bookings.
 * 
 * Usage:
 *   npm run seed:educators
 * 
 * Environment Variables Required:
 *   - TURSO_DATABASE_URL or TURSO_DB_URL
 *   - TURSO_AUTH_TOKEN or TURSO_TOKEN
 */

// Load environment variables from .env.local or .env FIRST
import { config } from "dotenv";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const envPathFallback = resolve(process.cwd(), ".env");
config({ path: envPath });
config({ path: envPathFallback });

import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth-utils";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Alumni data - same as in seed-remote.ts
const alumniData = [
  {
    almuniId: "AL001",
    name: "Rajesh Kumar",
    headline: "Senior Product Designer at Google",
    mail: "rajesh.kumar@example.com",
  },
  {
    almuniId: "AL002",
    name: "Priya Sharma",
    headline: "UX Lead at Microsoft",
    mail: "priya.sharma@example.com",
  },
  {
    almuniId: "AL003",
    name: "Amit Patel",
    headline: "Software Engineer at Amazon",
    mail: "amit.patel@example.com",
  },
  {
    almuniId: "AL004",
    name: "Sneha Reddy",
    headline: "Product Manager at Flipkart",
    mail: "sneha.reddy@example.com",
  },
  {
    almuniId: "AL005",
    name: "Vikram Singh",
    headline: "Interaction Designer at Adobe",
    mail: "vikram.singh@example.com",
  },
  {
    almuniId: "AL006",
    name: "Ananya Desai",
    headline: "Data Scientist at Goldman Sachs",
    mail: "ananya.desai@example.com",
  },
  {
    almuniId: "AL007",
    name: "Kavya Nair",
    headline: "Graphic Designer at Razorfish",
    mail: "kavya.nair@example.com",
  },
  {
    almuniId: "AL008",
    name: "Rohan Mehta",
    headline: "Consultant at McKinsey",
    mail: "rohan.mehta@example.com",
  },
];

const TEMP_PASSWORD = "12345678";

async function main() {
  console.log("🌱 Starting educator user seeding...\n");

  const passwordHash = await hashPassword(TEMP_PASSWORD);
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const alumnus of alumniData) {
    const slug = slugify(alumnus.name);
    const email = `${slug}@iqmento.com`;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Update existing user to ensure it's an educator with correct slug
        if (existingUser.role !== "EDUCATOR" || existingUser.educatorSlug !== slug) {
          await prisma.user.update({
            where: { email },
            data: {
              role: "EDUCATOR",
              educatorSlug: slug,
              name: alumnus.name,
              passwordHash, // Update password to temp password
            },
          });
          console.log(`✓ Updated educator: ${alumnus.name} (${email})`);
          updated++;
        } else {
          console.log(`⊘ Skipped (already exists): ${alumnus.name} (${email})`);
          skipped++;
        }
      } else {
        // Create new educator user
        await prisma.user.create({
          data: {
            email,
            name: alumnus.name,
            role: "EDUCATOR",
            passwordHash,
            educatorSlug: slug,
          },
        });
        console.log(`✓ Created educator: ${alumnus.name} (${email})`);
        created++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${alumnus.name}:`, error);
    }
  }

  console.log("\n✅ Seeding completed!");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${alumniData.length}`);
  console.log(`\n📧 All users have email format: <slug>@iqmento.com`);
  console.log(`🔑 Temporary password for all: ${TEMP_PASSWORD}`);
  console.log(`\n⚠️  Remember to change passwords after first login!`);
}

main()
  .catch((error) => {
    console.error("✗ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

