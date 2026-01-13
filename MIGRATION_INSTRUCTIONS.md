# Database Migration Instructions - Add Phone & Make Email Nullable

## Issue
1. The `phone` column doesn't exist in the User table
2. The `email` column has a NOT NULL constraint, but we're trying to create users without email

## Solution

### Step 1: Apply the Comprehensive Migration

**IMPORTANT**: Apply this migration to fix both issues at once.

If using **Turso** (remote SQLite):

```powershell
# Windows PowerShell - Apply the comprehensive migration
Get-Content prisma\migrations\add-phone-make-email-nullable.sql | turso db shell <your-database-name>
```

Or manually:
1. Open `prisma/migrations/add-phone-make-email-nullable.sql`
2. Copy the SQL content
3. Run: `turso db shell <your-database-name>`
4. Paste the SQL and press Enter

If using **local SQLite**:

```bash
# Using sqlite3 CLI
sqlite3 <your-database.db> < prisma/migrations/add-phone-make-email-nullable.sql
```

**Note**: If you already applied `add-phone-otp.sql`, you still need to apply this migration to make email nullable.

### Step 2: Regenerate Prisma Client

After applying the migration:

```bash
npx prisma generate
```

### Step 3: Verify Migration

Check that the columns exist:

```sql
PRAGMA table_info(User);
```

You should see:
- `phone` column (TEXT, nullable)
- `email` column (TEXT, nullable)

And the `Otp` table should exist:

```sql
.tables
```

Should show: `Otp` table

### Step 4: Restart Your Server

After applying the migration and regenerating Prisma client, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
bun dev
# or
npm run dev
```

## What the Migration Does

1. **Makes `email` nullable** - Removes NOT NULL constraint (required for phone-based auth)
2. **Adds `phone` column** - New column for phone-based authentication
3. **Preserves all existing data** - All user records are copied to the new table structure
4. **Recreates indexes** - All unique indexes and constraints are recreated
5. **Creates `Otp` table** - If not already created (from previous migration)

## Additional Migration: Otp Table

If you haven't already created the Otp table, also run:

```powershell
Get-Content prisma\migrations\add-phone-otp.sql | turso db shell <your-database-name>
```

This will create the Otp table (it's safe to run even if table exists).

## Troubleshooting

If you get "column already exists" errors:
- The migration is idempotent - it's safe to run multiple times
- SQLite will show warnings but won't break

If you still get errors after migration:
1. Check that Prisma client is regenerated: `npx prisma generate`
2. Restart your server
3. Verify the schema matches: `npx prisma db pull` (if using local DB)
