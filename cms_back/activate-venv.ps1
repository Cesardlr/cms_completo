# Quick script to activate the virtual environment

if (Test-Path ".\venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
    Write-Host "✅ Virtual environment activated!" -ForegroundColor Green
    Write-Host "You can now run: locust -f locustfile.py --host=http://localhost:5000" -ForegroundColor Cyan
} else {
    Write-Host "❌ Virtual environment not found. Run setup-venv.ps1 first." -ForegroundColor Red
}





