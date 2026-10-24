# ============================================================
#  run_all.ps1 - Flask + React (Dynamic Path Version)
# ============================================================

# تحديد مسار المجلد الرئيسي للمشروع تلقائياً حيث يوجد هذا السكربت
$RootFolder = $PSScriptRoot

# 1. تشغيل Flask AI Service على المنفذ 5092
Write-Host "4. Starting Flask AI Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootFolder\ml-service'; if (Test-Path .\venv) { .\venv\Scripts\Activate.ps1 }; python app.py"

# 2. تشغيل React Frontend على المنفذ 5173
Write-Host "5. Starting React Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootFolder\web-client'; npm run dev"

# 3. الانتظار لتهيئة السيرفرات ثم تشغيل المتصفح
Write-Host "Waiting 5 seconds for Web & AI services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Process "http://localhost:5173"