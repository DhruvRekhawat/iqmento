import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/api-helpers";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || user.role !== "ADMIN") return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
    }

    const csvText = await file.text();
    const { data: rows, errors: parseErrors } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });

    if (parseErrors.length > 0) {
      return NextResponse.json(
        { error: "CSV parse errors", details: parseErrors.slice(0, 10) },
        { status: 400 }
      );
    }

    // Pre-fetch colleges for name-to-id resolution
    const colleges = await prisma.college.findMany({ select: { id: true, name: true, slug: true } });
    const collegeMap = new Map<string, string>();
    for (const c of colleges) {
      collegeMap.set(c.name.toLowerCase(), c.id);
      collegeMap.set(c.slug.toLowerCase(), c.id);
    }

    const results: { created: number; skipped: number; errors: { row: number; message: string }[] } = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      if (!row.name) {
        results.errors.push({ row: rowNum, message: "Missing required field: name" });
        continue;
      }

      const slug =
        row.slug ||
        row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const existing = await prisma.alumni.findUnique({ where: { slug } });
      if (existing) {
        results.skipped++;
        results.errors.push({ row: rowNum, message: `Slug "${slug}" already exists, skipped` });
        continue;
      }

      // Resolve college
      let collegeId: string | null = null;
      if (row.collegeId) {
        collegeId = row.collegeId;
      } else if (row.collegeName) {
        collegeId = collegeMap.get(row.collegeName.toLowerCase()) || null;
      } else if (row.collegeSlug) {
        collegeId = collegeMap.get(row.collegeSlug.toLowerCase()) || null;
      }

      try {
        const parseField = (val: string | undefined) => {
          if (!val || val.trim() === "") return null;
          if (val.trim().startsWith("[") || val.trim().startsWith("{")) {
            try {
              JSON.parse(val);
              return val;
            } catch {
              return null;
            }
          }
          if (val.includes("|")) {
            return JSON.stringify(val.split("|").map((s: string) => s.trim()));
          }
          return JSON.stringify([val]);
        };

        await prisma.alumni.create({
          data: {
            slug,
            name: row.name,
            headline: row.headline || null,
            bio: row.bio || null,
            course: row.course || null,
            graduationYear: row.graduationYear ? parseInt(row.graduationYear, 10) : null,
            currentCompany: row.currentCompany || null,
            currentJobRole: row.currentJobRole || null,
            jobLocation: row.jobLocation || null,
            location: row.location || null,
            mobileNumber: row.mobileNumber || null,
            mail: row.mail || null,
            profileImageUrl: row.profileImageUrl || null,
            heroImageUrl: row.heroImageUrl || null,
            isBookable: row.isBookable === "true",
            isFeatured: row.isFeatured === "true",
            heroTagline: row.heroTagline || null,
            heroSummary: parseField(row.heroSummary),
            overview: parseField(row.overview),
            availability: row.availability || null,
            stats: parseField(row.stats),
            focusAreas: parseField(row.focusAreas),
            sessions: parseField(row.sessions),
            highlights: parseField(row.highlights),
            resources: parseField(row.resources),
            reviews: parseField(row.reviews),
            featuredQuote: row.featuredQuote || null,
            bookingUrl: row.bookingUrl || null,
            questionUrl: row.questionUrl || null,
            published: row.published === "true",
            collegeId,
          },
        });
        results.created++;
      } catch (err) {
        results.errors.push({
          row: rowNum,
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/alumni");

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error bulk uploading alumni:", error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
