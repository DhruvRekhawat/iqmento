-- Create College table
CREATE TABLE IF NOT EXISTS "College" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "location" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "hero" TEXT,
    "about" TEXT,
    "courses" TEXT,
    "admission" TEXT,
    "recruiters" TEXT,
    "reviews" TEXT,
    "faqs" TEXT,
    "collegeType" TEXT,
    "collegeTier" TEXT,
    "rating" REAL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "College_slug_key" ON "College"("slug");
CREATE INDEX IF NOT EXISTS "College_slug_idx" ON "College"("slug");
CREATE INDEX IF NOT EXISTS "College_published_idx" ON "College"("published");
CREATE INDEX IF NOT EXISTS "College_collegeType_idx" ON "College"("collegeType");

-- Create Alumni table
CREATE TABLE IF NOT EXISTS "Alumni" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "course" TEXT,
    "graduationYear" INTEGER,
    "currentCompany" TEXT,
    "currentJobRole" TEXT,
    "jobLocation" TEXT,
    "location" TEXT,
    "mobileNumber" TEXT,
    "mail" TEXT,
    "profileImageUrl" TEXT,
    "heroImageUrl" TEXT,
    "isBookable" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "heroTagline" TEXT,
    "heroSummary" TEXT,
    "overview" TEXT,
    "availability" TEXT,
    "stats" TEXT,
    "focusAreas" TEXT,
    "sessions" TEXT,
    "highlights" TEXT,
    "resources" TEXT,
    "reviews" TEXT,
    "featuredQuote" TEXT,
    "bookingUrl" TEXT,
    "questionUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "collegeId" TEXT,
    CONSTRAINT "Alumni_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Alumni_slug_key" ON "Alumni"("slug");
CREATE INDEX IF NOT EXISTS "Alumni_slug_idx" ON "Alumni"("slug");
CREATE INDEX IF NOT EXISTS "Alumni_collegeId_idx" ON "Alumni"("collegeId");
CREATE INDEX IF NOT EXISTS "Alumni_published_idx" ON "Alumni"("published");
CREATE INDEX IF NOT EXISTS "Alumni_isFeatured_idx" ON "Alumni"("isFeatured");
