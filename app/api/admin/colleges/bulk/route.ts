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

    const results: { created: number; skipped: number; errors: { row: number; message: string }[] } = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // 1-indexed + header row

      if (!row.name || !row.location) {
        results.errors.push({ row: rowNum, message: "Missing required fields: name, location" });
        continue;
      }

      const slug =
        row.slug ||
        row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      // Check for duplicate slug
      const existing = await prisma.college.findUnique({ where: { slug } });
      if (existing) {
        results.skipped++;
        results.errors.push({ row: rowNum, message: `Slug "${slug}" already exists, skipped` });
        continue;
      }

      try {
        const parseField = (val: string | undefined) => {
          if (!val || val.trim() === "") return null;
          // Check if it's JSON
          if (val.trim().startsWith("[") || val.trim().startsWith("{")) {
            try {
              JSON.parse(val);
              return val;
            } catch {
              return null;
            }
          }
          // Pipe-separated to JSON array
          if (val.includes("|")) {
            return JSON.stringify(val.split("|").map((s: string) => s.trim()));
          }
          return JSON.stringify([val]);
        };

        await prisma.college.create({
          data: {
            slug,
            name: row.name,
            shortName: row.shortName || null,
            location: row.location,
            heroImageUrl: row.heroImageUrl || null,
            hero: parseField(row.hero),
            about: parseField(row.about),
            courses: parseField(row.courses),
            admission: parseField(row.admission),
            recruiters: parseField(row.recruiters),
            reviews: parseField(row.reviews),
            faqs: parseField(row.faqs),
            collegeType: row.collegeType || null,
            collegeTier: row.collegeTier || null,
            rating: row.rating ? parseFloat(row.rating) : null,
            metaTitle: row.metaTitle || null,
            metaDescription: row.metaDescription || null,
            published: row.published === "true",
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
    revalidatePath("/colleges");

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error bulk uploading colleges:", error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
