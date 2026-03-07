@echo off
echo AI Chat Reply Assistant - Backend Setup
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit
)

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error creating virtual environment
    pause
    exit
)
echo ✓ Virtual environment created

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated

echo.
echo Step 3: Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies
    pause
    exit
)
echo ✓ Dependencies installed

echo.
echo Step 4: Checking .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠ IMPORTANT: Edit .env file and add your GROQ_API_KEY
    echo Get your key from: https://console.groq.com/keys
    echo.
) else (
    echo ✓ .env file already exists
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Make sure your GROQ_API_KEY is in the .env file
echo 2. Run start.bat to start the server
echo.
pause
