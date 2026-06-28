$files = @('windows.md', 'mac.md', 'extensions.md', 'archived.md')
foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f
        $newContent = $content | ForEach-Object {
            if ($_ -match '^\s*\[.*\]\(' -and $_ -notmatch '^\s*-') {
                "- " + $_.TrimStart()
            } else {
                $_
            }
        }
        $newContent | Set-Content $f -Encoding UTF8
        Write-Host "Updated $f"
    }
}
