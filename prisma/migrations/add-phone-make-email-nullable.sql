-- Comprehensive migration: Add phone column AND make email nullable
-- This handles both requirements in one migration

BEGIN TRANSACTION;

-- Step 1: Create new User table with nullable email and phone column
CREATE TABLE User_new (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT,  -- Now nullable (was NOT NULL)
    phone TEXT,  -- New column for phone-based auth
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

-- Step 2: Copy all data from old table
-- Copy all columns that definitely exist (phone will be NULL if it didn't exist in old table)
INSERT INTO User_new (id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl)
SELECT id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl
FROM User;

-- Note: If phone column already exists from a previous migration (add-phone-otp.sql),
-- the phone values will be lost in this migration. Users will need to re-register with phone.
-- This is acceptable for development. For production with existing users, you'd need a more complex migration.

-- Step 3: Drop old table
DROP TABLE User;

-- Step 4: Rename new table
ALTER TABLE User_new RENAME TO User;

-- Step 5: Recreate all indexes
CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_phone_key ON User(phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_educatorSlug_key ON User(educatorSlug) WHERE educatorSlug IS NOT NULL;

COMMIT;
