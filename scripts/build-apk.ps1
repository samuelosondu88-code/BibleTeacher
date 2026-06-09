# Build APK for Bible Teacher
# Run this from the project root directory

Write-Host "=== Bible Teacher APK Builder ===" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm.cmd -ErrorAction SilentlyContinue
$hasJava = Get-Command java -ErrorAction SilentlyContinue
$hasAndroidHome = Test-Path $env:ANDROID_HOME -ErrorAction SilentlyContinue

if (-not $hasNode) { Write-Host "ERROR: Node.js not found" -ForegroundColor Red; exit 1 }
if (-not $hasNpm) { Write-Host "ERROR: npm not found" -ForegroundColor Red; exit 1 }
if (-not $hasJava) { Write-Host "ERROR: Java not found. Install JDK 17+" -ForegroundColor Red; exit 1 }
if (-not $hasAndroidHome) { Write-Host "WARNING: ANDROID_HOME not set. Check your Android SDK path." -ForegroundColor Yellow }

Write-Host "1. Installing npm dependencies..." -ForegroundColor Green
npm.cmd install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed" -ForegroundColor Red; exit 1 }

Write-Host "2. Bundling JS bundle..." -ForegroundColor Green
npx.cmd react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
if ($LASTEXITCODE -ne 0) { Write-Host "Bundle failed" -ForegroundColor Red; exit 1 }

Write-Host "3. Building release APK..." -ForegroundColor Green
Push-Location -LiteralPath "android"
./gradlew assembleRelease
if ($LASTEXITCODE -ne 0) { Write-Host "APK build failed" -ForegroundColor Red; Pop-Location; exit 1 }
Pop-Location

Write-Host ""
Write-Host "=== APK Build Complete! ===" -ForegroundColor Cyan
Write-Host "APK location: android/app/build/outputs/apk/release/app-release.apk" -ForegroundColor Green
Write-Host "Debug APK: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Green

# For signed production APK, create a keystore first:
Write-Host ""
Write-Host "For a signed production APK, generate a keystore:" -ForegroundColor Yellow
Write-Host '  keytool -genkey -v -keystore bible-teacher.keystore -alias bibleteacher -keyalg RSA -keysize 2048 -validity 10000' -ForegroundColor White
Write-Host "Then update android/app/build.gradle signingConfigs" -ForegroundColor Yellow
