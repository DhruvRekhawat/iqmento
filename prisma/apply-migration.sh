#!/bin/bash
# Script to apply Prisma migration to Turso database
# Usage: ./apply-migration.sh <database-name> <migration-file>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./apply-migration.sh <database-name> <migration-file>"
    echo "Example: ./apply-migration.sh iqmento prisma/migrations/init.sql"
    exit 1
fi

DB_NAME=$1
MIGRATION_FILE=$2

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "Applying migration $MIGRATION_FILE to database $DB_NAME..."
turso db shell $DB_NAME < $MIGRATION_FILE

if [ $? -eq 0 ]; then
    echo "Migration applied successfully!"
else
    echo "Error applying migration"
    exit 1
fi

