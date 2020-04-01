@echo off
rem Copyleft Ciel 2017. All rights abandoned.
title Bat - Running

:comp
echo -------------------------------------------------
cd /d %3
%1
echo.
echo.
echo Program exited with status %errorlevel%.

:end
echo Press any key to exit...
pause>nul
exit

