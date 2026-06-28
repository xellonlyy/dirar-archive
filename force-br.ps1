# force-br.ps1
$files = @('windows.md', 'mac.md', 'extensions.md', 'archived.md')
foreach ($f in $files) {
    $path = Join-Path "D:\Download\website_arsip\dirar-site" $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Add <br> to the end of lines that start with - [
        # (?m) makes $ match end of line
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^(- \[.*)$', '$1<br>')
        
        [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Added <br> to $f"
    }
}
