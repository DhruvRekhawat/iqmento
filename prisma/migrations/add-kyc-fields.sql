-- Add KYC document fields to User table
ALTER TABLE User ADD COLUMN kycCollege TEXT;
ALTER TABLE User ADD COLUMN kycGraduationYear INTEGER;
ALTER TABLE User ADD COLUMN kycLinkedin TEXT;
ALTER TABLE User ADD COLUMN kycDocumentUrl TEXT;

