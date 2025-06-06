@echo off
setlocal

REM Define service directories
set SERVICES=api-gateway auth-service file-service task-service user-service

REM Loop through each service
for %%S in (%SERVICES%) do (
  echo Updating %%S

  REM Path to the service package.json
  set "SERVICE_PKG=%%S\package.json"

  REM Check if package.json exists
  if exist %%S\package.json (
    REM Use PowerShell to replace xcopy line with cp -r
    powershell -Command "(Get-Content %%S\package.json) -replace 'xcopy src\\\\proto dist\\\\proto /E /I /Y', 'cp -r src/proto dist/proto' | Set-Content %%S\package.json"
    echo Updated copy:proto script in %%S\package.json
  ) else (
    echo %%S\package.json not found!
  )

  REM Copy root-level package files
  copy /Y package.json %%S\ > nul
  copy /Y package-lock.json %%S\ > nul
  echo Copied package.json and package-lock.json to %%S
)

echo Done.
