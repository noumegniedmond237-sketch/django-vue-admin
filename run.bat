@echo off
setlocal

chcp 65001 >nul
title Django Vue Admin - Lanceur Intelligent
cd /d "%~dp0"
set "ROOT_DIR=%~dp0"

echo ==============================================================================
echo       DJANGO VUE ADMIN - DEMARRAGE ET VERIFICATION DE L'ENVIRONNEMENT
echo ==============================================================================
echo.

REM 1. Verification de Python
echo [1/5] Verification de Python...
python --version >nul 2>&1
if errorlevel 1 goto err_python
python --version
echo   -- Python detecte. [OK]

REM 2. Verification de Node.js et NPM
echo.
echo [2/5] Verification de Node.js et npm...
node --version >nul 2>&1
if errorlevel 1 goto err_node
call npm --version >nul 2>&1
if errorlevel 1 goto err_node

echo   -- Node.js:
node --version
echo   -- npm:
call npm --version
echo   -- Environnement Node.js detecte. [OK]

REM 3. Environnement virtuel Python et dependances Backend
echo.
echo [3/5] Verification du Backend Python...

set VENV_PY=
if exist "backend\.venv_sys\Scripts\python.exe" set "VENV_PY=%ROOT_DIR%backend\.venv_sys\Scripts\python.exe"
if not defined VENV_PY if exist "backend\.venv\Scripts\python.exe" set "VENV_PY=%ROOT_DIR%backend\.venv\Scripts\python.exe"
if not defined VENV_PY if exist ".venv\Scripts\python.exe" set "VENV_PY=%ROOT_DIR%.venv\Scripts\python.exe"

if not defined VENV_PY (
    echo   -- Aucun environnement virtuel trouve. Creation de backend\.venv_sys...
    python -m venv "%ROOT_DIR%backend\.venv_sys"
    if errorlevel 1 goto err_venv
    set "VENV_PY=%ROOT_DIR%backend\.venv_sys\Scripts\python.exe"
    echo   -- Environnement virtuel cree avec succes.
)

echo   -- Environnement virtuel : %VENV_PY%

REM Verifier les packages python indispensables
"%VENV_PY%" -c "import django, rest_framework, captcha" >nul 2>&1
if errorlevel 1 (
    echo   -- Installation des dependances Python depuis backend\requirements.txt...
    "%VENV_PY%" -m pip install --upgrade pip
    "%VENV_PY%" -m pip install -r "%ROOT_DIR%backend\requirements.txt"
    if errorlevel 1 goto err_pydeps
    echo   -- Dependances Python installees avec succes.
) else (
    echo   -- Dependances Python valides. [OK]
)

REM Verifier et initialiser la base de donnees si neuve
set FRESH_DB=0
if not exist "backend\db.sqlite3" set FRESH_DB=1

echo   -- Verification des migrations de base de donnees...
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cd /d "%ROOT_DIR%backend"
"%VENV_PY%" manage.py migrate
if "%FRESH_DB%"=="1" (
    echo   -- Initialisation des donnees et fixtures du systeme...
    "%VENV_PY%" manage.py init
    "%VENV_PY%" manage.py init_area
)
cd /d "%ROOT_DIR%"

REM 4. Dependances Frontend
echo.
echo [4/5] Verification du Frontend [web/node_modules]...
set INSTALL_FRONT=0
if not exist "web\node_modules" set INSTALL_FRONT=1
if not exist "web\node_modules\vxe-table" set INSTALL_FRONT=1

if "%INSTALL_FRONT%"=="1" (
    echo   -- Installation des modules Node.js [npm install]...
    cd /d "%ROOT_DIR%web"
    call npm install
    if errorlevel 1 goto err_npm
    cd /d "%ROOT_DIR%"
    echo   -- Dependances Frontend installees avec succes.
) else (
    echo   -- Dependances Frontend valides. [OK]
)

REM 5. Lancement des serveurs
echo.
echo [5/5] Lancement des serveurs Backend et Frontend...

echo   -- Lancement du serveur Django [http://127.0.0.1:8000]...
start "Django Vue Admin - Backend" /D "%ROOT_DIR%backend" cmd /k "set PYTHONUTF8=1& set PYTHONIOENCODING=utf-8& \"%VENV_PY%\" manage.py runserver 127.0.0.1:8000"

echo   -- Lancement du serveur Vue [http://localhost:8080]...
start "Django Vue Admin - Frontend" /D "%ROOT_DIR%web" cmd /k "set NODE_OPTIONS=--openssl-legacy-provider& npm run dev"

echo.
echo ==============================================================================
echo                 APPLICATION DEMARREE AVEC SUCCES !
echo ==============================================================================
echo.
echo   * URL Application Frontend : http://localhost:8080/
echo   * API Backend / Swagger    : http://127.0.0.1:8000/api/
echo   * Identifiants par defaut  : superadmin / admin123456
echo.
echo   Ouverture automatique du navigateur dans 5 secondes...
echo.

ping 127.0.0.1 -n 5 >nul
start http://localhost:8080/

echo Vous pouvez fermer cette fenetre de controle.
echo Pour arreter l'application, fermez les deux fenetres de serveurs ouvertes.
echo.
pause
exit /b 0

:err_python
echo.
echo [ERREUR] Python n'est pas installe ou n'est pas dans le PATH.
echo Installez Python 3.8+ (https://www.python.org/downloads/) et cochez 'Add Python to PATH'.
pause
exit /b 1

:err_node
echo.
echo [ERREUR] Node.js ou npm n'est pas installe ou n'est pas dans le PATH.
echo Installez Node.js LTS (https://nodejs.org/).
pause
exit /b 1

:err_venv
echo.
echo [ERREUR] Echec de la creation de l'environnement virtuel.
pause
exit /b 1

:err_pydeps
echo.
echo [ERREUR] Echec de l'installation des dependances Python.
pause
exit /b 1

:err_npm
cd /d "%ROOT_DIR%"
echo.
echo [ERREUR] Echec de npm install dans le dossier web.
pause
exit /b 1
