@echo off
REM FindDoc India — one-shot: install, verify build, push to GitHub
cd /d "%~dp0"

echo ==========================================
echo  STEP 1/3: Installing dependencies...
echo ==========================================
call npm install
if errorlevel 1 goto :fail

echo ==========================================
echo  STEP 2/3: Verifying production build...
echo ==========================================
call npm run build
if errorlevel 1 goto :fail

echo ==========================================
echo  STEP 3/3: Pushing to GitHub...
echo ==========================================
git init
git config user.name "ARPRK1"
git config user.email "rp271187@gmail.com"
git add -A
git commit -m "FindDoc India: complete healthcare discovery platform"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/ARPRK1/fin-doc.git
git push -u origin main
if errorlevel 1 goto :fail

echo.
echo ================= SUCCESS =================
echo  Build verified and code pushed to:
echo  https://github.com/ARPRK1/fin-doc
echo ===========================================
pause
exit /b 0

:fail
echo.
echo ========= FAILED - see error above =========
pause
exit /b 1
