@echo off
REM R2 Setup Script for TempChat
REM ================================

echo.
echo ========================================
echo   R2 Cloudflare Setup for TempChat
echo ========================================
echo.

REM Check if credentials are set
if "%R2_ACCESS_KEY_ID%"=="" (
    echo ERROR: R2_ACCESS_KEY_ID not set in environment!
    echo.
    echo Please set your R2 credentials:
    echo   set R2_ACCESS_KEY_ID=your_access_key_id
    echo   set R2_SECRET_ACCESS_KEY=your_secret_access_key
    echo.
    echo Then run this script again.
    exit /b 1
)

echo Setting up CORS for R2 bucket...
echo.

REM Set CORS using AWS CLI (requires aws-cli with R2 configured)
aws s3api put-bucket-cors ^
  --bucket tempchat-files ^
  --cors-configuration file://scripts\r2-cors.json ^
  --endpoint-url https://%R2_ACCOUNT_ID%.r2.cloudflarestorage.com ^
  --profile r2

if %errorlevel% equ 0 (
    echo.
    echo CORS configured successfully!
) else (
    echo.
    echo CORS configuration may have failed. Please configure manually:
    echo   1. Go to Cloudflare Dashboard ^> R2 ^> tempchat-files
    echo   2. Settings ^> CORS
    echo   3. Add rule allowing all origins
)

echo.
echo Setup complete!
