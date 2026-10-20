# Deploys each publication to Vercel as its own prebuilt static project.
# Prereqs: `npm i -g vercel` and `vercel login` done once.
# Usage:
#   pwsh scripts/deploy-vercel.ps1            # preview deploys of all 5
#   pwsh scripts/deploy-vercel.ps1 -Prod      # production deploys of all 5
#   pwsh scripts/deploy-vercel.ps1 -Only pt-practice-journal -Prod
#
# First deploy of each folder: Vercel asks to link/create a project — accept, and give it a
# distinct name (e.g. "ptpracticejournal"). After that, add the real domain to each project
# in the Vercel dashboard (Project -> Settings -> Domains).

param(
  [switch]$Prod,
  [string]$Only = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "Building all publications..." -ForegroundColor Cyan
node build.js | Out-Host

$slugs = @(
  "digital-health-news",
  "healthtech-insider",
  "pt-practice-journal",
  "applied-ai-review",
  "medical-practice-business"
)
if ($Only) { $slugs = @($Only) }

foreach ($slug in $slugs) {
  $dir = Join-Path $root "dist/$slug"
  if (-not (Test-Path $dir)) { Write-Warning "Missing $dir — skipping"; continue }
  Write-Host "`nDeploying $slug ..." -ForegroundColor Green
  # Deploy the prebuilt static directory directly (no remote build step needed).
  if ($Prod) { vercel deploy $dir --prod }
  else { vercel deploy $dir }
}

Write-Host "`nDone. Add each project's real domain in the Vercel dashboard, then update" -ForegroundColor Cyan
Write-Host "config/publications.js 'domain' fields and rebuild so canonical/OG/sitemap URLs match." -ForegroundColor Cyan
