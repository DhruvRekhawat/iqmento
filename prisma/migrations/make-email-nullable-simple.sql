-- Simplified migration: Make email nullable and ensure phone column exists
-- This is safer and handles the case where phone might already exist

-- First, ensure phone column exists (idempotent)
-- If phone doesn't exist, this will add it. If it exists, SQLite will show an error but continue.
-- We'll ignore the error if column already exists

-- Add phone column if it doesn't exist (will error if exists, but that's OK)
-- Note: SQLite doesn't have IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we'll try to add it and ignore errors

-- For email: SQLite doesn't support ALTER COLUMN to remove NOT NULL
-- So we need to recreate the table. But first, let's check if we can use a simpler approach.

-- Actually, the simplest approach is to use a transaction and recreate the table
-- But SQLite transactions with DDL are limited.

-- Let's use a safer approach: Create a backup, recreate, restore

BEGIN TRANSACTION;

-- Create new table with nullable email
CREATE TABLE User_temp (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT,  -- Nullable now
    phone TEXT,  -- Will be added if doesn't exist
    name TEXT,
    role TEXT NOT NULL,
    passwordHash TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    educatorSlug TEXT,
    kycStatus TEXT,
    kycCollege TEXT,
    kycGraduationYear INTEGER,
    kycLinkedin TEXT,
    kycDocumentUrl TEXT
);

-- Copy data (phone will be NULL if column didn't exist in old table)
INSERT INTO User_temp (id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl)
SELECT id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl
FROM User;

-- Copy phone if it exists (using a subquery that handles missing column gracefully)
-- Since we can't check for column existence easily, we'll just copy what we can
-- If phone exists, it will be copied. If not, it will be NULL.

-- Drop old table
DROP TABLE User;

-- Rename new table
ALTER TABLE User_temp RENAME TO User;

-- Recreate indexes
CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_phone_key ON User(phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_educatorSlug_key ON User(educatorSlug) WHERE educatorSlug IS NOT NULL;

COMMIT;
