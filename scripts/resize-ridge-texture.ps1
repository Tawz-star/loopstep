Add-Type -AssemblyName System.Drawing

$src = "c:\Users\tawfe\Desktop\loopstep\public\models\ridge\original\textures\eccometashape.jpg"
$destDir = "c:\Users\tawfe\Desktop\loopstep\public\models\ridge\textures"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

$dest2k = Join-Path $destDir "eccometashape.jpg"

Write-Host "Loading source image: $src"
$img = [System.Drawing.Image]::FromFile($src)
Write-Host "Original dimensions: $($img.Width) x $($img.Height)"

$targetW = 2048
$targetH = 2048

$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$rect = New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH
$graph.DrawImage($img, $rect)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]92)

Write-Host "Saving 2048x2048 optimized JPEG to: $dest2k"
$bmp.Save($dest2k, $codec, $encoderParams)

$graph.Dispose()
$bmp.Dispose()
$img.Dispose()

$fileInfo = Get-Item $dest2k
Write-Host "Saved successfully! Size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB"
