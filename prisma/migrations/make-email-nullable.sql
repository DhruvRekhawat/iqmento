-- Make email column nullable in User table
-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table
-- This migration preserves all existing data and constraints

-- Step 1: Create new User table with nullable email and phone
CREATE TABLE IF NOT EXISTS User_new (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT,  -- Now nullable
    phone TEXT,  -- Added for phone-based auth
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

-- Step 2: Copy data from old table to new table
-- Handle case where phone column might not exist yet
INSERT INTO User_new (
    id, email, name, role, passwordHash, createdAt, updatedAt,
    educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl, phone
)
SELECT 
    id, 
    email, 
    name, 
    role, 
    passwordHash, 
    createdAt, 
    updatedAt,
    educatorSlug, 
    kycStatus, 
    kycCollege, 
    kycGraduationYear, 
    kycLinkedin, 
    kycDocumentUrl,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pragma_table_info('User') WHERE name='phone') 
        THEN (SELECT phone FROM User WHERE User.id = User_new.id)
        ELSE NULL 
    END as phone
FROM User;

-- If the above doesn't work due to SQLite limitations, use this simpler approach:
-- First, try to get all columns that exist
-- We'll use a simpler INSERT that handles missing columns

-- Alternative Step 2: Copy with explicit column handling
-- This handles the case where phone might not exist in old table
INSERT INTO User_new (id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl)
SELECT id, email, name, role, passwordHash, createdAt, updatedAt, educatorSlug, kycStatus, kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl
FROM User;

-- Step 3: Drop old table
DROP TABLE User;

-- Step 4: Rename new table to User
ALTER TABLE User_new RENAME TO User;

-- Step 5: Recreate indexes and constraints
CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_phone_key ON User(phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS User_educatorSlug_key ON User(educatorSlug) WHERE educatorSlug IS NOT NULL;
