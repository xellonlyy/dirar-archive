$files = @('windows.md', 'mac.md', 'extensions.md', 'archived.md')
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($f in $files) {
    $path = Join-Path "D:\Download\website_arsip\dirar-site" $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
        Write-Host "Fixed encoding to UTF8 No BOM for $f"
    }
}
