# final-fix-lists.ps1
$files = @('windows.md', 'mac.md', 'extensions.md', 'archived.md')
foreach ($f in $files) {
    $path = Join-Path "D:\Download\website_arsip\dirar-site" $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Regex to add bullet points to lines starting with [
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^\[', '- [')
        
        [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed lists in $f"
    }
}
