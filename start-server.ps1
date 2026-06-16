Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Remove-Item -Recurse -Force apps\rps-frontend\.next -ErrorAction SilentlyContinue
cd apps\rps-frontend
npx next dev
