$ErrorActionPreference = "Stop"

# Source (vly.ai)
$ORIGIN_URL = "https://next-cod-660.convex.cloud"

# Destination (nuevo PROD)
$DESTINO_URL = "https://formal-dogfish-712.convex.cloud"
$DESTINO_DEPLOY_KEY = "prod:formal-dogfish-712|eyJ2MiI6ImExMjJjMTdmNGI4NzQ0NTBiYzUwYWExZGJjZThlNTliIn0="

Write-Host "--- Starting Data Migration ---" -ForegroundColor Cyan
Write-Host "Note: This script assumes you are already logged in to Convex CLI (npx convex login)." -ForegroundColor Gray

# 1. Export from Source
Write-Host "Exporting data from $ORIGIN_URL..." -ForegroundColor Yellow
npx convex export --url $ORIGIN_URL --path data_export.zip

if (Test-Path data_export.zip) {
    Write-Host "Export successful: data_export.zip created." -ForegroundColor Green
} else {
    Write-Error "Export failed: data_export.zip not found."
}

# 2. Import to Destination
Write-Host "Importing data to $DESTINO_URL..." -ForegroundColor Yellow
# We use the deploy key for the destination as it's typically required for production imports
$env:CONVEX_DEPLOY_KEY = $DESTINO_DEPLOY_KEY
npx convex import data_export.zip --url $DESTINO_URL --yes

Write-Host "--- Migration Complete ---" -ForegroundColor Green
