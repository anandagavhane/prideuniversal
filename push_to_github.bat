@echo off
setlocal
echo ===================================================
echo   Pride Festival - Push to GitHub
echo ===================================================
echo.
set REPO_URL=https://github.com/anandagavhane/prideuniversal.git

echo Target Repository: %REPO_URL%
echo.
echo Configuring remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Setting main branch...
git branch -M main

echo.
echo Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo SUCCESS! Your code is now on GitHub!
    echo Next step:
    echo 1. Open: https://github.com/anandagavhane/prideuniversal/actions
    echo 2. The 'Build iOS Native App (IPA)' workflow will run automatically.
    echo 3. Download 'PrideFestival-iOS.ipa' from the Artifacts section!
    echo ===================================================
) else (
    echo.
    echo Error pushing to GitHub. Please sign in to your GitHub account if prompted.
)
echo.
pause
