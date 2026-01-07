# Applying Prisma Migrations to Turso

Since Prisma Migrate doesn't directly support Turso, you need to apply migrations manually using the Turso CLI.

## Method 1: Using Turso CLI directly

```bash
turso db shell iqmento < prisma/migrations/init.sql
```

## Method 2: Using the provided script (WSL/Linux/Mac)

```bash
chmod +x prisma/apply-migration.sh
./prisma/apply-migration.sh iqmento prisma/migrations/init.sql
```

## Method 3: Copy and paste SQL

1. Open `prisma/migrations/init.sql`
2. Copy all the SQL content
3. Run `turso db shell iqmento`
4. Paste the SQL content and press Enter

## Verify Migration

After applying, you can verify the tables were created:

```bash
turso db shell iqmento
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

## Notes

- Make sure you have `TURSO_DB_URL` and `TURSO_TOKEN` set in your environment
- The database name `iqmento` should match your actual Turso database name
- If you get permission errors, make sure you're authenticated: `turso auth login`

