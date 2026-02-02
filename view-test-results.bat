@echo off
echo ========================================
echo Portfolio Testing Results Viewer
echo ========================================
echo.

echo Generated Screenshots:
dir tests\e2e\screenshots\*.png | findstr png

echo.
echo Test Reports:
dir test-results\*.json
dir test-results\*.html

echo.
echo Opening HTML Report...
npx playwright show-report

echo.
echo ========================================
echo Analysis Report:
type TESTING_ANALYSIS_REPORT.md
echo ========================================