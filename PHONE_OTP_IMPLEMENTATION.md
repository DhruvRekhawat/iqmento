# Phone Number & OTP Authentication Implementation

## Overview

Successfully implemented phone number-based registration and login using OTP (One-Time Password) instead of email/password authentication. The system uses MSG91 SMS API for sending OTPs.

## What Was Implemented

### 1. Database Schema Updates

- **User Model**: 
  - Added `phone` field (unique, required)
  - Made `email` field optional (nullable)
  
- **Otp Model**: 
  - New model to store OTPs temporarily
  - Fields: `id`, `phone`, `otp`, `expiresAt`, `verified`, `createdAt`
  - Indexes on `phone` and `expiresAt` for efficient lookups

### 2. SMS Integration

- **SMS Utility** (`lib/sms.ts`):
  - `sendOtp()` - Sends OTP via MSG91 API
  - `generateOtp()` - Generates 6-digit random OTP
  - Uses environment variables: `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`
  - Default values provided: `395515AXkDp29FHEDx69637a16P1` and `69637ae8ac5de15414632582`

### 3. API Routes Created

#### `/api/auth/send-otp` (POST)
- Validates phone number (10-digit Indian format)
- Generates 6-digit OTP
- Stores OTP in database with 10-minute expiration
- Sends OTP via SMS
- Prevents phone number enumeration

#### `/api/auth/verify-otp-register` (POST)
- Verifies OTP for registration
- Checks if user already exists
- Creates new user with phone number
- Returns user data and JWT token

#### `/api/auth/verify-otp-login` (POST)
- Verifies OTP for login
- Checks if user exists
- Returns user data and JWT token

### 4. Updated Auth Utilities

- **`lib/auth-utils.ts`**:
  - `generateToken()` - Now uses phone instead of email
  - `verifyToken()` - Returns phone in decoded token

### 5. Updated Auth Context

- **`lib/auth.tsx`**:
  - Added `sendOtp()` function
  - Updated `login()` to use phone + OTP
  - Updated `register()` to use phone + OTP
  - Removed password-based authentication

### 6. Updated Frontend Pages

#### Registration Page (`app/register/page.tsx`)
- Two-step flow: Phone → OTP
- Phone number validation (10-digit)
- OTP input with resend functionality
- Role selection (Student/Educator)
- Name field (optional)

#### Login Page (`app/login/page.tsx`)
- Two-step flow: Phone → OTP
- Phone number validation
- OTP input with resend functionality

### 7. Updated Type Definitions

- **`types/auth.ts`**:
  - User interface now includes `phone` (required)
  - `email` is now optional (`string | null`)
  - `name` is now optional (`string | null`)

## Environment Variables

Add these to your `.env.local` file:

```env
MSG91_AUTH_KEY=395515AXkDp29FHEDx69637a16P1
MSG91_TEMPLATE_ID=69637ae8ac5de15414632582
```

## Database Migration

Since SQLite doesn't support ALTER COLUMN well, you need to apply the migration using Prisma:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_phone_otp
```

Or if using Turso, apply the migration manually:

```bash
# For SQLite/Turso, you may need to manually handle the migration
# since ALTER COLUMN is limited. Consider:
# 1. Export existing data
# 2. Drop and recreate User table with new schema
# 3. Re-import data (adding phone numbers for existing users)
```

**Important**: For existing users, you'll need to:
1. Add a phone number for each existing user
2. Or create a migration script to handle the transition

## Phone Number Format

- Accepts 10-digit Indian phone numbers
- Validates format: starts with 6-9, followed by 9 digits
- Automatically removes non-digit characters
- Stores as plain 10-digit number (no country code prefix in DB)

## OTP Flow

1. User enters phone number
2. System generates 6-digit OTP
3. OTP stored in database with 10-minute expiration
4. OTP sent via SMS using MSG91
5. User enters OTP
6. System verifies OTP (checks expiration and correctness)
7. For registration: Creates user account
8. For login: Authenticates user
9. OTP marked as verified

## Security Features

- OTPs expire after 10 minutes
- OTPs can only be used once
- Phone number validation prevents invalid inputs
- Prevents phone number enumeration (returns success even if SMS fails)
- Old OTPs are deleted when new ones are generated

## Dependencies

- `axios` - For HTTP requests to MSG91 API (already installed)

## Testing

1. Test registration flow:
   - Enter phone number
   - Receive OTP via SMS
   - Enter OTP
   - Verify account creation

2. Test login flow:
   - Enter phone number
   - Receive OTP via SMS
   - Enter OTP
   - Verify authentication

3. Test error cases:
   - Invalid phone number
   - Expired OTP
   - Wrong OTP
   - Already registered phone number

## Notes

- The old email/password routes (`/api/auth/login` and `/api/auth/register`) still exist but are not used by the frontend
- Email is now optional - users can register with just phone number
- Password is no longer required for authentication
- OTPs are automatically cleaned up (expired ones can be deleted via a cleanup job if needed)
