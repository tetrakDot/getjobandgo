Add-Type -AssemblyName System.Drawing
function Resize-Image {
    param($InputPath, $OutputPath, $Width, $Height)
    $img = [System.Drawing.Image]::FromFile($InputPath)
    $newImg = new-object System.Drawing.Bitmap($Width, $Height)
    $graph = [System.Drawing.Graphics]::FromImage($newImg)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($img, 0, 0, $Width, $Height)
    $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graph.Dispose()
    $newImg.Dispose()
    $img.Dispose()
}

$logoPath = "e:\Get_Job_And_Go\Frontend\public\logo.png"

Resize-Image -InputPath $logoPath -OutputPath "e:\Get_Job_And_Go\Frontend\public\apple-touch-icon.png" -Width 180 -Height 180
Resize-Image -InputPath $logoPath -OutputPath "e:\Get_Job_And_Go\Frontend\public\favicon-32x32.png" -Width 32 -Height 32
Resize-Image -InputPath $logoPath -OutputPath "e:\Get_Job_And_Go\Frontend\public\favicon-16x16.png" -Width 16 -Height 16
Resize-Image -InputPath $logoPath -OutputPath "e:\Get_Job_And_Go\Frontend\public\android-chrome-192x192.png" -Width 192 -Height 192
Resize-Image -InputPath $logoPath -OutputPath "e:\Get_Job_And_Go\Frontend\public\android-chrome-512x512.png" -Width 512 -Height 512
