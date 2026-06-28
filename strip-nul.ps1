# strip-nul.ps1
$files = @('windows.md', 'mac.md', 'extensions.md', 'archived.md')
foreach ($f in $files) {
    $path = Join-Path "D:\Download\website_arsip\dirar-site" $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        $clean = $content.Replace("`0", "")
        [System.IO.File]::WriteAllText($path, $clean, [System.Text.Encoding]::UTF8)
        Write-Host "Cleaned $f"
    }
}
