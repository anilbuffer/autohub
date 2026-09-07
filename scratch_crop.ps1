Add-Type -AssemblyName System.Drawing

$sourcePath = 'C:\Users\DELL-566\.gemini\antigravity-ide\brain\5ad8ba8b-f2b7-4e77-a005-f0b3ac842d81\.user_uploaded\media_1788765854929.png'
$img = [System.Drawing.Bitmap]::FromFile($sourcePath)

$minX = 26
$maxX = 492
$minY = 64
$maxY = 555

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1
$cropRect = [System.Drawing.Rectangle]::new($minX, $minY, $cropWidth, $cropHeight)
$cropped = $img.Clone($cropRect, $img.PixelFormat)
$cropped.Save('e:\autohub\public\heritage-workshop.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$img.Dispose()

Write-Output "Cropped cleanly to 467x492"
