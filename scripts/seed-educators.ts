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
import * as fs from "fs";
import * as path from "path";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const TEMP_PASSWORD = "12345678";

// Simple robust CSV parser that handles quoted fields with commas
function parseCSV(content: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim());
        result.push(row);
        current = "";
        row = [];
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else {
      current += char;
    }
  }

  if (current || row.length > 0) {
    row.push(current.trim());
    result.push(row);
  }

  return result;
}

async function main() {
  console.log("🌱 Starting educator user seeding from CSV...\n");

  const csvPath = path.resolve(process.cwd(), "scripts", "Data - Sheet1.csv");
  if (!fs.existsSync(csvPath)) {
    console.error(`✗ CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvContent);
  
  // Remove header row
  const dataRows = rows.slice(1);

  const passwordHash = await hashPassword(TEMP_PASSWORD);
  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const row of dataRows) {
    if (row.length < 5) continue; // Skip empty or invalid rows

    const email = row[1]; // Email Address
    const name = row[2];  // Enter your name
    const rawPhone = row[3]; // Mobile Number
    const college = row[6]; // College name
    const gradYearStr = row[28]; // Which year did you pass out from college?
    const linkedin = row[32]; // Your Linkedin ID

    if (!email || !name) {
      console.log(`⊘ Skipping row with missing email or name: ${name || "Unknown"}`);
      continue;
    }

    // Sanitize phone: take first 10 digits
    const phoneMatch = rawPhone?.match(/\d{10}/);
    const phone = phoneMatch ? phoneMatch[0] : `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    // Parse graduation year
    const gradYearMatch = gradYearStr?.match(/\d{4}/);
    const kycGraduationYear = gradYearMatch ? parseInt(gradYearMatch[0], 10) : null;

    const slug = slugify(name);

    try {
      // Use upsert to be idempotent
      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phone,
          role: "EDUCATOR",
          educatorSlug: slug,
          kycStatus: "APPROVED",
          kycCollege: college,
          kycGraduationYear,
          kycLinkedin: linkedin,
        },
        create: {
          email,
          phone,
          name,
          role: "EDUCATOR",
          passwordHash,
          educatorSlug: slug,
          kycStatus: "APPROVED",
          kycCollege: college,
          kycGraduationYear,
          kycLinkedin: linkedin,
        },
      });

      console.log(`✓ Processed educator: ${name} (${email})`);
      created++; // Counting as "processed" since upsert doesn't tell us if it was created or updated easily without a check
    } catch (error) {
      console.error(`✗ Error processing ${name} (${email}):`, error);
      errors++;
    }
  }

  console.log("\n✅ Seeding completed!");
  console.log(`   Processed: ${created}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total rows: ${dataRows.length}`);
  console.log(`🔑 Temporary password for all: ${TEMP_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("✗ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

