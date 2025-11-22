# PowerShell script to set up and activate Python virtual environment for Locust

Write-Host "🐍 Setting up Python virtual environment..." -ForegroundColor Cyan

# Check if Python is available
try {
    $pythonVersion = python --version
    Write-Host "✓ Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.7+ first." -ForegroundColor Red
    exit 1
}

# Navigate to cms_back directory
Set-Location $PSScriptRoot

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install requirements
Write-Host "Installing Locust and dependencies..." -ForegroundColor Yellow
pip install -r requirements-locust.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Setup complete! Virtual environment is now active." -ForegroundColor Green
    Write-Host "`nTo run Locust:" -ForegroundColor Cyan
    Write-Host "  locust -f locustfile.py --host=http://localhost:5000" -ForegroundColor White
    Write-Host "`nTo deactivate the virtual environment later:" -ForegroundColor Cyan
    Write-Host "  deactivate" -ForegroundColor White
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}





