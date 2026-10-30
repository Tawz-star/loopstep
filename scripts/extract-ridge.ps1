$zipPath = "C:\Users\tawfe\Downloads\worn-hiking-shoes.zip"
$destDir = "c:\Users\tawfe\Desktop\loopstep\public\models\ridge\original"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

Write-Host "Extracting outer zip: $zipPath"
Expand-Archive -Path $zipPath -DestinationPath $destDir -Force

Write-Host "Checking extracted files in $destDir"
Get-ChildItem -Path $destDir -Recurse | Select-Object FullName, Length

$nestedZip = Join-Path $destDir "source\eccoblender.zip"
if (Test-Path $nestedZip) {
    Write-Host "Extracting nested zip: $nestedZip"
    Expand-Archive -Path $nestedZip -DestinationPath $destDir -Force
    Write-Host "Nested extraction complete."
} else {
    Write-Host "Searching for nested zip in $destDir..."
    $found = Get-ChildItem -Path $destDir -Filter "*.zip" -Recurse
    foreach ($f in $found) {
        Write-Host "Extracting: $($f.FullName)"
        Expand-Archive -Path $f.FullName -DestinationPath $destDir -Force
    }
}

Write-Host "Final listing in $($destDir):"
Get-ChildItem -Path $destDir -Recurse | Select-Object FullName, Length
