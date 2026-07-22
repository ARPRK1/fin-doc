@echo off
REM FindDoc — build static export, zip it for Netlify, push update to GitHub
cd /d "%~dp0"

echo ==========================================
echo  STEP 1/3: Building static export...
echo ==========================================
call npm run build
if errorlevel 1 goto :fail
if not exist out\index.html goto :fail

echo ==========================================
echo  STEP 2/3: Zipping site for Netlify...
echo ==========================================
if exist finddoc-site.zip del finddoc-site.zip
powershell -NoProfile -Command "Compress-Archive -Path 'out\*' -DestinationPath 'finddoc-site.zip' -Force"
if errorlevel 1 goto :fail

echo ==========================================
echo  STEP 3/3: Pushing update to GitHub...
echo ==========================================
git add -A
git commit -m "Enable static export for universal deployment (Netlify/Vercel/Pages)"
git push origin main

echo.
echo ================= SUCCESS =================
echo  finddoc-site.zip is ready for Netlify.
echo ===========================================
timeout /t 10
exit /b 0

:fail
echo.
echo ========= FAILED - see error above =========
pause
exit /b 1
