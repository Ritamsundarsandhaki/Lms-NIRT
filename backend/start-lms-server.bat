@echo off
title LMS Server and LocalTunnel Starter

:: Navigate to backend directory
cd /d C:\Users\HP\fullstack\Lms_Test\backend

:: Start the Node.js server
echo Starting the Node server using npm run dev...
start cmd /k "npm run dev"

:: Wait for server to spin up (adjust delay if needed)
timeout /t 5 >nul

:: Start LocalTunnel on port 1407 with custom subdomain
echo Starting LocalTunnel on port 1407 with subdomain lmsdevritam...
start cmd /k "lt --port 1407 --subdomain lmsdevritam"

:: Optional: Use curl to test tunnel with bypass header (uncomment to enable)
REM timeout /t 10 >nul
REM curl -H "bypass-tunnel-reminder: true" https://lmsdevritam.loca.lt
