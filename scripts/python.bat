@echo off
rem Copyleft Ciel 2017. All rights abandoned.
title Python - Running

:comp
set PATH=%PATH%;%~dp0..\environments\python38-32
echo -------------------------------------------------
cd /d %3
%~dp0..\environments\python38-32\python %1
echo.
echo.
echo Program exited with status %errorlevel%.

:end
echo Press any key to exit...
pause>nul
exit

