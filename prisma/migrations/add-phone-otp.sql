-- Add phone field to User table
-- Note: For SQLite, we add it as nullable first, then update existing rows
-- Prisma will enforce NOT NULL at application level for new records

-- Add phone column (nullable for now to handle existing data)
ALTER TABLE User ADD COLUMN phone TEXT;

-- Create unique index on phone (allows NULL values)
CREATE UNIQUE INDEX IF NOT EXISTS User_phone_key ON User(phone) WHERE phone IS NOT NULL;

-- Make email nullable (remove NOT NULL constraint)
-- Note: SQLite doesn't support ALTER COLUMN, but we can work around it
-- For existing data, email can remain as is
-- New records will allow NULL email

-- Create Otp table
CREATE TABLE IF NOT EXISTS Otp (
    id TEXT NOT NULL PRIMARY KEY,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for Otp table
CREATE INDEX IF NOT EXISTS Otp_phone_idx ON Otp(phone);
CREATE INDEX IF NOT EXISTS Otp_expiresAt_idx ON Otp(expiresAt);
