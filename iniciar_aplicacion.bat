@echo off
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit
echo Iniciando Aplicacion de Control SINPE Movil...

for /f "delims=" %%I in ('powershell -command "(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '172.*' } | Select-Object -First 1).IPAddress"') do set LOCAL_IP=%%I

cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
start /min cmd /c "title SINPE Backend && uvicorn main:app --host 0.0.0.0 --reload --port 8000"

cd ..\frontend
if not exist "node_modules" (
    npm install
)
start /min cmd /c "title SINPE Frontend && npm run dev -- --host"

cd ..
if defined LOCAL_IP (
    echo Hola! Enviale este mensaje a tus compañeros para que puedan entrar al sistema: > "Enlace_Para_La_Oficina.txt"
    echo. >> "Enlace_Para_La_Oficina.txt"
    echo Enlace del sistema: http://%LOCAL_IP%:5173 >> "Enlace_Para_La_Oficina.txt"
    echo. >> "Enlace_Para_La_Oficina.txt"
    echo (Nota: Solo funciona cuando esten conectados al Wifi o Red de la misma oficina^) >> "Enlace_Para_La_Oficina.txt"
)

timeout /t 5 /nobreak >nul
start http://localhost:5173
exit
