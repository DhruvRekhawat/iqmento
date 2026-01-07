-- Add payment fields to Booking table
ALTER TABLE Booking ADD COLUMN razorpayOrderId TEXT;
ALTER TABLE Booking ADD COLUMN razorpayPaymentId TEXT;
ALTER TABLE Booking ADD COLUMN razorpaySignature TEXT;
ALTER TABLE Booking ADD COLUMN paymentStatus TEXT;

