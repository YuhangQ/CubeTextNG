@echo off
rem Copyleft Ciel 2017. All rights abandoned.
title C++ - Running

:comp
set PATH=%PATH%;%~dp0..\environments\mingw64\bin
cd /d %3
g++ %1 -o %2 -std=c++11 -lm -Wall -g -static-libgcc -static-libstdc++ || goto end
echo -------------------------------------------------
%2.exe
echo.
echo.
echo Program exited with status %errorlevel%.

:end
echo Press any key to exit...
pause>nul
exit

