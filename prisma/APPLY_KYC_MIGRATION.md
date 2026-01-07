# Applying KYC Fields Migration to Turso

This migration adds KYC document fields to the User table:
- `kycCollege` (TEXT) - College name
- `kycGraduationYear` (INTEGER) - Graduation year
- `kycLinkedin` (TEXT) - LinkedIn profile URL
- `kycDocumentUrl` (TEXT) - URL to document stored in Strapi

## Method 1: Using Turso CLI directly (Windows PowerShell)

```powershell
Get-Content prisma\migrations\add-kyc-fields.sql | turso db shell <your-database-name>
```

Or using cmd:
```cmd
type prisma\migrations\add-kyc-fields.sql | turso db shell <your-database-name>
```

## Method 2: Using PowerShell script

```powershell
.\prisma\apply-migration.ps1 <your-database-name> prisma\migrations\add-kyc-fields.sql
```

Example:
```powershell
.\prisma\apply-migration.ps1 iqmento prisma\migrations\add-kyc-fields.sql
```

## Method 3: Copy and paste SQL

1. Open `prisma/migrations/add-kyc-fields.sql`
2. Copy all the SQL content
3. Run `turso db shell <your-database-name>`
4. Paste the SQL content and press Enter

## Method 4: Using Turso CLI with input redirection (Linux/Mac/WSL)

```bash
turso db shell <your-database-name> < prisma/migrations/add-kyc-fields.sql
```

Or using the bash script:
```bash
chmod +x prisma/apply-migration.sh
./prisma/apply-migration.sh <your-database-name> prisma/migrations/add-kyc-fields.sql
```

## Verify Migration

After applying, verify the columns were added:

```bash
turso db shell <your-database-name>
```

Then run:
```sql
.schema User
```

You should see the new columns:
- `kycCollege TEXT`
- `kycGraduationYear INTEGER`
- `kycLinkedin TEXT`
- `kycDocumentUrl TEXT`

## Notes

- Make sure you have `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set in your environment
- Replace `<your-database-name>` with your actual Turso database name (e.g., `iqmento`)
- If you get permission errors, make sure you're authenticated: `turso auth login`
- The migration is idempotent - if columns already exist, SQLite will show an error but won't break anything

## Troubleshooting

If you get "duplicate column name" errors, the columns already exist. You can check with:
```sql
PRAGMA table_info(User);
```

This will show all columns in the User table.

