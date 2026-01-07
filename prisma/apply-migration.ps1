# PowerShell script to apply Prisma migration to Turso database
# Usage: .\apply-migration.ps1 <database-name> <migration-file>
# Example: .\apply-migration.ps1 iqmento prisma\migrations\add-kyc-fields.sql

param(
    [Parameter(Mandatory=$true)]
    [string]$DatabaseName,
    
    [Parameter(Mandatory=$true)]
    [string]$MigrationFile
)

if (-not (Test-Path $MigrationFile)) {
    Write-Host "Error: Migration file not found: $MigrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "Applying migration $MigrationFile to database $DatabaseName..." -ForegroundColor Cyan

# Read the SQL file content
$sqlContent = Get-Content $MigrationFile -Raw

# Apply migration using Turso CLI
$sqlContent | turso db shell $DatabaseName

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration applied successfully!" -ForegroundColor Green
} else {
    Write-Host "Error applying migration" -ForegroundColor Red
    exit 1
}

