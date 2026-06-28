# push-software-links.ps1
$gitExe = "C:\Program Files\Git\cmd\git.exe"
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User") + ";C:\Program Files\Git\cmd"

Set-Location "D:\Download\website_arsip\dirar-site"

& $gitExe add windows.md mac.md extensions.md archived.md
& $gitExe commit -m "Fix layout of links in software download pages"
& $gitExe push origin main

Write-Host "Pushed software links layout fix to GitHub!"
