# Email/Password Authentication Implementation

## Overview

Successfully implemented proper email/password authentication system replacing the mock localStorage-based auth. The system uses Turso database, bcryptjs for password hashing, and JWT tokens for session management.

## What Was Implemented

### 1. Database Schema Updates
- Added `passwordHash` field to `User` model in Prisma schema
- Updated role comment to include "ADMIN"
- Created migration SQL file: `prisma/migrations/add-password.sql`

### 2. Dependencies Installed
- `bcryptjs` - Password hashing (pure JS)
- `@types/bcryptjs` - TypeScript types
- `jsonwebtoken` - JWT token generation
- `@types/jsonwebtoken` - TypeScript types
- `tsx` - TypeScript execution for scripts

### 3. API Routes Created

#### `/api/auth/login` (POST)
- Validates email and password
- Verifies password hash using bcryptjs
- Returns user data and JWT token
- Error handling for invalid credentials

#### `/api/auth/register` (POST)
- Validates email uniqueness
- Hashes password with bcryptjs (10 rounds)
- Creates user in database
- Returns user data and JWT token
- Minimum password length: 6 characters

#### `/api/auth/logout` (POST)
- Placeholder endpoint for consistency
- Logout handled client-side (token removal)

#### `/api/auth/me` (GET)
- Returns current authenticated user
- Validates JWT token from Authorization header
- Used for session verification

### 4. Auth Utilities (`lib/auth-utils.ts`)
- `hashPassword()` - Hash passwords with bcryptjs
- `verifyPassword()` - Verify password against hash
- `generateToken()` - Create JWT tokens
- `verifyToken()` - Validate JWT tokens
- `getTokenFromRequest()` - Extract token from request headers

### 5. Updated Auth Context (`lib/auth.tsx`)
- Replaced localStorage mock auth with API calls
- Stores JWT token in localStorage
- Stores user data in localStorage
- Fetches user on mount if token exists
- Validates token on app load
- Handles loading states
- Error handling for API calls

### 6. Updated Login Page (`app/login/page.tsx`)
- Added password input field
- Async form submission with API call
- Error message display
- Loading state during login
- Automatic redirect based on user role
- Role-based redirect paths:
  - STUDENT → `/dashboard/student`
  - EDUCATOR → `/dashboard/educator`
  - ADMIN → `/admin`

### 7. Updated Register Page (`app/register/page.tsx`)
- Added password input field
- Added password confirmation field
- Password validation (min 6 characters)
- Password match validation
- Async form submission with API call
- Error message display
- Loading state during registration

### 8. Admin Password Script (`scripts/admin-password.ts`)
- CLI script for admin user management
- Commands:
  - `create <email> <password>` - Create new admin or update existing user to admin
  - `change <email> <new-password>` - Change password for existing user
- Simple overwrite (no validation checks as requested)
- Uses Prisma client directly
- Hashes passwords with bcryptjs

**Usage:**
```bash
# Create admin user
npm run admin-password create admin@example.com mypassword123

# Change admin password
npm run admin-password change admin@example.com newpassword123
```

### 9. Database Migration
- Created `prisma/migrations/add-password.sql`
- SQL: `ALTER TABLE User ADD COLUMN passwordHash TEXT;`

**To apply migration:**
```bash
turso db shell iqmento < prisma/migrations/add-password.sql
```

## Security Features

- Passwords hashed with bcryptjs (10 rounds)
- Password hash never returned in API responses
- JWT tokens for session management
- Token validation on app load
- Minimum password length: 6 characters
- Email normalization (lowercase, trimmed)

## Environment Variables

Make sure these are set:
- `TURSO_DB_URL` - Your Turso database URL
- `TURSO_TOKEN` - Your Turso authentication token
- `JWT_SECRET` - Secret key for JWT tokens (defaults to insecure fallback - change in production!)

## Next Steps

1. **Apply Migration**: Run the migration SQL to add passwordHash column
2. **Set JWT_SECRET**: Add secure JWT secret to environment variables
3. **Create First Admin**: Use the admin script to create your first admin user
4. **Test Authentication**: Test login/register flows
5. **Update Existing Users**: If you have existing users, they'll need to set passwords (or use admin script)

## Files Modified/Created

**New Files:**
- `lib/auth-utils.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`
- `scripts/admin-password.ts`
- `prisma/migrations/add-password.sql`

**Modified Files:**
- `prisma/schema.prisma`
- `lib/auth.tsx`
- `app/login/page.tsx`
- `app/register/page.tsx`
- `package.json`

## Testing

1. Register a new user:
   - Go to `/register`
   - Fill in name, email, password
   - Select role (STUDENT or EDUCATOR)
   - Submit form

2. Login:
   - Go to `/login`
   - Enter email and password
   - Should redirect to appropriate dashboard

3. Create admin:
   ```bash
   npm run admin-password create admin@example.com admin123
   ```

4. Login as admin:
   - Use admin credentials
   - Should redirect to `/admin`

