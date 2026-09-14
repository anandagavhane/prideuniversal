@echo off
setlocal
echo ===================================================
echo   Pride Festival - Push to GitHub
echo ===================================================
echo.
echo Please create a new empty repository on github.com (if not already done).
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/repo.git): "
if "%REPO_URL%"=="" (
    echo No URL entered. Aborting.
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Renaming branch to main...
git branch -M main

echo.
echo Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo SUCCESS! Your code is now on GitHub!
    echo Next step:
    echo 1. Go to your GitHub repository in your browser.
    echo 2. Click the 'Actions' tab.
    echo 3. The 'Build iOS Native App (IPA)' will automatically run or click 'Run workflow'.
    echo 4. Download your 'PrideFestival-iOS.ipa' from the Artifacts section!
    echo ===================================================
) else (
    echo.
    echo Error pushing to GitHub. Please verify your repository URL and GitHub login credentials.
)
echo.
pause
