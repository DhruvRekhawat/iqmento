# Applying Prisma Migrations to Turso

Since Prisma Migrate doesn't directly support Turso, you need to apply migrations manually using the Turso CLI.

## Available Migrations

Apply migrations in order:
1. `init.sql` - Initial schema (tables and indexes)
2. `add-password.sql` - Adds passwordHash to User table
3. `add-payment-fields.sql` - Adds payment fields to Booking table
4. `add-kyc-fields.sql` - Adds KYC document fields to User table

## Method 1: Using Turso CLI directly (Linux/Mac/WSL)

```bash
turso db shell <your-database-name> < prisma/migrations/init.sql
turso db shell <your-database-name> < prisma/migrations/add-password.sql
turso db shell <your-database-name> < prisma/migrations/add-payment-fields.sql
turso db shell <your-database-name> < prisma/migrations/add-kyc-fields.sql
```

## Method 2: Using PowerShell script (Windows)

```powershell
.\prisma\apply-migration.ps1 <your-database-name> prisma\migrations\init.sql
.\prisma\apply-migration.ps1 <your-database-name> prisma\migrations\add-password.sql
.\prisma\apply-migration.ps1 <your-database-name> prisma\migrations\add-payment-fields.sql
.\prisma\apply-migration.ps1 <your-database-name> prisma\migrations\add-kyc-fields.sql
```

## Method 3: Using bash script (WSL/Linux/Mac)

```bash
chmod +x prisma/apply-migration.sh
./prisma/apply-migration.sh <your-database-name> prisma/migrations/init.sql
./prisma/apply-migration.sh <your-database-name> prisma/migrations/add-password.sql
./prisma/apply-migration.sh <your-database-name> prisma/migrations/add-payment-fields.sql
./prisma/apply-migration.sh <your-database-name> prisma/migrations/add-kyc-fields.sql
```

## Method 4: Copy and paste SQL

1. Open the migration file (e.g., `prisma/migrations/add-kyc-fields.sql`)
2. Copy all the SQL content
3. Run `turso db shell <your-database-name>`
4. Paste the SQL content and press Enter

## Quick Apply All Migrations (PowerShell)

```powershell
$dbName = "iqmento"  # Replace with your database name
Get-Content prisma\migrations\init.sql | turso db shell $dbName
Get-Content prisma\migrations\add-password.sql | turso db shell $dbName
Get-Content prisma\migrations\add-payment-fields.sql | turso db shell $dbName
Get-Content prisma\migrations\add-kyc-fields.sql | turso db shell $dbName
```

## Verify Migration

After applying, verify the schema:

```bash
turso db shell <your-database-name>
```

Then run:
```sql
.tables
```

You should see:
- User
- Service
- AvailabilityRule
- AvailabilitySlot
- Booking

Check User table columns:
```sql
PRAGMA table_info(User);
```

You should see:
- id, email, name, role, passwordHash
- educatorSlug, kycStatus
- kycCollege, kycGraduationYear, kycLinkedin, kycDocumentUrl
- createdAt, updatedAt

## Notes

- Make sure you have `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set in your environment
- Replace `<your-database-name>` with your actual Turso database name (e.g., `iqmento`)
- If you get permission errors, make sure you're authenticated: `turso auth login`
- Migrations are idempotent - if columns already exist, SQLite will show an error but won't break anything

