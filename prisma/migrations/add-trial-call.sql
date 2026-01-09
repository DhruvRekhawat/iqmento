-- Create TrialCall table
CREATE TABLE IF NOT EXISTS "TrialCall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "TrialCall_email_idx" ON "TrialCall"("email");
CREATE INDEX IF NOT EXISTS "TrialCall_createdAt_idx" ON "TrialCall"("createdAt");
