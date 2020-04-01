@echo off
rem Copyleft Ciel 2017. All rights abandoned.
title C - Running

:comp
set PATH=%PATH%;%~dp0..\environments\mingw64\bin
cd /d %3
gcc %1 -o %2.exe -std=c99 || goto end
echo -------------------------------------------------
%2.exe
echo.
echo.
echo Program exited with status %errorlevel%.

:end
echo Press any key to exit...
pause>nul
exit

