#!/usr/bin/env node

/**
 * Seed Services Script
 * 
 * Creates service records in Prisma database from alumni session data.
 * Each alumnus's sessions become services for their corresponding educator user.
 * 
 * Usage:
 *   npm run seed:services
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

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Parse duration from "60 min" format to minutes
const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)\s*min/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  // Default to 60 minutes if parsing fails
  return 60;
};

// Parse price from "₹2000" format to float
const parsePrice = (price: string): number => {
  // Remove currency symbols and commas, then parse
  const cleaned = price.replace(/[₹,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Alumni data with sessions
const alumniData = [
  {
    almuniId: "AL001",
    name: "Rajesh Kumar",
    sessions: [
      {
        title: "Introduction to Product Design",
        duration: "60 min",
        price: "₹2000",
        description: "Learn the fundamentals of product design",
      },
      {
        title: "Design Systems Workshop",
        duration: "90 min",
        price: "₹3000",
        description: "Deep dive into building design systems",
      },
    ],
  },
  {
    almuniId: "AL002",
    name: "Priya Sharma",
    sessions: [
      {
        title: "UX Research Fundamentals",
        duration: "60 min",
        price: "₹2000",
        description: "Learn how to conduct effective user research",
      },
    ],
  },
  {
    almuniId: "AL003",
    name: "Amit Patel",
    sessions: [
      {
        title: "System Design Interview Prep",
        duration: "90 min",
        price: "₹2500",
        description: "Master system design interviews",
      },
    ],
  },
  {
    almuniId: "AL004",
    name: "Sneha Reddy",
    sessions: [
      {
        title: "Product Management 101",
        duration: "60 min",
        price: "₹2000",
        description: "Introduction to product management",
      },
      {
        title: "Growth Strategy Workshop",
        duration: "90 min",
        price: "₹3000",
        description: "Learn growth frameworks",
      },
    ],
  },
  {
    almuniId: "AL005",
    name: "Vikram Singh",
    sessions: [
      {
        title: "Advanced Figma Prototyping",
        duration: "90 min",
        price: "₹2500",
        description: "Learn advanced prototyping in Figma",
      },
    ],
  },
  {
    almuniId: "AL006",
    name: "Ananya Desai",
    sessions: [
      {
        title: "ML for Finance",
        duration: "90 min",
        price: "₹3000",
        description: "Applying ML to financial problems",
      },
    ],
  },
  {
    almuniId: "AL007",
    name: "Kavya Nair",
    sessions: [
      {
        title: "Brand Identity Design",
        duration: "90 min",
        price: "₹2500",
        description: "Learn to create compelling brand identities",
      },
    ],
  },
  {
    almuniId: "AL008",
    name: "Rohan Mehta",
    sessions: [
      {
        title: "Case Interview Prep",
        duration: "90 min",
        price: "₹3500",
        description: "Ace your consulting interviews",
      },
      {
        title: "Business Strategy 101",
        duration: "60 min",
        price: "₹2500",
        description: "Learn strategic frameworks",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting service seeding...\n");

  let totalCreated = 0;
  let totalUpdated = 0;
  const totalSkipped = 0;
  let educatorsNotFound = 0;

  for (const alumnus of alumniData) {
    const slug = slugify(alumnus.name);
    console.log(`\n📚 Processing ${alumnus.name} (${alumnus.almuniId})...`);

    // Find educator user by slug
    const educator = await prisma.user.findUnique({
      where: { educatorSlug: slug },
    });

    if (!educator) {
      console.log(`   ⚠️  Educator not found for slug: ${slug}`);
      console.log(`   💡 Run 'npm run seed:educators' first to create educator users`);
      educatorsNotFound++;
      continue;
    }

    if (educator.role !== "EDUCATOR") {
      console.log(`   ⚠️  User ${educator.email} is not an EDUCATOR (role: ${educator.role})`);
      educatorsNotFound++;
      continue;
    }

    // Process each session
    for (const session of alumnus.sessions) {
      const durationMinutes = parseDuration(session.duration);
      const price = parsePrice(session.price);

      try {
        // Check if service already exists (by title and educator)
        const existingService = await prisma.service.findFirst({
          where: {
            educatorId: educator.id,
            title: session.title,
          },
        });

        if (existingService) {
          // Update existing service
          await prisma.service.update({
            where: { id: existingService.id },
            data: {
              title: session.title,
              description: session.description || null,
              durationMinutes,
              price,
              active: true,
            },
          });
          console.log(`   ✓ Updated: "${session.title}" (${durationMinutes} min, ₹${price})`);
          totalUpdated++;
        } else {
          // Create new service
          await prisma.service.create({
            data: {
              educatorId: educator.id,
              title: session.title,
              description: session.description || null,
              durationMinutes,
              price,
              active: true,
            },
          });
          console.log(`   ✓ Created: "${session.title}" (${durationMinutes} min, ₹${price})`);
          totalCreated++;
        }
      } catch (error) {
        console.error(`   ✗ Error processing "${session.title}":`, error);
      }
    }
  }

  console.log("\n✅ Service seeding completed!");
  console.log(`   Created: ${totalCreated}`);
  console.log(`   Updated: ${totalUpdated}`);
  console.log(`   Skipped: ${totalSkipped}`);
  if (educatorsNotFound > 0) {
    console.log(`   ⚠️  Educators not found: ${educatorsNotFound}`);
    console.log(`   💡 Make sure to run 'npm run seed:educators' first`);
  }
  console.log(`   Total sessions processed: ${alumniData.reduce((sum, a) => sum + a.sessions.length, 0)}`);
}

main()
  .catch((error) => {
    console.error("✗ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

