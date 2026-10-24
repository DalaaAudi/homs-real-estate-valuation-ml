Write-Host "Closing all project services and terminals..." -ForegroundColor Red

# 1. إغلاق خوادم بايثون ونود
taskkill /F /IM python.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null

# 2. إغلاق نوافذ PowerShell الفرعية للمشروع
Get-Process -Name powershell | Where-Object { $_.Id -ne $PID } | Stop-Process -Force

Write-Host "All project services and terminals closed successfully!" -ForegroundColor Green